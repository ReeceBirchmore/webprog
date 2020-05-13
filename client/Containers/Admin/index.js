'use strict'


import Card from '/Components/Card/card.js';
import SubmissionCard from '/Components/SubmissionCard/submissioncard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toast from '/Components/Toast/toast.js';
import Progress from '/Components/Progress/progress.js';
import QuestionNumber from '/Components/QuestionNumber/questionnumber.js';
import Modal from '/Components/Modal/modal.js';
import ModalContent from '/Components/Modal/modal-content.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import Fab from '../../Components/Fab/fab.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';

import { answers } from '/Components/Input/input.js';
import { filebutton, quiztitle } from '/Components/Modal/modal-content.js';


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

 let params;

export function generatePage(param) {
    console.log(param)
    params = param;
    Render.createToast("Quiz Submitted", FX.toastClear, "Undo");
    //let nav = new Nav({id:'nav', title: "Administrator Console", links:['View Responses', 'Link 2', 'Link 3']});
    //let fab = new Fab({id: "fab", name:"Next Question", action: "Quiz.up", param: +1, type: "next"})
    
    displayQuizzes(params);
    allowUpload();
}


//new Toggle({id:'toggletest'});
  


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes



let quizListObject;

export async function displayQuizzes(params) {
    const quizlist = await fetch('/api/quizlist/');
        if (quizlist.ok) {
            quizListObject = await quizlist.json();
        } else {
            quizListObject = [{ msg: 'Failed to load cards' }];
            return;
        }
        quizListObject.forEach(quiz => {
            let quizCard = new QuizCard({id: quiz.id, quizTitle: quiz.title, });
        });
    let createQuizButton = new QuizCard({id: 'card-create', option: 'create-quiz'});

}




export function createNewQuiz(title) {
  console.log(title)
}


import {textHolder} from '/Components/Input/input.js';




export async function uploadJSON() {
    console.log("Uploading")
    console.log({filebutton}.filebutton.files[0].text())
    const jsonfile = await {filebutton}.filebutton.files[0].text();
    upload(jsonfile);
}


async function upload(jsonfile) {
    await fetch('/api/upload', {
        method: 'POST', // or 'PUT'
        body: jsonfile,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(jsonfile)
    
}














function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
    
    

export async function uploadQuiz() {
    console.log(makeid(5));
}    


    




