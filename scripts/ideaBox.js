window.onload = getIdeas();
$('.save-button').on('click', prependCard);
$('.title-input').on('keyup', toggleSaveButton);
$('.body-input').on('keyup', toggleSaveButton);
$('.card-area').on('click', '.delete-button', deleteCard);
$('.card-area').on('click', '.upvote-button', upvote);
$('.card-area').on('click', '.downvote-button', downvote);
$('.card-area').on('keyup', '.card-title', editCard);
$('.card-area').on('keyup', '.card-body', preventEnter);
$('.card-area').on('keyup', '.card-body', editCard);
$('.search-input').on('keyup', filterCards);
$('.body-input').on('keyup', preventBreak);
$('.completed-button').on('change', toggleCheckBox);
$('.search__button-show-completed').on('click', showCompleted)

function showCompleted(e) {
  e.preventDefault();
$.each(localStorage, function (index, element) {
    var parsedIdea = JSON.parse(localStorage.getItem(index));
    console.log(parsedIdea);
    if (index >= localStorage.length && parsedIdea.isChecked === 'checked') {
    $('.card-area').prepend(createCard(parsedIdea));   
  }});
}

function toggleCheckBox() {
  var idFinder = $(this).closest('article').attr('id');
  var ideaStorage = JSON.parse(localStorage.getItem(idFinder));
  var status = $(this).is(':checked')
  if (status === true) {
  ideaStorage.isChecked = 'checked'
  $(this).closest('article').addClass('completed-to-do-style');
  } else {
    ideaStorage.isChecked = 'unchecked' 
$(this).closest('article').removeClass('completed-to-do-style');  
  }
  localStorage.setItem(idFinder, JSON.stringify(ideaStorage)); 
}
  

function preventBreak(e) {
  // e.preventDefault();
if (e.keyCode === 13) {
  $('.save-button').click();
}
}

function preventEnter(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    $('.title-input').focus();
  }
}

function createCard(newCard) {
  return (`
    <article class="card-container" id="${newCard.id}">
      <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
      <button class="button delete-button" aria-label="delete card"></button>
      <p class="card-body" contenteditable="true">${newCard.body}</p>
      <button class="button upvote-button" aria-label="upvote card"></button>
      <button class="button downvote-button" aria-label="downvote card"></button>
      <p class="quality-text" aria-label="Importance ${newCard.voteQuality}" tabindex="0" aria-live="assertive" aria-atomic="true">Importance: <span class="vote-quality">${newCard.voteQuality}</span></p><form class="card__completed-button"><label for="completed-button" class="label__completed-button">Completed</label><input type="checkbox" value="Completed" class="button completed-button" ${newCard.isChecked}></input></form>
    </article>
  `);
}

function CardFactory(title, body) {
  this.id = $.now();
  this.title = title;
  this.body = body;
  this.voteQuality = 'Normal';
  this.isChecked = 'unchecked';
}

function prependCard() {
  var newCard = new CardFactory($('.title-input').val(), $('.body-input').val());
  var stringifyCard = JSON.stringify(newCard);
  localStorage.setItem(newCard.id, stringifyCard);
  $('.card-area').prepend(createCard(newCard));
  toggleSaveButton();
  $('.title-input').focus();
  
}

function getIdeas() {
  $.each(localStorage, function (index, element) {
    var getIdea = JSON.parse(localStorage.getItem(index));
    if (index >= localStorage.length && getIdea.isChecked === 'unchecked') {
    $('.card-area').prepend(createCard(getIdea));   
  }});
}

function toggleSaveButton() {
  if ($('.title-input').val() && $('.body-input').val()) {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true);
  }
}

function deleteCard() {
  localStorage.removeItem($(this).parent()[0].id);
  $(this).parent().remove();
}


function upvote() {
  var qualityValues = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var voteText = $(this).closest('article').find('.vote-quality');
  var idFinder = $(this).closest('article').attr('id');
  var voteStorage = JSON.parse(localStorage.getItem(idFinder));
  var i = qualityValues.indexOf(voteStorage.voteQuality);
  if (i <= 3) {
  voteText.text(qualityValues[i + 1]);
  voteStorage.voteQuality = qualityValues[i + 1];
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
}
}

function downvote() {
  var qualityValues = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var voteText = $(this).closest('article').find('.vote-quality');
  var idFinder = $(this).closest('article').attr('id');
  var voteStorage = JSON.parse(localStorage.getItem(idFinder));
  var i = qualityValues.indexOf(voteStorage.voteQuality);
  if (i > 0) {
  voteText.text(qualityValues[i - 1]);
  voteStorage.voteQuality = qualityValues[i - 1];
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
}
}

function editCard(e) {
  var idFinder = $(this).closest('article').attr('id');
  var ideaStorage = JSON.parse(localStorage.getItem(idFinder));
  if ($(e.target).is('h2.card-title')) {
    ideaStorage.title = $(this).text();
    localStorage.setItem(idFinder, JSON.stringify(ideaStorage));
  } else if ($(e.target).is('p.card-body')){
    ideaStorage.body = $(this).text();
    localStorage.setItem(idFinder, JSON.stringify(ideaStorage));
  }
}

function filterCards(e) {
  e.preventDefault();
  var searchValue = $('.search-input').val().toLowerCase();
  $.each($('.card-container'), function(index, element) {
    element.style.display = searchCards(element.children, searchValue);
  });
}

function searchCards(cards, searchVal) {  
  if (cards[0].innerText.toLowerCase().includes(searchVal) 
  || cards[2].innerText.toLowerCase().includes(searchVal)
  || !searchVal) {
    return 'block';
  } else {
    return 'none';    
  }
}