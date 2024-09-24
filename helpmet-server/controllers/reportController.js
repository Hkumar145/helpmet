const {
    Employee,
    Report,
    Alert,
    Equipment
} = require("../models/schemas");

// Create a new injury report
exports.createReport = async (req, res) => {
    try {
        // Check if the employee exists
        const { injuredEmployeeID, dateOfInjury } = req.body;
        const injuredEmployee = await Employee.findOne({ injuredEmployeeID });
        if (!injuredEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Check for duplicate report on the same date for the same employee
        const duplicateReport = await Injury.findOne({ injuredEmployeeID, dateOfInjury });
        if (duplicateReport) {
            return res.status(400).json({ message: "Duplicate injury report for this employee on the same date" });
        }

        const report = new Report(req.body);
        await report.save();
        res.json({ message: "Injury report created successfully", report: report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reports for analytics
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View a specific injury report by ReportID
exports.getReportByID = async (req, res) => {
    try {
        const report = await Report.findOne({ ID: req.params.id });
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
        const updatedReport = await Report.findByIdAndUpdate(
            { ID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an injury report by ReportID
exports.deleteReportByID = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete({ ID: req.params.id });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};