const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profile: {
      age: Number,
      country: String,
      occupation: String,
      salaryRange: String,
      incomeFrequency: String,
      incomeSource: String,
      obligationType: String,
      obligationAmount: Number,
    },

    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "SAR",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);