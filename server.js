require('dotenv').config();


const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const Ride = require('./src/models/Ride');
const { getUserTrips } = require("./src/controllers/fetchdata");

const app = express();



app.use(cors({
  origin: "*"
}));
app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.json({ message: 'Uber backend running' });
});

// console.log("moveDriver type:", typeof moveDriver);

// create ride
app.post('/api/rides', async (req, res) => {
  try {
    const ride = await Ride.create({
      ...req.body,

      driver: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        carNumber: "GJ01 AB 4321",

        // driver starts at pickup location
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
app.get('/api/rides/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// update status
app.patch('/api/rides/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/rides/user/:userId", getUserTrips);
// app.patch("/api/rides/:id/move-driver", moveDriver);



const PORT = process.env.PORT || 4000;

connectDB().then(() => {

  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
