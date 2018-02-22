window.onload = getIdeas();
$('.card-area').on('input', '.completed-button', toggleCheckBox);
$('.search__button-show-completed').on('click', showCompleted);
$('.card-area').on('click', '.delete-button', deleteCard);
$('.card-area').on('click', '.downvote-button', downvote);
$('.card-area').on('keyup', '.card-body', preventEnter);
$('.card-area').on('click', '.upvote-button', upvote);
$('.card-area').on('keyup', '.card-title', editCard);
$('.card-area').on('keyup', '.card-body', editCard);
$('.title-input').on('keyup', toggleSaveButton);
$('#dropdown-menu').on('change', qualityFilter)
$('.body-input').on('keyup', toggleSaveButton);
$('.search-input').on('keyup', filterCards);
$('.save-button').on('click', prependCard);
$('.body-input').on('keyup', preventBreak);
$('.secret-button').on('click', showAll);

function createCard(newCard, classname) {
  return (`
    <article class="card-container ${classname}" id="${newCard.id}">
    <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
    <button class="button delete-button" aria-label="delete card"></button>
    <p class="card-body" contenteditable="true">${newCard.body}</p>
    <button class="button upvote-button" aria-label="upvote card"></button>
    <button class="button downvote-button" aria-label="downvote card"></button>
    <p class="quality-text" aria-label="Importance ${newCard.voteQuality}" tabindex="0" aria-live="assertive" aria-atomic="true">Importance: <span class="vote-quality">${newCard.voteQuality}</span></p><form class="card__completed-button"><label for="completed-button" class="label__completed-button">Completed</label><input type="checkbox" aria-label="completed button" class="button completed-button" ${newCard.isChecked}></input></form>
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

function prependCard(e) {
  e.preventDefault();
  var newCard = new CardFactory($('.title-input').val(), $('.body-input').val());
  var stringifyCard = JSON.stringify(newCard);
  localStorage.setItem(newCard.id, stringifyCard);
  if(localStorage.length < 11) {
    normalAddCards();
    resetFields();
  } else {
    addNewestCards();
    showSecretButton();
  };
}

function getIdeas() {
  if (localStorage.length > 10){
    addNewestCards();
  } else {
    normalAddCards();
  }
}

function normalAddCards() {
  $('.card-container').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var parsed2Do = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (parsed2Do.isChecked === 'unchecked') {
      $('.card-area').prepend(createCard(parsed2Do));
    }
  }
}

function addNewestCards() {
  $('.card-container').remove();
  for (var i = (localStorage.length - 10); i < localStorage.length; i++) {
    var parsed2Do = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (parsed2Do.isChecked === 'unchecked') {
      $('.card-area').prepend(createCard(parsed2Do));
      showSecretButton();
    }}
  }

function showAll() {
  $('.card-container').remove();
  for (var i = 0; i < localStorage.length; i++) {
    var parsed2Do = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (parsed2Do.isChecked === 'unchecked') {
      $('.card-area').prepend(createCard(parsed2Do));
    }
  }
}

function showCompleted(e) {
  e.preventDefault();
  for (var i = 0; i < localStorage.length; i++) {
    var parsed2Do = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (parsed2Do.isChecked === 'checked') {
      $('.card-area').prepend(createCard(parsed2Do, 'completed-to-do-style')); 
    }};
  }

function toggleCheckBox() {
  var idFinder = $(this).closest('article').attr('id');
  var parsed2Do = JSON.parse(localStorage.getItem(idFinder));
  if ($(this).is(':checked') === true) {
    addChecked(parsed2Do, this);
  } else {
    removeChecked(parsed2Do, this);
  } 
  localStorage.setItem(idFinder, JSON.stringify(parsed2Do));
}

function addChecked(object, newthis) {
  object.isChecked = 'checked';
  $(newthis).closest('article').addClass('completed-to-do-style');
}

function removeChecked(object, newthis) {
  object.isChecked = 'unchecked'; 
  $(newthis).closest('article').removeClass('completed-to-do-style');
}

function qualityFilter() {
  $('.card-container').hide();
  var $input = document.getElementById('dropdown-menu')
  var $inputText = $input.options[$input.selectedIndex].text;
  var array = $('.vote-quality');
  for (var i = 0; i < array.length; i++) {
    if ($(array[i]).text().includes($inputText)) {
      $(array[i]).closest('article').show();
    } else if ($inputText === 'All') {
      $('.card-container').show();
    }
  }
}

function showSecretButton() {
  $('.secret-button').addClass('show-button');
  $('.secret-button').removeClass('hidden-button');
  resetFields();
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
    doUpvote(voteText, voteStorage, qualityValues, idFinder, i);
  }
}

function doUpvote(voteText, voteStorage, qualityValues, idFinder, i) {
  voteText.text(qualityValues[i + 1]);
  voteStorage.voteQuality = qualityValues[i + 1];
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
}

function downvote() {
  var qualityValues = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var voteText = $(this).closest('article').find('.vote-quality');
  var idFinder = $(this).closest('article').attr('id');
  var voteStorage = JSON.parse(localStorage.getItem(idFinder));
  var i = qualityValues.indexOf(voteStorage.voteQuality);
  if (i > 0) {
    doDownvote(voteText, voteStorage, qualityValues, idFinder, i);
  }
}

function doDownvote(voteText, voteStorage, qualityValues, idFinder, i) {
  voteText.text(qualityValues[i - 1]);
  voteStorage.voteQuality = qualityValues[i - 1];
  localStorage.setItem(idFinder, JSON.stringify(voteStorage));
}

function editCard(e) {
  var idFinder = $(this).closest('article').attr('id');
  var parsed2Do = JSON.parse(localStorage.getItem(idFinder));
  if ($(e.target).is('h2.card-title')) {
    parsed2Do.title = $(this).text();
    localStorage.setItem(idFinder, JSON.stringify(parsed2Do));
  } else if ($(e.target).is('p.card-body')){
    parsed2Do.body = $(this).text();
    localStorage.setItem(idFinder, JSON.stringify(parsed2Do));
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

function preventBreak(e) {
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

function clearFields() {
  $('.input').val("");
  $('.title-input').focus();
}

function resetFields() {
  toggleSaveButton();
  clearFields();
}

function toggleSaveButton() {
  if ($('.title-input').val() && $('.body-input').val()) {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true);
  }
}