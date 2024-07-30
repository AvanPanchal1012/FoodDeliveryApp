const express = require("express");
const User = require("../models/User");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");
const Contact = require("../models/Contact");
const order = require("../models/Order"); // Import the Contact model
const route = express.Router();
const path = require("path");
const multer = require("multer");
const validate = require("validate.js");
const UserController = require("../controllers/admin/UserController");
const LoginController = require("../controllers/admin/LoginController");

route.get("/", (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("🚀 ~ route.get ~ loginUser:", loginUser);
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
  console.log("🚀 ~ route.post ~ data:", req.body);
  if (data == null || data == undefined) {
    res.render("login", {
      loginUser: null,
      invalid: true,
      email: req.body.email,
      logout: req.session.logout || false,
      loginFirst: req.session.loginFirst || false,
      newRegister: req.session.newRegister || false,
    });
  } else {
    req.session.loginUser = data;
    console.log("🚀 ~ route.post ~ req.session.loginUser:", req.session);
    if (req.session.loginUser.type == "normal") {
      res.redirect("/dashboard");
      return;
    }
    res.send("admin");
  }
});

route.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("login", {
      logout: true,
      loginUser: null,
      loginFirst: false,
      invalid: false,
      newRegister: false,
    });
  });
});

route.post("/saveRegistration", async (req, res) => {
  await User.create(req.body);
  res.render("login", {
    newRegister: true,
    loginUser: null,
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
      loginUser: null,
      loginFirst: true,
    });
  } else {
    res.render("adminDashboard", {
      loginUser: loginUser,
      // file: `uploads/${req.file.filename}`,
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

  const restaurants = await Restaurant.find(searchQuery)
  .skip(start)
  .limit(total);
  // console.log("cuurentpage", currentPage);
  res.render("showDishes", {
    loginUser,
    foods,
    restaurants,
    count,
    currentPage,
    searchKey, // Pass searchKey to the template
  });
});

route.post("/saveRegistration", async (req, res) => {
  const data = await User.create(req.body);
  res.render("login", {
    loginUser: null,
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
    restaurants,
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

// --------------------------- ADMIN ROUTES ::: START ---------------------------

async function checkLoginUser(req, res) {
  return {
    _id: "66a57266aa51210082fe3581",
    name: "Jessica Morgan",
    email: "jessicamorgan@yopmail.com",
    phone: "1234567890",
    password: "$2a$10$X/2H3n7Bu9E7hTLHZ6g2V.5XohwTdBWT/5na4Su14wrCX50JQk.0q",
    address: "Scarborough",
    type: "admin",
    __v: 0,
  };
  // const loginUser = req.session.loginUser;
  // console.log(req.session);
  // if (!loginUser) {
  //   res.render("adminLogin");
  // }
  // else {
  //   return loginUser;
  // }
}

route.get("/admin", LoginController.adminLogin);
route.post("/loginAdmin", LoginController.handleLogin);
route.get("/admin/dashboard", LoginController.adminDashboard);

route.get("/admin/users/add", UserController.addNewUser);
route.post("/admin/users/save", UserController.saveNewUser);
route.get("/admin/users/:page?", UserController.getAllUsers);
route.get("/admin/users/edit/:id", UserController.getUserById);
route.post("/admin/users/update/:id", UserController.updateUser);
route.get("/admin/users/delete/:id", UserController.deleteUser);

// --------------------------- ADMIN ROUTES ::: END ---------------------------

//--------------------------- ORDERS ROUTES - START ---------------------------

route.get("/user/orderFood", (req, res) => {
  if (req.session.loginUser) {
    const loginUser = req.session.loginUser;
    res.render("userPages/userCheckout", {
      loginUser: loginUser,
    });
  } else {
    res.render("login", {
      loginFirst: true,
    });
  }
<<<<<<< HEAD
})


route.post("/orderNowFromBasket", (req, res) => {
  if (req.session.loginUser) {
      res.redirect("/")
      const loginUser = req.session.loginUser;
      const basket = JSON.parse(req.body.data)
      let dt_ob = new Date();
      let dateTime = "" + ("0" + dt_ob.getDate()).slice(-2) + "/" + ("0" + dt_ob.getMonth()).slice(-2) + "/" + dt_ob.getFullYear() + " T " + dt_ob.getHours() + ":" + dt_ob.getMinutes() + ":" + dt_ob.getSeconds();
      const paymentType = req.body.paymentType

      basket.forEach(async function (item) {
          let object = {
              dishId: item.id,
              userId: loginUser._id,
              restaurantId: item.rid,
              user: loginUser,
              photo: item.image,
              dname: item.name,
              time: dateTime,
              price: item.price,
              quantity: item.quantity,
              paymentType: paymentType,
              states: "NA"//not active order
          }
          console.log(object)
          const data = await order.create(object);
          console.log(data)
          if (data) {
              console.log('data is save');
          }

      });
  } else {
      res.render("login", {
          loginFirst: true
      })
  }
})

route.get("/user/history", async (req, res) => {
  if (req.session.loginUser) {

      const loginUser = req.session.loginUser;
      const data = await order.find({ "userId": req.session.loginUser._id });


      res.render("userPages/userHistory", {
          loginUser: loginUser,
          history: data
      })
  } else {
      res.render("login", {
          loginFirst: true
      })
  }
})

route.get("/user/cancelOrder/:id", async (req, res) => {
  if (req.session.loginUser) {
      const loginUser = req.session.loginUser;
      const deleteData = await order.deleteOne({ _id: req.params.id });


      const data = await order.find({ $and: [{ "states": { $ne: "deliverd" } }, { "userId": req.session.loginUser._id }] });
      console.log("find data : " + data)
      if (deleteData)
          res.render("userPages/userOrders", {
              loginUser: loginUser,
              orderFood: data,
              cancelOrder: true
          })
  } else {
      res.render("login", {
          loginFirst: true
      })
  }
})

route.get("/user/orders", async (req, res) => {
  if (req.session.loginUser) {
      const loginUser = req.session.loginUser;
      const data = await order.find({ $and: [{ "states": { $ne: "deliverd" } }, { "userId": req.session.loginUser._id }] });
      console.log("find data : " + data)
      res.render("userPages/userOrders", {
          loginUser: loginUser,
          orderFood: data,
          cancelOrder: null
      })
  } else {
      res.render("login", {
          loginFirst: true
      })
  }
})
=======
});
>>>>>>> f1aa7b2081120370f0a49e51003d19e82fff05ed
//--------------------------- ORDERS ROUTES - END ---------------------------

module.exports = route;
