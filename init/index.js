const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("✅ Connected to DB");
    return initDB(); // Safe seeding
  })
  .then(() => {
    console.log("✅ Data initialization completed");
    mongoose.connection.close(); // Close DB
  })
  .catch((err) => {
    console.error("❌ Error initializing database:", err);
    mongoose.connection.close(); // Still close on error
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  const existingCount = await Listing.countDocuments();
  if (existingCount === 0) {
    // Add owner to each listing
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "686535b772ab689f4ebfa111" // Replace with a valid user ID
    }));

    await Listing.insertMany(initData.data);
    console.log("✅ Seed data inserted.");
  } else {
    console.log("ℹ️ Listings already exist. Skipping seeding.");
  }
}

