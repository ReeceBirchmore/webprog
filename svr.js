'use strict'


const express = require('express');
const path = require('path');
const app = express();
const q = require('./questionnaire');

const router = express.Router();


const port = 8080;

// app.use(express.static('client', { extensions: ['html'] }));




app.use('/api', router);


app.use(express.static(__dirname + '/client'))

// app.use('/assets', express.static(__dirname + '/client/Assets/avatar.png'));


// app.get('/assets/*', (req, res) => {
//   console.log(req.params[0], "PARAM REQUEST")
//   console.log(__dirname, "ASSETS ");
//   res.sendFile(path.join(__dirname, '/client/assets/' + req.params[0]));
// })

app.get('*', (req, res) => {
  console.log(req.params, "REQUEST");
  console.log(__dirname)
  res.sendFile(path.join(__dirname, '/client/index.html'))
})





async function getAllQuizzes(req, res) {
  const result = await q.listAllQuizzes();
  if(!result) {
    res.status(404).send('No Quizzes Found');
    return;
  }
  res.json(result);
}

  
async function getQuizzes(req, res) {
    const result = await q.getQuizDetails(req.params.id);
    if (!result) {
      res.status(404).send('No match for that ID.');
      return;
    }
    console.log(result);
    res.json(result);
}


async function getQuestions(req, res) {
  console.log("getting questions");
  const result = await q.listQuestions(req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}



async function submitQuiz(req, res) {
  console.log('Submitting');
  const result = await q.quizSubmission(req.body, req.params.id);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}


async function uploadQuiz(req, res) {
  console.log('uploading quiz', req);
  console.log(req.body);
  const result = await q.quizUpload(req.body);
  if (!result) {
    res.status(404).send('No match for that ID.');
    return;
  }
  res.json(result);
}

async function getAnswers(req, res) {
  const result = await q.getAnswerData(req.params.id);
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



  app.get('*/quizid/:id', asyncWrap(getQuizzes));
  router.get('/questions/:id', asyncWrap(getQuestions));
  router.get('/quizzes/:id', asyncWrap(getQuizzes));
  router.get('/answers/:id', asyncWrap(getAnswers));
  router.get('/quizlist', asyncWrap(getAllQuizzes));

  router.post('/submit/:id', express.json(), asyncWrap(submitQuiz));
  router.post('/upload', express.json(), asyncWrap(uploadQuiz));











app.listen(port);

  