require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require('./routes/routes');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Define a route for the root path
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Use the router for API routes
app.use("/api", router);

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

startServer();