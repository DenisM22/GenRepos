CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    email VARCHAR
    );

--
-- Справочники
--
CREATE TABLE IF NOT EXISTS first_names (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS aliases (
    id SERIAL PRIMARY KEY,
    alias VARCHAR(255) NOT NULL UNIQUE,
    first_name INT REFERENCES first_names(id),
    );


CREATE TABLE IF NOT EXISTS last_names (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS middle_names (
    id SERIAL PRIMARY KEY,
    middle_name VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    place VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS parishes (
    id SERIAL PRIMARY KEY,
    parish VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS social_statuses (
    id SERIAL PRIMARY KEY,
    social_status VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS family_statuses (
    id SERIAL PRIMARY KEY,
    family_status VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS landowners (
    id SERIAL PRIMARY KEY,
    landowner VARCHAR(255) NOT NULL UNIQUE
    );

--
--Основные таблицы
--
CREATE TABLE IF NOT EXISTS fuzzy_dates (
    id SERIAL PRIMARY KEY,
    exact_date DATE,
    start_date DATE,
    end_date DATE,
    description VARCHAR(10)
    );

CREATE TABLE IF NOT EXISTS people (
    id BIGSERIAL PRIMARY KEY,
    first_name INT NOT NULL REFERENCES first_names(id),
    last_name INT REFERENCES last_names(id),
    middle_name INT REFERENCES middle_names(id),
    gender VARCHAR(10),
    birth_date INT REFERENCES fuzzy_dates(id),
    death_date INT REFERENCES fuzzy_dates(id),
    place INT REFERENCES places(id),
    social_status INT REFERENCES social_statuses(id),
    spouse_id BIGINT REFERENCES persons(id),
    father_id BIGINT REFERENCES persons(id),
    mother_id BIGINT REFERENCES persons(id),
    children_id BIGINT[] REFERENCES persons(id)
    );

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    year_of_creation SMALLINT,
    parish INT REFERENCES parishes(id),
    place INT REFERENCES places(id),
    household VARCHAR,
    image BYTEA
    );

CREATE TABLE IF NOT EXISTS people_from_documents (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES documents(id),
    first_name INT NOT NULL REFERENCES first_names(id),
    last_name INT REFERENCES last_names(id),
    middle_name INT REFERENCES middle_names(id),
    birth_date INT REFERENCES fuzzy_dates(id),
    death_date INT REFERENCES fuzzy_dates(id),
    social_status INT REFERENCES social_statuses(id),
    family_status INT REFERENCES family_statuses(id)
    );
