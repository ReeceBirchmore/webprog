'use strict';

import Router from '/Javascript/router.js';
import * as Quiz from '/Containers/Quiz/index.js';
import * as Admin from '/Containers/Admin/index.js';
import * as Response from '/Containers/Responses/index.js';
import * as Edit from '/Containers/Edit/index.js';


// Local Routing, add new pre-defined routes here
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

  .add(/quiz\/(.*)/, (id) => {
    Quiz.generateQuiz({ id });
  })

  .add(/admin\/edit\/(.*)/, (id) => {
    Edit.buildEditor(id);
  })

  .add(/admin\/response\/(.*)/, (id) => {
    Response.viewResponses(id);
  })

  .add(/admin/, () => {
    Admin.generatePage();
  })

  .add('', () => {
    location.replace('./#/admin');
  });
