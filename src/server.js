const express = require("express");
const app = express();
const path = require("path");
const expressEjsLayout = require("express-ejs-layouts");
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const sessions = require("express-session");
const dotenv = require('dotenv');

//read .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Template Engine
app.set("views", path.join(__dirname, "../src/resources/views"));
app.set("view engine", "ejs");
app.use(expressEjsLayout);

// Public assets
app.use(express.static(path.join(__dirname, "../public")));

// Routes path
app.use("/", express.static('public'), require("./routes/home"));
app.use("/auth", express.static('public'), require("./routes/auth"));
app.use("/api/users", express.static('public'), require("./routes/user"));

// Database
require("./database/mongo");
// create req.body method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register session cookies
app.use(sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized:true,
    cookie: { maxAge: 108000 }, //30 hours add ", Secure: True" and next to maxAge and app.set('trust proxy', 1)  for https
    resave: false,
    rolling: true //Add store: if instead of saving cookie sessions in memory save to the database instead
}));

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT;
app.listen(PORT, (err) => {
  console.log(`Homepage hosted here: http://localhost:${PORT}/`);
  if (err) {
    console.log(err);
  }
});
