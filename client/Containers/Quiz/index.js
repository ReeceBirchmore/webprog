'use strict'


import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import * as Render from '../../Javascript/render.js';
import { quiz } from '/Javascript/quiz.js'

let arrOfCards = [];
let j = 0;

let quizObject;







export function generateDeck(quizID) {
    console.log(quizID)
    quizObject = quiz[quizID]
    for(let i = 0; i < quizObject.questions.length; i ++) { 
        let card = new Card({id: quizObject.questions[i].id, title: quizObject.questions[i].text});
        arrOfCards.push(card);
    }
        //TESTING, MOVE WHEN TESTING COMPLETE
        //Use localstorage for testing later
        let btn = new Button({id: "TEST", name:"Next Question", action: +1});
        let btn2 = new Button({id: "TEST2", name:"Previous Question", action: -1});
        Render.render(arrOfCards[0], Render.$('root'));
}

export function upDown(i) {
    ((i > 0) ? j++ : j--); 
    let num = ((i === + 1 ) ? - 1 : + 1);
    Render.render(arrOfCards[j], Render.$('root'));
        if(Render.$(quizObject.questions[j + num].id) != undefined) {
            Render.removeRender(Render.$(quizObject.questions[j + num].id));
        }   
}
    

    




