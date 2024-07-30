const express = require("express");
const User = require("../models/User");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");
const Contact = require("../models/Contact"); // Import the Contact model
const route = express.Router();
const path = require("path");
const multer = require('multer');
const validate = require('validate.js');

// --------------------------- ADMIN ROUTES ::: START --------------------------- 

async function checkLoginUser(req, res) {

  return {
    _id: '66a57266aa51210082fe3581',
    name: 'Jessica Morgan',
    email: 'jessicamorgan@yopmail.com',
    phone: '1234567890',
    password: '$2a$10$X/2H3n7Bu9E7hTLHZ6g2V.5XohwTdBWT/5na4Su14wrCX50JQk.0q',
    address: 'Scarborough',
    type: 'admin',
    __v: 0
  }
  // const loginUser = req.session.loginUser;
  // console.log(req.session);
  // if (!loginUser) {
  //   res.render("adminLogin");
  // } 
  // else {
  //   return loginUser;
  // }
}



// --------------------------- ADMIN ROUTES ::: END --------------------------- 

module.exports = route;
