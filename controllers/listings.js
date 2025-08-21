const Listing = require("../models/listing");
const mongoose = require("mongoose");

// 📃 Show all listings (with search + category filter)
module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  

  let query = {};

  // 🔍 Search filter
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // 🏷️ Category filter
  if (category && category !== "all") {
    query.category = category;
  }

  const allListings = await Listing.find(query);

  res.render("listings/index.ejs", {
    allListings,
    search: search || "",
    selectedCategory: category || "all",
  });
};


// 🆕 Render new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// 🔍 Show specific listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

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

// ➕ Create new listing
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};

// ✏️ Render edit form
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImageUrl = "";
  if (listing.image && listing.image.url) {
    originalImageUrl = listing.image.url.replace(
      "/upload",
      "/upload/w_250,h_100,c_fill"
    );
  }

  res.render("listings/edit", { listing, originalImageUrl });
};

// 🔁 Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const { title, description, price, location, country, category } = req.body.listing;
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;
  listing.category = category; // ✅ keep category updated

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ❌ Delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
