const mongoose = require("mongoose");

let cached = global.mongoose || { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "uber_clone",
  });

  console.log("✅ MongoDB connected");
  return cached.conn;
}

module.exports = connectDB;
