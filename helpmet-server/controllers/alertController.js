const {
    Employee,
    Report,
    Alert,
    Equipment,
    Department,
    EmployeeAlert,
    DepartmentAlert
} = require("../models/schemas");

// Create a new alert
exports.createAlert = async (req, res) => {
    try {
        // Check if similar alert already exists for the same condition and type
        const { alertName, type, triggerCondition, sentAt, scheduleTime, description, employeeIDs, departmentIDs } = req.body;
        const duplicateAlert = await Alert.findOne({ type, triggerCondition, scheduleTime, description });
        if (duplicateAlert) {
            return res.status(400).json({ message: "Duplicate alert" });
        }

        const alertCount = await Alert.countDocuments();
        const nextAlertNumber = alertCount + 1;

        const newAlert = new Alert({
            alertID: `A${nextAlertNumber.toString().padStart(4, "0")}`,
            alertName,
            type, 
            triggerCondition, 
            sentAt, 
            scheduleTime, 
            description
        });
        await newAlert.save();

        // Update EmployeeAlert with selected employees
        if (employeeIDs && employeeIDs.length > 0) {
            const employeeAlertEntries = employeeIDs.map(employeeID => ({
                alertID: newAlert.alertID,
                employeeID
            }));
            await EmployeeAlert.insertMany(employeeAlertEntries);
        }

        // Update DepartmentAlert with selected departments
        if (departmentIDs && departmentIDs.length > 0) {
            const departmentAlertEntries = departmentIDs.map(departmentID => ({
                alertID: newAlert.alertID,
                departmentID
            }));
            await DepartmentAlert.insertMany(departmentAlertEntries);
        }

        res.json({ message: "Alert created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all alerts by CompanyID
exports.getAlertsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        // Step 1: Find all employees of the company
        const employeeRecords = await Employee.find({ companyID }).distinct("employeeID");

        // Step 2: Find all departments of the company through employees' department IDs
        const departmentRecords = await Employee.find({ companyID }).distinct("departmentID");
        if (employeeRecords.length === 0 && departments.length === 0) {
            return res.status(404).json({ message: "No employees or departments found for this company" });
        }

         // Step 3: Fetch alerts for employees via EmployeeAlert
         const employeeAlerts = await EmployeeAlert.find({ employeeID: { $in: employeeRecords } }).distinct("alertID");

         // Step 4: Fetch alerts for departments via DepartmentAlert
         const departmentAlerts = await DepartmentAlert.find({ departmentID: { $in: departmentRecords } }).distinct("alertID");
 
         // Step 5: Combine all alertIDs and fetch the alert details
         const allAlertIDs = [...new Set([...employeeAlerts, ...departmentAlerts])];
         const alerts = await Alert.find({ alertID: { $in: allAlertIDs } });
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
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const updatedAlert = await Alert.findByIdAndUpdate(
            { alertID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedAlert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json({ message: "Alert updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an alert by AlertID
exports.deleteAlertByID = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndDelete({ alertID: req.params.id });
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

         // Delete related EmployeeAlert entry
         await EmployeeAlert.deleteMany({ alertID: req.params.id });

         // Delete related DepartmentAlert entry
        await DepartmentAlert.deleteMany({ alertID: req.params.id });

        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};