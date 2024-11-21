const {
    Employee,
    Department
} = require("../models/schemas");

// Create a new department under a specific company
exports.createDepartment = async (req, res) => {
    const { companyID, departmentName } = req.body;
    try {
        const existingDepartment = await Department.findOne({ companyID, departmentName });
        if (existingDepartment) {
            return res.status(400).json({ message: "Department with this name already exists within the company" });
        }

        const lastDepartment = await Department.findOne().sort({ departmentID: -1 });
        let nextDepartmentNumber = 1;

        if (lastDepartment) {
            const lastID = lastDepartment.departmentID.substring(1);
            nextDepartmentNumber = parseInt(lastID, 10) + 1;
        }

        const newDepartment = new Department({
            companyID,
            departmentID: `D${nextDepartmentNumber.toString().padStart(4, "0")}`,
            departmentName
        });
        await newDepartment.save();
        res.json(newDepartment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all departments by CompanyID
exports.getDepartmentsByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
       const departments = await Department.find({ companyID });
       if (departments.length === 0) {
           return res.status(404).json({ message: "No department found for this company" });
       }
       res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get specific department details by departmentID
exports.getDepartmentByID = async (req, res) => {
    try {
        const department = await Department.findOne({ departmentID: req.params.id });
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a department's details by departmentID
exports.updateDepartmentByID = async (req, res) => {
    try {
        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedDepartment = await Department.findOneAndUpdate(
            { departmentID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a department by departmentID
exports.deleteDepartmentByID = async (req, res) => {
    try {
        const deletedDepartment = await Department.findOneAndDelete({ departmentID: req.params.id });
        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json({ message: 'Department successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};