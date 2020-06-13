


CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title  text,
    quizid text,
    allowback BOOLEAN,
    restrict BOOLEAN,
    enabled BOOLEAN
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question  TEXT,
    quizid TEXT,
    input TEXT,
    options TEXT [],
    min TEXT,
    max TEXT,
    required BOOLEAN
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    answers  TEXT,
    quizid TEXT
);


INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Hidden Back Button Demo', '26JBU', false, false, true );
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Disabled Questionnaire Demo', '27JBU', true, false, false);
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Required Questions Demo', '28JBU', true, false, true);
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Restricted Submissions Demo', '30JBU', true, true, false);
INSERT INTO quizzes (title, quizid, allowback, restrict, enabled) VALUES('Overview Demo', '31JBU', false, false, true );



INSERT INTO questions (question, quizid, input, required) VALUES('Is lybin fit?', '26JBU', 'text', true);
INSERT INTO questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '26JBU', 'text');
INSERT INTO questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '26JBU', 'text');
INSERT INTO questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '26JBU', 'text');
INSERT INTO questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '26JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');
INSERT INTO questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '26JBU', 'text');

INSERT INTO questions (question, quizid, input) VALUES('Is lybin fit?', '27JBU', 'text');
INSERT INTO questions (question, quizid, input) VALUES('Is Lybin honestly not the fittest character?', '27JBU', 'text');
INSERT INTO questions (question, quizid, input) VALUES('What would you rate Lybin out of 5?', '27JBU', 'text');
INSERT INTO questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '27JBU', 'text');
INSERT INTO questions (question, quizid, options, input) VALUES('What do you love the most about our lord Lybin?', '27JBU', '{That damned smile, his amazing body, his voice}', 'multi-select');
INSERT INTO questions (question, quizid, input) VALUES('How do you personally feel Lybin has shaped your world?', '27JBU', 'text');



INSERT INTO questions (question, quizid, input) VALUES('What is your name?', '31JBU', 'text');
INSERT INTO questions (question, quizid, input, min, max) VALUES('How old are you?', '31JBU', 'number', '30', '60');
INSERT INTO questions (question, quizid, input, required) VALUES('This is a required question, leave it blank and try to hit next!', '31JBU', 'text', true);
INSERT INTO questions (question, quizid, input) VALUES('I included this bad boy too, rate how sweet you think it is', '31JBU', 'range');
INSERT INTO questions (question, quizid, options, input) VALUES('What is your experience using this app?', '31JBU', '{Absolutely Amazing, Seen Better, God Awful}', 'single-select');
INSERT INTO questions (question, quizid, input) VALUES('What grade do you think this is worth?', '31JBU', 'range');
INSERT INTO questions (question, quizid, input) VALUES('When do I get my results back?', '31JBU', 'date');
