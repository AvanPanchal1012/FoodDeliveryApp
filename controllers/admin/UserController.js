const User = require("../../models/User");
const validate = require('validate.js');
const validationObj = require('../../validations/admin/UserValidations');
const upload = require('../../helpers/UploadHelper');
const checkLoginSession = require("../../helpers/checkLoginSession");

module.exports = {
    addNewUser: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
      
      if (loginUser) {
        res.render('admin/adminUserAdd', {
            loginUser: loginUser,
            errors: null,
            user: null
        })
      }
      else {
        res.redirect("/admin");
      }
    },
    saveNewUser: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
    
      if (loginUser) {
        upload(req, res, async (err) => {
          if (err) {
            res.render("admin/adminUserAdd", {
              user: {
                ...req.body
              },
              errors: validation,
              loginUser: loginUser
            })
          } 
          else {
              const { name, email, phone, address, password, type } = req.body;
              const profileImage = req.file ? `/uploads/${req.file.filename}` : '';
          
              const constraints = validationObj.saveUser;
          
              const validation = validate(req.body, constraints);
          
              if (validation) {
                res.render("admin/adminUserAdd", {
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
                  res.render("admin/adminUserAdd", {
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
          }
        });
      }
      else {
        res.redirect("/admin");
      }
    },
    getAllUsers: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
      
      if (loginUser) {
        let currentPage = 1;
        const page = req.params.page;
        if (page)
            currentPage = page;
      
        const total = 5;
        const start = (currentPage - 1) * total;
        const data = await User.find({type : {$ne: 'admin'}}).skip(start).limit(total);
        const totalPage = Math.ceil(await User.find({type : {$ne: 'admin'}}).countDocuments() / total);
        
        res.render('admin/adminUsers', {
            loginUser: loginUser,
            users: data,
            currentPage: currentPage,
            count: totalPage
        })
      }
      else {
        res.redirect("/admin");
      }
    },
    getUserById: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
    
      if (loginUser) {
        const data = await User.findOne({_id: req.params.id, type : {$ne: 'admin'}})
        console.log(data);
        if (data) {
            res.render("admin/adminUserAdd", {
                user: data,
                errors: null,
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
    updateUser: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
      const userId = req.params.id;
    
      if (loginUser) {
        upload(req, res, async (err) => {
          if (err) {
            res.render("admin/adminUserAdd", {
              user: {
                _id: userId,
                ...req.body
              },
              errors: null,
              loginUser: loginUser
            })
          } 
          else {
            const { name, email, phone, address, password } = req.body;
        
            const constraints = validationObj.modifyUser;
        
            const validation = validate(req.body, constraints);
        
            if (validation) {
              res.render("admin/adminUserAdd", {
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
              console.log(emailExist);
              if (emailExist) {
                res.render("admin/adminUserAdd", {
                  user: {
                    _id: userId,
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
                  updateData.profileImage = `/uploads/${req.file.filename}`;
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
          }
        });
      }
      else {
        res.redirect("/admin");
      }
    },
    deleteUser: async (req, res) => {
      const loginUser = await checkLoginSession(req, res);
    
      if (loginUser) {
        const data = await User.deleteOne({ "_id": req.params.id })
        if (data) {
            console.log("file is deleted...")
            res.redirect('/admin/users')
        } else {
            res.send("<h1>Server Error !!</h1><h2> Sorry user is not deleted please try letter..</h2>")
        }
      }
      else {
        res.redirect("/admin");
      }
    }
}