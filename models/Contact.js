const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
},  { timestamps: true });

const Contact = mongoose.model("Contacts", contactSchema);

module.exports = Contact;
