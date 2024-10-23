const { DateTime } = require('luxon');
const {
    Employee,
    Report,
    EmployeeReport,
    PendingReport
} = require("../models/schemas");
const { uploadToS3 } = require('../utils/s3Upload');

// Submit a new pending report (Employee Submission)
exports.submitReport = async (req, res) => {
    try {
        const { reportBy, injuredEmployeeID, dateOfInjury, locationID, injuryTypeID, severity, description, witnessID } = req.body;

        // Fetch the employee's companyID based on reportBy (employeeID)
        const employee = await Employee.findOne({ employeeID: reportBy });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const companyID = employee.companyID;

        // Upload the image file to S3
        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToS3(req.file);
        }

        const newPendingReport = new PendingReport({
            companyID,
            reportBy,
            injuredEmployeeID,
            dateOfInjury,
            locationID,
            injuryTypeID,
            severity,
            description,
            image: imageUrl,
            witnessID,
            status: "On going"
        });

        await newPendingReport.save();
        res.json({ message: "Report submitted successfully and pending HR approval" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve or reject a pending report (HR review)
exports.reviewPendingReport = async (req, res) => {
    const { _id, action } = req.body;

    try {
        // Find the pending report
        const pendingReport = await PendingReport.findById(_id);
        if (!pendingReport) {
            return res.status(404).json({ message: "Pending report not found" });
        }

        // Create a new report in the Reports table with a new reportID
        if (action === "approve") {

            // Check for duplicate report on the same date for the same employee
            const duplicateReport = await Injury.findOne({ injuredEmployeeID, dateOfInjury, injuryTypeID });
            if (duplicateReport) {
                return res.status(400).json({ message: "Duplicate injury report for this employee on the same date" });
            }
    
            const reportCount = await Report.countDocuments();
            const nextReportNumber = reportCount + 1;

            const newReport = new Report({
                reportID: `R${nextReportNumber.toString().padStart(4, "0")}`,
                reportBy: pendingReport.reportBy,
                injuredEmployeeID: pendingReport.injuredEmployeeID,
                dateOfInjury: pendingReport.dateOfInjury,
                reportDate: pendingReport.reportDate,
                locationID: pendingReport.locationID,
                injuryTypeID: pendingReport.injuryTypeID,
                severity: pendingReport.severity,
                description: pendingReport.description,
                image: pendingReport.image,
                witnessID: pendingReport.witnessID,
                status: "Completed"
            });

            await newReport.save();
            // Remove the pending report
            await PendingReport.findByIdAndDelete(_id);
            // Update EmployeeReport table
            if (injuredEmployeeID) {
                const employeeReportEntry = {
                    reportID: newReport.reportID,
                    employeeID: injuredEmployeeID
                };
                await EmployeeReport.create(employeeReportEntry);
            }
            res.status(200).json({ message: "Report approved successfully" });
        } else if (action === "reject") {
            // Mark report as on hold and save
            pendingReport.status = "On hold";
            pendingReport.reviewDate = new Date();
            await pendingReport.save();
            res.status(200).json({ message: "Report is on hold" });
        } else {
            res.status(400).json({ message: "Invalid action" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all pending reports by companyID
exports.getPendingReportsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        const pendingReports = await PendingReport.find({ companyID: companyID, status: { $in: ["On going", "On hold"] } })
        if (pendingReports.length === 0) {
            return res.status(404).json({ message: "No pending reports" });
        }
        res.json(pendingReports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reports by CompanyID
exports.getReportsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    const { injuryTypeID } = req.query;

    try {
        const query = { companyID };
        if (injuryTypeID) {
            query.injuryTypeID = injuryTypeID;
        }

        const reports = await Report.find(query);
        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found for this company" });
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View a specific injury report by ReportID
exports.getReportByID = async (req, res) => {
    try {
        const report = await Report.findOne({ reportID: req.params.id });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an injury report details
exports.updateReportByID = async (req, res) => {
    try {
        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const updatedReport = await Report.findOneAndUpdate(
            { reportID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json({ message: "Report updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an injury report by ReportID
exports.deleteReportByID = async (req, res) => {
    try {
        const report = await Report.findOneAndDelete({ reportID: req.params.id });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Delete related EmployeeReport entry
        await EmployeeReport.deleteOne({ reportID: req.params.id });

        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get pending report details by MongoDB _id
exports.getPendingReportByID = async (req, res) => {
    const { _id } = req.params;
    try {
        const pendingReport = await PendingReport.findById(_id);
        if (!pendingReport) {
            return res.status(404).json({ message: "Pending report not found" });
        }
        if (pendingReport.status === "Completed") {
            return res.status(404).json({ message: "Report is approved" });
        }
        res.json(pendingReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get submitted report details by MongoDB _id
exports.getSubmittedReportByID = async (req, res) => {
    const { _id } = req.params;
    try {
      const report = await PendingReport.findById(_id);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      if (report.status !== "On hold") {
        return res.status(404).json({ message: "Report cannot be updated" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Update pending report details by MongoDB _id
exports.updatePendingReportByID = async (req, res) => {
    const { _id } = req.params;
    const updateFields = req.body;

    if (req.file) {
        try {
            const imageUrl = await uploadToS3(req.file);
            updateFields.image = imageUrl;
        } catch (error) {
            return res.status(500).json({ message: "Failed to upload image" });
        }
    }

    try {
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedPendingReport = await PendingReport.findByIdAndUpdate(
            _id,
            updateFields,
            { new: true }
        );

        if (!updatedPendingReport) {
            return res.status(404).json({ message: "Pending report not found" });
        }

        res.json({ message: "Pending report updated successfully", updatedPendingReport });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Move the approved report to reports collection and delete it from pendingReports collection
exports.approveReport = async (req, res) => {
    try {
        const { pendingReportId, reportID } = req.body;

        const pendingReport = await PendingReport.findById(pendingReportId);
        if (!pendingReport) {
            return res.status(404).json({ message: "Pending report not found." });
        }

        const approvedReport = new Report({
            ...pendingReport.toObject(),
            status: "Completed",
            reportID: reportID,
        });

        await approvedReport.save();

        await PendingReport.findByIdAndDelete(pendingReportId);

        res.status(200).json({ message: "Report approved and moved successfully." });
    } catch (error) {
        console.error("Error approving report:", error);
        res.status(500).json({ message: "Error approving report." });
    }
};

exports.getInjuryTypeStats = async (req, res) => {
    const { companyID } = req.query;
    try {
        const stats = await Report.aggregate([
            { $match: { companyID: Number(companyID) } },
            { $group: { _id: "$injuryTypeID", count: { $sum: 1 } } }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error });
    }
};

exports.getWeeklyInjuryStats = async (req, res) => {
    try {
        const { companyID } = req.query;

        const startOfWeek = DateTime.now().startOf('week').minus({ days: 1 }).toJSDate();
        // const startOfWeek = DateTime.now().startOf('week').toJSDate();
        const endOfWeek = DateTime.now().endOf('week').toJSDate();

        const weeklyReports = await Report.aggregate([
            {
                $match: {
                    companyID: parseInt(companyID),
                    dateOfInjury: { $gte: startOfWeek, $lte: endOfWeek }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$dateOfInjury" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.json(weeklyReports);
    } catch (error) {
        console.error("Error fetching weekly injury stats:", error);
        res.status(500).json({ error: "Server error" });
    }
};