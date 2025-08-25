const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");

// ------------------- CORRECTED SECTION -------------------
// 📃 This single line now handles the AI search and category filtering
router.get("/", wrapAsync(listingController.index));
// ---------------------------------------------------------

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