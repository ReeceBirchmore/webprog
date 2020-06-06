// Created on 07/02/2020
//
// This module is responsible for the cold-start operation of the
// system. This operation should be run anually to create all of
// the new boards

// ////////////////////////////////////////////////////////////// Create The Database


const Postgres = require('pg').Client;

// This can also be a connection string
// (in which case the database part is ignored and replaced with postgres)

const sql = new Postgres({
  user: 'postgres',
  host: 'localhost',
  database: 'template1',
  password: 'root',
  port: 5432,
});

sql.connect();

sql.on('error', (err) => {
  console.error('SQL Fail', err);
  sql.end();
});

sql.query('DROP DATABASE IF EXISTS quiz2;')
  .then(data => {
    console.log('successfully dropped');
    buildDB();
  })
  .catch(error => {
    console.log(error);
  });

function buildDB() {
  sql.query('CREATE DATABASE quiz3;')
    .then(data => {
      console.log('successfully created');
      quizzesTable();
    })
    .catch(error => {
      console.log(error);
    });
}

async function quizzesTable() {
  console.log('HELLO');
  const q = 'CREATE TABLE IF NOT EXISTS Quizzes (id SERIAL PRIMARY KEY, title  text, allowback BOOLEAN, quizid TEXT); CREATE TABLE IF NOT EXISTS Questions (id SERIAL PRIMARY KEY, question  TEXT, quesnumber INT, quizid TEXT, input TEXT, options TEXT, req BOOLEAN); CREATE TABLE IF NOT EXISTS answers (id SERIAL PRIMARY KEY, answers  TEXT, quizid TEXT);';
  const result = await sql.query(q);
  console.log(result);
}
