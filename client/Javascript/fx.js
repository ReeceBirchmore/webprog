'use strict'


import Toast from '/Components/Toast/toast.js';

import * as Render from '../../Javascript/render.js';
import * as Quiz from '/Javascript/quiz.js';




/*************************************************************************
*
* Toast Notification Animation Management
*
**************************************************************************/

let linger;
let destroy;

export function toastManagement() {
    //Default show/hide code
    if(!Render.$('toast')) {  
        let toast = new Toast({id:'toast', text:"Quiz Submitted Succesfully", action: toastClear , actionText: "Close"})
    }

    setTimeout(function() {
    Render.$('toast').classList.add('appear');
    }, 100);

    linger = setTimeout(function() {
        console.log("Lingering")
        Render.$('toast').classList.add('remove'); 
        Render.$('toast').classList.remove('appear');
    }, 3000);

    destroy = setTimeout(function() {
        console.log("Destroyed")
        Render.$('root').removeChild(Render.$('toast'))
    }, 3500);


}

export function toastClear() {
    Render.$('toast').classList.add('remove'); 
    Render.$('toast').classList.remove('appear');

    setTimeout(function() {
        Render.$('root').removeChild(Render.$('toast'))
    }, 100);
}






/*************************************************************************
*
* Progress Bar Animation Management
*
**************************************************************************/


//Use hashtag question number to gather data and use that to fill the progress bar as appropriate
export function progressCheck(val) {
    let prog = Render.$('progressSpan');
    prog.style.width = (3 / (Quiz.quiz[1].questions.length)) * 100 + "%";
}


/*
    console.log(param);
    console.log(parseInt(value), "Value")
    console.log(value + param)
    value = value + param;
    let prog = Render.$('progressSpan');
    prog.style.width = ((value / Quiz.quiz[1].questions.length) * 100) + "%";
}*/