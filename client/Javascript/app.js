'use strict'

let quizID;

import Card from '../Components/Card/card.js';
import Router from '../Javascript/router.js';
import NavBar from '../Containers/NavBar/navbar.js'
import * as Render from '../Javascript/render.js';


import { index } from '../Containers/Homepage/index.js';
import * as Quiz from '../Containers/Quiz/index.js';


//deploy a navbar to the screen
const Nav = new NavBar({id:"test"});





//Deploy the router
const router = new Router();

router.get('home', function(req, params) {
    index();
});
router.get('quiz/:id', function(req, params) {
    Quiz.generateQuiz(params);
});

/*
router.get('quiz/:id', function(req) {
    req.quizID;
    console.log(quizID);
    Quiz.generateDeck(quizID);
})
*/
router.init();

