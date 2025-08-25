// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js"); // ✨ ADD THIS LINE
const ExpressError = require("./utils/ExpressError.js");

// Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

// MongoDB Atlas URL from .env
const dbUrl = process.env.ATLASDB_URL;

// MongoDB Connection
async function main() {
  try {
    console.log("🌐 Connecting to DB...");
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}
main();

// Listen for connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error(`❌ MongoDB connection error after initial connect: ${err}`);
});


// View Engine & Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || 'thisshouldbeabettersecret', // Fallback secret
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (err) {
  console.log("❌ ERROR in mongo session store", err);
});

// Session & Flash
const sessionOptions = {
  store,
  secret: process.env.SECRET || 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// --- ✨ FINAL, UPDATED HOME ROUTE ---
app.get("/", async (req, res) => {
  try {
    // Fetch 3 random listings to feature on the homepage
    const featuredListings = await Listing.aggregate([{ $sample: { size: 3 } }]);
    res.render("home", { featuredListings });
  } catch (err) {
    console.error("Error fetching listings for homepage:", err);
    // If there's an error, still render the page without featured listings
    res.render("home", { featuredListings: [] });
  }
});


// Use Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/", userRouter);

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

// Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});