const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");

// Routes for listings
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("image"), // Cloudinary image upload
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


// 🔄 TEMPORARY: Seed data route for Render
const initData = require("../init/data.js"); // ✅ Points to your existing file

const Listing = require("../models/listing");

router.get("/seed", async (req, res) => {
  try {
    const count = await Listing.countDocuments();
    if (count === 0) {
      const seeded = initData.data.map((obj) => ({
        ...obj,
        owner: "686535b772ab689f4ebfa111", // 🟡 Replace with a valid user ID
      }));

      await Listing.insertMany(seeded);
      res.send("✅ Seed data inserted!");
    } else {
      res.send("ℹ️ Listings already exist. Skipping seeding.");
    }
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    res.status(500).send("❌ Error occurred during seeding.");
  }
});

module.exports = router;
