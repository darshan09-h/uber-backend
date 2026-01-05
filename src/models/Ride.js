const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    pickup: {
      lat: Number,
      lon: Number,
      label: String,
    },
    dropoff: {
      lat: Number,
      lon: Number,
      label: String,
    },
    distanceKm: { type: Number, required: true },
    carType: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['booked', 'ongoing', 'cancelled', 'completed'],
      default: 'booked',
    },
    driver: {
      name: String,
      phone: String,
      carNumber: String,
      lat: Number,
      lon: Number
    }

  },
  { timestamps: true }
);

module.exports = mongoose.models.Ride || mongoose.model('Ride', rideSchema);
