// Create a new instance of XMLHttpRequest
var xhr = new XMLHttpRequest();

// Initialize it with the HTTP method you want to use and the URL of the JSON data
xhr.open('GET', 'https://mazratul.github.io/CSCI-4441-6655/db.json', true);

// Define what should happen when the ready state changes
xhr.onreadystatechange = function () {
  // readyState 4 means the request is complete
  if (xhr.readyState === 4) {
    // status 200 means "OK"
    if (xhr.status === 200) {
      try {
        // Parse the JSON response
        const data = JSON.parse(xhr.responseText);
        console.log("JSON data successfully fetched:", data);

        // Create an unordered list to display book titles
        const list = document.createElement("ul");

        // Loop through books and display each one
        data.books.forEach(book => {
          const item = document.createElement("li");
          item.textContent = `${book.title} (${book.year})`;
          list.appendChild(item);
        });

        // Add the list to the webpage
        document.body.appendChild(list);

      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      // Log an error if the HTTP status is not 200
      console.error("Request failed with status:", xhr.status, xhr.statusText);
    }
  }
};

// Send the request
xhr.send();
