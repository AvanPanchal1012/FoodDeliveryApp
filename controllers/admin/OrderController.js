const Order = require("../../models/Order");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/DishValidations');

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
    getAllOrders: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
        
        let currentPage = 1;
        const page = req.params.page;

        if (page)
            currentPage = page;

        const total = 10;
        const start = (currentPage - 1) * total;
        const data = await order.find().skip(start).limit(total);
        const totalPage = Math.ceil(order.find().countDocuments() / total);

        console.log("place order" + data)
        res.render('adminOrders', {
            loginuser: loginUser,
            orders: data,
            currentPage: currentPage,
            count: totalPage
        })
    },
    cookingStatus: async (req, res) => {
        if (req.session.loginUser) {
            if (req.session.loginUser.type == 'admin') {
                
                const data = await order.updateOne({ _id: req.params.id }, { $set: { states: "Cooking" } })
                res.redirect("/admin/adminOrder/1")
            }else
            res.send("<h2>Wrong page try to access...</h2>")
        } else {
            res.render("login", {
                loginFirst: true
            })
        }
    },
    deliverStatus: async (req, res) => {
        if (req.session.loginUser) {
            if (req.session.loginUser.type == 'admin') {
            
                const data = await order.updateOne({ _id: req.params.id }, { $set: { states: "Out for deliver." } })
                
                res.redirect("/admin/adminOrder/1")
            }else
            res.send("<h2>Wrong page try to access...</h2>")
        } else {
            res.render("login", {
                loginFirst: true
            })
        }
    },
    completeStatus: async (req, res) => {
        if (req.session.loginUser) {
            if (req.session.loginUser.type == 'admin') {
                console.log("function i scalled")
                const data = await order.updateOne({ _id: req.params.id }, { $set: { states: "Order completed." } })
        
                res.redirect("/admin/adminOrder/1")
            }else
            res.send("<h2>Wrong page try to access...</h2>")
        } else {
            res.render("login", {
                loginFirst: true
            })
        }
    }
}