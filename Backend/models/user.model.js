const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
   {
    username: {   
      type: String,
      // required: [true, "Full Name is required"],
      // trim: true,
      // minlength: [3, "Name must be at least 3 characters long"]
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      // unique: true,
      // lowercase: true,
      // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      // minlength: [6, "Password must be at least 6 characters long"]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const userModel = mongoose.model("users",userSchema);
module.exports = userModel;