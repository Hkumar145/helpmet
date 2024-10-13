const {
    Employee,
    Report,
    Alert,
    Equipment,
    Company,
    Location,
    EmployeeEquipment
} = require("../models/schemas");

// Create a new equipment
exports.createEquipment = async (req, res) => {
    try {
        const { equipmentName, locationID, inspectionDate, inspectionInterval, inspectedBy, isChecked, status, description, image } = req.body;
        // Check if an equipment with the same name and in the same location already exists
        const existingEquipment = await Equipment.findOne({ equipmentName, locationID, description });
        if (existingEquipment) {
            return res.status(400).json({ message: "Equipment in this location with this name already exists" });
        }

        const equipmentCount = await Equipment.countDocuments();
        const nextEquipmentNumber = equipmentCount + 1;
        const newEquipment = new new Equipment({
            equipmentID: `E${nextEquipmentNumber.toString().padStart(4, "0")}`,
            equipmentName,
            locationID,
            inspectionDate,
            inspectionInterval,
            inspectedBy,
            isChecked,
            status,
            description,
            image
        });
        await newEquipment.save();

        // Update EmployeeEquipment table
        if (inspectedBy) {
            const employeeEquipmentEntry = {
                equipmentID: newEquipment.equipmentID,
                employeeID: inspectedBy
            };
            await EmployeeEquipment.create(employeeEquipmentEntry);
        }

        res.json({ message: "Equipment created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // Get all equipments by CompanyID
// exports.getEquipmentsByCompany = async (req, res) => {
//     const { id: companyID } = req.params.id;
    // try {
    //    // Step 1: Find all locationIDs associated with the company
    //    const locationRecords = await Location.find({ companyID }).distinct("locationID");
    //    if (locationRecords.length === 0) {
    //        return res.status(404).json({ message: "No locations found for this company" });
    //    }

    //    // Step 2: Fetch all equipment that belongs to these locations
    //    const equipmentRecords = await Equipment.find({ locationID: { $in: locationRecords } });
    //    if (equipmentRecords.length === 0) {
    //        return res.status(404).json({ message: "No equipment found for this company" });
    //    }
    //    res.json(equipmentRecords);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
// };

// Get all equipments by CompanyID
exports.getEquipmentsByCompany = async (req, res) => {
    const { id: companyID } = Number(req.params.id);  // Extract companyID from URL params

    // try {
    //    // Step 1: Find all locationIDs associated with the company
    //    const locationRecords = await Location.find({ companyID }).distinct("locationID");
    //    if (locationRecords.length === 0) {
    //        return res.status(404).json({ message: "No locations found for this company" });
    //    }

    //    // Step 2: Fetch all equipment that belongs to these locations
    //    const equipmentRecords = await Equipment.find({ locationID: { $in: locationRecords } });
    //    if (equipmentRecords.length === 0) {
    //        return res.status(404).json({ message: "No equipment found for this company" });
    //    }

    //    // Step 3: Return equipment data
    //    res.json(equipmentRecords);
    // } catch (error) {
    //     // Catch and return any errors encountered
    //     res.status(500).json({ error: error.message });
    // }
};


// Get a specific equipment by EquipmentID
exports.getEquipmentByID = async (req, res) => {
    try {
        const equipment = await Equipment.findOne({ equipmentID: req.params.id });
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
            { equipmentIDID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedEquipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.json({ message: "Equipment updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete equipment record by EquipmentID
exports.deleteEquipmentByID = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete({ equipmentID: req.params.id });
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        // Delete related EmployeeEquipment entry
        await EmployeeEquipment.deleteOne({ equipmentID: req.params.id });

        res.json({ message: "Equipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};