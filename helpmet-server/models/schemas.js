const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Employee Schema
const employeeSchema = new Schema({
    ID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    firstName: { type: String, required: true, trim: true, maxlength: 30 },
    lastName: { type: String, required: true, trim: true, maxlength: 30 },
    DateOfBirth: { type: Date, required: true,
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

// Report Schema
const reportSchema = new Schema({
    ID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    paramedicID: { type: Number, required: true, trim: true, ref: "Employee" },
    injuredEmployeeID: { type: Number, required: true, trim: true, ref: "Employee" },
    dateOfInjury: { type: Date, required: true },
    reportDate: { type: Date, required: true, default: Date.now },
    location: { type: String, required: true, trim: true, maxlength: 30 },
    injuryType: { type: String, required: true, trim: true, maxlength: 30 },
    severity: { type: String, required: true, trim: true, maxlength: 30 },
    circumstanceID: { type: Number, required: true, trim: true, ref: "Circumstance" },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: Buffer, required: true },
});

// Employee Report Schema
const employeeReportSchema = new Schema({
    employeeID: { type: Number, ref: "Employee", trim: true, required: true },
    reportID: { type: Number, ref: "Report", trim: true, required: true },
    assignedAt: { type: Date, default: Date.now }
  });

// Alert Schema
const alertSchema = new Schema({
    ID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    reportID: { type: Number, trim: true, required: true, ref: "Report" },
    type: { type: String, trim: true, required: true, maxlength: 30 }, 
    triggerCondition: { type: String, trim: true, required: true, maxlength: 30 },
    createdAt: { type: Date, default: Date.now, required: true },
    description: { type: String, trim: true, required: true, maxlength: 500 }
});

// Equipment Schema
const equipmentSchema = new Schema({
    ID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    name: { type: String, trim: true, required: true, maxlength: 30 },
    location: { type: String, trim: true, required: true, maxlength: 30 },
    inspectionDate: { type: Date, required: true },
    nextInspectionDate: { type: Date, required: true },
    inspectedBy: { type: String, trim: true, required: true, maxlength: 30 },
    status: { 
        type: String,
        enum: ["Operational", "Maintenance Needed", "Broken"],
        default: "Operational",
        required: true 
    },
    description: { type: String, trim: true, required: true, maxlength: 500 },
    image: { type: Buffer, required: true }
});

// Circumstance Schema
const circumstanceSchema = new Schema({
    ID: { type: Number, required: true, unique: true, trim: true, maxlength: 10 },
    reportID: { type: Number, trim: true, required: true, ref: "Report" },
    weather: { type: String, trim: true, required: true, maxlength: 30 },
    location: { type: String, trim: true, required: true, maxlength: 30 },
    cause: { type: String, trim: true, required: true, maxlength: 30 },
    description: { type: String, trim: true, required: true, maxlength: 500 },
    equipmentInvolved: { type: String, trim: true, required: true, maxlength: 30 },
    employeeInvolved: { type: String, trim: true, required: true, maxlength: 30 }
});

const Employee = mongoose.model("Employee", employeeSchema);
const Report = mongoose.model("Report", reportSchema);
const EmployeeReport = mongoose.model("EmployeeReport", employeeReportSchema);
const Alert = mongoose.model("Alert", alertSchema);
const Equipment = mongoose.model("Equipment", equipmentSchema);
const Circumstance = mongoose.model("Circumstance", circumstanceSchema);

module.exports = {
    Employee,
    Report,
    EmployeeReport,
    Alert,
    Equipment,
    Circumstance
};
