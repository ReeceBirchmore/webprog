'use strict'


import Card from '/Components/Card/card.js';
import SubmissionCard from '/Components/SubmissionCard/submissioncard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toast from '/Components/Toast/toast.js';
import Progress from '/Components/Progress/progress.js';
import QuestionNumber from '/Components/QuestionNumber/questionnumber.js';
import Modal from '/Components/Modal/modal.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import { answers } from '/Components/Input/input.js';
import Screen from '/Components/Screen/screen.js';



import * as Quiz from '/Javascript/quiz.js';
import { $, render, renderText, createToast } from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
//import Footer from '../../Components/Footer/footer.js';




// #endregion
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template


//let screen = new Screen({id: 'quiz'});




//Variables to sort!
let quizID; //ID of quiz
export let j = 0; //Counter
let title;

let qData;



let uid; //Quiz ID

let arrOfCards = [];

let next;
let prev;

let params;


// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

 /*************************
 * 
 * @param { Array } params 
 * 
 *************************/

export function generateQuiz(param) {

    new Screen({id: 'quiz', class: 'quizScreen'});
    uid = param.id;
    j = 0;
    quizID = params;
    if(arrOfCards.length === 0) {
        generateQuestionnaire(uid);
        generateQuestionObjects(uid);
        generateQuestions(uid)
    } else {
        generateQuestionnaire(uid);
        generateQuestionObjects();
        stackManager();
    }
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
* Generate the splash screen
*
**************************************************************************/












/*************************************************************************
*
* Get all questions from the server, attach to a card and build
*
**************************************************************************/

function generateQuestionObjects(uid) {
    new Footer({id:'Footer'});
    prev = new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer", type: "previous"});
    next = new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer", type: "next"}); 
    new Progress({id: "progressBar"});    
}











async function generateQuestionnaire(uid) {
    const questionnaire = await fetch('/api/quizzes/' + uid);       
        if (questionnaire.ok) {
            qData = await questionnaire.json();
            new Nav({id:"nav", title: qData[0].title});
        } else {
            qData = [{ msg: 'Failed to load cards' }];
            return;
        }
}

async function generateQuestions(uid) {
    const response = await fetch('/api/questions/' + uid);
        let questions;
        if (response.ok) {
            questions = await response.json();
            let i = 1;
            questions.forEach(question => {
                let card = new Card({id: 'card-' + i++, title: question.question });
                    card.classList.add("card");
                    // if(question.options != null) {
                    //     for(let x = 0; x < question.options.length; x++) {
                    //         let input = new Input({id: 'input-' + x + "question-" + i, type:  question.input, options: question.options[x] });
                    //             input.classList.add("input");
                    //         (card).appendChild(input);
                    //     }
                    // } else {
                        let input2 = new Input({id: 'input-question-' + i, type: question.input, title: question.question });
                            (card).appendChild(input2);
                    //}
                arrOfCards.push(card);
                return arrOfCards;
            });
                stackManager();
            return;
        } else {
            questions = [{ msg: 'Failed to load cards' }];
            createToast(questions[0].msg, FX.toastClear, "Close");
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
//This entire section needs reworking
    //Previous button handling! WILL NEED ITS OWN FUNCTION SOON
    if(j === 0) {
        $('prevbtn').disabled = true;
        $('prevbtn').classList.add('disabled');
    }
    else {
        $('prevbtn').disabled = false;
        $('prevbtn').classList.remove('disabled');
    }

    if(j != arrOfCards.length) {
        if($('submitbtn')) {
            $('submitbtn').style.display = "none";
        }
        if($('card-submit')) {
            $('card-submit').style.display = "none";
        }
    }

    //Display all given answers and give option to submit quiz
    if(j === arrOfCards.length) {

        if($('submitbtn')) {
            $('submitbtn').style.display = "block";
        } else {
            let submit = new Button({id: 'submitbtn', type: 'submit', action: 'submit', render: 'Footer'});
        }
        

        if($('card-submit')) {
            $('card-submit').style.display = "block";
        } else {
            let submissioncard = new Card({id:'card-submit', answers: { answers }});
                submissioncard.classList.add('card-submit');
            $('root').appendChild(submissioncard);
        }
    }


//End of horrible section

    newArr = [];
    if(!val) {
        for(let i = 0; i < 3; i++) {
            if(arrOfCards[i]) {
                arrOfCards[i].classList.remove('card-remove')
                newArr.push(arrOfCards[i]);
                $('root').appendChild(newArr[i]);
            }
        }
        sortDeck();
        return;
    }

    if(val === 'increase') {
        
        if(arrOfCards) {
            newArr.push(arrOfCards[j], arrOfCards[j + 1], arrOfCards[j + 2]);
        }
        sortDeck();
        return;
    } else if (val === 'decrease') {
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
            newArr[i].style.zIndex = -i;
            newArr[i].classList.add("card-add");
            newArr[i].style.transform = "translateY(" + (i * - 2.5) + "%) scale(" + (1 - (0.1*i)) +")";          
            newArr[i].style.transitionDelay = 0.3 * i + "s";
        }
    }
    nextCard();  
}


/*************************************************************************
*
* Discard Stack, turn into linear mode
*
**************************************************************************/

export function toLinear() {
    let j = 0;
    let position;
    for(let i of arrOfCards) {

        $('root').appendChild(i);
        setTimeout(function() {
            j++
            let position = i.getBoundingClientRect();

            i.style.transform = "translateY(" + (position.height * j) + "px)";
        }, 100);
    }
    // for(let i = 0; i < arrOfCards.length; i++) {
    //     Render.$('root').appendChild(arrOfCards[i]);
    //     if(arrOfCards[i - 1]) {
    //         position = arrOfCards[i - 1].getBoundingClientRect();
    //     } else {
    //         console.log("First card")
    //         position = arrOfCards[i].getBoundingClientRect();
    //     }
    //      console.log(position.bottom);
    //         arrOfCards[i].style.transform = "translateY(" + (position.bottom + 100) + "px)";
    //         console.log(arrOfCards[i].style.transform)
    // }
    // arrOfCards.forEach(card => {
    //     i++;
    //     Render.$('root').appendChild(card);
    //     setTimeout(function() {

    //         card.style.transform = "translateY(" + j * 10 + "%)";
    //     }, 100);
    // })

}





/*************************************************************************
*
* Up Down functions to control the flow of cards
*
**************************************************************************/


export function increase() {
    if(j < arrOfCards.length) {
        j++;
        $('card-' + j).classList.add('card-remove');
        stackManager('increase');
        FX.progressCheck(j, arrOfCards.length + 1);
    }
}

function nextCard() {
    if(arrOfCards[j + 2]) {
        $('root').appendChild(arrOfCards[j + 2]);
    }
}

export function decrease() {
    if(j != 0) {
        $('card-' + j).classList.remove('card-remove');
        j--;
        if(arrOfCards[j + 3]) {
            $('root').removeChild(arrOfCards[j + 3]);
        }
        stackManager('decrease');
        FX.progressCheck(j, arrOfCards.length + 1);
    }
}









export async function submitQuiz() {
    await fetch('/api/submit/' + uid, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(answers),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let test;
    const quizAnswersTest = await fetch('/api/answers/' + qData[0].id)
        if (quizAnswersTest.ok) {
            new Screen({id: 'quiz-complete', class: 'quizScreen'});
            new Nav({id:"nav", title: "Thank You"});
            test = await quizAnswersTest.json();

        } else {
            test = [{ msg: 'Failed to load cards' }];
            return;
        }
}



    


