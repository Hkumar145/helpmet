const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Employee Schema
const employeeSchema = new Schema({
    employeeID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    departmentID: { type: String, required: true, ref: "Department", trim: true, maxlength: 10 },
    companyID: { type: Number, required: true, ref: "Company", trim: true, maxlength: 10 },
    firstName: { type: String, required: true, trim: true, maxlength: 30 },
    lastName: { type: String, required: true, trim: true, maxlength: 30 },
    dateOfBirth: { type: Date, required: true,
        validate: [
          (date) => date <= new Date(),
          "Date of Birth must be in the past",
        ],
      },
    email: { type: String, required: true, trim: true, maxlength: 30 },
    role: {
        type: String,
        enum: ["HR", "Employee", "Manager", "Safety Officer"],
        required: true
    }
});

// PendingReport Schema
const pendingReportSchema = new Schema({
    companyID: { type: Number, required: true, ref: "Company", trim: true, maxlength: 10 },
    reportBy: { type: Number, required: true, trim: true, ref: "Employee" },
    injuredEmployeeID: { type: Number, required: true, trim: true, ref: "Employee" },
    dateOfInjury: { type: Date, required: true },
    reportDate: { type: Date, required: true, default: Date.now },
    locationID: { type: String, required: true, ref: "Location", trim: true, maxlength: 10 },
    injuryTypeID: { type: String, required: true, ref: "InjuryType", trim: true, maxlength: 10 },
    severity: {
        type: Number,
        enum: [1, 2, 3, 4, 5], // 1: Minor, 2: Severe, 3: Moderate, 4: Significant, 5: Fatal
        required: true
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: [String], required: false },
    witnessID: { type: Number, required: false, trim: true, ref: "Employee" },
    status: {
        type: String,
        enum: ["On going", "On hold", "Completed"],
        default: "On going",
        required: true
    },
    reviewDate: { type: Date, default: Date.now, required: true }
});

const reportSchema = new Schema({
    reportID: { type: String, required: true, unique: true, trim: true, maxlength: 10 },
    companyID: { type: Number, required: true, ref: "Company", trim: true, maxlength: 10 },
    reportBy: { type: Number, required: true, trim: true, ref: "Employee" },
    injuredEmployeeID: { type: Number, required: true, trim: true, ref: "Employee" },
    dateOfInjury: { type: Date, required: true },
    reportDate: { type: Date, required: true },
    locationID: { type: String, required: true, ref: "Location", trim: true, maxlength: 10 },
    injuryTypeID: { type: String, required: true, ref: "InjuryType", trim: true, maxlength: 10 },
    severity: {
        type: Number,
        enum: [1, 2, 3, 4, 5], // 1: Minor, 2: Severe, 3: Moderate, 4: Significant, 5: Fatal
        required: true
    },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: [String], required: false },
    witnessID: { type: Number, required: false, trim: true, ref: "Employee" },
    status: { 
        type: String,
        default: "Completed",
        required: true 
    },
    reviewDate : { type: Date, required: true }
});

// Employee Report Schema
const employeeReportSchema = new Schema({
    employeeID: { type: Number, ref: "Employee", trim: true, required: true },
    reportID: { type: String, ref: "Report", trim: true, required: true }
});
employeeReportSchema.index({ employeeID: 1, reportID: 1 }, { unique: true });

// Alert Schema
const alertSchema = new Schema({
    alertID: { type: String, required: true, unique: true, trim: true, maxlength: 10 },
    alertName: { type: String, trim: true, required: true, maxlength: 100 }, 
    companyID: { type: Number, ref: "Company", trim: true, required: true },
    sentAt: { type: Date, required: true, },
    description: { type: String, trim: true, required: true, maxlength: 300 },
    status: { type: String, default: "deactive" },
    recipients: [{ type: String }],
    cc: { type: String, required: false },
    scheduledTime: { type: Date },
    attachments: { type: [String], required: false },
    type: { type: String, required: true }
});

// EmployeeAlert Schema
const employeeAlertSchema = new Schema({
    employeeID: { type: Number, ref: "Employee", trim: true, required: true },
    alertID: { type: String, ref: "Alert", trim: true, required: true }
});
employeeAlertSchema.index({ employeeID: 1, alertID: 1 }, { unique: true });

