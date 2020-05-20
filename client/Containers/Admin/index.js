'use strict'

import Card from '/Components/Card/card.js';
import EditCard from '/Components/Card/editcard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toggle from '/Components/Input/Toggle.js';
import Modal from '/Components/Modal/modal.js';
import * as ModalFunctions from '/Components/Modal/modal.js';
import ModalContent from '/Components/Modal/modal-content.js';
import Divider from '/Components/Divider/divider.js';
import Nav from '/Components/Nav/nav.js';
import Fab from '../../Components/Fab/fab.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';
import Screen from '/Components/Screen/screen.js';


import { filebutton } from '/Components/Modal/modal-content.js';


import * as Quiz from '/Javascript/quiz.js';
// import * as Render from '../../Javascript/render.js';

import { $, createToast, renderText } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';
import { options } from '../../Components/Input/input.js';
import { render } from '../../Javascript/render.js';




// #endregion
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template


//let screen = new Screen({id: 'quiz'});






// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

 /*************************
 * 
 * @param { Array } params 
 * 
 *************************/

let params;
let uid;
let quizListObject;



export function generatePage(param) {
    new Screen({id: 'admin-console', class: 'adminScreen'});
    new Nav({id:'nav', title: "Administrator Console", add: true});
    displayQuizzes(params);
}


//new Toggle({id:'toggletest'});
  


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes




export async function displayQuizzes() {
    let check = document.querySelectorAll('.card-quiz-list');
    check.forEach(element => {
        $('root').removeChild(element);
    });
    check = null;
    if(check === null) {
    const quizlist = await fetch('/api/quizlist/');
        if (quizlist.ok) {
            quizListObject = await quizlist.json();
        } else {
            quizListObject = [{ msg: 'Failed to load cards' }];
            return;
        }
        quizListObject.forEach(quiz => {
            new QuizCard({id: quiz.quizid, quizTitle: quiz.title, type: 'quiz', uid: quiz.quizid});
        });
    }   
}





// #endregion
// ////////////////////////////////////////////////////////////// DELETE
// #region Delete Quizzes and Questions



export async function deleteQuiz(uid, quiztitle) {
    let title = (!quiztitle) ? "Quiz Deleted" : quiztitle + " Deleted";
    const deleteQuiz = await fetch('/api/delete/quiz/' + uid);
    if (deleteQuiz.ok) {
        displayQuizzes();
        createToast(title, FX.toastClear, "Close");
    } else {
        //Code if it failed here
        return;
    }
}



export async function deleteQuestion(qid, question) {
    let title = (!question) ? "Question Deleted" : question + " Deleted";
    const deleteQuiz = await fetch('/api/delete/question/' + qid);
    if (deleteQuiz.ok) {
        console.log(uid)
        editQuiz(uid);
        createToast(title, FX.toastClear, "Close");
    } else {
        //Code if it failed here
        return;
    }
}










// #endregion
// ////////////////////////////////////////////////////////////// CREATE
// #region Upload or create a new quiz



export async function createNewQuiz(value) {
    let title = { value }
    if(title != undefined) {
        const upload = await fetch('/api/create/quiz', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(title),
        headers: {
            'Content-Type': 'application/json',
            },
        });
        if(upload.ok) {
            newQuizCreated(await upload.json());
        }
    }
}

export async function uploadJSON() {
    const jsonfile = await {filebutton}.filebutton.files[0].text();
    upload(jsonfile);
}

