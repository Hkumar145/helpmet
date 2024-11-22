const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInjuryReportEmail = async (recipient, senderEmail, remark) => {
  const mailOptions = {
    from: senderEmail,   // email address can only be passed from the backend
    to: recipient.email,
    subject: "Please fill in this Injury Report",
    text: `Hello,

Please fill in this Injury Report.
Here is the link to the injury report: http://localhost:3000/injury-report
Remarks: ${remark}

Thank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

const sendAlertEmail = async ({ recipient, senderEmail, alertDetails, cc, attachments }) => {
  const mailOptions = {
    from: senderEmail,
    to: recipient.email,
    cc: cc || undefined,
    subject: `Alert: ${alertDetails.alertName}`,
    text: `Hello,

An important alert has been issued.

Alert Details:
- Alert Name: ${alertDetails.alertName}
- Description: ${alertDetails.description}

Please review the details and take the necessary actions.

Thank you.\n\n\n`,
    attachments: attachments
  };

  try {
    console.log("Attempting to send email with options:", mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};

const sendHoldEmail = async (recipient, senderEmail, reportDetails, holdReason) => {
  const pendingReportLink = `http://localhost:3000/update-report/${reportDetails._id}`;
  const mailOptions = {
    from: senderEmail,
    to: recipient.email,
    subject: `Report #${reportDetails._id} placed on hold`,
    text: `Hello,

The following injury report has been placed on hold with the reason: "${holdReason}"

Report Details:
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

const sendApprovalEmail = async (recipient, senderEmail, reportDetails, reportID) => {
  const mailOptions = {
    from: senderEmail,
    to: recipient.email,
    subject: `Report #${reportDetails._id} Approved`,
    text: `Hello,

The following injury report has been approved, its official report ID is ${reportID}.

Report Details:
- Reported By: ${reportDetails.reportBy}
- Injured Employee ID: ${reportDetails.injuredEmployeeID}
- Date of Injury: ${new Date(reportDetails.dateOfInjury).toLocaleDateString()}
- Location ID: ${reportDetails.locationID}
- Injury Type ID: ${reportDetails.injuryTypeID}
- Severity: ${reportDetails.severity}
- Description: ${reportDetails.description}
- Witness ID: ${reportDetails.witnessID}

Thank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Approval email sent successfully to:", recipient.email);
  } catch (error) {
    console.error("Error sending approve email:", error);
    throw new Error("Could not send approve email");
  }
};

const sendForgotPasswordEmail = async (recipientEmail, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "Password Reset Request",
    text: `Hello,

Your password has been reset. Please use the temporary password below to log in and change your password immediately.

Temporary Password: ${newPassword}

Thank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", recipientEmail);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Could not send password reset email");
  }
};

module.exports = { sendInjuryReportEmail, sendAlertEmail, sendHoldEmail, sendApprovalEmail, sendForgotPasswordEmail };
