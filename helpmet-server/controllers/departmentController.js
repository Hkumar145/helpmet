const {
    Employee,
    Department
} = require("../models/schemas");

// Create a new department under a specific company
exports.createDepartment = async (req, res) => {
    const { departmentName } = req.body;
    try {
        const existingDepartment = await Department.findOne({ departmentName });
        if (existingDepartment) {
            return res.status(400).json({ message: "Department with this name already exists" });
        }

        const departmentCount = await Department.countDocuments();
        const nextDepartmentNumber = departmentCount + 1;

        const newDepartment = new Department({
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
        // Step 1: Find unique department IDs for the company through employees
        const employeeRecords = await Employee.find({ companyID }).distinct("departmentID");
        // Step 2: Fetch departments with those IDs
        const departments = await Department.find({ departmentID: { $in: employeeRecords } });
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