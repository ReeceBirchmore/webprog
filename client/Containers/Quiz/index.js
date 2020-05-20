'use strict'


import Card from '/Components/Card/card.js';
import SubmissionCard from '/Components/SubmissionCard/submissioncard.js';
import Button from '/Components/Button/button.js';
import Input from '/Components/Input/input.js';
import Toast from '/Components/Toast/toast.js';
import Progress from '/Components/Progress/progress.js';
import Footer from '/Components/Footer/footer.js';
import Nav from '/Components/Nav/nav.js';
import { options } from '/Components/Input/input.js';
import Screen from '/Components/Screen/screen.js';
import { $, render, renderText, createToast } from '../../Javascript/render.js';
import * as FX from '../../Javascript/fx.js';



// #endregion Imports
// ////////////////////////////////////////////////////////////// Generate Page Template
// #region  Generate Page Template

export const answers1 = { responses: [], time: '' } //The answer form built for submission!
export let j = 0; //Counter RENAME

//Variables to sort!
let qData; //Questionnaire Data pulled from database
let uid; //Quiz ID
let arrOfCards = [];  //All cards generated from the list of questions

let newArr = []; //cardStackArr
let questions; //Used to store questions array pulled from database

let startTime;
let endTime;




// #endregion Variables
// ////////////////////////////////////////////////////////////// GENERATE PAGE
// #region  Generate Quiz Setup

/****************************************************************
 * 
 *  This function will start the process of creating the screen,
 *  generating questions and sorting the card stack 
 * 
 ***************************************************************/

 /*************************
 * 
 * @param { Array } params
 * 
 *************************/

export function generateQuiz(param) {
    new Screen({id: 'quiz', class: 'quizScreen'});
    uid = param.id;
    j = 0;
    if(arrOfCards.length === 0) {
        generateQuestionnaire(uid);
        generateQuestions(uid)
    } else {
        generateQuestionnaire(uid);
        stackManager();
    }
    //Start the clock if timed!
    startTime = new Date();
}

// #endregion
// ////////////////////////////////////////////////////////////// GENERATE CARDS AND INPUTS
// #region Generate Cards and Inputs

/****************************************************************
 * 
 *  This function will start the process of pulling data from 
 *  the database in order for the quiz to display. 
 *  It also handles the generation of input, card and text 
 *  components
 * 
 ***************************************************************/

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
//let btn = new Button({id: "test up progress", name:"Next Question 1", action: "progress", param: 1});
//let btn2 = new Button({id: "test down progress", name:"Previous Question 1", action: "progress", param: 0});
//let btn3 = new Button({id: "TEST2", name:"Previous Question", action: "toast"});


/****************************************************************
 * 
 *  This function will start the process of pulling the data 
 *  from the database, dragging out quiz data (settings)
 * 
 ***************************************************************/

export async function generateQuestionnaire(uid) {
    const questionnaire = await fetch('/api/quizzes/' + uid);       
        if (questionnaire.ok) {
            qData = await questionnaire.json();
        } else {
            qData = [{ msg: 'Failed to load cards' }];
            return;
        }

        new Footer({id:'Footer'});
        if(qData[0].allowback != false ) { 
            new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer", type: "previous"});
        }
        new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer", type: "next"}); 
        new Progress({id: "progressBar"});    
}




/****************************************************************
 * 
 *  This function will start the process of pulling data from 
 *  the database in order for the questionnaire to display. 
 *  It also handles the generation of input, card and text 
 *  components
 * 
 ***************************************************************/

