DROP DATABASE IF EXISTS Quiz;


CREATE DATABASE Quiz;

CREATE TABLE IF NOT EXISTS Quizzes (
    id SERIAL PRIMARY KEY,
    title  text
);

CREATE TABLE IF NOT EXISTS Questions (
    id SERIAL PRIMARY KEY,
    question  TEXT,
    quesnumber INT,
    quizid TEXT,
    input TEXT,
    options TEXT,
    req BOOLEAN,
);



CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    answers  TEXT,
    quizid TEXT
);



INSERT INTO Quizzes (title) VALUES ("Test Quiz Numbero one");


INSERT INTO Quizzes (title) VALUES ("Pompey Reality Test");



INSERT INTO Questions (question, quizid) VALUES ("Are you gay", 1)



ALTER TABLE Quizzes ADD COLUMN quizid varchar(5);


question = text
quizid = INTEGER
options = [];
input = text

will need:
min
max
optional extras


INSERT INTO Quizzes (title, quizid) VALUES('Directional Quiz Example', '27JBU');


INSERT INTO Questions (question, quizid, input) VALUES('Is lybin fit?', '27JBU', 'text');
INSERT INTO Questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', 26JBU, 'text');
INSERT INTO Questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', 26JBU, 'text');
INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', 26JBU, 'text');
INSERT INTO Questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', 26JBU, '{That damned smile, his amazing body, his voice}', 'text');
INSERT INTO Questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', , 'range');
