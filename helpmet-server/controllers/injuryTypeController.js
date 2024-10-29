const {
    Employee,
    Report,
    Department,
    InjuryType
} = require("../models/schemas");

// Create a new injury type
exports.createInjuryType = async (req, res) => {
    const { injuryTypeName } = req.body;
    try {
        const existingInjuryType = await Department.findOne({ injuryTypeName });
        if (existingInjuryType) {
            return res.status(400).json({ message: "Injury type with this name already exists" });
        }

        const injuryTypeCount = await InjuryType.countDocuments();
        const nextInjuryTypeNumber = injuryTypeCount + 1;

        const newInjuryType = new InjuryType({
            injuryTypeID: `T${nextInjuryTypeNumber.toString().padStart(4, "0")}`,
            injuryTypetName
        });
        await newInjuryType.save();
        res.json({ message: "Injury type created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Injury Types for a company
exports.getInjuryTypesByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        // Step 1: Find all employees for the company
        const employeeRecords = await Employee.find({ companyID: companyID }).distinct("employeeID");
        if (employeeRecords.length === 0) {
            return res.status(404).json({ message: "No employees found for this company" });
        }

        // Step 2: Find all reports linked to those employees
        const reportRecords = await Report.find({ injuredEmployeeID: { $in: employeeRecords } }).distinct("injuryTypeID");
        if (reportRecords.length === 0) {
            return res.status(404).json({ message: "No reports found for these employees" });
        }

        // Step 3: Fetch the Injury Types based on injuryTypeID
        const injuryTypes = await InjuryType.find({ injuryTypeID: { $in: reportRecords } });
        if (!injuryTypes || injuryTypes.length === 0) {
            return res.status(404).json({ message: "No injury types found for this company" });
        }
        res.json(injuryTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific injury type details by injuryTypeID
exports.getInjuryTypeByID = async (req, res) => {
    try {
        const injuryType = await InjuryType.findOne({ injuryTypeID: req.params.id });
        if (!injuryType) {
            return res.status(404).json({ message: "Injury Type not found" });
        }
        res.json(injuryType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update injury type by injuryTypeID
exports.updateInjuryTypeByID = async (req, res) => {
    try {
        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedInjuryType = await InjuryType.findOneAndUpdate(
            { injuryTypeID: req.params.id },
            updateFields,
            { new: true }
        );

        if (!updatedInjuryType) {
            return res.status(404).json({ message: "Injury type not found" });
        }
        res.json({ message: "Injury type updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete injury type by injuryTypeID
exports.deleteInjuryTypeByID = async (req, res) => { 
    try {
        const deletedInjuryType = await InjuryType.findOneAndDelete({ injuryTypeID: req.params.id });
        if (!deletedInjuryType) {
            return res.status(404).json({ message: "Injury type not found" });
        }
        res.json({ message: "Injury type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};