// Equipment Schema
const equipmentSchema = new Schema({
    equipmentID: { type: String, required: true, unique: true, trim: true, maxlength: 10 },
    equipmentName: { type: String, trim: true, required: true, maxlength: 30 },
    companyID: { type: Number, required: true, ref: "Company", trim: true, maxlength: 10 },
    locationID: { type: String, required: true, ref: "Location", trim: true, maxlength: 10 },
    inspectionDate: { type: Date, required: true },
    isChecked: {type: Boolean, required: true },
    inspectionInterval: { type: Number, required: true },
    inspectedBy: { type: Number, required: true, trim: true, ref: "Employee" },
    status: { 
        type: String,
        enum: ["Good", "Needs Maintenance", "Out of Service"],
        default: "Good",
        required: true 
    },
    description: { type: String, trim: true, required: true, maxlength: 500 },
    image: { type: String }
});

// EmployeeEquipment Schema
const employeeEquipmentSchema = new Schema({
    employeeID: { type: Number, ref: "Employee", trim: true, required: true },
    equipmentID: { type: String, ref: "Equipment", trim: true, required: true }
});
employeeEquipmentSchema.index({ employeeID: 1, equipmentID: 1 }, { unique: true });

// Company Schema
const companySchema = new Schema({
    companyID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    companyName: { type: String, trim: true, required: true, maxlength: 30 },
    companyAddress: { type: String, trim: true, required: true, maxlength: 30 },
    contactEmail: { type: String, required: true, trim: true, maxlength: 30 },
    province: { type: String, required: true, trim: true, maxlength: 30 },
    city: { type: String, required: true, trim: true, maxlength: 30 },
    postCode: { type: String, required: true, trim: true, maxlength: 30 }
});

// Department Schema
const departmentSchema = new Schema({
    companyID: { type: Number, required: true, ref: "Company", trim: true, maxlength: 10 },
    departmentID: { type: String, required: true, unique: true, trim: true, maxlength: 10 },
    departmentName: { type: String, trim: true, required: true, maxlength: 30 }
});

// DepartmentAlert Schema
const departmentAlertSchema = new Schema({
    departmentID: { type: String, trim: true, required: true, maxlength: 10 },
    alertID: { type: String, trim: true, required: true, maxlength: 30 }
});
departmentAlertSchema.index({ departmentID: 1, alertID: 1 }, { unique: true });

// // Location Schema
// const locationSchema = new Schema({
//     locationID: { type: String, unique: true, trim: true, required: true, maxlength: 10 },
//     locationName: { type: String, trim: true, required: true, maxlength: 30 },
//     companyID: { type: Number, ref: "Company", trim: true, required: true },
//     managerID: { type: Number,unique: true, trim: true, maxlength: 10 },
//     location: {
//         type: {
//           type: String,
//           enum: ["Point"],
//           required: true,
//           default: "Point"
//         },
//         coordinates: {
//           type: [Number],
//           required: true
//         }
//       }
// });

const locationSchema = new Schema({
    locationID: { type: String, unique: true, trim: true, required: true, maxlength: 10 },
    locationName: { type: String, trim: true, required: true, maxlength: 30 },
    companyID: { type: Number, ref: "Company", trim: true, required: true },
    managerID: { type: Number, ref: "Employee", maxlength: 10 }, // Add reference to Employee
    location: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
          default: "Point"
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
});



// InjuryType Schema
const injuryTypeSchema = new Schema({
    injuryTypeID: { type: String, unique: true, trim: true, required: true, maxlength: 10 },
    injuryType: { type: String, trim: true, required: true, maxlength: 30 },
});

const Employee = mongoose.model("Employee", employeeSchema);
const PendingReport = mongoose.model("PendingReport", pendingReportSchema);
const Report = mongoose.model("Report", reportSchema);
const EmployeeReport = mongoose.model("EmployeeReport", employeeReportSchema);
const Alert = mongoose.model("Alert", alertSchema);
const EmployeeAlert = mongoose.model("EmployeeAlert", employeeAlertSchema);
const Equipment = mongoose.model("Equipment", equipmentSchema);
const EmployeeEquipment = mongoose.model("EmployeeEquipment", employeeEquipmentSchema);
const Company = mongoose.model("Company", companySchema);
const Department = mongoose.model("Department", departmentSchema);
const DepartmentAlert = mongoose.model("DepartmentAlert", departmentAlertSchema);
const Location = mongoose.model("Location", locationSchema);
const InjuryType = mongoose.model("InjuryType", injuryTypeSchema);


module.exports = {
    Employee,
    PendingReport,
    Report,
    EmployeeReport,
    Alert,
    EmployeeAlert,
    Equipment,
    EmployeeEquipment,
    Company,
    Department,
    DepartmentAlert,
    Location,
    InjuryType
};