async function upload(jsonfile) {
    const upload = await fetch('/api/upload', {
        method: 'POST', // or 'PUT'
        body: jsonfile,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let uid = await upload.json();
    if(upload.ok === true) {
        ModalFunctions.hideModal();
        displayQuizzes();
        createToast("Quiz Uploaded Succesfully", deleteQuiz, "Undo", uid);
        } else {
        //Something went wrong!
    }
}



function newQuizCreated(uid) {
    ModalFunctions.hideModal();
    displayQuizzes();
    createToast("Quiz Uploaded Succesfully", deleteQuiz, "Undo", uid);
    setTimeout(function() {
        new Modal({id:'modal-link', type: 'info', title:'Quiz Link', params: uid, text: 'http://localhost:8080/quiz/' + uid + '/flow/'})
    },200);
}




// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


export function buildEditor(quizid) {
    new Screen({id: 'admin-edit-quiz', class: 'editScreen', title: 'Quiz Editor'});
    gatherDetails(quizid)
    editQuiz(quizid);
}

async function gatherDetails(quizid) {
    const questionnaire = await fetch('/api/quizzes/' + quizid);       
        if (questionnaire.ok) {
            let qData = await questionnaire.json();
            new Nav({id:"nav", title: "Edit " + qData[0].title, return: true});
        } else {
            qData = [{ msg: 'Failed to load cards' }];
            return;
        }
}

async function editQuiz(uid) {
    let check = document.querySelectorAll('.card-edit');
    check.forEach(element => {
        $('root').removeChild(element);
    });
    check = null;
    if(check === null) {
    const response = await fetch('/api/questions/' + uid);
        if (response.ok) {
            let questions = await response.json();
            let i = 1;
            questions.forEach(question => {
                let card = new EditCard({id: question.id, title: question.question, questionNum: i++, input: question.input, });
                $('root').append(card);
            });        
             //Create the object to iterate over:
             console.log(document.getElementsByTagName('input')[0].dataset.number);
        }
    }
    let card = new EditCard({id: 'add-question', type: 'add'})
    $('root').append(card);
}

export async function addQuestion() {
    const id = { id: uid }
    const upload = await fetch('/api/create/question', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(id),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let result = await upload.json();
    if(upload.ok) {
        editQuiz(uid);
        } else {
        //Something went wrong!
    }
}




export function changeQuestionType(el) {
    console.log(el)
}

    







































/************************************************************
 * 
 * RESPONSES VIEWER
 * 
 ***********************************************************/

let answerData;
let questions;
let quizInfo;
let quizLength;
let answerArray = [];

export async function viewResponses(uid) {
        const answerlist = await fetch('/api/answers/' + uid);
        if (answerlist.ok) {
            answerData = await answerlist.json();
        } else {
            answerData = [{ msg: 'Failed to load cards' }];
            return;
        }
        const response = await fetch('/api/questions/' + uid);
            if (response.ok) {
                questions = await response.json();
            } else {
                questions = [{ msg: 'Failed to load cards' }];
                createToast(questions[0].msg, FX.toastClear, "Close");
                return;
            }
        const quizdetails = await fetch('/api/quizzes/' + uid);
            if(quizdetails.ok) {
                quizInfo = await quizdetails.json();
            }
        generateResponsesPage(questions, answerData, quizInfo[0]);
}



function generateResponsesPage(questions, answerData, quizdetails) {
    answerArray = [];
    console.log(answerData)
    if(answerData.length != 0) quizLength = answerData[0].responses.length;
    new Screen({id: 'admin-response-quiz', class: 'editScreen'});
    new Nav({id:"nav", title: answerData.length + " Responses", type: 'response', return: true});
    let numberCount = 1;


    //Quiz details overview Card

    let detailsCard = new Card({id: 'details-card'});
        detailsCard.classList.add("card-linear");
    $('root').append(detailsCard);
    renderText(detailsCard, quizdetails.title, "h2");
    new Divider(detailsCard, "Quiz Information");

    if(answerData.length === 0) {
        renderText(detailsCard, "This quiz has not had any responses yet.");
        return;
    } else {
        if(quizdetails.allowback === false || quizdetails.allowback === null) {
            renderText(detailsCard, "The back button is disabled for this quiz.", "p");
        }
        if(quizdetails.timelimit != null) {
            renderText(detailsCard, "This quiz has a time limit of " + quizdetails.timelimit + "minutes.", "p");
        }
        let time = 0;
        answerData.forEach(answer => { time += answer.time; });
        time = time / answerData.length;
        renderText(detailsCard, "On average, this quiz takes " + parseInt(time)  + " seconds to complete.", "p");
    }




    questions.forEach(question => {
        let card = new Card({id: 'card-' + numberCount++, required: true});
            card.classList.add("card-linear");
        let text = renderText(card, question.question, 'label');
            text.classList.add('label');    
        new Divider(card, "Answers");

        if(question.input === 'multi-select' || question.input === 'single-select') {
            let optionContainer;
            for(let h =0; h < question.options.length; h++) {
                optionContainer = document.createElement('div');
                    optionContainer.classList.add('option-bar');
                    optionContainer.id = 'question-' + (numberCount - 1) + "-" + h;
                renderText(optionContainer, question.options[h], 'p');
                card.append(optionContainer);
            }
        }
        $('root').append(card);
        let answerObject = new Object ({
            qid: numberCount - 1,
            arr: []
        })
        answerArray.push(answerObject);
    });
    scrapeData(questions, answerData);
}


function scrapeData(questions, answerData) {
    for(let i = 0; i < answerData.length; i++) {
        for(let k = 0; k < answerData[i].responses.length; k++) {
            if(answerData[i].responses[k].type === 'checkbox' || answerData[i].responses[k].type === 'radio') {
                let object = answerArray[k];
                for(let j = 0; j < answerData[i].responses[k].choices[0].length; j++) {
                    let test = answerData[i].responses[k].choices[0][j];
                    object.arr.push(test);
                }
            }
            if (answerData[i].responses[k].type === 'text' || answerData[i].responses[k].type === 'number' || answerData[i].responses[k].type === '' ) {
                let list = document.createElement('p');
                console.log(answerData[i].responses[k])
                    list.textContent = answerData[i].responses[k].choices[0];
                renderList(answerData, k, list)
            }
        }
    }
    console.log(answerArray)
    renderBars(answerArray, questions, answerData);
}


function renderBars(answerArray, questions, answerData) {
    for(let i = 0; i < answerArray.length; i++) {
        if(questions[i].input === 'multi-select' || questions[i].input === 'single-select' ) {
            for(let j = 0; j < questions[i].options.length; j++) {
                    let span = document.createElement("span");
                    let tempArr = answerArray[i].arr.filter(value => value === questions[i].options[j]);
                        span.style.width = (tempArr.length / (answerData.length)) * 100 + "%";
                    $('question-' + (i + 1) + "-" + j).append(span);
                    renderText($('question-' + (i + 1) + "-" + j), parseInt(span.style.width) + "%");
           }
        }
    }
}

    
async function renderList(answerData, k, list) {

    let load = await $('card-' + (k + 1));
    if(load) {
        $('card-' + (k + 1)).append(list);
        
    }
}