async function generateQuestions(uid) {
    const response = await fetch('/api/questions/' + uid);
        if (response.ok) {
            questions = await response.json();
            new Nav({id:"nav", length: questions.length, clear: true});
            let i = 1;
            questions.forEach(question => {
                let card = new Card({id: 'card-' + i++, required: true});
                    card.classList.add("card");
                let text = renderText(card, question.question, 'label');
                    text.classList.add('label');
                    text.setAttribute('for', 'input-question-' + i);
                let quesContainer = document.createElement('div');
                    quesContainer.classList.add('scroll-container');
                    card.append(quesContainer);
                if(question.options != null) {
                    for(let x = 0; x < question.options.length; x++) {
                        let input = new Input({id: 'input-' + x + '-question-' + i, type:  question.input, options: question.options[x], name: i, title: question.question, linkedQ: 3});
                            input.classList.add("input");
                        (quesContainer).appendChild(input);
                    }
                } else {
                    let input2 = new Input({id: 'input-question-' + i, type: question.input, title: question.question });
                        (quesContainer).appendChild(input2);
                }
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

function stackManager(val) {
//This entire section needs reworking
//Previous button handling! WILL NEED ITS OWN FUNCTION SOON
    if(j === 0 && $('prevbtn')) {
        $('prevbtn').disabled = true;
        $('prevbtn').classList.add('disabled');
    }
    else if($('prevbtn')) {
        $('prevbtn').disabled = false;
        $('prevbtn').classList.remove('disabled');
    }
    if(j != arrOfCards.length) {
        if($('submitbtn')) {
            $('nextbtn').style.display = 'block';
            $('submitbtn').style.display = "none";
        } 
        if($('envelopearticle')) {
            $('root').removeChild($('envelopearticle'));
        }
    }
    //Display all given answers and give option to submit quiz
    if(j === arrOfCards.length) {
        if($('submitbtn')) {
            $('submitbtn').style.display = 'block';
            $('nextbtn').style.display = 'none';
        } else {
            let submit = new Button({id: 'submitbtn', type: 'submit', action: 'submit'});
            $('nextbtn').style.display = 'none';
        }            
        if($('card-submit')) {
            $('card-submit').style.display = "block";
        } else {
            let submissioncard = new Card({id:'card-submit', answers: answers1.responses });
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
    if(val === 'shuffle') {
        if(arrOfCards) {
            newArr.push(arrOfCards[j], arrOfCards[j + 1], arrOfCards[j + 2]);
        }
        sortDeck();
        return;
    }
}





/****************************************************************
 * 
 *  These function will sort the card deck, styling each card as
 *  appropriate as well as appending new cards when required
 * 
 ***************************************************************/

function sortDeck() {
    for(let i = 0; i < newArr.length; i++) {
        if(newArr[i]) {
            newArr[i].style.zIndex = -i;
            newArr[i].classList.add("card-add");
            newArr[i].style.transform = "translateY(" + (i * - 2.5) + "%) scale(" + (1 - (0.1*i)) +")";          
            newArr[i].style.transitionDelay = 0.3 * i + "s";
        }
    }
    //Place the next card to be loaded in at the bottom of the deck
    nextCard();  
}

function nextCard() {
    if(arrOfCards[j + 2]) {
        $('root').appendChild(arrOfCards[j + 2]);
    }
}












/****************************************************************
 * 
 *  This function will handle the answers, when the next button
 *  is pressed it calls upon this function to do the following:
 * 
 *  - Create a new object
 *  - Use exported data from input.js to fill in the object
 *  - Push the object into an array named Answers
 * 
 ***************************************************************/

function handleAnswers() {
    //Answer object to be created to store user data
    let response = new Object({
        qid: j + 1,
        choices: (options.choices.length === 0) ? ['No Answer'] : [options.choices],
        title: questions[j].question,
        type: options.type
    });

    //Find if the object already exists in the array (User returning to edit question)
    let inputIndex = answers1.responses.findIndex((question => question.qid == j + 1))
    if(inputIndex === -1 ) {   
        answers1.responses.push(response);
    } else {
        if(options.choices.length != 0) {
            answers1.responses[inputIndex].choices = [options.choices];
        }
    }

    //Directional Quizzing, place counter to directional quiz question number
    if(options.linkedQ) j = options.linkedQ;

    //Clear the choices array again ready for the next question
    options.choices = [];
    options.type = '';
}


/****************************************************************
 * 
 *  These functions will handle the direction of the stack, by
 *  increase a counter 'J' the application is able to keep track
 *  of what question the user should be on.
 * 
 ***************************************************************/

export function increase() {
    //Detect if the question is required and filled in as appropriate
    //Once data is fully validated, store answers
    // if(arrOfCards[j].dataset.required === 'true' && options.choices.length === 0) {
    //     console.log("REQUIRED QUESTION");
    // } else {
        //Answer handling function
        handleAnswers();
        //Increase the card stack pointer count
        //Add the remove class to the topmost card, 
        //Call upon the stackManager function to increase the deck
        //Increase Progress
        if(j < arrOfCards.length) {
            j++;
            $('card-' + j).classList.add('card-remove');
            stackManager('shuffle');
            FX.progressCheck(j, arrOfCards.length + 1);
        }
}

export function decrease() {
    //Remove the remove class to the topmost card, bring it back up
    //Decrease the card stack pointer count
    //Remove the bottommost card from the deck
    //Call upon the stackManager function to decrease the deck
    //Decrease Progress
    if(j != 0) {
        $('card-' + j).classList.remove('card-remove');
        j--;
        if(arrOfCards[j + 3]) {
            $('root').removeChild(arrOfCards[j + 3]);
        }
        stackManager('shuffle');
        FX.progressCheck(j, arrOfCards.length + 1);
    }
}


/****************************************************************
 * 
 *  This function will allow the user to submit the questionnaire
 *  It will take the data from the answers array, stringify it 
 *  and send it to the backend to be processed and posted onto
 *  the database.
 * 
 ***************************************************************/


function downloadCSV(args) {
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSV({
        data: answers1.responses
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}


//SORT OUT
function timeDifference() {
    let endTime = new Date();
    answers1.time = -diff_minutes(startTime, endTime);
}
function diff_minutes(dt2, dt1) {
  var diff =(dt2 - dt1) / 1000;
  return (diff);  
}




export async function submitQuiz() {
    FX.submitAnimation();
    timeDifference();
    await fetch('/api/submit/' + uid, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(answers1),
        headers: {
            'Content-Type': 'application/json',
        },
    });
        //CHANGE THIS
        let link = document.createElement('p');
        link.addEventListener('click', function() {
            downloadCSV({ filename: qData[0].title + ".csv" });
        });
        link.classList.add('result-message-sent');        
        link.textContent = "Tap here to download your answers";
        $('root').appendChild(link)
}



function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });
    return result;
}






    /**
 * Take an array of objects of similar structure and convert it to a CSV.
 * @source     https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
 * @modifiedBy sators
 * @param      {Array}  options.data            Array of data
 * @param      {String} options.columnDelimiter Column separator, defaults to ","
 * @param      {String} options.lineDelimiter   Line break, defaults to "\n"
 * @return     {String}                         CSV
 */
export default ({data = null, columnDelimiter = ",", lineDelimiter = "\n"}) => {
	let result, ctr, keys

	if (data === null || !data.length) {
		return null
	}

	keys = Object.keys(data[0])

	result = ""
	result += keys.join(columnDelimiter)
	result += lineDelimiter

	data.forEach(item => {
		ctr = 0
		keys.forEach(key => {
			if (ctr > 0) {
				result += columnDelimiter
			}

			result += typeof item[key] === "string" && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key]
			ctr++
		})
		result += lineDelimiter
	})

	return result
}