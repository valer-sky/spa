"use strict";

export function gameInit() {
  let gameField      = document.getElementById('field');
  let restartButton  = document.getElementById('restart');
  let stepsCounter   = document.getElementById('steps');
  let timerUI        = document.getElementById('timer');
  let cardViewInHTML = '<div class="card card_closed" data-status="closed"></div>';
  let cardsContent  = ['harp','domra','bagpipe','block flute','folk harp','guitar','maracas','piano','tambourine','tom-tom','trumpet','xylophone'];
      cardsContent = cardsContent.map((card) => {
       let img = new Image();
       img.src = `img/${card}.png`;
        return img;
      });
  
  let openedCards    = [];
  let complitedCards = 0;
  let paused         = false;
  
  restartButton.hidden = true;
  cardsContent = doubleCards(cardsContent);
  createCardsOnGameField(field);
  
  gameField.onclick = (e) => {
    // wait while two wrong opened cards was closed;
    if (paused) { 
      return; 
    }
    if (!timerUI.dataset.started) {
      toggleTimer();
    }
    if (e.target.dataset.status === 'opened'
     || e.target.dataset.status === 'complited') {
      return;
    }
  
    openCard(e.target);
    stepsCounter.innerHTML = +stepsCounter.innerHTML + 1;
  
    if (openedCards.length !== 2) return;
    let audio = new Audio('audio/zvuk-oshibki-vyibora.mp3');
    audio.play();
    // set comlited status for matched cards, or close their with delay if not
    if (openedCards[0] === openedCards[1]) {
      setOpenedCardsStatus('complited', '');
      complitedCards += 2;
      let audio = new Audio('audio/igrovaya-sreda-audio-energoobespechenie-audio-material-39368.mp3');
      window.navigator.vibrate(200);
    audio.play();
    } else {
      paused = true;
      setTimeout(() => {
        setOpenedCardsStatus('closed', 'card_closed');
        paused = false;
      }, 700);
    }
  
    // clear openedCards array for next try
    openedCards = [];
    if (complitedCards === cardsContent.length) {
      let audio = new Audio('audio/zvuk-pobedyi-v-igrovom-urovne-30120.mp3');
        audio.play();
      
      restartButton.hidden = false;
    }
  }
  
  restartButton.onclick = function() {
    
    gameField.innerHTML = '';
    cardsContent = mixarr(cardsContent);
    // create cards in HTML
    for (let i = 0; i < cardsContent.length; i++) {
      gameField.insertAdjacentHTML('beforeend', cardViewInHTML);
      gameField.lastElementChild.innerHTML =  '<img class="card-image" src="' + cardsContent[i].getAttribute('src') + '">';
    }
    toggleTimer();
    stepsCounter.innerHTML = 0;
    complitedCards = 0;
    restartButton.hidden = true;
  }
  
  function openCard(target) {
    target.dataset.status = 'opened';
    target.classList.remove('card_closed');
    openedCards.push(target.innerHTML);
  }
  
  function setOpenedCardsStatus(status, className) {
    for (let i = 0; i < gameField.children.length; i++) {
      if (gameField.children[i].dataset.status === 'opened') {
        gameField.children[i].dataset.status = status;
        if (!className) continue;
        gameField.children[i].classList.add(className);
      }
    }
  }
  
  function mixarr(arr) {
    return arr.map(i => [Math.random(), i]).sort().map(i => i[1])
  }
  
  function doubleCards(cardsContent) {
    cardsContent = [...cardsContent,...cardsContent];
    cardsContent = mixarr(cardsContent);
    return cardsContent;
  }
  
  function createCardsOnGameField(field) {
    for (let i = 0; i < cardsContent.length; i++) {
      field.insertAdjacentHTML('beforeend', cardViewInHTML);
      gameField.lastElementChild.innerHTML =  '<img class="card-image" src="' + cardsContent[i].getAttribute('src') + '">';
    }
  }
  
  function timer(elemId) {
    let minutes = '00';
    let seconds = '00';
    let milliseconds = '00';
  
    const timerId = setInterval(() => {
      elemId.innerHTML = setTime();
      if (complitedCards === cardsContent.length) clearTimeout(timerId);
    }, 10);
  
    function doubleNumber(number) {
      if (number < 10) return '0' + number;
      return number;
    }
  
    function setTime() {
      if (milliseconds === 99) {
        milliseconds = '00';
        seconds++;
        seconds = doubleNumber(seconds);
      }
      if (seconds === 60) {
        seconds = '00';
        minutes++;
        minutes = doubleNumber(minutes);
      }
  
      milliseconds++;
      milliseconds = doubleNumber(milliseconds);
  
      return `${minutes}:${seconds}:${milliseconds}`;
    }
  }
  
  function toggleTimer() {
    if (!timerUI.dataset.started) {
      timerUI.dataset.started = 'true';
      timer(timerUI);
    } else {
      timerUI.innerHTML = '00:00:00';
      timerUI.dataset.started = '';
    }
  }
}