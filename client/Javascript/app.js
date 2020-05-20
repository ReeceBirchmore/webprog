'use strict'

let quizID;

import Router from '../../Javascript/router.js';
import Nav from '../Components/Nav/nav.js'
import * as Render from '../Javascript/render.js';


import * as Index from '../Containers/Homepage/index.js';


import * as Quiz from '../Containers/Quiz/index.js';
import * as Admin from '../Containers/Admin/index.js';


detectClickandTouch();


export const cursorCoords = new Object()

function detectClickandTouch() {
  window.addEventListener('click', function(e) {
    cursorCoords.x = e.pageX;
    cursorCoords.y = e.pageY;
    
    }, true);
}

















const router = new Router({
    mode: 'hash',
    root: '/'
  });


  router


  .add(/about/, () => {
    alert('welcome in about page');
  })

  .add(/products\/(.*)\/specification\/(.*)/, (id, specification) => {
    alert(`products: ${id} specification: ${specification}`);
  })

  .add(/quiz\/(.*)\/flow/, (id) => {
    Quiz.generateQuiz({id});
  })

  .add(/admin\/quiz\/edit\/(.*)/, (id) => {
    Admin.buildEditor(id);
  })

  .add(/admin\/quiz\/response\/(.*)/, (id) => {
    Admin.viewResponses(id);
  })

  .add(/admin/, () => {
    Admin.generatePage();
  })

  .add('', () => {
    // general controller
    console.log('welcome in catch all controller');
  });



// //Deploy the router
// export const router = new Router();

// router.get('home', function(req, params) {

//     Index.index();
//     new Nav({id:"test"});
// });


// router.get('/quiz', function(req, params) {

//     //new Nav({id:"Quiz"});
// });

// router.get('/quiz/:id/:type', function(req, params) {

//     Quiz.generateQuiz(params);
// });

// router.get('/admin/quiz/edit/:id', function(req, params) {
//     Admin.editQuiz(params[1]);
// });

// router.get('/admin', function(req, params) {
//     if(req.path === '/admin/') {
//         Admin.generatePage(params);
//     }
// });


// router.init();

