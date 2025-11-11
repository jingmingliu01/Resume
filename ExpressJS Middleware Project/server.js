// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

// Create an Express application instance
const app = express();

/* --------------------------------------------------------
   MIDDLEWARE SETUP
-------------------------------------------------------- */

/*
  bodyParser:
  Allows the server to read data sent from HTML forms (URL-encoded)
  and JSON requests. Without this, req.body would be undefined.
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
  express.static:
  Serves all files inside the "public" folder directly.
  Example: "/main.html" will automatically map to public/main.html
*/
app.use(express.static(path.join(__dirname, "public")));

/*
  express-session:
  Allows the server to store login status for each user session.
  This means users do not need to re-enter their credentials on
  every page request after logging in.
*/
app.use(
  session({
    secret: "express-demo-secret", // Used to sign session cookies (must remain private)
    resave: false, // Prevents saving unchanged sessions
    saveUninitialized: true, // Saves new sessions even if nothing stored yet
  })
);

// Hardcoded credentials for demonstration purposes
const username = "john_doe123";
const password = "mypass@John";

/* --------------------------------------------------------
   AUTHENTICATION MIDDLEWARE (Custom)
-------------------------------------------------------- */

/*
  authMiddleware:
  This function checks whether the user has already logged in.
  If session.loggedIn exists → allow access to the next handler.
  Otherwise → block access and redirect back to login page.
*/
function authMiddleware(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next(); // User is authenticated → continue request
  }
  res.redirect("/"); // Not logged in → return to login page
}

/* --------------------------------------------------------
   ROUTES
-------------------------------------------------------- */

/*
  GET /
  Serves the login page (index.html)
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
  POST /login
  Validates username & password.
  If correct → set session.loggedIn = true and redirect to /main
  If incorrect → send "401 Unauthorized" response.
*/
app.post("/login", (req, res) => {
  const { username: reqUsername, password: reqPassword } = req.body;

  if (reqUsername === username && reqPassword === password) {
    req.session.loggedIn = true;
    req.session.username = reqUsername;
    console.log(req.session.username);
    res.redirect("/main");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

/*
  GET /main
  This page is protected by authMiddleware.
  Only logged-in users may access it.
*/
app.get("/main", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

/*
  GET /logout
  Destroys the session to log the user out,
  then redirects back to the login page.
*/
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* --------------------------------------------------------
   START SERVER
-------------------------------------------------------- */
const port = process.env.PORT || 5950;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
