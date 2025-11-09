// Import core Node.js modules
const http = require("http");
const path = require("path");
const fs = require("fs");

// Create an HTTP server
const server = http.createServer((req, res) => {
  /*
    ------------------------------------------------------------------------
    ROUTING CONCEPT:
    The server responds differently depending on the request URL.
    ------------------------------------------------------------------------
  */

  if (req.url === "/") {
    // Route 1: Homepage
    fs.readFile(
      path.join(__dirname, "public", "index.html"),
      (err, content) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    );
  } else if (req.url === "/about") {
    // Route 2: About Page
    fs.readFile(
      path.join(__dirname, "public", "about.html"),
      (err, content) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    );
  } else if (req.url === "/contact") {
    // Route 6: Contact Page
    fs.readFile(
      path.join(__dirname, "public", "contact.html"),
      (err, content) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    );
  } else if (req.url === "/books") {
    // Route 3: Books Page (HTML that fetches JSON and renders it)
    fs.readFile(path.join(__dirname, "public", "books.html"), (err, content) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        return res.end("<h1>500 - books.html missing</h1>");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  } else if (req.url === "/books-data") {
    // Route 4: Serve the raw JSON (used by the Books Page)
    fs.readFile(
      path.join(__dirname, "public", "books.json"),
      "utf-8",
      (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Failed to load books.json" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(content);
      }
    );
  } else {
    // Route 5: Custom 404 Error Page
    fs.readFile(path.join(__dirname, "public", "404.html"), (err, content) => {
      if (err) {
        // In case the 404 file itself is missing
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
      } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  }
});

// Pick a port to run the server on
const PORT = process.env.PORT || 5959;

// Start the server
server.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
