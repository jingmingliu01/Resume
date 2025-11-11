const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

/* Parse JSON request bodies for POST/PUT/PATCH routes */
app.use(express.json());

/* Serve static files (HTML/CSS/JS/images) from /public */
app.use(express.static(path.join(__dirname, "public")));

/* Load books from JSON once at startup (we'll also persist on POST) */
const DATA_PATH = path.join(__dirname, "data", "books.json");
let books = require(DATA_PATH);

/* ----------------- ROUTES ----------------- */

/* Home page */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* About page */
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

/* Books page (UI) */
app.get("/books", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "books.html"));
});

/* Books JSON data */
app.get("/books-data", (req, res) => {
  res.json(books);
});

/*
  Add a new book
  Body: { "title": string, "year": number, "published": boolean }
*/
app.post("/add-book", (req, res) => {
  const { title, year, published } = req.body;

  // Basic validation
  if (!title || typeof year !== "number" || typeof published !== "boolean") {
    return res.status(400).json({
      error: 'Invalid payload. Expected { "title": string, "year": number, "published": boolean }'
    });
  }

  // Generate next id (simple incremental)
  const nextId = (books.books.at(-1)?.id || 0) + 1;
  const newBook = { id: nextId, title, year, published };

  // Update in-memory
  books.books.push(newBook);

  // Persist to file
  fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Failed to save books.json:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.status(201).json({ message: "Book added successfully", book: newBook });
  });
});

/* 404 fallback (must be last) */
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

/* Start server */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
