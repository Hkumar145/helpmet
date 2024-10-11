const { Router } = require('express');
const emailRouter = Router();
const { sendInjuryReportEmail } = require("../utils/emailService");

emailRouter.post("/send-report-email", async (req, res) => {
  const { selectedRecipients, reportID, senderEmail, remark } = req.body;

  try {
    await Promise.all(
      selectedRecipients.map((recipient) =>
        sendInjuryReportEmail(recipient, reportID, senderEmail, remark)
      )
    );
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = emailRouter;