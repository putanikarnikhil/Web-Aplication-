const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const initData = require("../init/data.js");
const Listing = require("../models/listing");

// 🔁 Seed route for initial data (one-time setup)
// router.get("/", async (req, res) => {
//   try {
//     const count = await Listing.countDocuments();
//     if (count === 0) {
//       const seeded = initData.data.map((obj) => ({
//         ...obj,
//         owner: "686535b772ab689f4ebfa111", // ⚠️ Replace with a valid user ID
//       }));
//       await Listing.insertMany(seeded);
//       res.send("✅ Seed data inserted!");
//     } else {
//       res.send("ℹ️ Listings already exist. Skipping seeding.");
//     }
//   } catch (err) {
//     console.error("❌ Error seeding DB:", err);
//     res.status(500).send("❌ Error occurred during seeding.");
//   }
// });


// 📃 Index route (search + category handled in controller)
// router.get("/", wrapAsync(listingController.index));

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query; // get search from query
    let listings;
    console.log(category,"catgory")

    if (category && category !== "All") {
      listings = await Listing.find({ category });
    } else {
      listings = await Listing.find({}); 
    }
    console.log(listings,"listings this is it");  
    res.render("listings/index", { listings, search }); // pass search here
  } catch (e) {
    console.log(e);
    res.send("Error loading listings");
  }
});



// router.get("/", async (req, res) => {
//   try {
//     const { category } = req.query;
//     let listings;

//     if (category && category !== "All") {
//       listings = await Listing.find({ category: category });
//     } else {
//       listings = await Listing.find({});
//     }

//     res.render("listings/index", { listings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// 🆕 New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ➕ Create listing
router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// 🔍 Show listing
// router.get("/listings/:id", listings.showListing);
router.get("/:id", wrapAsync(listingController.showListing));

// ✏️ Edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// 🔁 Update listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// ❌ Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
