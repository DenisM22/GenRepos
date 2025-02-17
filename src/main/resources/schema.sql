-- Справочники
--
-- \COPY first_names(first_name) FROM 'C:/Users/denis/Downloads/first_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY last_names(last_name) FROM 'C:/Users/denis/Downloads/last_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY middle_names(middle_name) FROM 'C:/Users/denis/Downloads/middle_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
--
CREATE TABLE IF NOT EXISTS aliases (
    alias VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR REFERENCES first_names(first_name)
    );

CREATE TABLE IF NOT EXISTS first_names (
    first_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS last_names (
    last_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS middle_names (
    middle_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS places (
    place VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS parishes (
    parish VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS social_statuses (
    social_status VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS family_statuses (
    family_status VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS landowners (
    landowner VARCHAR(255) PRIMARY KEY
    );

--
--Основные таблицы
--
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    email VARCHAR
    );

CREATE TABLE IF NOT EXISTS fuzzy_dates (
    id SERIAL PRIMARY KEY,
    exact_date DATE,
    start_date DATE,
    end_date DATE,
    description VARCHAR(100)
    );

CREATE TABLE IF NOT EXISTS people (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    gender VARCHAR(10),
    birth_date INT REFERENCES fuzzy_dates(id),
    death_date INT REFERENCES fuzzy_dates(id),
    place VARCHAR(255),
    social_status VARCHAR(255),
    spouse_id BIGINT REFERENCES people(id),
    father_id BIGINT REFERENCES people(id),
    mother_id BIGINT REFERENCES people(id)
    );

CREATE TABLE IF NOT EXISTS parents_children (
    parent_id BIGINT REFERENCES people(id) ON DELETE CASCADE,
    child_id BIGINT REFERENCES people(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, child_id)
    );

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year_of_creation SMALLINT,
    parish VARCHAR(255),
    place VARCHAR(255),
    household VARCHAR(255),
    image VARCHAR
    );

CREATE TABLE IF NOT EXISTS people_from_documents (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES documents(id),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    birth_date INT REFERENCES fuzzy_dates(id),
    death_date INT REFERENCES fuzzy_dates(id),
    social_status VARCHAR(255),
    family_status VARCHAR(255)
    );
