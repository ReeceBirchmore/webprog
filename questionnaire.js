'use strict';


// ////////////////////////////////////////////////////////////// CONSTANTS
// #region Constants


const Postgres = require('pg').Client;


// // //#endregion
// // ////////////////////////////////////////////////////////////// Connect to the Database
// // ////#region This module will connect to the db

const sql = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'quiz',
  password: 'root',
  // password: 'secret123',
  port: 5432,
});

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
  console.table(data);
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
  const result = await sql.query(quiz, [uid]);
  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  const questionresult = await sql.query(question, [uid]);
  return true;
}

// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE CREATE
// // #region Upload/Generate A Questionnaire

async function quizUpload(data) {
  // Step 1, run the ID Generator
  const uid = makeid(5);
  // Step 2, create the quiz entry in the quizzes table
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  await sql.query(quizq, [data.name, uid]);
  // Step 3, insert the questions into the database
  data.questions.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function generateNewQuiz(data) {
  const uid = makeid(5);
  const title = JSON.parse(data);
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  await sql.query(quizq, [title.value, uid]);
  return uid;
}


// // #endregion
// // ////////////////////////////////////////////////////////////// QUESTIONNAIRE EDITING
// // #region Edit Questionnaire

async function addAQuestion(quizid) {
  const uid = JSON.parse(quizid).id;
  const q = 'INSERT INTO Questions (quizid) VALUES($1) ';
  const result = await sql.query(q, [uid]);
  console.log(result.rows);
  return result.rows;
}


async function addAOption(optiondata) {
  const data = JSON.parse(optiondata).arr;
  data.forEach(async question => {
    const option = question.option;
    const id = question.id;
    const type = question.type;
    // Step 1. Update the questions type
    const typeq = 'UPDATE Questions SET input = $1 WHERE id = $2';
    await sql.query(typeq, [type, id]);
    // Update the Array of options
    const optionq = 'UPDATE Questions SET options = $1 WHERE id = $2';
    await sql.query(optionq, [option, id]);
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
  console.log(responses);
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
  addAOption,
};
