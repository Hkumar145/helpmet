const {
    Employee,
    Report,
    Alert,
    Equipment
} = require("../models/schemas");

// Create a new employee account
exports.createEmployee = async (req, res) => {
    try {
        // Check if an employee with the same email already exists
        const { email } = req.body;

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this email already exists" });
        }

        const employee = new Employee(req.body);
        if (!employee.firstName || !employee.lastName || !employee.DateOfBirth || !employee.email || !employee.role) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all employees by CompanyID
exports.getEmployeesByCompany = async (req, res) => {
    const { id: companyID } = req.params;
    try {
        const employees = await Employee.find({ companyID: companyID });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific employee by EmployeeID
exports.getEmployeeByID = async (req, res) => {
    try {
        const employee = await Employee.findOne({ ID: req.params.id });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update employee account details by EmployeeID
exports.updateEmployeeByID = async (req, res) => {
    try {
        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            { ID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an employee account by EmployeeID
exports.deleteEmployeeByID = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete({ ID: req.params.id });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};