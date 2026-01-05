const express = require("express");
const cors = require("cors");
const connectDB = require("../src/config/db");
const Ride = require("../src/models/Ride");
const { getUserTrips, moveDriver } = require("../src/controllers/fetchdata");

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:4000",
      "http://localhost:4000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ✅ Connect DB ONCE
let isConnected = false;
async function dbMiddleware(req, res, next) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
}

app.use(dbMiddleware);

// health check
app.get("/", (req, res) => {
  res.json({ message: "Uber backend running on Vercel" });
});

// create ride
app.post("/api/rides", async (req, res) => {
  try {
    const ride = await Ride.create({
      ...req.body,
      driver: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        carNumber: "GJ01 AB 4321",
        lat: req.body.pickup.lat,
        lon: req.body.pickup.lon,
      },
    });
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// get ride by id
app.get("/api/rides/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// update status
app.patch("/api/rides/:id/status", async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/rides/user/:userId", getUserTrips);
app.patch("/api/rides/:id/move-driver", moveDriver);

// ✅ EXPORT APP (VERY IMPORTANT)
module.exports = app;
