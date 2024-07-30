const express = require("express");
const ejs = require("ejs");
const route = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const path = require("path");
const User = require("./models/User");
const app = express();
// app.use(fileUpload());
app.use(
  session({
    secret: "secret",
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save a new session even if not modified
    cookie: { secure: false },
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("", route);
// Static folder
app.use("/static", express.static("public"));
app.use("/uploads", express.static("public/uploads"));
// Template engine
app.set("view engine", "ejs");
app.set("views", "views");

const url = "mongodb+srv://ganganisagar33:qYWLFC9NbHW3bFja@cluster0.jfdipkj.mongodb.net/restaraunt";
mongoose.connect(url);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to database");
});

// Set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    console.log("mimetype", mimetype, extname);
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Render the main page
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req.session);
  upload(req, res, async (err) => {
    const redirectToPage =
      req.session.loginUser.type == "normal"
        ? "./userPages/userDashboard"
        : "./admin/adminDashboard";
    if (err) {
      res.render(redirectToPage, {
        msg: err,
        file: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
        loginUser: req.session.loginUser,
      });
    } else {
      if (req.file == undefined) {
        res.render(redirectToPage, {
          msg: "Error: No File Selected!",
          file: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
          loginUser: req.session.loginUser,
        });
      } else {
        const user = await User.findOne({
          email: req.session.loginUser.email,
        });
        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();
        req.session.loginUser.profileImage = user.profileImage;
        res.render(redirectToPage, {
          msg: "File Uploaded!",
          file: `/uploads/${req.file.filename}`,
          loginUser: req.session.loginUser,
        });
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
