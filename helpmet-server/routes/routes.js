const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    createEmployee,
    getEmployeesByCompany,
    getEmployeesByDepartment,
    getEmployeeByID,
    updateEmployeeByID,
    deleteEmployeeByID
} = require("../controllers/employeeController");

const {
    submitReport,
    reviewPendingReport,
    getPendingReportsByCompany,
    // createReport,
    getReportsByCompany,
    getReportByID,
    updateReportByID,
    deleteReportByID,
    getPendingReportByID,
    getSubmittedReportByID,
    updatePendingReportByID,
    approveReport,
    getInjuryTypeStats,
    getWeeklyInjuryStats,
    getPreviousWeeklyInjuryStats,
    getMonthlyEpidemicData
} = require("../controllers/reportController");

const {
    createAlert,
    getAlertsByCompany,
    getAlertByID,
    updateAlertByID,
    // deleteAlertByID
} = require("../controllers/alertController");

const {
    createEquipment,
    getEquipmentsByCompany,
    getEquipmentByID,
    updateEquipmentByID,
    deleteEquipmentByID
} = require("../controllers/equipmentController");

const {
    createDepartment,
    getDepartmentsByCompany,
    getDepartmentByID,
    updateDepartmentByID,
    deleteDepartmentByID
} = require("../controllers/departmentController");

const {
    createLocation,
    getLocationsByCompany,
    getLocationByID,
    updateLocationByID,
    deleteLocationByID
} = require("../controllers/locationController");

const {
    createInjuryType,
    getInjuryTypesByCompany,
    getInjuryTypeByID,
    updateInjuryTypeByID,
    deleteInjuryTypeByID
} = require("../controllers/injuryTypeController");

/***************   Employee Routes   ***************/
// Create an employee
router.post("/companies/:id/employees", createEmployee);

// Get a list of all employees by company ID
router.get("/companies/:id/employees", getEmployeesByCompany);

// Get a list of all employees by department ID
router.get("/companies/:companyID/departments/:departmentID/employees", getEmployeesByDepartment);

// Get employee details by employee ID
router.get("/employees/:id", getEmployeeByID);

// Update employee details by employee ID
router.put("/employees/:id", updateEmployeeByID);

// Delete employee by employee ID
router.delete("/employees/:id", deleteEmployeeByID);

/***************   Report Routes   ***************/
// Submit a new pending report
router.post("/reports/submit", upload.array('image', 5), submitReport);

// Review a pending report
router.put("/reports/review", reviewPendingReport);

// Get all pending reports by CompanyID
router.get("/companies/:id/reports/pending", getPendingReportsByCompany);

// // Create a report
// router.post("/companies/:id/reports", createReport);

// Get a list of all reports by CompanyID
router.get("/companies/:id/reports", getReportsByCompany);

// Get report details by report ID
router.get("/reports/:id", getReportByID);

// Update report details by report ID
router.put("/reports/:id", updateReportByID);

// Delete report by report ID
router.delete("/reports/:id", deleteReportByID);

// Get pending report details by MongoDB _id
router.get("/reports/pending/:_id", getPendingReportByID);

// Get submitted report details by MongoDB _id
router.get("/update-report/:_id", getSubmittedReportByID);

// Update pending report details by MongoDB _id
router.put("/update-report/:_id", upload.array('image', 5), updatePendingReportByID);

// Move approved report from pendingreports to reports collection
router.post("/reports/approve", approveReport);

// Get injury type data from reports collection
router.get('/injury-type-stats', getInjuryTypeStats);

// Get weekly injury data from reports collection
router.get('/weekly-injury-stats', getWeeklyInjuryStats);

// Get previous weekly injury data from reports collection
router.get('/previous-weekly-injury-stats', getPreviousWeeklyInjuryStats);

// Get monthly epidemic type from reports collection
router.get('/monthly-epidemic-data', getMonthlyEpidemicData);

/***************   Alert Routes   ***************/
// Create an alert
router.post("/companies/:id/alerts", upload.array("attachments"), createAlert);

// Get a list of all alerts by CompanyID
router.get("/companies/:id/alerts", getAlertsByCompany);

// Get alert details by alert ID
router.get("/alerts/:id", getAlertByID);

// Update alert details by alert ID
router.put("/alerts/:id", upload.array("attachments"), updateAlertByID);

// // Delete alert by alert ID
// router.delete("/alerts/:id", deleteAlertByID);

/***************   Equipment Routes   ***************/
// Create an equipment
router.post("/companies/:id/equipments", createEquipment);

// Get a list of all equipments by CompanyID
router.get("/companies/:id/equipments", getEquipmentsByCompany);

// Get equipment details by equipment ID
router.get("/equipments/:id", getEquipmentByID);

// Update equipment details by equipment ID
router.put("/equipments/:id", updateEquipmentByID);

// Delete equipment by equipment ID
// router.delete("/equipments/:id", deleteEquipmentByID);
router.delete('/companies/:id/equipments/:equipmentID', deleteEquipmentByID);



/***************   Department Routes   ***************/
// Create a department
router.post("/companies/:id/departments", createDepartment);

// Get a list of all departments by company ID
router.get("/companies/:id/departments", getDepartmentsByCompany);

// Get department details by department ID
router.get("/departments/:id", getDepartmentByID);

// Update department details by department ID
router.put("/departments/:id", updateDepartmentByID);

// Delete department by department ID
router.delete("/departments/:id", deleteDepartmentByID);

/***************  Location Routes   ***************/
// Create a location
router.post("/companies/:id/createlocations", createLocation);

// Get a list of all locations by company ID
router.get("/companies/:id/locations", getLocationsByCompany);

// Get location details by location ID
router.get("/locations/:id", getLocationByID);

// Update location details by location ID
router.put("/locations/:id", updateLocationByID);

// Delete location by location ID
router.delete("/locations/:id", deleteLocationByID);

/***************   InjuryType Routes   ***************/
// Create an injury type
router.post("/companies/:id/injurytypes", createInjuryType);

// Get a list of all injury types by company ID
router.get("/companies/:id/injurytypes", getInjuryTypesByCompany);

// Get injury type details by injury type ID
router.get("/injurytypes/:id", getInjuryTypeByID);

// Update injury type details by injury type ID
router.put("/injurytypes/:id", updateInjuryTypeByID);

// Delete injury type by injury type ID
router.delete("/injurytypes/:id", deleteInjuryTypeByID);

module.exports = router;