// Fetch the JSON file hosted on GitHub Pages
fetch('https://mazratul.github.io/CSCI-4441-6655/db.json')
  .then(response => {
    // Check if the HTTP request was successful (status 200–299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response body as JSON
    return response.json();
  })
  .then(data => {
    console.log("JSON data successfully fetched:", data);

    // Create a container for the book list
    const container = document.createElement("div");

    // Create a list element to hold all book items
    const list = document.createElement("ul");

    // Loop through the array of books and create list items
    data.books.forEach(book => {
      const item = document.createElement("li");
      item.textContent = `${book.title} (${book.year})`;

      // Optional: add visual indicator if book is unpublished
      if (book.published === false) {
        item.style.color = "#b33a3a";
        item.textContent += "(Unpublished)";
      } else {
        item.style.color = "#2c7a2c";
        item.textContent += "(Published)";
      }

      list.appendChild(item);
    });

    // Append the list to the container, and then the container to the document body
    container.appendChild(list);
    document.body.appendChild(container);
  })
  .catch(error => {
    // Log any network or parsing errors
    console.error('Fetch Error:', error);
  });
