'use strict'

let quizID;

import Router from '../Javascript/router.js';
import Nav from '../Components/Nav/nav.js'
import * as Render from '../Javascript/render.js';


import * as Index from '../Containers/Homepage/index.js';


import * as Quiz from '../Containers/Quiz/index.js';
import * as Admin from '../Containers/Admin/index.js';





//Deploy the router
const router = new Router();

router.get('home', function(req, params) {
    console.log(req);
    console.log(params);
    Index.index();
    new Nav({id:"test"});
});


router.get('/quiz', function(req, params) {
    console.log(req);
    console.log(params);
    //new Nav({id:"Quiz"});
});

router.get('/quiz/:id/:type', function(req, params) {
    console.log(req);
    console.log(params);
    Quiz.generateQuiz(params);
});

router.get('admin', function(req, params) {
    Admin.generatePage();
});


router.init();

