'use strict'


import Card from '/Components/Card/card.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import { quiz } from '/Javascript/quiz.js';
import * as Render from '../../Javascript/render.js';







// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

 /*************************
 * 
 * @param { Array } params 
 * 
 *************************/

export function generateQuiz(params) {
    let quizID = params[0];
    let mode = params[1];
    generateDeck(quizID, mode);
}


// #endregion
// ////////////////////////////////////////////////////////////// Generate Cards
// #region Generate Cards

 /**************************
 * 
 * @param { Int } quizID 
 * @param { String } mode 
 * 
 **************************/

let arrOfCards = [];
let arrOfInputs = [];
let quizObject;

function generateDeck(quizID, mode) {
    quizObject = quiz[quizID];
    for(let i = 0; i < quizObject.questions.length; i ++) { 
        //Work on seperating text generation from the card to the rendering file! The card should NOT handle rendering text
        let card = new Card({id: quizObject.questions[i].id, title: quizObject.questions[i].text});
        arrOfCards.push(card);
        let input = new Input({id: quizObject.questions[i].id, title: quizObject.questions[i].type});
        arrOfInputs.push(input);



        
    }
    if(mode === 'flow') {
        let btn = new Button({id: "TEST", name:"Next Question", action: "Quiz.upDown", param: +1});
        let btn2 = new Button({id: "TEST2", name:"Previous Question", action: "Quiz.upDown", param: -1});
     
        //Render Card     
        Render.render(arrOfCards[0], Render.$('root'));
        //Render Input
        Render.render(arrOfInputs[0], arrOfCards[0]);
        
        
    } else {
        linear();  
    } 
}

// #endregion
// ////////////////////////////////////////////////////////////// FLOW COUNTER
// #region Flow Increase and Decrease

 /*********************
 * 
 * @param { Int } val
 *  
 **********************/

let j = 0;

export function upDown(val) {
    ((val > 0) ? j++ : j--); 
    let num = ((val === + 1 ) ? - 1 : + 1);
    Render.render(arrOfCards[j], Render.$('root'));
    Render.render(arrOfInputs[j], arrOfCards[j]);
        if(Render.$(quizObject.questions[j + num].id) != undefined) {
            Render.removeRender(Render.$(quizObject.questions[j + num].id));
        }   
}


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY LINEAR
// #region Display All Elements Linear

function linear() {
    for(let i = 0; i < arrOfCards.length; i++) {
        Render.render(arrOfCards[i], Render.$('root'));
    }
}

    




