const User = require("../../models/User");
const Order = require("../../models/Order");
const Restaurant = require("../../models/Restaurant");
const Contacts = require("../../models/Contact");
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
    adminLogin: async (req, res) => {
        res.render("admin/adminLogin");
    },
    handleLogin: async (req, res) => {
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
    },
    adminDashboard: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
       
        if (loginUser) {
          res.render("admin/adminDashboard", {
            loginUser: loginUser,
            users: await User.find({type : {$ne: 'admin'}}).countDocuments(),
            restaurants: await Restaurant.find().countDocuments(),
            contacts: await Contacts.find().countDocuments(),
            orders: await Order.find().countDocuments(),
          });
        }
        else {
          res.redirect("/admin");
        }
    }
}