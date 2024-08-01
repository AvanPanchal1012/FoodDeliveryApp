const Restaurant = require("../../models/Restaurant");
const Dish = require("../../models/Dish");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/RestaurantValidations');
const upload = require('../../helpers/UploadHelper');
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
    addNewRestaurant: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
      
      if (loginUser) {
        res.render('admin/adminRestaurantAdd', {
            loginUser: loginUser,
            dishes: await Dish.find(),
            errors: null,
            restaurant: null
        })
      }
      else {
        res.redirect("/admin");
      }
    },
    saveNewRestaurant: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
      
      if (loginUser) {
        upload(req, res, async (err) => {
          if (err) {
            console.log(err);
            res.render("admin/adminRestaurantAdd", {
                restaurant: {
                  ...req.body
                },
                errors: null,
                dishes: await Dish.find(),
                loginUser: loginUser
            })
          } 
          else {
        
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
              var newRestaurant = new Restaurant({
                name: req.body.name,
                location: req.body.location,
                cuisine: req.body.cuisine,
                email: req.body.email,
                contact: req.body.contact,
                openingHours: req.body.openingHours,
                description: req.body.description,
                dishIds: req.body.dishIds
              });

              if (req.file) {
                newRestaurant['photo'] = req.file ? `/uploads/${req.file.filename}` : ''
              }
        
              // Save the user to the database
              await newRestaurant.save();
        
              res.redirect('/admin/restaurants'); 
            }
          }
        });
      }
      else {
        res.redirect("/admin");
      }
    },
    getAllRestaurants: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
        
      if (loginUser) {
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
      }
      else {
        res.redirect("/admin");
      }
    },
    getRestaurantById: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
        
      if (loginUser) {
      
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
      }
      else {
        res.redirect("/admin");
      }
    },
    updateRestaurant: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
  
      if (loginUser) {
        const restaurantId = req.params.id;
        upload(req, res, async (err) => {
          if (err) {
            console.log(err);
            res.render("admin/adminRestaurantAdd", {
              restaurant: {
                _id: restaurantId,
                ...req.body
              },
              dishes: await Dish.find(),
              errors: null,
              loginUser: loginUser
            })
          } 
          else {
        
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
              var updateData = { 
                name: req.body.name,
                location: req.body.location,
                cuisine: req.body.cuisine,
                email: req.body.email,
                contact: req.body.contact,
                openingHours: req.body.openingHours,
                description: req.body.description,
                dishIds: req.body.dishIds
              };
        
              // Query to check if email exists
              const emailExist = await Restaurant.findOne({ email: updateData.email, _id: {$ne: restaurantId}});
              console.log(emailExist);
              if (emailExist) {
                res.render("admin/adminRestaurantAdd", {
                  restaurant: {
                    _id: restaurantId,
                    ...req.body
                  },
                  dishes: await Dish.find(),
                  errors: {
                    email: ["Email address is already taken"]
                  },
                  loginUser: loginUser
                })
              }
              else {
                if (req.file) {
                  updateData.photo = req.file ? `/uploads/${req.file.filename}` : '';
                }

                const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, { new: true });
          
                if (!restaurant) {
                  return res.status(404).send('Restaurant not found');
                }
          
                res.redirect('/admin/restaurants'); // Adjust the redirect as necessary
              }
              
            }
          }
        });
      }
      else {
        res.redirect("/admin");
      }
    },
    deleteRestaurant: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

        if (loginUser) {
          const data = await User.deleteOne({ "_id": req.params.id })
          if (data) {
              console.log("file is deleted...")
              res.redirect('/admin/restaurants')
          } else {
              res.send("<h1>Server Error !!</h1><h2> Sorry restaurant is not deleted please try letter..</h2>")
          }
        }
        else {
          res.redirect("/admin");
        }
    }
}