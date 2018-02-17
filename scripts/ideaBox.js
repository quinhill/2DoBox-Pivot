window.onload = getIdeas();
$('.save-button').on('click', prependCard);
$('.title-input').on('keyup', toggleSaveButton);
$('.body-input').on('keyup', toggleSaveButton);
$('.card-area').on('click', '.delete-button', deleteCard);
$('.card-area').on('click', '.upvote-button', upvote);
$('.card-area').on('click', '.downvote-button', downvote);
$('.card-area').on('keyup', '.card-title', editTitle);
$('.card-area').on('keyup', '.card-body', editBody);
$('.search-input').on('keyup', filterCards);

function createCard(newCard) {
  return (`
    <article class="card-container" id="${newCard.id}">
      <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
      <button class="button delete-button" aria-label="delete card"></button>
      <p class="card-body" contenteditable="true">${newCard.body}</p>
      <button class="button upvote-button" aria-label="upvote card"></button>
      <button class="button downvote-button" aria-label="downvote card"></button>
      <p class="quality-text" aria-label="quality ${newCard.voteQuality}" tabindex="0" aria-live="assertive" aria-atomic="true">quality: <span class="vote-quality">${newCard.voteQuality}</span></p>
    </article>
  `);
};

function CardFactory(title, body) {
  this.id = $.now();
  this.title = title;
  this.body = body;
  this.voteQuality = 'swill';
};

function prependCard(e) {
  e.preventDefault();
  var newCard = new CardFactory($('.title-input').val(), $('.body-input').val());
  var stringifyCard = JSON.stringify(newCard);
  localStorage.setItem(newCard.id, stringifyCard);
  $('.card-area').prepend(createCard(newCard));
  clearInputs();
  toggleSaveButton();
};

function getIdeas() {
  $.each(localStorage, function (index, element) {
    if (index >= localStorage.length) {
    var getIdea = JSON.parse(localStorage.getItem(index));
    $('.card-area').prepend(createCard(getIdea));    
  }});
};

function clearInputs() {
  $('.title-input').val('').focus();
  $('.body-input').val('');
};

function toggleSaveButton() {
  if ($('.title-input').val() && $('.body-input').val()) {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true);
  }
};

function deleteCard() {
  localStorage.removeItem($(this).parent()[0].id);
  $(this).parent().remove();
};

function upvote() {
  var voteText = $(this).next().next().children();
  var idFinder = $(this).parent()[0].id;
  var voteStorage = JSON.parse(localStorage.getItem(idFinder));
   if (voteText.text() === 'swill') {
      voteText.text('plausible');
      voteStorage.voteQuality = 'plausible';
    } else if (voteText.text() === 'plausible') {
      voteText.text('genius');
      voteStorage.voteQuality = 'genius';
    };
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
};

function downvote() {
  var voteText = $(this).next().children();
  var idFinder = $(this).parent()[0].id;
  var voteStorage = JSON.parse(localStorage.getItem(idFinder));
  if (voteText.text() === 'genius') {
      voteText.text('plausible');
      voteStorage.voteQuality = 'plausible'; 
    } else if (voteText.text() === 'plausible') {
      voteText.text('swill');
      voteStorage.voteQuality = 'swill';
    };
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
};

function editTitle(e) {
  var idFinder = $(this).parent()[0].id;
  var ideaStorage = JSON.parse(localStorage.getItem(idFinder));
  if (e.keyCode === 13 || $('.card-area').blur()) {
    ideaStorage.title = $('.card-title').text();
    localStorage.setItem(idFinder, JSON.stringify(ideaStorage));
  };
  if (e.keyCode === 13 ){
    $('.title-input').focus();
  };
};

function editBody(e) {
  var idFinder = $(this).parent()[0].id;
  var ideaStorage = JSON.parse(localStorage.getItem(idFinder));
  if (e.keyCode === 13 || $('.card-area').blur()) {
    ideaStorage.body = $('.card-body').text();
    localStorage.setItem(idFinder, JSON.stringify(ideaStorage));
  };
  if (e.keyCode === 13 ) {
    $('.title-input').focus();
  };
};

function filterCards(e) {
  e.preventDefault();
  var searchValue = $('.search-input').val().toLowerCase();
  $.each($('.card-container'), function(index, element) {
    element.style.display = searchCards(element.children, searchValue);
  });
};

function searchCards(cards, searchVal) {  
  if (cards[0].innerText.toLowerCase().includes(searchVal) 
  || cards[2].innerText.toLowerCase().includes(searchVal)
  || !searchVal) {
    return 'block';
  } else {
    return 'none';    
  };
};