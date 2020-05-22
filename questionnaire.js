'use strict';
const config = require('./config');

const Postgres = require('pg').Client;


const sql = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'quiz',
  password: 'root',
  port: 5432,
});

sql.connect();

sql.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});


function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


async function listAllQuizzes() {
  try {
    const q = 'SELECT * FROM quizzes;';
    const result = await sql.query(q);
    return result.rows;
  } catch (error) {
    throw error;
  }
}


async function getQuizDetails(id) {
  try {
    const q = 'SELECT * FROM quizzes WHERE quizid = $1;';
    const result = await sql.query(q, [id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function listQuestions(quizid) {
  console.log(quizid);
  const q = 'SELECT * FROM questions WHERE quizid = $1 ORDER BY id ASC;';
  const result = await sql.query(q, [quizid]);
  console.log(result.rows);
  return result.rows;
}


async function quizSubmission(data, quizid) {
  console.log(data);
  const quizdata = JSON.stringify(data);
  const q = 'INSERT INTO answers (answers, quizid) VALUES( $1, $2) ';
  const result = await sql.query(q, [quizdata, quizid]);
  return result.rows;
}


async function quizUpload(data) {
  const title = data.name;
  const questionsArr = data.questions; // valid end datas, .id, .text, .type, .options(ARRAY)
  // Step 1, run the ID Generator
  const uid = makeid(5);
  // Step 2, create the quiz entry in the quizzes table
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title, uid]);
  // Step 3, insert the questions into the database
  questionsArr.forEach(async question => {
    const questionq = 'INSERT INTO questions (question, quizid, input, options) VALUES( $1, $2, $3, $4) ';
    const questionResult = await sql.query(questionq, [question.text, uid, question.type, question.options]);
  });
  return uid;
}


async function addAQuestion(quizid) {
  const uid = JSON.parse(quizid).id;
  console.log(uid);
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
    // const title = question.title;
    console.log(id);
    // Step 1. Update the questions type
    const typeq = 'UPDATE Questions SET input = $1 WHERE id = $2';
    const typeResult = await sql.query(typeq, [type, id]);
    // Update the Array of options
    const optionq = 'UPDATE Questions SET options = $1 WHERE id = $2';
    const optionResult = await sql.query(optionq, [option, id]);
  });
  return true;
}


async function deleteAQuiz(uid) {
  console.log(uid, 'PRINT');
  const quiz = 'DELETE from Quizzes where quizid = $1;';
  const result = await sql.query(quiz, [uid]);
  const question = 'DELETE FROM Questions WHERE quizid = $1;';
  const questionresult = await sql.query(question, [uid]);
  return true;
}


async function deleteAQuestion(uid) {
  console.log(uid, 'DELETED');
  const quiz = 'DELETE from Questions where id = $1;';
  const result = await sql.query(quiz, [uid]);
  return true;
}


async function generateNewQuiz(data) {
  const uid = makeid(5);
  const title = JSON.parse(data);
  const quizq = 'INSERT INTO Quizzes (title, quizid) VALUES ($1, $2)';
  const quizResult = await sql.query(quizq, [title.value, uid]);
  return uid;
}


async function getAnswerData(quizid) {
  console.log(quizid, 'PASSED QUIZ ID');
  const q = 'SELECT * FROM answers WHERE quizid =  $1;';
  const result = await sql.query(q, [quizid]);
  console.log(result.rows, 'RESULTS');
  const responses = [];
  result.rows.forEach(question => {
    responses.push(JSON.parse(question.answers));
    console.log('QUESTIONS', JSON.parse(question.answers));
  });
  console.log(responses, 'RESPONSES BIT');
  return responses;
}


module.exports = {
  getQuizDetails,
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
