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





let quizID;


// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

 /*************************
 * 
 * @param { Array } params 
 * 
 *************************/

export function generateQuiz(params) {
    quizID = params[0];
    let mode = params[1];  
    generateQuestionObjects(params);
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



/*************************************************************************
*
* Generate the all cards for the screen (REDUNDANT)
*
**************************************************************************/

let maxCards = 3; //Maximum cards to show on screen
export let cardCount;














/*************************************************************************
*
* Get all questions from the server, attach to a card and build
*
**************************************************************************/

function generateQuestionObjects(params) {
    if(params[1] === 'flow') {
        prev = new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer"});
        next = new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer"}); 
    }
    generateQuestions(params);
    let progress = new Progress({id: "progressBar"})
}

async function generateQuestions(params) {
    //Fetch all questions related to the parameter given in the URL
    const response = await fetch('../../api/questions/' + params[0]);
        let questions;
        if (response.ok) {
            questions = await response.json();
            let i = 1;
            questions.forEach(question => {
                let card = new Card({id: 'card-' + i++, title: question.question });
                    card.classList.add("card");
                    
                    
                    
                    if(question.options != null) {
                        for(let x = 0; x < question.options.length; x++) {
                            let input = new Input({id: 'input-' + x + "question-" + i, type:  question.input, options: question.options[x] });
                                input.classList.add("input");
                            (card).appendChild(input);
                        }
                    } else {
                        let input2 = new Input({id: 'input-question-' + i, type: question.input });
                                input2.classList.add("input");
                            (card).appendChild(input2);
                    }


                arrOfCards.push(card);
                return arrOfCards;
            });
            if(params[1] === 'flow') {
                stackManager();
            } else {
                linear();
            }
            return;
        } else {
            questions = [{ msg: 'Failed to load cards' }];
            Render.createToast(questions[0].msg, FX.toastClear, "Close");
            return;
        }
}


/*************************************************************************
*
* Stack the cards into a neat pile of viewable cards
*
**************************************************************************/

let newArr = [];

function stackManager(val) {

    if(!val) {
        for(let i = 0; i < 3; i++) {
            if(arrOfCards[i]) {
                newArr.push(arrOfCards[i]);
                Render.$('root').appendChild(newArr[i]);
            }
        }
        sortDeck();
        return;
    }

    newArr = [];
    if(val === 'increase') {
        if(arrOfCards) {
            newArr.push(arrOfCards[j], arrOfCards[j + 1], arrOfCards[j + 2]);
        }
        sortDeck();
        return;
    } else {
        if(arrOfCards) {
            newArr.push(arrOfCards[j], arrOfCards[j + 1], arrOfCards[j + 2])
        }
        sortDeck();
        return;
    }
}



function sortDeck() {
    for(let i = 0; i < newArr.length; i++) {
        if(newArr[i]) {
            newArr[i].classList.add("card-add");
            newArr[i].style.transform = "scale(" + (1 - (0.1*i)) +")";
            //newArr[i].style.width = 70 - (i * 10) + "vw";
            newArr[i].style.visibility = "visible";
            newArr[i].style.marginTop = 0 + (i * - 10) + "%";
            newArr[i].style.zIndex = -i;
            newArr[i].style.transitionDelay = 0.1 * i + "s";
        }
    }
 
}



/*************************************************************************
*
* Up Down functions to control the flow of cards
*
**************************************************************************/

let j = 0;

export function increase() {

    //Manage storage of answers given!
    if(j < arrOfCards.length) {
        



    //Move topmost card down below screen view
    
        
        j++;
        Render.$('card-' + j).classList.add('card-remove');
        stackManager('increase');
        if(arrOfCards[j + 2]) {
            Render.$('root').appendChild(arrOfCards[j + 2]);
        }


        FX.progressCheck(j, arrOfCards.length + 1);
        window.localStorage.setItem(quizID, j);
    }
    if(j === arrOfCards.length) {
        console.log("END OF QUIZ");
        //quizEnd();
    }
}

export function decrease() {
    if(j != 0) {
        Render.$('card-' + j).classList.remove('card-remove');
        j--;
        stackManager('decrease');
        if(arrOfCards[j + 3]) {
            Render.$('root').removeChild(arrOfCards[j + 3]);
        }
        FX.progressCheck(j, arrOfCards.length + 1);
        window.localStorage.setItem(quizID, j);
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
        arrOfCards[i].style.position = "relative";
    }
}

    




