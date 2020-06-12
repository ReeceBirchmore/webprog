'use strict';

// #endregion
// ////////////////////////////////////////////////////////////// REQUIRES
// #region Constants

const express = require('express');
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
app.use(express.static(__dirname + '/client'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});


// #endregion
// ////////////////////////////////////////////////////////////// FUNCTIONS
// #region Constants

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
    const result = await q.getQuiz(req.params.id);
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
    const result = await q.getAnswerData(req.params.id);
    console.log(result);
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
router.get('/quizzes', asyncWrap(getAllQuizzes));
router.get('/answers/:id', asyncWrap(getAnswers));

router.delete('/delete/quiz/:id', asyncWrap(deleteQuiz));
router.delete('/delete/question/:id/', asyncWrap(deleteQuestion));

router.put('/quizzes/update/:id', express.json(), asyncWrap(addOption));

router.post('/create/question/', express.json(), asyncWrap(addQuestion));
router.post('/create/quiz/', express.json(), asyncWrap(createQuiz));
router.post('/submit/:id', express.json(), asyncWrap(submitQuiz));
router.post('/upload', express.json(), asyncWrap(uploadQuiz));

app.listen(port);
