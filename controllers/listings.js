const Listing = require("../models/listing");
const mongoose = require("mongoose");

// Show all listings (with search + category filter)
// module.exports.index = async (req, res) => {
//   const { search, category } = req.query;
//   let query = {};

//   if (search) {
//     query.title = { $regex: search, $options: "i" };
//   }
//   if (category && category !== "all") {
//     query.category = category;
//   }

//   const allListings = await Listing.find(query);

//   // Group listings by category here in the controller
//   const categorizedListings = {};
//   for (const listing of allListings) {
//     if (!categorizedListings[listing.category]) {
//       categorizedListings[listing.category] = [];
//     }
//     categorizedListings[listing.category].push(listing);
//   }

//   res.render("listings/index.ejs", {
//     allListings, // Keep this for the count check
//     categorizedListings, // Send the grouped data to the view
//     search: search || "",
//     selectedCategory: category || "all",
//   });
// };

// controllers/listings.js

// ... (keep the other code in the file the same)

// Replace your existing index function with this one
module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  // --- THIS IS THE UPDATED SEARCH LOGIC ---
  // If there's a search term, use the powerful $text operator
  if (search) {
    query.$text = { $search: search };
  }
  // --- END OF UPDATE ---

  // This part handles the category filtering
  if (category && category.toLowerCase() !== "all") {
    query.category = category;
  }

  const allListings = await Listing.find(query);

  // Your existing logic for grouping by category
  const categorizedListings = {};
  for (const listing of allListings) {
    if (!categorizedListings[listing.category]) {
      categorizedListings[listing.category] = [];
    }
    categorizedListings[listing.category].push(listing);
  }

  res.render("listings/index.ejs", {
    listings: allListings, // Use 'listings' to match your EJS
    categorizedListings,
    search: search || "",
    selectedCategory: category || "all",
  });
};

// ... (the rest of your controller file)

// --- (The rest of your controller functions remain unchanged) ---

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;
  const updatedListing = await Listing.findByIdAndUpdate(id, listingData);
  if (req.file) {
    updatedListing.image = { url: req.file.path, filename: req.file.filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${updatedListing._id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};