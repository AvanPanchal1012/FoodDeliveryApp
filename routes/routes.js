const express = require("express");
const User = require("../models/User");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");
const Contact = require("../models/Contact"); // Import the Contact model
const route = express.Router();
const path = require("path");

route.get("/", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("index", {
    loginUser: loginUser,
  });
});
route.get("/register", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("registration", {
    loginUser: loginUser,
  });
});
route.get("/login", (req, res) => {
  const loginUser = req.session.loginUser;
  //   console.log("loginUser:", loginUser);

  res.render("login", {
    loginUser: loginUser,
    invalid: req.session.invalid || false,
    logout: req.session.logout || false,
    loginFirst: req.session.loginFirst || false,
    newRegister: req.session.newRegister || false,
  });
});

route.post("/loginUser", async (req, res) => {
  const data = await User.findOne({ email: req.body.email });
  console.log("🚀 ~ route.post ~ data:", data);
  if (data == null) {
    res.render("login", {
      invalid: true,
      email: req.body.email,
    });
  } else {
    req.session.loginUser = data;
    res.redirect("/dashboard");
  }
});

route.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("login", {
    logout: true,
  });
});

route.post("/saveRegistration", async (req, res) => {
  await User.create(req.body);
  res.render("login", {
    newRegister: true,
    loginUser: req.body,
    invalid: req.session.invalid || false,
    logout: req.session.logout || false,
    loginFirst: req.session.loginFirst || false,
    newRegister: req.session.newRegister || false,
  });
});

route.get("/admin", (req, res) => {
  res.render("adminLogin");
});

route.post("/loginAdmin", async (req, res) => {
  const loginUser = await User.findOne({ email: req.body.email });
  if (loginUser.type == "normal") {
    res.render("login", {
      loginFirst: true,
    });
  } else {
    res.render("adminDashboard", {
      loginUser: loginUser,
    });
  }
});
route.get("/dashboard", (req, res) => {
  if (req.session.loginUser) {
    const loginUser = req.session.loginUser;
    console.log("🚀 ~ route.get ~ loginUser:", loginUser);
    if (req.session.loginUser.type == "normal") {
      res.render("userPages/userDashboard", {
        loginUser: loginUser,
      });
    } else if (req.session.loginUser.type == "admin") {
      res.render("adminDashboard", {
        loginUser: loginUser,
      });
    }
  } else
    res.render("login", {
      loginFirst: true,
    });
});

// route.get("/contactus", (req, res) => {
//   res.render("contactus");
// });

//food page normal user
route.get("/foods/:page", async (req, res) => {
  const loginUser = req.session.loginUser;
  let currentPage = parseInt(req.params.page, 10) || 1;
  const searchKey = req.query.foodSearch || ""; // Get the search key from query params

  const total = 6; // Number of items per page
  const start = (currentPage - 1) * total;

  // Construct search query
  const searchQuery = searchKey
    ? { dname: { $regex: searchKey, $options: "i" } }
    : {};

  // Fetch foods with search query
  const foods = await Dish.find(searchQuery).skip(start).limit(total);
  const count = Math.ceil((await Dish.countDocuments(searchQuery)) / total);

  // console.log("cuurentpage", currentPage);
  res.render("showDishes", {
    loginUser,
    foods,
    count,
    currentPage,
    searchKey, // Pass searchKey to the template
  });
});

route.post("/saveRegistration", async (req, res) => {
  const data = await User.create(req.body);
  res.render("login", {
    newRegister: true,
  });
});

//search food dish by user
route.post("/searchFood", async (req, res) => {
  const loginUser = req.session.loginUser;
  const search = req.body.foodSearch || "";
  const currentPage = parseInt(req.query.page, 10) || 1; // Get current page from query parameters
  const total = 6; // Number of items per page
  const start = (currentPage - 1) * total;

  // Construct search query
  const searchQuery = search ? { dname: new RegExp(search, "i") } : {};

  // Fetch foods with search query and pagination
  const foods = await Dish.find(searchQuery).skip(start).limit(total);
  const count = Math.ceil((await Dish.countDocuments(searchQuery)) / total);

  res.render("showDishes", {
    loginUser,
    foods,
    count,
    currentPage,
    searchKey: search,
  });
});

//for restuarants
// Route to display a list of restaurants with pagination and search
route.get("/restaurants/:page", async (req, res) => {
  const loginUser = req.session.loginUser;
  let currentPage = parseInt(req.params.page, 10) || 1;
  const searchKey = req.query.restaurantSearch || ""; // Get the search key from query params

  const total = 6; // Number of items per page
  const start = (currentPage - 1) * total;

  // Construct search query
  const searchQuery = searchKey
    ? { name: { $regex: searchKey, $options: "i" } }
    : {};

  // Fetch restaurants with search query
  const restaurants = await Restaurant.find(searchQuery)
    .skip(start)
    .limit(total);
  const count = Math.ceil(
    (await Restaurant.countDocuments(searchQuery)) / total
  );

  res.render("showRestaurants", {
    loginUser,
    restaurants,
    count,
    currentPage,
    searchKey, // Pass searchKey to the template
  });
});

route.post("/searchRestaurant", async (req, res) => {
  const loginUser = req.session.loginUser;
  const search = req.body.restaurantSearch || "";
  const currentPage = parseInt(req.query.page, 10) || 1; // Get current page from query parameters
  const total = 6; // Number of items per page
  const start = (currentPage - 1) * total;

  // Construct search query
  const searchQuery = search ? { name: new RegExp(search, "i") } : {};

  // Fetch restaurants with search query and pagination
  const restaurants = await Restaurant.find(searchQuery)
    .skip(start)
    .limit(total);
  const count = Math.ceil(
    (await Restaurant.countDocuments(searchQuery)) / total
  );

  res.render("showRestaurants", {
    loginUser,
    restaurants,
    count,
    currentPage,
    searchKey: search,
  });
});
route.get("/restaurant/:id", async (req, res) => {
  const loginUser = req.session.loginUser;
  const restaurantId = req.params.id;

  try {
    // Fetch the restaurant details
    const restaurant = await Restaurant.findById(restaurantId).populate(
      "dishIds"
    );
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }

    // The dishes are already populated within the restaurant object due to the .populate() method
    const dishes = restaurant.dishIds;

    res.render("restaurantDetail", {
      loginUser,
      dishes, // Pass dishes as "dishes" to the template
      restaurant,
    });
  } catch (error) {
    console.error("Error fetching restaurant or dishes:", error);
    res.status(500).send("Server Error");
  }
});

// Displays message after successful submission of Contact Us form
route.get("/message", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("message", {
    loginUser: loginUser,
  });
});

// Render contactus.ejs for contact page
route.get("/contactus", (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("from contactus ~ route.get ~ loginUser:", loginUser);
  res.render("contactus", {
    loginUser: loginUser,
  });
});

// Handle form submission
route.post("/contactus", async (req, res) => {
  try {
    const loginUser = req.session.loginUser;
    console.log("🚀 ~ route.get ~ loginUser:", loginUser);
    const { name, email, phone, message } = req.body;
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.status(200).render("message", {
      loginUser: loginUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send message");
  }
});

// Render aboutus.ejs for about us page
route.get("/aboutus", (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("from about us ~ route.get ~ loginUser:", loginUser);
  res.render("aboutus", {
    loginUser: loginUser,
  });
});

module.exports = route;
