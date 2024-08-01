const mongoose = require("mongoose");
const Dish = require("./Dish");

// Define the schema for the Restaurant model
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  cuisine: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
  },
  openingHours: {
    type: String,
    trim: true,
  },
  photo: {
    type: String, // URL or path to restaurant photo
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dishIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dishes",
    },
  ],
});

// Create the Restaurant model using the schema
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
