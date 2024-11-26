require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");
const authRouter = require("./routes/authRoutes");
const reportRouter = require("./routes/reportRoutes");
const emailRouter = require('./routes/emailRoutes');
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 5001;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

app.use("/report", reportRouter);

app.use("/email", emailRouter);

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "An internal server error occurred" });
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`Server is running on Port:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

startServer();