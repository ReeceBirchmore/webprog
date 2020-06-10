// let toast = new Toast({id:'toast', text:"Quiz Submitted Succesfully", action: FX.toastClear , actionText: "Close"})
// Render.render(toast, Render.$('root'));
// let quizCard = new QuizCard({id: 1, quizTitle: "Test Title", questions: "7", expire: "Test Date", author: "Test Author"});
// let progress = new Progress({id: "progressBar"})
// let qNum = new QuestionNumber({id: '1'});
// let card = new Card({id: Quiz.quiz[1].questions[1].id, title: Quiz.quiz[1].questions[1].text});
// let modal = new Modal({text: "Click to continue", title:"Example Questionnaire"})
// let btn = new Button({id: "test up progress", name:"Next Question 1", action: "progress", param: 1});
// let btn2 = new Button({id: "test down progress", name:"Previous Question 1", action: "progress", param: 0});
// let btn3 = new Button({id: "TEST2", name:"Previous Question", action: "toast"});





'use strict';

import { render, $ } from './client/Javascript/render.js';


// const navbar = {
//   'position': 'fixed',
//   'background-color': 'black',
//   'z-index': ' 10000',
//   'width': '100vw',
//   'height': '10%',
//   'display': 'flex',
//   'flex-direction': 'row',
//   'justify-content': 'space-between',
// };

// const profile = {
//   'background-color': 'white',
//   'z-index': ' 10000',
//   'width': '10vw',
//   'background-image': 'url("./assets/images/account.svg")',
// };



// #endregion
// ////////////////////////////////////////////////////////////// STYLE ELEMENTS
// #region Use Styling

/************************
 *
 * @param {Object} object
 *
 ************************/

function useStyles(object) {
  const styleString = (
    Object.entries(object).reduce((styleString, [propName, propValue]) => {
      // console.log(`${styleString}${propName}:${propValue};`);
      return `${styleString}${propName}:${propValue};`;
    }, '')
  );
  return styleString;
}

export default class Footer {
  constructor(props) {
    this.createFrame(props);
  }

  createFrame(props) {
    this.el = document.createElement('div');
    this.el.id = props.id;
    this.el.classList.add('footer');
    render(this.el, $('root'));
  }


  // Handle profile button TODELETE
  displayProfile(props) {
    this.profile = document.createElement('div');
    this.profile.id = props.id + 'Profile';
    // this.profile.setAttribute('style', useStyles(profile));
    // handleProfile(props);
    render(this.profile, this.el);
  }
}
