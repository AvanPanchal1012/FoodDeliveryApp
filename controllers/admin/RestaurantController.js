const Restaurant = require("../../models/Restaurant");
const Dish = require("../../models/Dish");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/RestaurantValidations');

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
    addNewRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
      
        res.render('admin/adminRestaurantAdd', {
            loginUser: loginUser,
            dishes: await Dish.find(),
            errors: null,
            restaurant: null
        })
    },
    saveNewRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
    
        const profileImage = req.file ? req.file.filename : '';
    
        const constraints = validationObj.saveRestaurant;
        const validation = validate(req.body, constraints);
    
        if (validation) {
          res.render("admin/adminRestaurantAdd", {
              restaurant: {
                ...req.body
              },
              errors: validation,
              dishes: await Dish.find(),
              loginUser: loginUser
          })
        } else {
    
          // Query to check if email exists
          const isExists = await Restaurant.findOne({ email: req.body.email});
    
          if (isExists) {
            res.render("admin/adminRestaurantAdd", {
              user: {
                ...req.body
              },
              errors: {
                email: ["Email address is already taken"]
              },
              loginUser: loginUser
            })
          }

          // Create a new instance
          const newRestaurant = new Restaurant({
            name: req.body.name,
            location: req.body.location,
            cuisine: req.body.cuisine,
            email: req.body.email,
            contact: req.body.contact,
            openingHours: req.body.openingHours,
            description: req.body.description,
            photo: req.file ? req.file.filename : '',
            dishIds: req.body.dishIds
          });
    
          // Save the user to the database
          await newRestaurant.save();
    
          res.redirect('/admin/restaurants'); 
        }
    },
    getAllRestaurants: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
        
        let currentPage = 1;
        const page = req.params.page;
        if (page)
            currentPage = page;
      
        const total = 5;
        const start = (currentPage - 1) * total;
        const data = await Restaurant.find().populate('dishIds', 'dname').skip(start).limit(total);
        const totalPage = Math.ceil(await Restaurant.find().countDocuments() / total);
     
        res.render('admin/adminRestaurants', {
            loginUser: loginUser,
            data: data,
            currentPage: currentPage,
            count: totalPage
        })
    },
    getRestaurantById: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
      
        const data = await Restaurant.findOne({_id: req.params.id})
       
        if (data) {
            res.render("admin/adminRestaurantAdd", {
                restaurant: data,
                errors: null,
                dishes: await Dish.find(),
                loginUser: loginUser
            })
        } else {
          res.redirect('admin/users')
        }
    },
    updateRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
    
        const restaurantId = req.params.id;

        const constraints = validationObj.saveRestaurant;
    
        const validation = validate(req.body, constraints);
      
        if (validation) {
          res.render("admin/adminRestaurantAdd", {
              restaurant: {
                _id: restaurantId,
                ...req.body
              },
              dishes: await Dish.find(),
              errors: validation,
              loginUser: loginUser
          })
        } else {
          const updateData = { 
            name: req.body.name,
            location: req.body.location,
            cuisine: req.body.cuisine,
            email: req.body.email,
            contact: req.body.contact,
            openingHours: req.body.openingHours,
            description: req.body.description,
            photo: req.file ? req.file.filename : '',
            dishIds: req.body.dishIds
          };
    
          // Query to check if email exists
          const emailExist = await Restaurant.findOne({ email: updateData.email, _id: {$ne: restaurantId}});
    
          if (emailExist) {
            res.render("admin/adminRestaurantAdd", {
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
      
            const user = await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true });
      
            if (!user) {
              return res.status(404).send('Restaurant not found');
            }
      
            res.redirect('/admin/restaurants'); // Adjust the redirect as necessary
          }
          
        }
    },
    deleteRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
      
        const data = await User.deleteOne({ "_id": req.params.id })
        if (data) {
            console.log("file is deleted...")
            res.redirect('/admin/restaurants')
        } else {
            res.send("<h1>Server Error !!</h1><h2> Sorry restaurant is not deleted please try letter..</h2>")
        }
    }
}