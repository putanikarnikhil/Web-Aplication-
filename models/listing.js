const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const imageSchema = new Schema({
  url: String,
  filename: String,
}, { _id: false });

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  // 👇 New category field
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Mountains",
      "Castles",
      "Pools",
      "Camping",
      "Beaches"
    ],
    required: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Middleware: delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
