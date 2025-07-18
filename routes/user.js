const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");


const userController=require("../controllers/users.js");

//Signup
router.route("/signup")
.get(userController.rendersignup )// ✅ Render signup form
.post(wrapAsync(userController.signup));// ✅ Handle signup


//login
router.route("/login")
.get(userController.loginForm)// ✅ Render login form    
.post(                                   
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userController.login
);


// ✅ Handle logout (POST method)
router.post(
  "/logout",userController.logout);

  
module.exports = router;
