'use strict'


import Card from '/Components/Card/card.js';
import QuizCard from '/Components/QuizCard/quizcard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toast from '/Components/Toast/toast.js';
import Progress from '/Components/Progress/progress.js';
import QuestionNumber from '/Components/QuestionNumber/questionnumber.js'
import Modal from '/Components/Modal/modal.js';




import * as Quiz from '/Javascript/quiz.js';
import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';






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
    //generateDeck(quizID, mode);
    cardGeneration(quizID, mode)
}


// #endregion
// ////////////////////////////////////////////////////////////// GENERATE CARDS AND INPUTS
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


let toast = new Toast({id:'toast', text:"Quiz Submitted Succesfully", action: FX.toastClear , actionText: "Close"})
Render.render(toast, Render.$('root'));

//let quizCard = new QuizCard({id: 1, quizTitle: "Test Title", questions: "7", expire: "Test Date", author: "Test Author"});
//let progress = new Progress({id: "progressBar"})
//let qNum = new QuestionNumber({id: '1'});
//let card = new Card({id: Quiz.quiz[1].questions[1].id, title: Quiz.quiz[1].questions[1].text});
        
//let modal = new Modal({text: "Click to continue", title:"Example Questionnaire"})



function cardGeneration(quizID, mode) {
    /*
           let btn = new Button({id: "test up progress", name:"Next Question 1", action: "progress", param: 1});
        let btn2 = new Button({id: "test down progress", name:"Previous Question 1", action: "progress", param: 0});
*/
    //let btn3 = new Button({id: "TEST2", name:"Previous Question", action: "toast"});
    quizObject = Quiz.quiz[quizID];
    for(let i = 0; i < quizObject.questions.length; i ++) {        
        //let qNum = new QuestionNumber({id: i});
        //Work on seperating text generation from the card to the rendering file! The card should NOT handle rendering text
        let card = new Card({id: quizObject.questions[i].id, title: quizObject.questions[i].text});
        arrOfCards.push(card);
        let input = new Input({id: quizObject.questions[i].id, type: quizObject.questions[i].type});
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

        console.log(j)
}


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY LINEAR
// #region Display All Elements Linear

function linear() {
    for(let i = 0; i < arrOfCards.length; i++) {
        Render.render(arrOfCards[i], Render.$('root'));
        Render.render(arrOfInputs[i], arrOfCards[i]);

    }
}

    




