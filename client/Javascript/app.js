'use strict';

import Router from '../../Javascript/router.js';
import * as Quiz from '../Containers/Quiz/index.js';
import * as Admin from '../Containers/Admin/index.js';
import * as Response from '/Containers/Responses/index.js';
import * as Edit from '/Containers/Edit/index.js';

detectClickandTouch();
export const cursorCoords = {};
function detectClickandTouch() {
  window.addEventListener('click', function (e) {
    cursorCoords.x = e.pageX;
    cursorCoords.y = e.pageY;
  }, true);
}


const router = new Router({
  mode: 'hash',
  root: '/',
});

router
  .add(/about/, () => {
    alert('welcome in about page');
  })

  .add(/products\/(.*)\/specification\/(.*)/, (id, specification) => {
    alert(`products: ${id} specification: ${specification}`);
  })

  .add(/quiz\/(.*)\/flow/, (id) => {
    Quiz.generateQuiz({ id });
  })

  .add(/admin\/quiz\/edit\/(.*)/, (id) => {
    console.log(id);
    Edit.buildEditor(id);
  })

  .add(/admin\/quiz\/response\/(.*)/, (id) => {
    Response.viewResponses(id);
  })

  .add(/admin/, () => {
    Admin.generatePage();
  })

  .add('', () => {
    // general controller
    console.log('welcome in catch all controller');
  });
