const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  branch: {
    type: String,
    required: true
  }
});

mongoose.model("users", UserSchema,'admin');
