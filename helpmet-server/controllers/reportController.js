const {
    Employee,
    Report,
    Alert,
    Equipment,
    EmployeeReport
} = require("../models/schemas");

// Create a new injury report
exports.createReport = async (req, res) => {
    try {
        const { id: companyID } = req.params;
        // Check if the missing fields exist
        const { reportedBy, injuredEmployeeID, dateOfInjury, reportDate, locationID, injuryTypeID, severity, description, image } = req.body;

        const requiredFields = ["reportedBy", "injuredEmployeeID", "dateOfInjury", "reportDate", "locationID", "injuryTypeID", "severity", "description"];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Check if the employee exists
        const injuredEmployee = await Employee.findOne({ injuredEmployeeID });
        if (!injuredEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Check for duplicate report on the same date for the same employee
        const duplicateReport = await Injury.findOne({ injuredEmployeeID, dateOfInjury, injuryTypeID });
        if (duplicateReport) {
            return res.status(400).json({ message: "Duplicate injury report for this employee on the same date" });
        }

        const reportCount = await Report.countDocuments();
        const nextReportNumber = reportCount + 1;

        const newReport = new Report({
            reportID: `R${nextReportNumber.toString().padStart(4, '0')}`,
            reportedBy,
            injuredEmployeeID,
            dateOfInjury,
            reportDate,
            locationID,
            injuryTypeID,
            severity,
            description,
            image
        });
        await newReport.save();

        // Update EmployeeReport table
        if (injuredEmployeeID) {
            const employeeReportEntry = {
                reportID: newReport.reportID,
                employeeID: injuredEmployeeID
            };
            await EmployeeReport.create(employeeReportEntry);
        }

        res.json({ message: "Injury report created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reports by CompanyID
exports.getReportsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        // Step 1: Find all employeeIDs associated with the company
        const employeeRecords = await Employee.find({ companyID }).distinct("employeeID");
        if (employeeRecords.length === 0) {
            return res.status(404).json({ message: "No employees found for this company" });
        }

        // Step 2: Fetch all reports where employees are either 'reportedBy' or 'injuredEmployeeID'
        const reports = await Report.find({
            $or: [
                { reportedBy: { $in: employeeRecords } },
                { injuredEmployeeID: { $in: employeeRecords } }
            ]
        });

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
        const updatedReport = await Report.findByIdAndUpdate(
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
        const report = await Report.findByIdAndDelete({ reportID: req.params.id });
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
