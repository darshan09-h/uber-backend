const Ride = require("../models/Ride");

// ==============================
// GET USER TRIPS
// ==============================
const getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;
    const rides = await Ride.find({ userId }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==============================
// MOVE DRIVER
// ==============================
const moveDriver = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (!ride.driver) {
      return res.status(400).json({ error: "Driver not assigned" });
    }

    if (ride.status === "completed") {
      return res.json(ride);
    }

    const STEP = 0.0004;

    const dLat = ride.dropoff.lat - ride.driver.lat;
    const dLon = ride.dropoff.lon - ride.driver.lon;

    // reached destination
    if (Math.abs(dLat) < STEP && Math.abs(dLon) < STEP) {
      ride.driver.lat = ride.dropoff.lat;
      ride.driver.lon = ride.dropoff.lon;
      ride.status = "completed";
      await ride.save();
      return res.json(ride);
    }

    // move driver
    ride.driver.lat += STEP * Math.sign(dLat);
    ride.driver.lon += STEP * Math.sign(dLon);
    ride.status = "ongoing";

    await ride.save();
    res.json(ride);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ EXPORT BOTH FUNCTIONS
module.exports = {
  getUserTrips,
  moveDriver,
};
