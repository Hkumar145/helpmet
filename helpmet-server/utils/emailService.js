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

const sendAlertEmail = async ({ recipient, senderEmail, alertDetails, cc = [], attachments = [] }) => {
  const mailOptions = {
    from: senderEmail,
    to: recipient.email,
    cc: cc.length > 0 ? cc : [],
    subject: alertDetails.alertName,
    text: `${alertDetails.description}`,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

module.exports = { sendInjuryReportEmail, sendAlertEmail };
