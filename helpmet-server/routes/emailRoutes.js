const { Router } = require('express');
const emailRouter = Router();
const { Employee, PendingReport, Report, Alert } = require("../models/schemas");
const { sendInjuryReportEmail, sendHoldEmail, sendApprovalEmail, sendAlertEmail } = require("../utils/emailService");

emailRouter.post("/send-report-email", async (req, res) => {
  const { selectedRecipients, senderEmail, remark } = req.body;

  try {
    await Promise.all(
      selectedRecipients.map((recipient) =>
        sendInjuryReportEmail(recipient, senderEmail, remark)
      )
    );
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

emailRouter.post("/send-hold-email", async (req, res) => {
  const { senderEmail, reportDetails, holdReason } = req.body;

  try {
    const recipient = await Employee.findOne({ employeeID: reportDetails.reportBy });
    if (!recipient) {
      return res.status(404).send({ error: "Employee not found" });
    }

    await sendHoldEmail(recipient, senderEmail, reportDetails, holdReason);
    
    await PendingReport.findByIdAndUpdate(reportDetails._id, { status: "On hold" });
    res.status(200).send({ message: "Email sent and report status updated successfully" });
  } catch (error) {
    console.error("Error in send-hold-email route:", error);
    res.status(500).send({ error: error.message });
  }
});

emailRouter.post("/send-approval-email", async (req, res) => {
  const { senderEmail, reportDetails, reportID } = req.body;

  try {
    const recipient = await Employee.findOne({ employeeID: reportDetails.reportBy });
    if (!recipient) {
      return res.status(404).send({ error: "Employee not found" });
    }

    await sendApprovalEmail(recipient, senderEmail, reportDetails, reportID);

    await PendingReport.findByIdAndUpdate(reportDetails._id, { status: "Completed" });
    res.status(200).send({ message: "Approval email sent and report status updated successfully" });
  } catch (error) {
    console.error("Error in send-approval-email route:", error);
    res.status(500).send({ error: error.message });
  }
});

emailRouter.post("/send-alert-email", async (req, res) => {
  const { recipients, senderEmail, alertDetails, cc, attachments } = req.body;
  try {
    
    if (!recipients || recipients.length === 0) {
      return res.status(400).send({ error: "No valid recipient emails found." });
    }
    await Promise.all(
      recipients.map((recipientEmail) =>
        sendAlertEmail({
          recipient: { email: recipientEmail },
          senderEmail,
          alertDetails,
          cc,
          attachments,
        })
      )
    );
    res.status(200).send({ message: "Alert emails sent successfully" });
  } catch (error) {
    console.error("Error sending alert emails:", error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = emailRouter;