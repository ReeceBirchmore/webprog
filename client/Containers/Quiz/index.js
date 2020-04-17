'use strict'


import Card from '/Components/Card/card.js';
import QuizCard from '/Components/QuizCard/quizcard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toast from '/Components/Toast/toast.js';
import Progress from '/Components/Progress/progress.js';
import QuestionNumber from '/Components/QuestionNumber/questionnumber.js'
import Modal from '/Components/Modal/modal.js';
import Footer from '/Components/Footer/footer.js';



import * as Quiz from '/Javascript/quiz.js';
import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
//import Footer from '../../Components/Footer/footer.js';


// #endregion
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template


//let screen = new Screen({id: 'quiz'});

let footer = new Footer({id:'Footer'});



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

let next;
let prev;


//let toast = new Toast({id:'toast', text:"Quiz Submitted Succesfully", action: FX.toastClear , actionText: "Close"})
//Render.render(toast, Render.$('root'));

//let quizCard = new QuizCard({id: 1, quizTitle: "Test Title", questions: "7", expire: "Test Date", author: "Test Author"});
//let progress = new Progress({id: "progressBar"})
//let qNum = new QuestionNumber({id: '1'});
//let card = new Card({id: Quiz.quiz[1].questions[1].id, title: Quiz.quiz[1].questions[1].text});
        
//let modal = new Modal({text: "Click to continue", title:"Example Questionnaire"})
    /*
           let btn = new Button({id: "test up progress", name:"Next Question 1", action: "progress", param: 1});
        let btn2 = new Button({id: "test down progress", name:"Previous Question 1", action: "progress", param: 0});
*/
    //let btn3 = new Button({id: "TEST2", name:"Previous Question", action: "toast"});


function cardGeneration(quizID, mode) {
    quizObject = Quiz.quiz[quizID];
    for(let i = 0; i < quizObject.questions.length; i ++) {        
        //let qNum = new QuestionNumber({id: i});
        //Work on seperating text generation from the card to the rendering file! The card should NOT handle rendering text
        let card = new Card({id: 'card', title: quizObject.questions[i].text});
        arrOfCards.push(card);
        let input = new Input({id: quizObject.questions[i].id, type: quizObject.questions[i].type});
        arrOfInputs.push(input);
    }
    if(mode === 'flow') {
        prev = new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer"});
        next = new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer"}); 
        Render.render(arrOfCards[0], Render.$('root'));
        arrOfCards[0].style.transform = "translateX(0)";
        Render.render(arrOfInputs[0], arrOfCards[0]);
        let progress = new Progress({id: "progressBar"})
    } else {
        linear();  
    } 
}


/***************
 * 
 * TODO LIST:
 *  - Create observable to monitor and maintain Js value to determine which buttons should
 * be visible
 *  - Work on submission functionality
 *  - Work on pulling data from the database as opposed to a fuckin text file
 *  - Work on displaying questions properly
 *  - Using local storage to pre-populate fields
 *  - Using real time validation (with observables) 
 * 
 * 
 * 
 * 
 * 
 * 
 */




// #endregion
// ////////////////////////////////////////////////////////////// FLOW COUNTER
// #region Flow Increase and Decrease

 /*********************
 * 
 * @param { Int } val
 *  
 **********************/


let j = 0;


export function up() {
    Render.removeRender(Render.$('card'));
    j++;
    FX.progressCheck(j, quizObject.questions.length);
    Render.render(arrOfCards[j], Render.$('root'));
    Render.render(arrOfInputs[j], arrOfCards[j]);
}

export function down() {
    if(j != 0) {
        Render.removeRender(Render.$('card'));
        j--;
        FX.progressCheck(j, quizObject.questions.length);
        Render.render(arrOfCards[j], Render.$('root'));
        Render.render(arrOfInputs[j], arrOfCards[j]);
    }
}



//let j = 0;

export function upDown(val) {
    
    ((val > 0) ? j++ : j--); 
    let num = ((val === + 1 ) ? - 1 : + 1);
    FX.progressCheck(j, quizObject.questions.length);


    /* Handle the card display here */

    Render.render(arrOfCards[j], Render.$('root'));
    Render.render(arrOfInputs[j], arrOfCards[j]);
        if(Render.$(quizObject.questions[j + num].id) != undefined) {
            Render.removeRender(Render.$(quizObject.questions[j + num].id));
        }



    /* Handle the button control here */
    console.log(j)
    if(j == 0 || !j) {
        Render.$('prevbtn').style.display = "none";
    } else {
        Render.$('prevbtn').style.display = "block";
    }
    if(j == quizObject.questions.length - 1) {
        Render.$('nextbtn').style.display = "none";
        if(!Render.$('submitbtn')) { //Quick check to see if the submit button exists
            let submit = new Button({id: "submitbtn", name:"Submit", action: "toast", render: "Footer"});
        } else {
            Render.$('submitbtn').style.display = "block";
        }
    } else {
        Render.$('nextbtn').style.display = "block";
        if(Render.$('submitbtn')) { //Quick check to see if the submit button exists
            Render.$('submitbtn').style.display = "none";
        }
    }
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

    




