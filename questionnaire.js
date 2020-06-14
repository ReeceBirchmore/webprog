/* eslint-disable no-new-object */
'use strict';


// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants


const Postgres = require('pg').Client;
const config = require('./config.json');
const sql = new Postgres(config);
sql.connect();


// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE ID GENERATION
// // #region Generate Quiz ID

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// // #endregion
// // ////////////////////////////////////////////////////////////// LIST QUESTIONNAIRES
// // #region Fetch Quiz Details

async function listAllQuizzes() {
  const q = 'SELECT * FROM quizzes;';
  const result = await sql.query(q);
  return result.rows;
}


async function getQuiz(id) {
  const q = 'SELECT * FROM quizzes WHERE quizid = $1;';
  const result = await sql.query(q, [id]);
  return result.rows;
}


// // #endregion
// // ////////////////////////////////////////////////////////////// LIST QUESTIONS
// // #region Questions Gathering

async function listQuestions(quizid) {
  const q = 'SELECT * FROM questions WHERE quizid = $1 ORDER BY id ASC;';
  const result = await sql.query(q, [quizid]);
  return result.rows;
}

// // #endregion
// // ////////////////////////////////////////////////////////////// SUBMIT QUESTIONNAIRE
// // #region Submit Questionnaire

async function quizSubmission(data, quizid) {
  const quizdata = JSON.stringify(data);
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [quizdata, quizid]);
  return result.rows;
}


// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE DELETE
// // #region Delete A Questionnaire


async function deleteAQuiz(uid) {
  const quiz = 'DELETE from Quizzes where quizid = $1;';
  await sql.query(quiz, [uid]);

  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  await sql.query(question, [uid]);
  return true;
}

// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE CREATION
// // #region Upload/Generate A Questionnaire

async function quizUpload(data) {
  // Step 1, run the ID Generator
  const uid = makeid(10);
  // Step 2, create the quiz entry in the quizzes table
  const allowBack = (!!((data.allowBack === undefined || data.allowBack === true)));
  const restrict = ((data.restrict === true));
  const enabled = (!!((data.enabled === undefined || data.enabled === true)));
  const quizq = 'INSERT INTO Quizzes (title, quizid, allowback, restrict, enabled) VALUES ($1, $2, $3, $4, $5)';
  await sql.query(quizq, [data.name, uid, allowBack, restrict, enabled]);
  // Step 3, insert the questions into the database
  data.questions.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function generateNewQuiz() {
  const uid = makeid(10);
  const title = 'Untitled Questionnaire';
  const t = true;
  const f = false;
  const quizq = 'INSERT INTO Quizzes (title, quizid, allowback, restrict, enabled) VALUES ($1, $2, $3, $4, $5)';
  await sql.query(quizq, [title, uid, t, f, t]);
  return uid;
}


// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE EDITING
// // #region Edit Questionnaire

async function addAQuestion(quizid) {
  const uid = quizid;
  const q = 'INSERT INTO Questions (quizid) VALUES($1) RETURNING id';
  const result = await sql.query(q, [uid]);
  return result.rows;
}


async function saveQuestionnaire(optiondata) {
  // Declare all the variables for simplification
  const data = JSON.parse(optiondata).arr;
  console.log(data[0])
  const quizid = data[0].id;
  const title = data[0].quiztitle;
  const enabled = Boolean(data[0].enabled);
  const restricted = Boolean(data[0].restricted);
  const allowBack = Boolean(data[0].allowback);
  const questionnaireq = 'UPDATE Quizzes SET title = $1, enabled = $2, restrict = $3, allowback = $4 WHERE quizid = $5';
  await sql.query(questionnaireq, [title, enabled, restricted, allowBack, quizid]);
  data.forEach(async question => {
    console.log(question)
    if (question.deleted === true) {
      const id = parseInt(question.id);
      const remove = 'DELETE FROM Questions WHERE id = $1';
      await sql.query(remove, [id]);
    } else {
      console.log(parseInt(question.min), question.min, '[parsed not parsed]');
      let id = parseInt(question.id, 10);
      const option = question.options;
      const type = question.type;
      const title = question.title;
      const required = Boolean(question.required);
      // const min = (question.min !== null) ? parseInt(question.min) : 0;
      // const max = (question.max !== null) ? parseInt(question.max) : 0;
      const updateq = 'UPDATE Questions SET input = $1, options = $2, question = $3, required = $4 WHERE id = $5';
      await sql.query(updateq, [type, option, title, required, id]);
    }
  });
  return true;
}

async function deleteAQuestion(uid) {
  const quiz = 'DELETE from Questions where id = $1;';
  await sql.query(quiz, [uid]);
  return true;
}


// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE RESPONSES
// // #region Questionnaire Responses

async function getAnswerData(quizid) {
  const q = 'SELECT * FROM Answers WHERE quizid =  $1;';
  const result = await sql.query(q, [quizid]);
  const responses = [];
  result.rows.forEach(question => {
    responses.push(JSON.parse(question.answers));
  });
  return responses;
}

// // #endregion
// // ////////////////////////////////////////////////////////////// EXPORTS
// // #region Exports

module.exports = {
  getQuiz,
  listQuestions,
  quizSubmission,
  getAnswerData,
  listAllQuizzes,
  quizUpload,
  deleteAQuiz,
  generateNewQuiz,
  deleteAQuestion,
  addAQuestion,
  saveQuestionnaire,
};
