const express = require("express");
const User = require("../models/User");
const route = express.Router();

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

route.get("/contactus", (req, res) => {
  res.render("contactus");
});
module.exports = route;
