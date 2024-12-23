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
const port = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['https://helpmet.onrender.com', 'https://helpmet.ca'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Handle preflight requests
app.options('*', cors(corsOptions));
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

// Report-related routes
app.use("/report", reportRouter);

// Email-related routes
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
