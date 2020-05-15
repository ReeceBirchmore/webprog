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



import * as Quiz from '/Javascript/quiz.js';
import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
//import Footer from '../../Components/Footer/footer.js';




// #endregion
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template


//let screen = new Screen({id: 'quiz'});
let footer = new Footer({id:'Footer'});



//Variables to sort!
let quizID; //ID of quiz
export let j = 0; //Counter
let title;


let arrOfCards = [];
let quizObject;

let next;
let prev;
let toLin;

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
    params = param;
    quizID = params[0];
    let mode = params[1];  
    
    //Render.createToast("Welcome to the admin page", FX.toastClear, "Close")
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




let qData;








/*************************************************************************
*
* Get all questions from the server, attach to a card and build
*
**************************************************************************/

function generateQuestionObjects(params) {
    if(params[1] === 'flow') {
        prev = new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer", type: "previous"});
        next = new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer", type: "next"}); 
        //toLin = new Button({id: "toLin", name:"Switch to Linear", action: "toLinear", param: +1, render: "Footer"}); 
    }
    generateQuestionnaire(params);
    new Progress({id: "progressBar"})
}

async function generateQuestionnaire(params) {
    const questionnaire = await fetch('/api/quizzes/' + params[0]);       
        if (questionnaire.ok) {
            qData = await questionnaire.json();
            console.log(qData)
        } else {
            qData = [{ msg: 'Failed to load cards' }];
            return;
        }
        qData[0].id;
    const response = await fetch('/api/questions/' + params[0]);
    console.log(response)
        let questions;
        if (response.ok) {
            questions = await response.json();
            new Nav({id:"Quiz", title: qData[0].title, questions:questions.length});
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
//This entire section needs reworking
    //Previous button handling! WILL NEED ITS OWN FUNCTION SOON
    if(j === 0) {
        Render.$('prevbtn').disabled = true;
        Render.$('prevbtn').classList.add('disabled');
    }
    else {
        Render.$('prevbtn').disabled = false;
        Render.$('prevbtn').classList.remove('disabled');
    }

    if(j != arrOfCards.length) {
        if(Render.$('submitbtn')) {
            Render.$('submitbtn').style.display = "none";
        }
        if(Render.$('card-submit')) {
            Render.$('card-submit').style.display = "none";
        }
    }

    //Display all given answers and give option to submit quiz
    if(j === arrOfCards.length) {

        if(Render.$('submitbtn')) {
            Render.$('submitbtn').style.display = "block";
        } else {
            let submit = new Button({id: 'submitbtn', type: 'submit', action: 'submit', render: 'Footer'});
        }
        

        if(Render.$('card-submit')) {
            Render.$('card-submit').style.display = "block";
        } else {
            let submissioncard = new Card({id:'card-submit', answers: { answers }});
                submissioncard.classList.add('card-submit');
            Render.$('root').appendChild(submissioncard);
        }
    }
//End of horrible section
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

        Render.$('root').appendChild(i);
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
    //Manage storage of answers given!
    if(j < arrOfCards.length) {
        j++;
        Render.$('card-' + j).classList.add('card-remove');
        stackManager('increase');
        FX.progressCheck(j, arrOfCards.length + 1);
        window.localStorage.setItem(quizID, j);
    }
    if(j === arrOfCards.length) {
        console.log("END OF QUIZ");
        //quizEnd();
    }
}

function nextCard() {
    if(arrOfCards[j + 2]) {
        Render.$('root').appendChild(arrOfCards[j + 2]);
    }
}

export function decrease() {
    if(j != 0) {
        Render.$('card-' + j).classList.remove('card-remove');
        j--;
        if(arrOfCards[j + 3]) {
            Render.$('root').removeChild(arrOfCards[j + 3]);
        }
        stackManager('decrease');
        FX.progressCheck(j, arrOfCards.length + 1);
        window.localStorage.setItem(quizID, j);
    }
}









export async function submitQuiz() {
    await fetch('/api/submit/' + params[0], {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(answers),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let test;
    const quizAnswersTest = await fetch('/api/answers/' + qData[0].id)
        if (quizAnswersTest.ok) {
            test = await quizAnswersTest.json();
            console.log(test); //Test[0] is because an array is returned, response[0] is response number 0 out of the list of responses given
        } else {
            test = [{ msg: 'Failed to load cards' }];
            return;
        }
}



    


