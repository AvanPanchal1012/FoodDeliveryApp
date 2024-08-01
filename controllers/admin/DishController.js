const Dish = require("../../models/Dish");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/DishValidations');
const upload = require('../../helpers/UploadHelper');
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
    addNewDish: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

      if (loginUser) {

        res.render('admin/adminDishAdd', {
            loginUser: loginUser,
            errors: null,
            dish: null
        })
      }
      else {
        res.redirect("/admin");
      }
    },
    saveNewDish: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
      
      if (loginUser) {
        upload(req, res, async (err) => {
          if (err) {
            console.log(err);
            res.render("admin/adminDishAdd", {
              dish: {
                ...req.body
              },
              errors: null,
              loginUser: loginUser
            })
          } 
          else {
            const profileImage = req.file ? req.file.filename : '';
            
            const constraints = validationObj.saveDish;
            const validation = validate(req.body, constraints);
        
            if (validation) {
              res.render("admin/adminDishAdd", {
                  dish: {
                    ...req.body
                  },
                  errors: validation,
                  loginUser: loginUser
              })
            } else {
        
              // Create a new instance
              const newDish = new Dish({
                dname: req.body.name,
                dtype: req.body.type,
                dprice: req.body.price,
                dtime: req.body.time,
                discription: req.body.description,
                ddiscount: req.body.discount,
                dserve: req.body.serve,
                photo: req.file ? `/uploads/${req.file.filename}` : '',
              });
        
              // Save the user to the database
              await newDish.save();
        
              res.redirect('/admin/dishes'); 
            }
          }
        });
      }
      else {
        res.redirect("/admin");
      }
    },
    getAllDishes: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
        
        if (loginUser) {

          let currentPage = 1;
          const page = req.params.page;
          if (page)
              currentPage = page;
        
          const total = 5;
          const start = (currentPage - 1) * total;
          const data = await Dish.find().skip(start).limit(total);
          const totalPage = Math.ceil(await Dish.find().countDocuments() / total);
        
          res.render('admin/adminDishes', {
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
    getDishById: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);

        if (loginUser) {

          const data = await Dish.findOne({_id: req.params.id})

          if (data) {
              res.render("admin/adminDishAdd", {
                  dish: {
                    _id: data._id,
                    name: data.dname,
                    type: data.dtype,
                    price: data.dprice,
                    time: data.dtime,
                    photo: data.photo,
                    description: data.discription,
                    discount: data.ddiscount,
                    serve: data.dserve,
                  },
                  errors: null,
                  loginUser: loginUser
              })
          } else {
            res.redirect('admin/dishes')
          }
        }
        else {
          res.redirect("/admin");
        }
    },
    updateDish: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);    
        const dishId = req.params.id;
        
        if (loginUser) {
          upload(req, res, async (err) => {
            if (err) {
              console.log(err);
              res.render("admin/adminDishAdd", {
                dish: {
                  _id: dishId,
                  ...req.body
                },
                errors: null,
                loginUser: loginUser
              })
            } 
            else {
              const constraints = validationObj.saveDish;
            
              const validation = validate(req.body, constraints);
            
              if (validation) {
                res.render("admin/adminDishAdd", {
                    dish: {
                      _id: dishId,
                      ...req.body
                    },
                    errors: validation,
                    loginUser: loginUser
                })
              } else { 
                const updateData = { 
                  dname: req.body.name,
                  dtype: req.body.type,
                  dprice: req.body.price,
                  dtime: req.body.time,
                  discription: req.body.description,
                  ddiscount: req.body.discount,
                  dserve: req.body.serve
                };
          
                if (req.file) {
                  updateData.profileImage = req.file.filename;
                }
          
                const dish = await Dish.findByIdAndUpdate(dishId, updateData, { new: true });
          
                if (!dish) {
                  return res.status(404).send('Dish not found');
                }
          
                res.redirect('/admin/dishes'); // Adjust the redirect as necessary
              }
            }
          });
        }
        else {
          res.redirect("/admin");
        }
    },
    deleteDish: async (req, res) => {
        const loginUser = await checkLoginSession(req, res);
        
        if (loginUser) {
          const data = await User.deleteOne({ "_id": req.params.id })
          if (data) {
              console.log("file is deleted...")
              res.redirect('/admin/dishes')
          } else {
              res.send("<h1>Server Error !!</h1><h2> Sorry user is not deleted please try letter..</h2>")
          }
        }
        else {
          res.redirect("/admin");
        }
    }
}