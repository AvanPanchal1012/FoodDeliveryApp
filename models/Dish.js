const mongoose = require("mongoose");
const DishSchema = mongoose.Schema({
  dname: String,
  dtype: String,
  dprice: Number,
  dtime: String,
  photo: String,
  discription: String,
  ddiscount: Number,
  dserve: Number,
});
module.exports = mongoose.model("Dish", DishSchema);
