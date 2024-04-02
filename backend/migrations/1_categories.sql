CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT REFERENCES categories(id)
);

CREATE INDEX parent_index ON categories(parent_id);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE user_categories (
    user_id INT REFERENCES users(id),
    category_id INT REFERENCES categories(id),
    PRIMARY KEY (user_id, category_id)
);