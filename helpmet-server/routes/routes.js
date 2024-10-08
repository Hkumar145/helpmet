const express = require("express");
const router = express.Router();
const {
    createEmployee,
    getEmployees,
    getEmployeeByID,
    updateEmployeeByID,
    deleteEmployeeByID
} = require("../controllers/employeeController");

const {
    createReport,
    getReports,
    getReportByID,
    updateReportByID,
    deleteReportByID
} = require("../controllers/reportController");

const {
    createAlert,
    getAlerts,
    getAlertByID,
    updateAlertByID,
    deleteAlertByID
} = require("../controllers/alertController");

const {
    createEquipment,
    getEquipments,
    getEquipmentByID,
    updateEquipmentByID,
    deleteEquipmentByID
} = require("../controllers/equipmentController");

/***************   Employee Routes   ***************/
// Create an employee
router.post("/employees", createEmployee);

// Get a list of all employees
// router.get("/employees", getEmployees);

router.get('/employees', (req, res) => {
    res.send(getEmployees);
});

// Get employee details by employee ID
router.get("/employees/:id", getEmployeeByID);

// Update employee details by employee ID
router.put("/employees/:id", updateEmployeeByID);

// Delete employee by employee ID
router.delete("/employees/:id", deleteEmployeeByID);

/***************   Report Routes   ***************/
// Create a report
router.post("/reports", createReport);

// Get a list of all reports
router.get("/reports", getReports);

// Get report details by report ID
router.get("/reports/:id", getReportByID);

// Update report details by report ID
router.put("/reports/:id", updateReportByID);

// Delete report by report ID
router.delete("/reports/:id", deleteReportByID);

/***************   Alert Routes   ***************/
// Create an alert
router.post("/alerts", createAlert);

// Get a list of all alerts
router.get("/alerts", getAlerts);

// Get alert details by alert ID
router.get("/alerts/:id", getAlertByID);

// Update alert details by alert ID
router.put("/alerts/:id", updateAlertByID);

// Delete alert by alert ID
router.delete("/alerts/:id", deleteAlertByID);

/***************   Equipment Routes   ***************/
// Create an equipment
router.post("/equipments", createEquipment);

// Get a list of all equipments
router.get("/equipments", getEquipments);

// Get equipment details by equipment ID
router.get("/equipments/:id", getEquipmentByID);

// Update equipment details by equipment ID
router.put("/equipments/:id", updateEquipmentByID);

// Delete equipment by equipment ID
router.delete("/equipments/:id", deleteEquipmentByID);

module.exports = router;