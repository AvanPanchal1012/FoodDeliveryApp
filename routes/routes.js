const express = require("express");
const User = require("../models/User");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");
const Contact = require("../models/Contact"); // Import the Contact model
const route = express.Router();
const path = require("path");
const multer = require('multer');
const validate = require('validate.js');

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
    res.redirect("/dashboard");
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
      loginFirst: true,
      invalid: false,
      newRegister: false
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

route.get("/admin", (req, res) => {
  res.render("adminLogin");
});

route.post("/loginAdmin", async (req, res) => {
  const loginUser = await User.findOne({ email: req.body.email, type: 'admin' });

  if (!loginUser || !await loginUser.matchPassword(req.body.password)) {
    res.render("login", {
      loginUser: null,
      loginFirst: true,
    });
  } else {
    req.session.loginUser = loginUser;
    res.redirect("/admin/dashboard");
  }
});

route.get("/admin/dashboard", async (req, res) => {
  const loginUser = await checkLoginUser(req, res);
  
  res.render("adminDashboard", {
    loginUser: loginUser,
  });
});

route.get("/admin/users/add", async (req, res) => {
  const loginUser = await checkLoginUser(req, res);

  res.render('adminUserAdd', {
      loginUser: loginUser,
      errors: null,
      user: null
  })
});

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

route.post('/admin/users/save', async (req, res) => {
    const loginUser = await checkLoginUser(req, res);

    const { name, email, phone, address, password, type } = req.body;
    const profileImage = req.file ? req.file.filename : '';

    const constraints = {
      name: {
        presence: { allowEmpty: false, message: '^Name is required' },
        length: {
          maximum: 50,
          message: '^Name can be up to 50 characters long'
        }
      },
      email: {
        presence: { allowEmpty: false, message: '^Email is required' },
        email: { message: '^Email is not valid' }
      },
      phone: {
        presence: { allowEmpty: false, message: '^Phone number is required' },
        format: {
          pattern: "\\d{10}",
          message: '^Phone number must be 10 digits'
        }
      },
      address: {
        presence: { allowEmpty: false, message: '^Address is required' },
        length: {
          maximum: 100,
          message: '^Address can be up to 100 characters long'
        }
      },
      password: {
        presence: { allowEmpty: false, message: '^Password is required' },
        length: {
          minimum: 6,
          message: '^Password must be at least 6 characters long'
        }
      },
      cpassword: {
        presence: { allowEmpty: false, message: '^Confirm Password is required' },
        equality: {
          attribute: 'password',
          message: '^Passwords do not match'
        }
      }
    };

    const validation = validate(req.body, constraints);

    if (validation) {
      res.render("adminUserAdd", {
          user: {
            ...req.body
          },
          errors: validation,
          loginUser: loginUser
      })
    } else {

      // Query to check if email exists
      const user = await User.findOne({ email: email});

      if (user) {
        res.render("adminUserAdd", {
          user: {
            ...req.body
          },
          errors: {
            email: ["Email address is already taken"]
          },
          loginUser: loginUser
        })
      }

      // Create a new user instance
      const newUser = new User({
        name,
        email,
        phone,
        password,
        address,
        type,
        profileImage
      });

      // Save the user to the database
      await newUser.save();

      res.redirect('/admin/users'); // Redirect to the users list or a success page
    }
});

route.get("/admin/users/:page?", async (req, res) => {
  const loginUser = await checkLoginUser(req, res);
  
  let currentPage = 1;
  const page = req.params.page;
  if (page)
      currentPage = page;

  const total = 5;
  const start = (currentPage - 1) * total;
  const data = await User.find({type : {$ne: 'admin'}}).skip(start).limit(total);
  const totalPage = Math.ceil(await User.find({type : {$ne: 'admin'}}).countDocuments() / total);
  
  res.render('adminUsers', {
      loginUser: loginUser,
      users: data,
      currentPage: currentPage,
      count: totalPage
  })
});

//edit dish here
route.get("/admin/users/edit/:id", async (req, res) => {
  const loginUser = await checkLoginUser(req, res);

  const data = await User.findOne({_id: req.params.id, type : {$ne: 'admin'}})
  console.log(data);
  if (data) {
      res.render("adminUserAdd", {
          user: data,
          errors: null,
          loginUser: loginUser
      })
  } else {
    res.redirect('admin/users')
  }
});

route.post('/admin/users/update/:id', /* upload.single('profileImage'), */ async (req, res) => {
    const loginUser = await checkLoginUser(req, res);

    const userId = req.params.id;
    const { name, email, phone, address, password } = req.body;

    const constraints = {
      name: {
        presence: { allowEmpty: false, message: '^Name is required' },
        length: {
          maximum: 50,
          message: '^Name can be up to 50 characters long'
        }
      },
      email: {
        presence: { allowEmpty: false, message: '^Email is required' },
        email: { message: '^Email is not valid' }
      },
      phone: {
        presence: { allowEmpty: false, message: '^Phone number is required' },
        format: {
          pattern: "\\d{10}",
          message: '^Phone number must be 10 digits'
        }
      },
      address: {
        presence: { allowEmpty: false, message: '^Address is required' },
        length: {
          maximum: 100,
          message: '^Address can be up to 100 characters long'
        }
      },
      password: function(value, attributes) {
        if (!value && !attributes.cpassword) {
          return null;
        }
        return {
          presence: { allowEmpty: false, message: '^Password is required' },
          length: {
            minimum: 6,
            message: '^Password must be at least 6 characters long'
          }
        };
      },
      cpassword: function(value, attributes) {
        if (!attributes.password) {
          return null;
        }
        return {
          presence: { allowEmpty: false, message: '^Confirm Password is required' },
          equality: {
            attribute: 'password',
            message: '^Passwords do not match'
          }
        };
      }
    };

    const validation = validate(req.body, constraints);

    if (validation) {
      res.render("adminUserAdd", {
          user: {
            _id: userId,
            ...req.body
          },
          errors: validation,
          loginUser: loginUser
      })
    } else {
      const updateData = { name, email, phone, address };

      // Query to check if email exists
      const emailExist = await User.findOne({ email: email, _id: {$ne: userId}});

      if (emailExist) {
        res.render("adminUserAdd", {
          user: {
            ...req.body
          },
          errors: {
            email: ["Email address is already taken"]
          },
          loginUser: loginUser
        })
      }
      else {
        if (req.file) {
          updateData.profileImage = req.file.filename;
        }
  
        if (password) {
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(password, salt);
        }
  
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  
        if (!user) {
          return res.status(404).send('User not found');
        }
  
        res.redirect('/admin/users'); // Adjust the redirect as necessary
      }
      
    }
  
});

route.get('/admin/users/delete/:id', async (req, res) => {
  const loginUser = await checkLoginUser(req, res);

  const data = await User.deleteOne({ "_id": req.params.id })
  if (data) {
      console.log("file is deleted...")
      res.redirect('/admin/users')
  } else {
      res.send("<h1>Server Error !!</h1><h2> Sorry user is not deleted please try letter..</h2>")
  }
})
// --------------------------- ADMIN ROUTES ::: END --------------------------- 

module.exports = route;
