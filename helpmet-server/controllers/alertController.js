const {
    Employee,
    Report,
    Alert,
    Equipment
} = require("../models/schemas");

// Create a new alert
exports.createAlert = async (req, res) => {
    try {
        // Validate if alert exists
        const existingalert = await Alert.findOne({ ID: req.params.id });
        if (!existingalert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        // Check if similar alert already exists for the same condition and type
        const { type, triggerCondition } = req.body;
        const duplicateAlert = await Alert.findOne({ type, triggerCondition });
        if (duplicateAlert) {
            return res.status(400).json({ message: "Duplicate alert for the same trigger condition and type" });
        }

        const alert = new Alert(req.body);
        await alert.save();
        res.json(alert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all alerts
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find();
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific alert by AlertID
exports.getAlertByID = async (req, res) => {
    try {
        const alert = await Alert.findOne({ ID: req.params.id });
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
            { ID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedAlert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json(updatedAlert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an alert by AlertID
exports.deleteAlertByID = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndDelete({ ID: req.params.id });
        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }
        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};