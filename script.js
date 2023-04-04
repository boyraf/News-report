
const apiKey = '3f5959175ec142b28b0c44546fda81c7';
const endpoints = {
  'tesla': `https://newsapi.org/v2/everything?q=tesla&from=2023-03-03&sortBy=publishedAt&apiKey=${apiKey}`,
  'business': `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`,
  'wall street': `https://newsapi.org/v2/everything?domains=wsj.com&apiKey=${apiKey}`,
  'apple': `https://newsapi.org/v2/everything?q=apple&from=2023-04-02&to=2023-04-02&sortBy=popularity&apiKey=${apiKey}`,
  'tech': `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`
};

const container = document.getElementById('container');

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-form input');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const query = searchInput.value.toLowerCase();

  const searchUrl = endpoints[query] || `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&apiKey=${apiKey}`;


  container.innerHTML = '';

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      if (data.totalResults === 0) {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'No articles found for your search query.';
        container.appendChild(errorMessage);
      } else {
           data.articles.forEach(article => {
         
          const card = document.createElement('div');
          card.classList.add('card');

         
          const image = document.createElement('img');
          image.src = article.urlToImage;
          image.alt = article.title;

          
          const title = document.createElement('h2');
          title.textContent = article.title;

          
          const date = document.createElement('p');
          date.classList.add('date');
          const dateObj = new Date(article.publishedAt);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
          date.textContent = formattedDate;

          
          const description = document.createElement('p');
          description.textContent = article.description;

          
          card.appendChild(image);
          card.appendChild(title);
          card.appendChild(date);
          card.appendChild(description);

          
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.textContent = 'X';

         
          deleteButton.addEventListener('click', () => {
            
            card.remove();

            
            fetch(`https://newsapi.org/v2/everything/${article.id}?apiKey=${apiKey}`, {
              method: 'DELETE'
            })
            .then(response => {
            
            if (!response.ok) {
              throw new Error('Failed to delete article from API');
             }
            })
            .then(() => {
              
              card.remove();
            })
            .catch(error => {
            console.error(error);
            });
            });
            
            
            card.appendChild(deleteButton);
            
            
            container.appendChild(card);
            });
            }
            })
            .catch(error => {
            console.error(error);
            });
            });


            