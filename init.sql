


CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title  text,
    quizid text,
    allowback BOOLEAN
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question  TEXT,
    quizid TEXT,
    input TEXT,
    options TEXT [],
    minmax TEXT []
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    answers  TEXT,
    quizid TEXT
);


INSERT INTO quizzes (title, quizid, allowback) VALUES('No Back Button', '26JBU', false);
INSERT INTO quizzes (title, quizid, allowback) VALUES('Allow Back Button', '27JBU', true);

INSERT INTO questions (question, quizid, input) VALUES('Is lybin fit?', '26JBU', 'text');
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