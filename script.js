// Set API endpoint URLs
const apiKey = '3f5959175ec142b28b0c44546fda81c7';
const endpoints = {
  'tesla': `https://newsapi.org/v2/everything?q=tesla&from=2023-03-03&sortBy=publishedAt&apiKey=${apiKey}`,
  'business': `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`,
  'wall street': `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${apiKey}`,
  'apple': `https://newsapi.org/v2/everything?q=apple&from=2023-04-02&to=2023-04-02&sortBy=popularity&apiKey=${apiKey}`,
  'tech': `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`
};

// Get reference to container element
const container = document.getElementById('container');

// Get reference to search form and input
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form input');

// Add event listener to search form
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = searchInput.value.toLowerCase();

  // Construct new URL based on search query
  const searchUrl = endpoints[query] || `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${apiKey}`;

  // Clear existing cards in container
  container.innerHTML = '';

  // Fetch data from API
  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      if (data.totalResults === 0) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'No articles found for your search query.';
        container.appendChild(errorMessage);
      } else {
        // Loop through articles and create card for each one
        data.articles.forEach(article => {
          // Create card element
          const card = document.createElement('div');
          card.classList.add('card');

          // Create image element
          const image = document.createElement('img');
          image.src = article.urlToImage;
          image.alt = article.title;

          // Create title element
          const title = document.createElement('h2');
          title.textContent = article.title;

          // Create date element
          const date = document.createElement('p');
          date.classList.add('date');
          const dateObj = new Date(article.publishedAt);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
          date.textContent = formattedDate;

          // Create description element
          const description = document.createElement('p');
          description.textContent = article.description;

          // Append elements to card
          card.appendChild(image);
          card.appendChild(title);
          card.appendChild(date);
          card.appendChild(description);

          // Create delete button element
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.textContent = 'X';

          // Add click event listener to delete button
          deleteButton.addEventListener('click', () => {
            // Remove the card from the container
            card.remove();

            // Send DELETE request to API to delete article
            fetch(`https://newsapi.org/v2/everything/${article.id}?apiKey=${apiKey}`, {
              method: 'DELETE'
            })
              .then(response => {
                // Check if the response was successful
                if (!response.ok) {
                  throw new Error('Failed to delete article from API');
                }
              })
              .catch(error => {
                console.error(error);
              });
          });

          // Append delete button to card
          card.appendChild(deleteButton);

          // Append card to container
          container.appendChild(card);
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
});
