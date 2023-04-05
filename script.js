const apiUrl = 'http://localhost:3000/articles'; // replace with your server url

function displayCards() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      cardContainer.innerHTML = '';
      data.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.innerHTML = `
        <img src="${card.image_url}"
          <h3>${card.title}</h3>
          <p>${card.date}</p>
          <p>${card.description}</p>
          <button onclick="editCard(${card.id})">Edit</button>
          <button onclick="deleteCard(${card.id})">Delete</button>
        `;
        cardContainer.appendChild(cardEl);
      });
    })
    .catch(error => console.error(error));
}

function addCard(event) {
  event.preventDefault();
  const card = {
    title: nameInput.value,
    description: descriptionInput.value,
    image_url: imageInput.value,
    date: dateInput.value,
  };
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
    .then(response => response.json())
    .then(data => {
      cards.push(data);
      displayCards();
    })
    .catch(error => console.error(error));
}

function editCard(id) {
  const card = cards.find(card => card.id === id);
  imageInput.value = card.image_url;
  nameInput.value = card.title;
  dateInput.value = card.date;
  descriptionInput.value = card.description;
  addCardBtn.innerHTML = 'Save Changes';
  addCardBtn.onclick = function() {
    const updatedCard = {
      title: nameInput.value,
      description: descriptionInput.value,
      image_url: imageInput.value,
      date: dateInput.value,
    };
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard),
    })
      .then(response => response.json())
      .then(data => {
        const index = cards.findIndex(card => card.id === id);
        cards[index] = data;
        imageInput.value = '';
        nameInput.value = '';
        dateInput.value = '';
        descriptionInput.value = '';
        addCardBtn.innerHTML = 'Add Card';
        addCardBtn.onclick = addCard;
        displayCards();
      })
      .catch(error => console.error(error));
  };
}

function deleteCard(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        const index = cards.findIndex(card => card.id === id);
        cards.splice(index, 1);
        displayCards();
      } else {
        throw new Error('Failed to delete card');
      }
    })
    .catch(error => console.error(error));
}

displayCards();
addCardBtn.onclick = addCard;
