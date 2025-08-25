// Correctly load environment variables from the root directory
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const ATLASDB_URL = process.env.ATLASDB_URL;

console.log("🔍 ATLASDB_URL is:", ATLASDB_URL); // debug output

async function main() {
  try {
    await mongoose.connect(ATLASDB_URL);
    console.log("✅ Connected to DB");

    // 1. Delete existing listings
    await Listing.deleteMany({});
    console.log("🧹 Deleted existing listings");

    // 2. Add owner to each listing
    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: "686535b772ab689f4ebfa111", // ✅ ensure this _id exists in your users collection
    }));

    // 3. Insert new listings
    await Listing.insertMany(listingsWithOwner);
    console.log("🌱 Inserted all listings from data.js");

  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();