'use strict'


import Toast from '/Components/Toast/toast.js';

import * as Render from '../../Javascript/render.js';
import * as Quiz from '/Javascript/quiz.js';
import * as Card from '../../Containers/Quiz/index.js';





/*************************************************************************
*
* Toast Notification Animation Management
*
**************************************************************************/

let linger;
let destroy;

export function toastManagement() {

    setTimeout(function() {
    Render.$('toast').classList.add('appear');
    }, 100);

    linger = setTimeout(function() {
        Render.$('toast').classList.add('remove'); 
        Render.$('toast').classList.remove('appear');
    }, 3000);

    destroy = setTimeout(function() {
        Render.$('root').removeChild(Render.$('toast'))
    }, 3500);
}

export function toastClear() {
    Render.$('toast').classList.add('remove'); 
    Render.$('toast').classList.remove('appear');

    setTimeout(function() {
        Render.$('root').removeChild(Render.$('toast'))
    }, 100);
}



/*************************************************************************
*
* Modal Animation Management
*
**************************************************************************/

export function bounceModal() {
    console.log(Render.$('modal'))
    Render.$('modal').classList.add('bounce-in')
}




/*************************************************************************
*
* Progress Bar Animation Management
*
**************************************************************************/

export function progressCheck(val, quizLength) {
    let prog = Render.$('progressSpan');
    prog.style.width = (val / (quizLength - 1)) * 100 + "%";
}







/*************************************************************************
*
* Card Flow Animation Management
*
**************************************************************************/
export function moveCard() {
    Render.$('card').classList.add('completed');
    setTimeout(function() {
        Render.$('card').classList.add('nextCard');
    }, 120);
}


export function returnCard() {
        Render.$('card').classList.add('completed');
        setTimeout(function() {
            Render.$('card').classList.add('nextCard');
        }, 100);
}





let count;

export function animatecard(operand) {
    let card;
    console.log(Card.cardCount)
    if(count == undefined) {
        count = Card.cardCount;
    }
        if(operand > 1) {
            console.log(count);
            count = count - 1;    
            card = Render.$("card-" + count);
            console.log(card);
            card.classList.remove("cardFlip");
            

    
        } else {
            console.log("REMOVE")
           
            card = Render.$("card-" + count);
            card.classList.add("cardFlip");
            
            Card.addCard(count);
            count = count + 1;
        }   
}



/*
export function animatecard(operand) {
    let card;
    console.log(Card.cardCount)
    if(count == undefined) {
        count = Card.cardCount;
    }
        if(operand > 1) {
            console.log(count)
            card = Render.$("card-" + count);
            console.log(card);
            card.classList.remove("cardFlip");
            count = count + 1;    

    
        } else {
            console.log("REMOVE")
            count = count - 1;
            card = Render.$("card-" + count);
            card.classList.add("cardFlip");
            Card.addCard(count);
        }   
}

*/
