const {
    Employee,
    Report,
    Alert,
    Equipment
} = require("../models/schemas");

// Create a new equipment
exports.createEquipment = async (req, res) => {
    try {
        // Check if an equipment with the same name and in the same location already exists
        const { name, location } = req.body;
        const existingEquipment = await Equipment.findOne({ name, location });
        if (existingEquipment) {
            return res.status(400).json({ message: "Equipment in this location with this name already exists" });
        }
        const equipment = new Equipment(req.body);
        await equipment.save();
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: "Error creating equipment" });
    }
};

// Get all equipments
exports.getEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find();
        res.json(equipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific equipment by EquipmentID
exports.getEquipmentByID = async (req, res) => {
    try {
        const equipment = await Equipment.findOne({ ID: req.params.id });
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update equipment details by EquipmentID
exports.updateEquipmentByID = async (req, res) => {
    try {
        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedEquipment = await Equipment.findByIdAndUpdate(
            { ID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedEquipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.json(updatedEquipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete equipment record by EquipmentID
exports.deleteEquipmentByID = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete({ ID: req.params.id });
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.json({ message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};