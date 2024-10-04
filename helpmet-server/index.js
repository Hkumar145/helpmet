require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");
const authRouter = require("./routes/authRoutes");

const app = express();
const port = 5001;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Define the root route
app.get("/", (req, res) => {
  res.send("Welcome to the Injury Tracker API");
});

// Define a test route to check server status
app.get("/api", (req, res) => {
  res.status(200).send({ message: "API is running" });
});

// Use API routes defined in the router
app.use("/", router);

// User authentication routes
app.use("/auth", authRouter);

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An internal server error occurred" });
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_AUTH_URL);
    console.log("Connected to Authentication Database");

    const mainDbConnection = await mongoose.createConnection(process.env.DATABASE_URL);
    console.log("Connected to Main Database");

    // const User = require('./models/user')(authDbConnection);
    // const { Employee, Report, EmployeeReport, Alert, Equipment, Circumstance } = require('./models/schemas')(mainDbConnection);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

startServer();