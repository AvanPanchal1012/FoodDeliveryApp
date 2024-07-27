const express = require("express");
const ejs = require("ejs");
const route = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");

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

const url =
  "mongodb+srv://ganganisagar33:qYWLFC9NbHW3bFja@cluster0.jfdipkj.mongodb.net/restaraunt";
mongoose.connect(url);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to database");
});

// Render the main page
app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
