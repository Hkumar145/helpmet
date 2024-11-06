const { Employee } = require("../models/schemas");

const generateEmployeeID = () => {
    const randomNumber = Math.floor(1 + Math.random() * 99999);
    const formattedRandomNumber = randomNumber.toString().padStart(5, "0");
    return `1004${formattedRandomNumber}`;
};

// Create a new employee account
exports.createEmployee = async (req, res) => {
    try {
        // Check if an employee with the same email and birthday already exists
        const { departmentID, companyID, role, firstName, lastName, email, dateOfBirth } = req.body;

        const existingEmployee = await Employee.findOne({ email, dateOfBirth });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this email already exists" });
        }

        // Generate a unique employeeID
        let employeeID;
        let idExists = true;
        while (idExists) {
            employeeID = generateEmployeeID();
            const employeeWithID = await Employee.findOne({ employeeID });
            if (!employeeWithID) {
                idExists = false;
            }
        }

        const newEmployee = new Employee({
            employeeID: employeeID,
            departmentID, 
            companyID, 
            role, 
            firstName, 
            lastName, 
            email, 
            dateOfBirth
        });
        await newEmployee.save();
        res.json({ message: "Employee created successfully" });
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

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (err) {
      res.status(500).json({ error: error.message });
    }
  };

// Get a specific employee by EmployeeID
exports.getEmployeeByID = async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeID: req.params.id });
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

        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeID: req.params.id },
            updateFields,
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an employee account by EmployeeID
exports.deleteEmployeeByID = async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({ employeeID: req.params.id });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get employees by DepartmentID
exports.getEmployeesByDepartment = async (req, res) => {
    const { companyID, departmentID } = req.params;
    try {
        const employees = await Employee.find({ 
            companyID: companyID, 
            departmentID: departmentID 
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};