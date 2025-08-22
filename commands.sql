CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES (
    'Dan Abramov',
    'https://overreacted.io/things-i-dont-know-as-of-2018/',
    'Things I Don''t Know as of 2018'
);

INSERT INTO blogs (author, url, title) VALUES (
    'Kent C. Dodds',
    'https://kentcdodds.com/blog/how-to-use-react-context-effectively',
    'How to Use React Context Effectively'
);
