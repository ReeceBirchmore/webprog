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

    Index.index();
    new Nav({id:"test"});
});


router.get('/quiz', function(req, params) {

    //new Nav({id:"Quiz"});
});

router.get('/quiz/:id/:type', function(req, params) {

    Quiz.generateQuiz(params);
});

router.get('/admin/edit/:id', function(req, params) {
    Admin.editQuiz(params[1]);
});

router.get('/admin', function(req, params) {
    if(req.path === '/admin') {
        Admin.generatePage(params);
    }
});


router.init();

