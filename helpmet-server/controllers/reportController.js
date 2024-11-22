const { DateTime } = require('luxon');
const {
    Employee,
    Report,
    EmployeeReport,
    PendingReport,
    Location
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

        const dateOfInjuryWithTime = DateTime.fromISO(dateOfInjury, { zone: 'America/Vancouver' }).startOf('day').toISO();

        // Upload the image file to S3
        let imageUrls = [];
        if (req.files) {
            imageUrls = await uploadToS3(req.files);
        }

        const newPendingReport = new PendingReport({
            companyID,
            reportBy,
            injuredEmployeeID,
            dateOfInjury: dateOfInjuryWithTime,
            locationID,
            injuryTypeID,
            severity,
            description,
            image: imageUrls,
            witnessID: witnessID || null,
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

        const employeeIDs = [
            ...new Set(pendingReports.map(report => report.reportBy).concat(pendingReports.map(report => report.injuredEmployeeID))),
        ];

        const employees = await Employee.find({ employeeID: { $in: employeeIDs } }, 'employeeID firstName');

        const employeeMap = employees.reduce((map, employee) => {
            map[employee.employeeID] = employee.firstName;
            return map;
        }, {});

        const reportsWithNames = pendingReports.map(report => ({
            ...report._doc,
            reportByFirstName: employeeMap[report.reportBy],
            injuredEmployeeFirstName: employeeMap[report.injuredEmployeeID],
        }));

        res.json(reportsWithNames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reports by CompanyID
exports.getReportsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    const { injuryTypeID, dateOfInjury } = req.query;

    try {
        const query = { companyID };
        if (injuryTypeID) {
            query.injuryTypeID = injuryTypeID;
        }

        if (dateOfInjury) {
            query.dateOfInjury = {
                $gte: new Date(dateOfInjury),
                $lt: new Date(new Date(dateOfInjury).setDate(new Date(dateOfInjury).getDate() + 1))
            };
        }

        const reports = await Report.find(query);
        if (reports.length === 0) {
            return res.status(404).json({ message: "No reports found for this company" });
        }

        const employeeIDs = [
            ...new Set(reports.map(report => report.reportBy).concat(reports.map(report => report.injuredEmployeeID))),
        ];

        const employees = await Employee.find({ employeeID: { $in: employeeIDs } }, 'employeeID firstName');

        const employeeMap = employees.reduce((map, employee) => {
            map[employee.employeeID] = employee.firstName;
            return map;
        }, {});

        const reportsWithNames = reports.map(report => ({
            ...report._doc,
            reportByFirstName: employeeMap[report.reportBy],
            injuredEmployeeFirstName: employeeMap[report.injuredEmployeeID],
        }));

        res.json(reportsWithNames);
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

        const [reportByEmployee, injuredEmployee, witnessEmployee, location] = await Promise.all([
            Employee.findOne({ employeeID: report.reportBy }, 'firstName role'),
            Employee.findOne({ employeeID: report.injuredEmployeeID }, 'firstName role'),
            Employee.findOne({ employeeID: report.witnessID }, 'firstName role'),
            Location.findOne({ locationID: report.locationID }, 'locationName')
        ]);

        const reportWithDetails = {
            ...report._doc,
            reportByFirstName: reportByEmployee ? reportByEmployee.firstName : null,
            reportByRole: reportByEmployee ? reportByEmployee.role : null,
            injuredEmployeeFirstName: injuredEmployee ? injuredEmployee.firstName : null,
            injuredEmployeeRole: injuredEmployee ? injuredEmployee.role : null,
            witnessEmployeeFirstName: witnessEmployee ? witnessEmployee.firstName : null,
            witnessEmployeeRole: witnessEmployee ? witnessEmployee.role : null,
            locationName: location ? location.locationName : null,
        };

        res.json(reportWithDetails);
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

        const [reportByEmployee, injuredEmployee, witnessEmployee, location] = await Promise.all([
            Employee.findOne({ employeeID: pendingReport.reportBy }, 'firstName role'),
            Employee.findOne({ employeeID: pendingReport.injuredEmployeeID }, 'firstName role'),
            Employee.findOne({ employeeID: pendingReport.witnessID }, 'firstName role'),
            Location.findOne({ locationID: pendingReport.locationID }, 'locationName')
        ]);

        const pendingReportWithDetails = {
            ...pendingReport._doc,
            reportByFirstName: reportByEmployee ? reportByEmployee.firstName : null,
            reportByRole: reportByEmployee ? reportByEmployee.role : null,
            injuredEmployeeFirstName: injuredEmployee ? injuredEmployee.firstName : null,
            injuredEmployeeRole: injuredEmployee ? injuredEmployee.role : null,
            witnessEmployeeFirstName: witnessEmployee ? witnessEmployee.firstName : null,
            witnessEmployeeRole: witnessEmployee ? witnessEmployee.role : null,
            locationName: location ? location.locationName : null,
        };

        res.json(pendingReportWithDetails);
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

    if (req.files && req.files.length > 0) {
        try {
            const imageUrls = await uploadToS3(req.files);
            updateFields.image = imageUrls;
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
        const { pendingReportId } = req.body;

        const pendingReport = await PendingReport.findById(pendingReportId);
        if (!pendingReport) {
            return res.status(404).json({ message: "Pending report not found." });
        }

        const latestReport = await Report.findOne()
            .sort({ reportID: -1 })
            .select("reportID");

        let nextReportID = "R0001";
        if (latestReport && latestReport.reportID) {
            const latestID = parseInt(latestReport.reportID.slice(1));
            nextReportID = `R${(latestID + 1).toString().padStart(4, "0")}`;
        }

        const approvedReport = new Report({
            ...pendingReport.toObject(),
            status: "Completed",
            reportID: nextReportID,
        });

        await approvedReport.save();

        await PendingReport.findByIdAndDelete(pendingReportId);

        res.status(200).json({ message: "Report approved and moved successfully.", reportID: nextReportID });
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

        // Adjust by subtracting 1 day to account for the offset
        const startOfWeek = DateTime.now().setZone('UTC').startOf('week').toJSDate();
        const endOfWeek = DateTime.now().setZone('UTC').endOf('week').toJSDate();

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

exports.getPreviousWeeklyInjuryStats = async (req, res) => {
    try {
        const { companyID } = req.query;

        const startOfPreviousWeek = DateTime.now().startOf('week').plus({ days: 1 }).minus({ weeks: 1 }).toJSDate();
        const endOfPreviousWeek = DateTime.now().endOf('week').minus({ weeks: 1 }).toJSDate();

        const previousWeeklyReports = await Report.aggregate([
            {
                $match: {
                    companyID: parseInt(companyID),
                    dateOfInjury: { $gte: startOfPreviousWeek, $lte: endOfPreviousWeek }
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

        res.json(previousWeeklyReports);
    } catch (error) {
        console.error("Error fetching previous weekly injury stats:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMonthlyEpidemicData = async (req, res) => {
    try {
        const { companyID } = req.query;

        // Get the start and end of the current month
        const startOfMonth = DateTime.now().startOf("month").toJSDate();   // .minus({ months: 1 }) to last month
        const endOfMonth = DateTime.now().endOf("month").toJSDate();       // .minus({ months: 1 }) to last month

        const reports = await Report.aggregate([
            {
                $match: {
                    companyID: Number(companyID),
                    dateOfInjury: { $gte: startOfMonth, $lte: endOfMonth },
                    injuryTypeID: "T0006"
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfInjury" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.json(reports);
    } catch (error) {
        console.error("Error fetching monthly epidemic data:", error);
        res.status(500).json({ error: "Server error" });
    }
};