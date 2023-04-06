
//const form = document.querySelector('#article-form');
//form.addEventListener('submit', handleSubmit);


function handleSubmit(e){
e.preventDefault();
let articleObj = {
  image_url:e.target.image_url.value,
  title:e.target.name.value,
  date:e.target.date.value,
  description:e.target.description.value,
  likes:0
};
renderOneArticle(articleObj)
addArticle(articleObj)
}


function renderOneArticle(article){
  let card = document.createElement('li')
  card.className= 'card';
  card.innerHTML = `
  <img src="${article.image_url}">
  <div class='content'>
    <h2>${article.title}</h2>
    <p>${article.date}</p>
    <p>
    ❤️<span class="like-count">${article.likes}</span>Likes
    </p>
    <p>${article.description}</p>

    </div>
    <div class="button">
    <button id="remove">Remove</button>
    <button id="like">like</button>
    </div>
    `
    card.querySelector('#like').addEventListener('click', () => {
      article.likes+= 1
      card.querySelector('span').textContent = article.likes
      updateLikes(article)
    })
    card.querySelector('#remove').addEventListener('click', () => {
      card.remove()
      deleteArticle(article.id)
    })


    document.querySelector('#article-list').appendChild(card);
}

function getAllArticles(){
  fetch(`http://localhost:4000/articles`)
  .then(res => res.json())
  .then(articleData => articleData.forEach(article => renderOneArticle(article)))

}
function addArticle(articleObj){
  fetch('http://localhost:4000/articles',{
   method: 'POST',
   headers: {
    'Content-Type' : 'application/json'
  },
  body:JSON.stringify(articleObj)
})
.then(res => res.json())
.then(article => console.log(article))
}

function updateLikes(articleObj){
  fetch(`http://localhost:4000/articles/${articleObj.id}`,{
    method: 'PATCH',
    headers: {
     'Content-Type' : 'application/json'
   },
   body:JSON.stringify(articleObj)
 })
 .then(res => res.json())
 .then(article => console.log(article))
}

function deleteArticle(id){
  fetch(`http://localhost:4000/articles/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(res => res.json())
  .then(article => console.log(article))
}

function initialize (){
  getAllArticles()
  //articleData.forEach(article => renderOneArticle(article))
}
initialize()

