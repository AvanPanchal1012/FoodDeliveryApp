const Restaurant = require("../../models/Restaurant");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/UserValidations');

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
            errors: null,
            restaurant: null
        })
    },
    saveNewRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
    
        const { name, email, phone, address, password, type } = req.body;
        const profileImage = req.file ? req.file.filename : '';
    
        const constraints = validationObj.saveUser;
    
        const validation = validate(req.body, constraints);
    
        if (validation) {
          res.render("admin/adminRestaurantAdd", {
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
    },
    getAllRestaurants: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
        
        let currentPage = 1;
        const page = req.params.page;
        if (page)
            currentPage = page;
      
        const total = 5;
        const start = (currentPage - 1) * total;
        const data = await Restaurant.find().skip(start).limit(total);
        const totalPage = Math.ceil(await Restaurant.find().countDocuments() / total);
        
        res.render('admin/adminRestaurants', {
            loginUser: loginUser,
            users: data,
            currentPage: currentPage,
            count: totalPage
        })
    },
    getRestaurantById: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
      
        const data = await User.findOne({_id: req.params.id, type : {$ne: 'admin'}})
        console.log(data);
        if (data) {
            res.render("admin/adminRestaurantAdd", {
                user: data,
                errors: null,
                loginUser: loginUser
            })
        } else {
          res.redirect('admin/users')
        }
    },
    updateRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
    
        const userId = req.params.id;
        const { name, email, phone, address, password } = req.body;
    
        const constraints = validationObj.modifyUser;
    
        const validation = validate(req.body, constraints);
    
        if (validation) {
          res.render("admin/adminRestaurantAdd", {
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
    },
    deleteRestaurant: async (req, res) => {
        const loginUser = await checkLoginUser(req, res);
      
        const data = await User.deleteOne({ "_id": req.params.id })
        if (data) {
            console.log("file is deleted...")
            res.redirect('/admin/users')
        } else {
            res.send("<h1>Server Error !!</h1><h2> Sorry user is not deleted please try letter..</h2>")
        }
    }
}