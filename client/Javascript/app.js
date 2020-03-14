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



router.get('home', function(req) {
    //const newCard = new Card({id:"test2"});
    index();
});
router.get('quiz', function(req, quizID) {
    console.log(req)
    //const newCard = new Card({id:"test2"});
    console.log(req)
    Quiz.generateDeck(quizID);
});

/*
router.get('quiz/:id', function(req) {
    req.quizID;
    console.log(quizID);
    Quiz.generateDeck(quizID);
})
*/
router.init();

