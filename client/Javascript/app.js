'use strict'

let quizID;

import Router from '../Javascript/router.js';
import NavBar from '../Containers/NavBar/navbar.js'
import * as Render from '../Javascript/render.js';


import { index } from '../Containers/Homepage/index.js';


import * as Quiz from '../Containers/Quiz/index.js';
import * as Admin from '../Containers/Admin/index.js';


//deploy a navbar to the screen
const Nav = new NavBar({id:"test"});





//Deploy the router
const router = new Router();

router.get('home', function(req, params) {
    console.log(req);
    console.log(params);
    //index();
});

router.get('/quiz/:id', function(req, params) {
    console.log(req);
    console.log(params);
    Quiz.generateQuiz(params);
});

router.get('admin', function(req, params) {
    Admin.generatePage();
});


router.init();

