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



async function listQuizzes() {
  console.log("Quizzes");
  const q = 'SELECT * FROM quizzes LIMIT 10;';
  const result = await sql.query(q);
  return result.rows;
}


async function listOptions(questionid) {
  console.log("options", questionid);
  const q = 'SELECT * FROM options WHERE quizid = $1;';
  const result = await sql.query(q, [questionid]);
  return result.rows;
}


async function listQuestions(quizid) {
  console.log("questions");
  const q = 'SELECT * FROM questions WHERE quizid = $1;';
  const result = await sql.query(q, [quizid]);
  return result.rows;
}


module.exports = {
  listQuizzes,
  listQuestions,
  listOptions,
};