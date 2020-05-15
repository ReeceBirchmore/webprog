'use strict'


import EditCard from '/Components/Card/editcard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Modal from '/Components/Modal/modal.js';
import * as ModalFunctions from '/Components/Modal/modal.js';
import ModalContent from '/Components/Modal/modal-content.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import Fab from '../../Components/Fab/fab.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';

import { answers } from '/Components/Input/input.js';
import { filebutton } from '/Components/Modal/modal-content.js';


import * as Quiz from '/Javascript/quiz.js';
import * as Render from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';

//import Footer from '../../Components/Footer/footer.js';



// #endregion
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template


//let screen = new Screen({id: 'quiz'});
// let footer = new Footer({id:'Footer'});






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
    Render.$('root').classList.add('adminScreen');
    Render.$('root').classList.remove('screenDefault');
    console.log(param)
    params = param;
    new Nav({id:'nav', title: "Administrator Console", links:['View Responses', 'Link 2', 'Link 3']});
    displayQuizzes(params);
}


//new Toggle({id:'toggletest'});
  


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes



let quizListObject;
export async function displayQuizzes() {
    console.log("List all quizzes")
    let check = document.querySelectorAll('.card-quiz-list');
    check.forEach(element => {
        Render.$('root').removeChild(element);
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
    new Fab({id: "fab", name:"Next Question", action: "Quiz.up", type: 'create'});
    //new QuizCard({id: 'card-create', option: 'create-quiz', type: 'create'});
}








export async function deleteQuiz(uid, quiztitle) {
    let title = (!quiztitle) ? "Quiz Deleted" : quiztitle + " Deleted";
    const deleteQuiz = await fetch('/api/delete/quiz/' + uid);
    if (deleteQuiz.ok) {
        displayQuizzes();
        Render.createToast(title, FX.toastClear, "Close");
    } else {
        //Code if it failed here
        return;
    }
}



export async function createNewQuiz(value) {
    let title = { value }
    console.log(title)
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
        Render.createToast("Quiz Uploaded Succesfully", deleteQuiz, "Undo", uid);
        setTimeout(function() {
            new Modal({id:'modal-link', type: 'info', title:'Quiz Link', params: uid, text: 'http://localhost:8080/quiz/' + uid + '/flow/'})
        },200)
        } else {
        //Something went wrong!
    }
}



function newQuizCreated(uid) {
    ModalFunctions.hideModal();
    displayQuizzes();
    Render.createToast("Quiz Uploaded Succesfully", deleteQuiz, "Undo", uid);
    setTimeout(function() {
        new Modal({id:'modal-link', type: 'info', title:'Quiz Link', params: uid, text: 'http://localhost:8080/quiz/' + uid + '/flow/'})
    },200);
}

























export async function editQuiz(uid) {

    const quizlist = await fetch('/api/questions/' + uid);
            if (quizlist.ok) {
                quizListObject = await quizlist.json();
            } else {
                quizListObject = [{ msg: 'Failed to load cards' }];
                return;
            }
            // quizListObject.forEach(quiz => {
            //     new QuizCard({id: quiz.quizid, quizTitle: quiz.title, type: 'quiz', uid: quiz.quizid});
            // });
    

    const response = await fetch('/api/questions/' + uid);
    console.log(response)
        let questions;
        if (response.ok) {
            questions = await response.json();
            console.log(questions)
            let i = 1;
            questions.forEach(question => {
                let card = new EditCard({id: 'card-' + i++, title: question.question, questionNum: i - 1 });
                Render.$('root').append(card);


            });        



}

}

    




