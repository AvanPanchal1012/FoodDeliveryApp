const Restaurant = require("../../models/Restaurant");
const Contact = require("../../models/Contact");
const order = require("../../models/Order");
const User = require("../../models/User");

module.exports = {
    getOrders: async (req, res) => {
        if (req.session.loginUser) {
            const loginUser = req.session.loginUser;
            const data = await order.find({
              $and: [
                { states: { $ne: "deliverd" } },
                { userId: req.session.loginUser._id },
              ],
            });
            res.render("userPages/userOrders", {
              loginUser: loginUser,
              orderFood: data,
              cancelOrder: null,
            });
          } else {
            res.render("login", {
              loginFirst: true,
            });
          }
    },
    cancelOrder: async(req,res) =>{
        if (req.session.loginUser) {
            const loginUser = req.session.loginUser;
            const deleteData = await order.deleteOne({ _id: req.params.id });
        
            const data = await order.find({
              $and: [
                { states: { $ne: "deliverd" } },
                { userId: req.session.loginUser._id },
              ],
            });
            if (deleteData)
              res.render("userPages/userOrders", {
                loginUser: loginUser,
                orderFood: data,
                cancelOrder: true,
              });
          } else {
            res.render("login", {
              loginFirst: true,
            });
          }
    },
    orderHistory: async(req,res) =>{
        if (req.session.loginUser) {
            const loginUser = req.session.loginUser;
            const data = await order.find({ userId: req.session.loginUser._id });
        
            res.render("userPages/userHistory", {
              loginUser: loginUser,
              history: data,
            });
          } else {
            res.render("login", {
              loginFirst: true,
            });
          } 
    },
    orderCheckoutpage: async(req,res) =>{
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
    },
    loadOrderCheckoutData: async(req,res) =>{
        if (req.session.loginUser) {
            res.redirect("/");
            const loginUser = req.session.loginUser;
            const basket = JSON.parse(req.body.data);
            let dt_ob = new Date();
            let dateTime =
              "" +
              ("0" + dt_ob.getDate()).slice(-2) +
              "/" +
              ("0" + dt_ob.getMonth()).slice(-2) +
              "/" +
              dt_ob.getFullYear() +
              " T " +
              dt_ob.getHours() +
              ":" +
              dt_ob.getMinutes() +
              ":" +
              dt_ob.getSeconds();
            const paymentType = req.body.paymentType;
        
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
                states: "NA", //not active order
              };
              const data = await order.create(object);
              if (data) {
                console.log("data is save");
              }
            });
          } else {
            res.render("login", {
              loginFirst: true,
            });
          }
    }
}

// route.get("/user/orders", async (req, res) => {
//     if (req.session.loginUser) {
//       const loginUser = req.session.loginUser;
//       const data = await order.find({
//         $and: [
//           { states: { $ne: "deliverd" } },
//           { userId: req.session.loginUser._id },
//         ],
//       });
//       res.render("userPages/userOrders", {
//         loginUser: loginUser,
//         orderFood: data,
//         cancelOrder: null,
//       });
//     } else {
//       res.render("login", {
//         loginFirst: true,
//       });
//     }
//   });   

//   route.get("/user/cancelOrder/:id", async (req, res) => {
//     if (req.session.loginUser) {
//       const loginUser = req.session.loginUser;
//       const deleteData = await order.deleteOne({ _id: req.params.id });
  
//       const data = await order.find({
//         $and: [
//           { states: { $ne: "deliverd" } },
//           { userId: req.session.loginUser._id },
//         ],
//       });
//       if (deleteData)
//         res.render("userPages/userOrders", {
//           loginUser: loginUser,
//           orderFood: data,
//           cancelOrder: true,
//         });
//     } else {
//       res.render("login", {
//         loginFirst: true,
//       });
//     }
//   });

//   route.get("/user/history", async (req, res) => {
//     if (req.session.loginUser) {
//       const loginUser = req.session.loginUser;
//       const data = await order.find({ userId: req.session.loginUser._id });
  
//       res.render("userPages/userHistory", {
//         loginUser: loginUser,
//         history: data,
//       });
//     } else {
//       res.render("login", {
//         loginFirst: true,
//       });
//     }
//   });

//   route.get("/user/orderFood", (req, res) => {
//     if (req.session.loginUser) {
//       const loginUser = req.session.loginUser;
//       res.render("userPages/userCheckout", {
//         loginUser: loginUser,
//       });
//     } else {
//       res.render("login", {
//         loginFirst: true,
//       });
//     }
//   });

//   route.post("/orderNowFromBasket", (req, res) => {
//     if (req.session.loginUser) {
//       res.redirect("/");
//       const loginUser = req.session.loginUser;
//       const basket = JSON.parse(req.body.data);
//       let dt_ob = new Date();
//       let dateTime =
//         "" +
//         ("0" + dt_ob.getDate()).slice(-2) +
//         "/" +
//         ("0" + dt_ob.getMonth()).slice(-2) +
//         "/" +
//         dt_ob.getFullYear() +
//         " T " +
//         dt_ob.getHours() +
//         ":" +
//         dt_ob.getMinutes() +
//         ":" +
//         dt_ob.getSeconds();
//       const paymentType = req.body.paymentType;
  
//       basket.forEach(async function (item) {
//         let object = {
//           dishId: item.id,
//           userId: loginUser._id,
//           restaurantId: item.rid,
//           user: loginUser,
//           photo: item.image,
//           dname: item.name,
//           time: dateTime,
//           price: item.price,
//           quantity: item.quantity,
//           paymentType: paymentType,
//           states: "NA", //not active order
//         };
//         const data = await order.create(object);
//         if (data) {
//           console.log("data is save");
//         }
//       });
//     } else {
//       res.render("login", {
//         loginFirst: true,
//       });
//     }
//   });