const User = require("../../models/User");

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
        const loginUser = await checkLoginUser(req, res);
        
        res.render("admin/adminDashboard", {
          loginUser: loginUser,
        });
    }
}