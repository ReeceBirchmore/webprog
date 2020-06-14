'use strict';

import SubmissionCard from '/Components/Card/submissioncard.js';
import Button from '/Components/Button/button.js';
import { arrOfCards, cardStackArr, cardCounter, answersObject, submitQuiz } from '/Containers/Quiz/index.js';
import { $ } from './render.js';


export function shuffle(val) {
  cardStackArr.cards = []; // We need to reset the cardStackArray each time it is called to refresh it


  // Ugly code ahead, I apologise but there is not cute way to do this kind of stuff
  if (cardCounter === 0 && $('prevbtn')) {
    $('prevbtn').disabled = true;
    $('prevbtn').classList.add('disabled');
  } else if ($('prevbtn')) {
    $('prevbtn').disabled = false;
    $('prevbtn').classList.remove('disabled');
  }

  if (cardCounter !== arrOfCards.length) {
    if ($('submitbtn')) {
      $('nextbtn').style.display = 'block';
      $('submitbtn').style.display = 'none';
    }
    if ($('envelopearticle')) {
      $('root').removeChild($('envelopearticle'));
    }
  }

  // Display all given answers and give option to submit quiz if the question counter matrches the length of the array of cards
  if (cardCounter === arrOfCards.length) {
    if ($('submitbtn')) {
      $('submitbtn').style.display = 'block';
      $('nextbtn').style.display = 'none';
    } else {
      const button = new Button({
        id: 'submitbtn',
        text: 'Submit',
        class: 'submit',
        action: function () { submitQuiz(); },
      });
      $('nextbtn').style.display = 'none';
    }
    if ($('card-submit')) {
      $('card-submit').style.display = 'block';
    } else {
      const card = new SubmissionCard({
        id: 'card-submit',
        answers: answersObject.responses,
      });
    }
  }
  // Ugly code end


  // If the function is being called with no value, it means the questionnaire is initialising
  // Else, rearrange the cardStackArray with the next 3 cards to display.
  if (!val) {
    intialise();
  } else {
    if (arrOfCards) {
      cardStackArr.cards.push(arrOfCards[cardCounter], arrOfCards[cardCounter + 1], arrOfCards[cardCounter + 2]);
    }
    sortDeck();
  }
}


/******************************************************************************
 *
 * Initialise the quiz, gather the first 3 cards for the arrOfCards
 * (generated array) and put them into the cardStackArray (Array that handles
 * the cards visible on the screen)
 *
 ******************************************************************************/

function intialise() {
  for (let i = 0; i < 3; i++) {
    if (arrOfCards[i]) {
      console.log(cardStackArr.cards);
      arrOfCards[i].classList.remove('card-remove');
      cardStackArr.cards.push(arrOfCards[i]);
      $('root').appendChild(cardStackArr.cards[i]);
    }
  }
  sortDeck();
}


/******************************************************************************
 *
 * Manage the deck each time, check if reduced motion is on (if so, disable
 * animations) and shuffle the cards, move the topmost card offscreen and
 * rearrange the cardStackArray with the next 3 required cards.
 *
 ******************************************************************************/

function sortDeck() {
  for (let i = 0; i < cardStackArr.cards.length; i++) {
    if (cardStackArr.cards[i]) {
      if (window.matchMedia('(prefers-reduced-motion)').matches) {
        cardStackArr.cards[i].style.zIndex = -i;
        cardStackArr.cards[i].style.transform = 'translateY(0%) scale(1)';
      } else {
        cardStackArr.cards[i].style.zIndex = -i;
        cardStackArr.cards[i].style.transform = 'translateY(' + (i * -2.5) + '%) scale(' + (1 - (0.1 * i)) + ')';
        cardStackArr.cards[i].style.transitionDelay = 0.3 * i + 's';
      }
    }
  }
  nextCard();
}

// Gather the next card for the arrOfCards to put into the bottom of the stack (end of cardStackArray)
function nextCard() {
  if (arrOfCards[cardCounter + 2]) {
    $('root').appendChild(arrOfCards[cardCounter + 2]);
  }
}
