const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load user model

const User = require("../models/User");;

// User login route
exports.loginPage = (req, res) => res.render("users/login");

// User register route
exports.registrationPage = (req, res) => res.render("users/register");

// User register route
exports.getDashbash = (req, res) => res.render("dashboard");

// Login form POST
exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/general/showDashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
};

// Register form POST
exports.userregistration = (req, res, next) => {
  let errors = [];
  const {password, password2,email} = req.body;
  if (password != password2) errors.push({ text: "Passwords do not match" });
  if (password.length < 4) errors.push({ text: "Password must be at least 4 characters" });

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      branch: req.body.branch,
      password: req.body.password,
      password2: req.body.password2,
      role: req.body.role
    });
  } else {
    User.findOne({ email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered.");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          branch: req.body.branch,
          password: req.body.password,
          role: req.body.role
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                req.flash( "success_msg", "You are now registered and can log in");
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.logout();
  res.redirect("/users/login");
};


