const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInjuryReportEmail = async (recipient, reportID, senderEmail, remark) => {
  const mailOptions = {
    from: senderEmail,   // email address can only be passed from the backend
    to: recipient.email,
    subject: "Please fill in this Injury Report",
    text: `Hi,\n\nPlease fill in this Injury Report. The Report ID is ${reportID}.\n\nHere is the link to the injury report: http://localhost:3000/report\n\nRemark: ${remark}\n\nThank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

const sendAlertEmail = async ({ recipient, senderEmail, alertDetails }) => {
  const mailOptions = {
    from: senderEmail,
    to: recipient.email,
    cc: cc || [],
    subject: alertDetails.alertName,
    text: `${alertDetails.description}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

const sendHoldEmail = async (recipient, reportDetails, holdReason) => {
  const pendingReportLink = `http://localhost:3000/reports/pending/${reportDetails._id}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient.email,
    subject: `Report #${reportDetails._id} placed on hold`,
    text: `Hello,

The following injury report has been placed on hold with the reason: "${holdReason}"

Report Details:
- Report ID: ${reportDetails._id}
- Reported By: ${reportDetails.reportBy}
- Injured Employee ID: ${reportDetails.injuredEmployeeID}
- Date of Injury: ${new Date(reportDetails.dateOfInjury).toLocaleDateString()}
- Location ID: ${reportDetails.locationID}
- Injury Type ID: ${reportDetails.injuryTypeID}
- Severity: ${reportDetails.severity}
- Description: ${reportDetails.description}
- Witness ID: ${reportDetails.witnessID}

Please edit and resubmit the report by following link.
(${pendingReportLink})

Thank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending hold email:", error);
    throw new Error("Could not send hold email");
  }
};

module.exports = { sendInjuryReportEmail, sendAlertEmail, sendHoldEmail };
