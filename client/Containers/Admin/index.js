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
import Fab from '../../Components/Fab/fab.js';
import QuizCard from '../../Components/QuizCard/quizcard.js';
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






// #endregion
// ////////////////////////////////////////////////////////////// Generate Quiz
// #region  Generate Quiz Setup

 /*************************
 * 
 * @param { Array } params 
 * 
 *************************/

export function generatePage(params) {
    Render.createToast("Welcome to the admin page", FX.toastClear, "Close");
    let nav = new Nav({id:'nav', title: "Administrator Console", links:['View Responses', 'Link 2', 'Link 3']});
    let fab = new Fab({id: "fab", name:"Next Question", action: "Quiz.up", param: +1, type: "next"})
    displayQuizzes(params);
}


//new Toggle({id:'toggletest'});
  


// #endregion
// ////////////////////////////////////////////////////////////// DISPLAY THE QUIZZES AVAILABLE ON THE DATABASE
// #region Display Available Quizzes


let quizListObject;

export async function displayQuizzes(params) {
    console.log(params);
    const questionnaire = await fetch('/api/quizlist/')
        if (questionnaire.ok) {
            quizListObject = await questionnaire.json();
        } else {
            quizListObject = [{ msg: 'Failed to load cards' }];
            return;
        }
        console.log(quizListObject);
        quizListObject.forEach(quiz => {
            let quizCard = new QuizCard({id: quiz.id, quizTitle: quiz.title, });
        });
}






    




