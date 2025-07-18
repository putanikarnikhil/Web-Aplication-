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
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");

// Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB Atlas URL from .env
const dbUrl = process.env.ATLASDB_URL;

// ✅ MongoDB Connection
console.log("🌐 Connecting to DB...");
mongoose.connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(8080, () => {
      console.log("🚀 Server is listening on port 8080");
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

// ✅ View Engine & Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:"mysupersecretcode"
  },
  touchAfter: 24 * 3600,
});

store.on("error", () =>{
  console.log("ERROR in mongo session store", err)
});

// ✅ Session & Flash
const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Global Middleware for Flash & Current User
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ Home Route
app.get("/", async (req, res, next) => {
  try {
    const allListings = await Listing.find({}).sort({ _id: -1 }).limit(6);
    res.render("home", { allListings });
  } catch (err) {
    next(err);
  }
});

// ✅ Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ✅ Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});
