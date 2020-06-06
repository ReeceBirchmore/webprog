'use strict';

// #endregion
// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants

const express = require('express');
// const maintain = require('./coldstartdb');
const path = require('path');
const q = require('./questionnaire');

// #endregion
// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants
const app = express();
const router = express.Router();
const dev = express.Router();
const port = 8080;

app.use('/api', router);
app.use('/dev', dev);
app.use(express.static(__dirname + '/client'));

// app.use(express.static('client', { extensions: ['html'] }));
// app.use('/assets', express.static(__dirname + '/client/Assets/avatar.png'));
// app.get('/assets/*', (req, res) => {
//   console.log(req.params[0], "PARAM REQUEST")
//   console.log(__dirname, "ASSETS ");
//   res.sendFile(path.join(__dirname, '/client/assets/' + req.params[0]));
// })

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});


async function coldStart(req, res) {
    const result = await maintain.coldStart();
    res.json(result);

}



async function getAllQuizzes(req, res) {
  try {
    const result = await q.listAllQuizzes();
    res.json(result);
  } catch (error) {
    res.sendStatus(400);
  }
}


async function getQuizzes(req, res) {
  try {
    const result = await q.getQuizDetails(req.params.id);
    res.json(result);
  } catch (error) {
    res.sendStatus(400);
  }
}


async function getQuestions(req, res) {
  try {
    const result = await q.listQuestions(req.params.id);
    res.json(result);
  } catch (error) {
    res.sendStatus(400);
  }
}


async function submitQuiz(req, res) {
  try {
    const result = await q.quizSubmission(req.body, req.params.id);
    res.json(result);
  } catch (error) {
    res.sendStatus(400);
  }
}


async function uploadQuiz(req, res) {
  try {
    const result = await q.quizUpload(req.body);
    res.json(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}


async function createQuiz(req, res) {
  try {
    const result = await q.generateNewQuiz(JSON.stringify(req.body));
    res.json(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}


async function addQuestion(req, res) {
  try {
    const result = await q.addAQuestion(JSON.stringify(req.body));
    res.json(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}

async function addOption(req, res) {
  try {
    const result = await q.addAOption(JSON.stringify(req.body));
    res.json(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}



async function deleteQuiz(req, res) {
  try {
    const result = await q.deleteAQuiz(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}


async function deleteQuestion(req, res) {
  try {
    const result = await q.deleteAQuestion(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}


async function getAnswers(req, res) {
  try {
    console.log(req.params.id, 'params id')
    const result = await q.getAnswerData(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).send('No match for that ID.');
  }
}


function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}


router.get('/questions/:id', asyncWrap(getQuestions));
router.get('/quizzes/:id', asyncWrap(getQuizzes));
router.get('/answers/:id', asyncWrap(getAnswers));
router.get('/quizlist', asyncWrap(getAllQuizzes));
router.get('/delete/quiz/:id', asyncWrap(deleteQuiz));
router.get('/delete/question/:id/', asyncWrap(deleteQuestion));

router.post('/submit/:id', express.json(), asyncWrap(submitQuiz));
router.post('/create/quiz/', express.json(), asyncWrap(createQuiz));
router.post('/create/question/', express.json(), asyncWrap(addQuestion));
router.post('/create/option/:id', express.json(), asyncWrap(addOption));
router.post('/upload', express.json(), asyncWrap(uploadQuiz));


router.get('/newdb', asyncWrap(coldStart));
dev.get('/create', asyncWrap(coldStart));

app.listen(port);
