const {
    Employee,
    Alert,
    EmployeeAlert,
    DepartmentAlert
} = require("../models/schemas");
const { sendEmail } = require("../utils/emailService");
const path = require("path");
const { uploadToS3 } = require('../utils/s3Upload');

// Create a new alert
exports.createAlert = async (req, res) => {
    try {
        // Check if similar alert already exists
        const { id: companyID } = req.params;
        const { alertName, cc, recipients, recipientType, description, scheduleTime, type } = req.body;
        const duplicateAlert = await Alert.findOne({ alertName, description });

        if (duplicateAlert) {
            return res.status(400).json({ message: "Duplicate alert" });
        }

        const alertCount = await Alert.countDocuments();
        const nextAlertNumber = alertCount + 1;

        const sentAt = scheduleTime ? new Date(scheduleTime) : new Date();

        // Upload the image file to S3
        let attachmentUrls = [];
        if (req.files) {
            attachmentUrls = await uploadToS3(req.files);
        }
        console.log("Uploaded attachment URLs:", attachmentUrls);

        const newAlert = new Alert({
            alertID: `A${nextAlertNumber.toString().padStart(4, "0")}`,
            alertName,
            companyID,
            sentAt, 
            description,
            type,
            recipients,
            cc: cc ? cc.trim() : null,  
            attachments: attachmentUrls
        });
        await newAlert.save();

        let recipientEmails = [];
        let employeeAlertEntries = [];
        let departmentAlertEntries = [];

        // Update EmployeeAlert with selected employees
        if (recipientType === "employee") {
            // Fetch recipient emails if employees are selected
            const employees = await Employee.find({ employeeID: { $in: recipients }, companyID });
            recipientEmails = employees.map(emp => emp.email);

            // Create EmployeeAlert entries for each employee
            employeeAlertEntries = employees.map(emp => ({
                alertID: newAlert.alertID,
                employeeID: emp.employeeID
            }));

            // Insert employee alert entries into EmployeeAlert
            await EmployeeAlert.insertMany(employeeAlertEntries); 
        } else if (recipientType === "department") {
            // Update DepartmentAlert with selected departments
            const departments = await Department.find({ departmentID: { $in: recipients }, companyID });
            const departmentIDs = departments.map(dept => dept.departmentID);

            const employeesInDepartments = await Employee.find({ departmentID: { $in: departmentIDs }, companyID });
            recipientEmails = employeesInDepartments.map(emp => emp.email);

            // Create DepartmentAlert entries for each department
            departmentAlertEntries = departments.map(dept => ({
                alertID: newAlert.alertID,
                departmentID: dept.departmentID
            }));

            // Insert department alert entries into DepartmentAlert
            await DepartmentAlert.insertMany(departmentAlertEntries);
        }

        // File attachments
        const attachments = attachmentUrls.map((url) => ({
            filename: url.split('/').pop(), 
            path: url,
        }));  

        // Send alert email using nodemailer to each recipient and CC
        for (const recipientEmail of recipientEmails) {
            await sendEmail({
                recipient: { email: recipientEmail },
                alertDetails: {
                    alertName,
                    description: description,
                },
                senderEmail: process.env.EMAIL_USER,
                cc: cc ? cc.trim() : undefined,
                attachments
            });
        }
        res.json({ message: "Alert created successfully", attachments: attachments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all alerts by CompanyID
exports.getAlertsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
         const alerts = await Alert.find({ companyID }).sort({ sentAt: 1 });
        if (alerts.length === 0) {
            return res.status(404).json({ message: "No alerts found for this company" });
        }
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific alert by AlertID
exports.getAlertByID = async (req, res) => {
    try {
        const alert = await Alert.findOne({ alertID: req.params.id });
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json(alert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an alert details by AlertID
exports.updateAlertByID = async (req, res) => {
    try {
        const updateFields = req.body;
        console.log("Initial updateFields:", updateFields);

        const currentAlert = await Alert.findOne({ alertID: req.params.id });
        if (!currentAlert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        
        let currentAttachments = currentAlert.attachments || []; 
        const removedAttachments = updateFields.removedAttachments ? JSON.parse(updateFields.removedAttachments) : [];
        const baseUrl = "https://pika-helpmet.s3.us-west-1.amazonaws.com/";
        const removedAttachmentUrls = removedAttachments.length > 0 ? removedAttachments.map(filename => `${baseUrl}${filename}`) : [];

        currentAttachments = currentAttachments.filter(
            (attachment) => !removedAttachmentUrls.includes(attachment)
        );

        let attachmentUrls = [];
        if (req.files && req.files.length > 0) {
            attachmentUrls = await uploadToS3(req.files);
        }

        const newAttachments = [...new Set([...currentAttachments, ...attachmentUrls])];
        updateFields.attachments = newAttachments;
        
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const updatedAlert = await Alert.findOneAndUpdate(
            { alertID: req.params.id },
            // { $set: updateFields },
            { $set: { ...updateFields, sentAt: updateFields.scheduleTime } },
            { new: true }
        );
        delete updateFields.scheduleTime;
        console.log(updatedAlert);
        if (!updatedAlert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json({ message: "Alert updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.updateAlertByID = async (req, res) => {
//     try {
//         const { alertName, description } = req.body;
//         const updateFields = {
//             ...(alertName && { alertName }),
//             ...(description && { description }),
//         };

//         // if (req.files && req.files.length > 0) {
//         //     const newAttachmentUrls = await uploadToS3(req.files);
//         //     if (updateFields.attachments) {
//         //         updateFields.attachments = [
//         //             ...JSON.parse(req.body.existingAttachments || "[]"),
//         //             ...newAttachmentUrls,
//         //         ];
//         //     } else {
//         //         updateFields.attachments = newAttachmentUrls;
//         //     }
//         // } else if (req.body.existingAttachments) {
//         //     updateFields.attachments = JSON.parse(req.body.existingAttachments);
//         // }

//         if (Object.keys(updateFields).length === 0) {
//             return res.status(400).json({ message: "No fields to update" });
//         }

//         const updatedAlert = await Alert.findOneAndUpdate(
//             { alertID: req.params.id },
//             updateFields,
//             { new: true }
//         );
//         if (!updatedAlert) {
//             return res.status(404).json({ message: "Alert not found" });
//         }
//         res.json({ message: "Alert updated successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete an alert by AlertID
// exports.deleteAlertByID = async (req, res) => {
//     try {
//         const alert = await Alert.findOneAndDelete({ alertID: req.params.id });
//         if (!alert) {
//             return res.status(404).json({ message: "Alert not found" });
//         }

//          // Delete related EmployeeAlert entry
//          await EmployeeAlert.deleteMany({ alertID: req.params.id });

//          // Delete related DepartmentAlert entry
//         await DepartmentAlert.deleteMany({ alertID: req.params.id });

//         res.json({ message: "Alert deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };