const express = require("express");
const router = express.Router();
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Create Booking
router.post("/:listingId", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const newBooking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
    });

    await newBooking.save();
    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error("Booking Error:", err);
    req.flash("error", "Could not complete booking.");
    res.redirect("back");
  }
});


// Show all bookings by current user
router.get('/mine', isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('listing');
  res.render('bookings/mine', { bookings });
});
module.exports = router;
