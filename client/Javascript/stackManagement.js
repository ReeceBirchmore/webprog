'use strict';

import SubmissionCard from '/Components/SubmissionCard/submissioncard.js';
import Button from '/Components/Button/button.js';

import { arrOfCards, cardStackArr, flowCount, answersObject } from '../Containers/Quiz/index.js';
import { $ } from './render.js';


export function shuffle(val) {
  cardStackArr.cards = [];


  // Ugly code ahead
  if (flowCount === 0 && $('prevbtn')) {
    $('prevbtn').disabled = true;
    $('prevbtn').classList.add('disabled');
  } else if ($('prevbtn')) {
    $('prevbtn').disabled = false;
    $('prevbtn').classList.remove('disabled');
  }

  if (flowCount !== arrOfCards.length) {
    if ($('submitbtn')) {
      $('nextbtn').style.display = 'block';
      $('submitbtn').style.display = 'none';
    }
    if ($('envelopearticle')) {
      $('root').removeChild($('envelopearticle'));
    }
  }
  // Display all given answers and give option to submit quiz
  if (flowCount === arrOfCards.length) {
    if ($('submitbtn')) {
      $('submitbtn').style.display = 'block';
      $('nextbtn').style.display = 'none';
    } else {

      const button = new Button({
        id: 'submitbtn',
        text: 'Submit',
        type: 'submit',
        action: 'submit',
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
  if (!val) {
    intialise();
  } else {
    if (arrOfCards) {
      cardStackArr.cards.push(arrOfCards[flowCount], arrOfCards[flowCount + 1], arrOfCards[flowCount + 2]);
    }
    sortDeck();
  }
}

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


export function changeDisplayMode() {
  // code
}


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

function nextCard() {
  if (arrOfCards[flowCount + 2]) {
    $('root').appendChild(arrOfCards[flowCount + 2]);
  }
}
