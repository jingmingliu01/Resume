// URL of the JSON file hosted on GitHub Pages
const DATA_URL = 'https://mazratul.github.io/CSCI-4441-6655/db.json';

// Select the HTML element where the books will be displayed
const container = document.querySelector('.books');

// Immediately Invoked Async Function Expression (IIFE)
// runs automatically when the page loads
(async function () {
  try {
    // --- STEP 1: Fetch the JSON file ---
    // The fetch() function returns a Promise that resolves to a Response object
    // cache-buster + no-store to avoid stale GitHub Pages cache
    const res = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: 'no-store' });

    // Check if the response was successful (status code 200–299)
    if (!res.ok) throw new Error(res.status);

    // --- STEP 2: Parse the JSON data ---
    // Convert the raw response body into a JavaScript object
    const { books } = await res.json();

    // --- STEP 3: Validate the data structure ---
    // Ensure that 'books' exists and is an array
    if (!Array.isArray(books)) throw new Error('Invalid data structure: expected { books: [] }');

    // --- STEP 4: Render books into the HTML page ---
    // Use Array.map() to create a list of <article> elements for each book
    // .join('') merges all HTML strings into one continuous block
    container.innerHTML = books
      .map(b => `
        <article class="single-book">
          <!-- Display each book’s title and details -->
          <h3>${b.title ?? 'Untitled'}</h3>
          <p>Year: ${b.year ?? '—'}; ID: ${b.id ?? '—'}</p>
        </article>
      `)
      .join('');

  } catch (err) {
    // --- STEP 5: Handle any errors that occur ---
    console.error('Fetch error:', err);

    // Show an error message on the page if something goes wrong
    container.textContent = 'Failed to load books.';
  }
})();
