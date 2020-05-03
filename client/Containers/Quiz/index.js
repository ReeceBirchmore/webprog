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
    console.log(params)
    //generateDeck(quizID, mode);
    generateQuestionObjects(params);


    //displayCards(Quiz.quiz[quizID].questions);
    // cardGeneration(quizID, mode);
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
const stack = [];

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

/*
function cardGeneration(quizID, mode) {
    quizObject = Quiz.quiz[quizID];
    for(let i = 0; i < quizObject.questions.length; i ++) {        
        //let qNum = new QuestionNumber({id: i});
        //Work on seperating text generation from the card to the rendering file! The card should NOT handle rendering text
        let card = new Card({id: 'card' + quizObject.questions[i].id, title: quizObject.questions[i].text});
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
*/


/*************************************************************************
*
* Generate the all cards for the screen (REDUNDANT)
*
**************************************************************************/

let maxCards = 3; //Maximum cards to show on screen
export let cardCount;



function displayCards(questions) {
    let count = 0;
    //Generate the cards, push cards into arrOfCards
    questions.forEach(question => {
        console.log(question)
        let card = new Card({id: 'card-' + count, title: question.text });
            card.classList.add("card");
            count = count + 1;
            card.id = "card-" + count;
        arrOfCards.push(card);

        let input = new Input({id: question.id, type: question.type});
        arrOfInputs.push(input);


    });
    cardCount = 1;
    cardStacking(questions);
}











/*************************************************************************
*
* Shuffle cards about to ensure consistent pile layout (REDUNDANT)
*
**************************************************************************/


export function addCard(count) {
    console.log("Add a card");
    Render.$('root').appendChild(arrOfCards[count]);
    arrOfCards[count].style.marginTop = (-count * 5) + "%";
    arrOfCards[count].style.zIndex = -count;
}





/*************************************************************************
*
* Get all questions from the server, attach to a card and build
*
**************************************************************************/



function generateQuestionObjects(params) {
    console.log(params[1]);
    if(params[1] === 'flow') {
        prev = new Button({id: "prevbtn", name:"Previous Question", action: "Quiz.down", param: -1, render: "Footer"});
        next = new Button({id: "nextbtn", name:"Next Question", action: "Quiz.up", param: +1, render: "Footer"}); 
    }
    console.log(params);
    generateQuestions(params);
    let progress = new Progress({id: "progressBar"})
}


async function generateQuestions(params) {
    console.log(params)
    //Fetch all questions related to the parameter given in the URL
    const response = await fetch('../../api/questions/' + params[0]);
    console.log(params)
        let questions;
        if (response.ok) {
            questions = await response.json();
            let i = 1;
            questions.forEach(question => {
                let card = new Card({id: 'card-' + i++, title: question.question });
                    card.classList.add("card");
                arrOfCards.push(card);
                return arrOfCards;
            });
            cardStacking();
            generateOptions(params);
            return;
        } else {
            questions = [{ msg: 'Failed to load cards' }];
            Render.createToast(questions[0].msg, FX.toastClear, "Close");
            return;
        }
}




async function generateOptions(params) {
    const optionlist = await fetch('../../api/option/' + params[0]);
            let options;
            if(optionlist.ok) {
                options = await optionlist.json();
                //For multiple option types
                options.forEach(option => {
                    let input = new Input({id: 'card-' + option.questionid, title: option.option, type: option.type });
                        input.classList.add("input");
                    //Render.$('card-' + option.questionid).appendChild(input);
                });
                return options;
            } else {
                options = [{ msg: 'Failed to load options'}];
                Render.createToast(questions[0].msg, FX.toastClear, "Close");
                return;
            }
}


/*************************************************************************
*
* Stack the cards into a neat pile of viewable cards
*
**************************************************************************/


function cardStacking() {
    for(let i = 0; i < arrOfCards.length; i++) {
        arrOfCards[i].style.marginTop = (-i * 5) + "%";
        arrOfCards[i].style.zIndex = -i;
    }
    for(let i = 0; i < 3; i++) {
        stack.push(arrOfCards[i]);
        console.log(stack);
        Render.$('root').appendChild(stack[i]);
    }
    
}



function stackManager() {
    //only allow up to 4 cards in the stack by adding to the start and end

    let length = stack.length;

    stack.shift();
        console.log(stack);
        console.log(j);

    stack.push(arrOfCards[(j + 2)]);
        console.log(stack);


    
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




/*************************************************************************
*
* Sort stack, ensure consistency within pile, up/down functions
*
**************************************************************************/


let j = 0;


export function increase() {
    //Render.removeRender(Render.$('card'));
    j++;
    //Move topmost card down below screen view
    Render.$('card-' + j).classList.add('card-remove');
    stackManager();


    //Shuffle next 3 cards down (staggered delay to add)
    for(let i = 0; i < 3; i++) {
        if(arrOfCards[i + j]) {
            arrOfCards[i + j].style.marginTop = (-i * 5) + "%";
        } else {
            console.log("Card does not exist");
        }
    }
    //Insert a new card at the bottom of the deck, have it animate
    if(arrOfCards[j + 2]) {
        Render.$('root').appendChild(arrOfCards[j + 2]);
    }
    


    

    FX.progressCheck(j, arrOfCards.length + 1);
    console.log(j);
    //Render.render(arrOfCards[j], Render.$('root'));
    //Render.render(arrOfInputs[j], arrOfCards[j]);
}

export function decrease() {
        
    if(j != 0) {
        console.log(j);
        Render.$('root').appendChild(arrOfCards[j]);
        Render.$('card-' + j).classList.remove('card-remove');


        //Remove the bottom card from the deck
        stackManager();

        //shuffle 3 cards back up

        for(let i = 0; i < 3; i++) {
            if(arrOfCards[i - j]) {
                arrOfCards[i - j].style.marginTop = (-i * 5) + "%";
            } else {
                console.log("Card does not exist");
            }
        }


        j--;
        FX.progressCheck(j, arrOfCards.length + 1);
        
        
        
        
        // Render.render(arrOfCards[j], Render.$('root'));
        // Render.render(arrOfInputs[j], arrOfCards[j]);
    }



}





export function animateStack(cardCount, operand) {
    if(operand > 1) {
        Render.$('card' + cardCount).classList.remove("cardFlip");
        cardCount = cardCount + 1;
    } else {
        cardCount = cardCount - 1;

        Render.$('card' + cardCount).classList.remove("cardFlip");
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

    




