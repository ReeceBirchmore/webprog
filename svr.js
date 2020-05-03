'use strict'


const express = require('express');
const app = express();
const q = require('./questionnaire');

const router = express.Router();


const port = 8080;

app.use(express.static('client', { extensions: ['html'] }));



async function getMessages(req, res) {
    res.json(await q.listMessages());
  }

async function getQuizzes(req, res) {
    const result = await q.listQuizzes(req.params.id);
    if (!result) {
      res.status(404).send('No match for that ID.');
      return;
    }
    res.json(result);
}


async function getQuestions(req, res) {
  console.log("getting questions");
  const result = await q.listQuestions(req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  console.log(result);
  res.json(result);
}


async function getOptions(req, res) {
  console.log("getting options");
  const result = await q.listOptions(req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}



function asyncWrap(f) {
    console.log("async Wrap");
    return (req, res, next) => {
        Promise.resolve(f(req, res, next))
            .catch((e) => next(e || new Error()));
    };
}




  app.get('*/api/messages', asyncWrap(getMessages));
  app.get('*/quizid/:id', asyncWrap(getQuizzes));
  app.get('*/api/questions/:id', asyncWrap(getQuestions));
  app.get('*/api/option/:id', asyncWrap(getOptions));












// app.use('*/api', router);
app.use('*', express.static("client"));
// router.get('/yeet', asyncWrap(getMessages));
// router.get('/quiz', function() { console.log("test");})






//var msg = require('./homepage.js');

/*

const router = express.Router();
app.use(express.static('client'));

/*app.use('/api', router);
app.use('*', express.static('client'));

router.get('yeet', (req, res) => console.log("ERERERE"));
*/


app.listen(port);

  