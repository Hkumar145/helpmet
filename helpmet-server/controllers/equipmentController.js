const {
    Equipment,
    EmployeeEquipment
} = require("../models/schemas");

// Create a new equipment
exports.createEquipment = async (req, res) => {
    try {
        const { id: companyID } = req.params;
        const { equipmentName, locationID, inspectionDate, inspectionInterval, inspectedBy, isChecked, status, description, image } = req.body;
        // Check if an equipment with the same name and in the same location already exists
        const existingEquipment = await Equipment.findOne({ equipmentName, locationID, description });
        if (existingEquipment) {
            return res.status(400).json({ message: "Equipment in this location with this name already exists" });
        }

        // Create unique equipment ID
        const lastEquipment = await Equipment.findOne().sort({ equipmentID: -1 });
        let nextEquipmentNumber = 1;

        if (lastEquipment) {
            const lastID = lastEquipment.equipmentID.substring(1);
            nextEquipmentNumber = parseInt(lastID, 10) + 1;
        }

        const newEquipment = new Equipment({
            equipmentID: `E${nextEquipmentNumber.toString().padStart(4, "0")}`,
            equipmentName,
            companyID,
            locationID,
            inspectionDate,
            inspectionInterval,
            inspectedBy,
            isChecked,
            status,
            description,
            image:URL
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

// // Create a new equipment
// exports.createEquipment = async (req, res) => {
//     try {
//         const { id: companyID } = req.params;
//         const { equipmentName, locationID, inspectionDate, inspectionInterval, inspectedBy, isChecked, status, description, image } = req.body;

//         // Find the current highest equipment ID and increment it
//         const lastEquipment = await Equipment.findOne({}).sort({ equipmentID: -1 });
//         let nextEquipmentNumber;
        
//         if (lastEquipment) {
//             const lastEquipmentID = parseInt(lastEquipment.equipmentID.substring(1), 10);
//             nextEquipmentNumber = lastEquipmentID + 1;
//         } else {
//             nextEquipmentNumber = 1;  // If no equipment exists, start from 1
//         }

//         const newEquipmentID = `E${nextEquipmentNumber.toString().padStart(4, "0")}`;

//         const newEquipment = new Equipment({
//             equipmentID: newEquipmentID,
//             equipmentName,
//             companyID,
//             locationID,
//             inspectionDate,
//             inspectionInterval,
//             inspectedBy,
//             isChecked,
//             status,
//             description,
//             image
//         });
//         await newEquipment.save();

//         // Update EmployeeEquipment table
//         if (inspectedBy) {
//             const employeeEquipmentEntry = {
//                 equipmentID: newEquipment.equipmentID,
//                 employeeID: inspectedBy
//             };
//             await EmployeeEquipment.create(employeeEquipmentEntry);
//         }

//         res.json({ message: "Equipment created successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };




// // Get all equipments by CompanyID
// exports.getEquipmentsByCompany = async (req, res) => {
//     const { id: companyID } = req.params.id;
//     try {
//        // Step 1: Find all locationIDs associated with the company
//        const locationRecords = await Location.find({ companyID }).distinct("locationID");
//        if (locationRecords.length === 0) {
//            return res.status(404).json({ message: "No locations found for this company" });
//        }

//        // Step 2: Fetch all equipment that belongs to these locations
//        const equipmentRecords = await Equipment.find({ locationID: { $in: locationRecords } });
//        if (equipmentRecords.length === 0) {
//            return res.status(404).json({ message: "No equipment found for this company" });
//        }
//        res.json(equipmentRecords);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get all equipments by CompanyID
exports.getEquipmentsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
       const equipments = await Equipment.find({ companyID });
       if (equipments.length === 0) {
           return res.status(404).json({ message: "No equipment found for this company" });
       }
       res.json(equipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

        const updatedEquipment = await Equipment.findOneAndUpdate(
            { equipmentID: req.params.id },
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
// exports.deleteEquipmentByID = async (req, res) => {
//     try {
//         const equipment = await Equipment.findOneAndDelete({ equipmentID: req.params.id });
//         if (!equipment) {
//             return res.status(404).json({ message: "Equipment not found" });
//         }

//         // Delete related EmployeeEquipment entry
//         await EmployeeEquipment.deleteOne({ equipmentID: req.params.id });

//         res.json({ message: "Equipment deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.deleteEquipmentByID = async (req, res) => {
    try {
      const equipment = await Equipment.findOneAndDelete({ equipmentID: req.params.equipmentID });
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.json({ message: 'Equipment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  