'use strict'


import EditCard from '/Components/Card/editcard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toggle from '/Components/Input/Toggle.js';
import Modal from '/Components/Modal/modal.js';
import * as ModalFunctions from '/Components/Modal/modal.js';
import ModalContent from '/Components/Modal/modal-content.js';
import Nav from '/Components/Nav/nav.js';
import Fab from '../../Components/Fab/fab.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';
import Screen from '/Components/Screen/screen.js';

import { answers } from '/Components/Input/input.js';
import { filebutton } from '/Components/Modal/modal-content.js';


import * as Quiz from '/Javascript/quiz.js';
// import * as Render from '../../Javascript/render.js';

import { $, createToast } from '/Javascript/render.js';
import * as FX from '../../Javascript/fx.js';




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
    new Screen({id: '1', class: 'adminScreen'});
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
        console.log($('root'), "TEST");
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
// ////////////////////////////////////////////////////////////// SHARE
// #region Share Quizzes


export function buildSharePage(quizid) {
    uid = quizid;
    new Screen({id: 'admin-edit-quiz', class: 'adminScreen'});
    new Nav({id:'nav', title: "Share Quiz", close: true});
}





// #endregion
// ////////////////////////////////////////////////////////////// EDIT
// #region Edit Quizzes


export function buildEditor(quizid) {
    uid = quizid;
    new Screen({id: 'admin-edit-quiz', class: 'adminScreen'});
    new Nav({id:'nav', title: "Editing Quiz", return: true});
    editQuiz(quizid);
}


export async function editQuiz(uid) {
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
                console.log(i)
                let card = new EditCard({id: question.id, title: question.question, questionNum: i++, input: question.input, });
                $('root').append(card);
            });        
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

    




