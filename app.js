const express = require("express");
const ejs = require("ejs");
const route = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const User = require("./models/User");

const app = express();
app.use(fileUpload());
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
// Template engine
app.set("view engine", "ejs");
app.set("views", "views");

const url = "mongodb://localhost:27017/restaraunt";
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
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Render the main page
// app.get("/", (req, res) => {
//   res.render("index");
// });

app.post("/upload", async (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("🚀 ~ app.post ~ loginUser:", req.session);
  upload(req, res, (err) => {
    if (err) {
      console.log("in the if part");
      res.render("userPages/userDashboard", {
        msg: err,
        loginUser: loginUser,
      });
    } else {
      if (req.file == undefined) {
        res.render("userPages/userDashboard", {
          msg: "Error: No File Selected!",
          loginUser: loginUser,
        });
      } else {
        console.log("in the else part");
        const imageUrl = `/uploads/${req.file.filename}`;
        const email = req.session.loginUser.email;

        User.findOneAndUpdate(
          { email: email },
          {
            profileImage: imageUrl,
          }
        );
        loginUser.profileImage = imageUrl;
        req.session.loginUser = loginUser; // Save updated user to session
        res.render("userPages/userDashboard", {
          msg: "File Uploaded!",
          loginUser: loginUser,
          file: imageUrl,
        });
        res.render("userPages/userDashboard", {
          msg: "File Uploaded!",
          loginUser: loginUser,
          file: `/uploads/${req.file.filename}`,
        });
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
