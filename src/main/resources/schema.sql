--
-- Справочники
--
/*
\COPY first_names(first_name) FROM 'C:/Users/denis/Downloads/first_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
\COPY last_names(last_name) FROM 'C:/Users/denis/Downloads/last_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
\COPY middle_names(middle_name) FROM 'C:/Users/denis/Downloads/middle_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
\COPY volosts(volost) FROM 'C:/Users/denis/Downloads/volosts.csv' DELIMITER ',' CSV ENCODING 'UTF8';
\COPY places(place) FROM 'C:/Users/denis/Downloads/places.csv' DELIMITER ',' CSV ENCODING 'UTF8';
\COPY parishes(parish) FROM 'C:/Users/denis/Downloads/parishes.csv' DELIMITER ',' CSV ENCODING 'UTF8';
 INSERT INTO uyezdy (uyezd) VALUES
                               ('Вельский'),
                               ('Вологодский'),
                               ('Грязовецкий'),
                               ('Кадниковский'),
                               ('Никольский'),
                               ('Сольвычегодский'),
                               ('Тотемский'),
                               ('Усть-Сысольский'),
                               ('Устюжский'),
                               ('Яренский');
 */
--Порядок: имена, возраст, даты, место, принадлежность и статусы

CREATE TABLE IF NOT EXISTS first_names (
    first_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS aliases (
    alias VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR REFERENCES first_names(first_name)
    );

CREATE TABLE IF NOT EXISTS last_names (
    last_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS middle_names (
    middle_name VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS uyezdy (
    id BIGSERIAL PRIMARY KEY,
    uyezd VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS volosts (
    id BIGSERIAL PRIMARY KEY,
    volost VARCHAR(255) NOT NULL,
    uyezd_id BIGINT NOT NULL REFERENCES uyezdy(id)
    );

CREATE TABLE IF NOT EXISTS places (
    id BIGSERIAL PRIMARY KEY,
    place VARCHAR(255) NOT NULL,
    volost_id BIGINT NOT NULL REFERENCES volosts(id)
    );

CREATE TABLE IF NOT EXISTS parishes (
    id BIGSERIAL PRIMARY KEY,
    parish VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS family_statuses (
    id BIGSERIAL PRIMARY KEY,
    family_status VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS social_statuses (
    id BIGSERIAL PRIMARY KEY,
    social_status VARCHAR(255) NOT NULL UNIQUE
    );

CREATE TABLE IF NOT EXISTS landowners (
    id BIGSERIAL PRIMARY KEY,
    landowner VARCHAR(255),
    place_id BIGINT NOT NULL REFERENCES places(id)
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
    id BIGSERIAL PRIMARY KEY,
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
    birth_date BIGINT REFERENCES fuzzy_dates(id),
    death_date BIGINT REFERENCES fuzzy_dates(id),
    place_id BIGINT REFERENCES places(id),
    social_status_id BIGINT REFERENCES places(id),
    spouse_id BIGINT REFERENCES people(id),
    father_id BIGINT REFERENCES people(id),
    mother_id BIGINT REFERENCES people(id)
    );

CREATE TABLE IF NOT EXISTS parents_children (
    parent_id BIGINT REFERENCES people(id) ON DELETE CASCADE,
    child_id BIGINT REFERENCES people(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, child_id)
    );

--Метрическая книга
CREATE TABLE IF NOT EXISTS metric_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    parish_id BIGINT REFERENCES parishes(id)
    );

CREATE TABLE IF NOT EXISTS birth_records (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),

    --Ребенок
    newborn_name VARCHAR(255),
    birth_date BIGINT REFERENCES fuzzy_dates(id),
    place_id BIGINT REFERENCES places(id),
    landowner_id BIGINT REFERENCES landowners(id),
    family_status_id BIGINT REFERENCES family_statuses(id),

    --Отец
    father_first_name VARCHAR(255),
    father_last_name VARCHAR(255),
    father_middle_name VARCHAR(255),
    father_social_status_id BIGINT REFERENCES social_statuses(id),
    father_is_dead BOOLEAN DEFAULT FALSE,

    --Мать
    mother_first_name VARCHAR(255),
    mother_middle_name VARCHAR(255),
    mother_family_status_id BIGINT REFERENCES family_statuses(id),

    --Крестный
    godparent_first_name VARCHAR(255),
    godparent_last_name VARCHAR(255),
    godparent_middle_name VARCHAR(255),
    godparent_place_id BIGINT REFERENCES places(id),
    godparent_family_status_id BIGINT REFERENCES family_statuses(id),
    godparent_social_status_id BIGINT REFERENCES social_statuses(id),

    image VARCHAR,
    image_description VARCHAR
);

CREATE TABLE IF NOT EXISTS marriage_records (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),
    marriage_date BIGINT REFERENCES fuzzy_dates(id),

    --Жених
    groom_first_name VARCHAR(255),
    groom_last_name VARCHAR(255),
    groom_middle_name VARCHAR(255),
    groom_age SMALLINT,
    groom_place_id BIGINT REFERENCES places(id),
    groom_landowner_id BIGINT REFERENCES landowners(id),
    groom_social_status_id BIGINT REFERENCES social_statuses(id),
    groom_marriage_number SMALLINT,

    --Отец жениха
    groom_father_first_name VARCHAR(255),
    groom_father_last_name VARCHAR(255),
    groom_father_middle_name VARCHAR(255),
    groom_father_social_status_id BIGINT REFERENCES social_statuses(id),

    --Невеста
    bride_first_name VARCHAR(255),
    bride_last_name VARCHAR(255),
    bride_middle_name VARCHAR(255),
    bride_age SMALLINT,
    bride_place_id BIGINT REFERENCES places(id),
    bride_landowner_id BIGINT REFERENCES landowners(id),
    bride_social_status_id BIGINT REFERENCES social_statuses(id),
    bride_marriage_number SMALLINT,

    --Отец невесты
    bride_father_first_name VARCHAR(255),
    bride_father_last_name VARCHAR(255),
    bride_father_middle_name VARCHAR(255),
    bride_father_social_status_id BIGINT REFERENCES social_statuses(id),

    --Поручитель
    guarantor_first_name VARCHAR(255),
    guarantor_last_name VARCHAR(255),
    guarantor_middle_name VARCHAR(255),
    guarantor_place_id BIGINT REFERENCES places(id),
    guarantor_role VARCHAR(255),
    guarantor_family_status_id BIGINT REFERENCES family_statuses(id),
    guarantor_social_status_id BIGINT REFERENCES social_statuses(id),

    image VARCHAR,
    image_description VARCHAR
    );

CREATE TABLE IF NOT EXISTS death_records (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),

    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    gender VARCHAR(10),
    age SMALLINT,
    death_date BIGINT REFERENCES fuzzy_dates(id),
    place_id BIGINT REFERENCES places(id),
    family_status_id BIGINT REFERENCES family_statuses(id),
    social_status_id BIGINT REFERENCES social_statuses(id),
    death_cause VARCHAR(255),
    burial_place_id BIGINT REFERENCES places(id),

    image VARCHAR,
    image_description VARCHAR
);

--Исповедная ведомость
CREATE TABLE IF NOT EXISTS confessional_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    parish_id BIGINT REFERENCES parishes(id)
    );

CREATE TABLE IF NOT EXISTS people_from_confessional_documents (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES confessional_documents(id),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    gender VARCHAR(10),
    birth_date BIGINT REFERENCES fuzzy_dates(id),
    death_date BIGINT REFERENCES fuzzy_dates(id),
    place_id BIGINT REFERENCES places(id),
    household VARCHAR(255),
    landowner_id BIGINT REFERENCES landowners(id),
    family_status_id BIGINT REFERENCES family_statuses(id),
    social_status_id BIGINT REFERENCES social_statuses(id),

    image VARCHAR,
    image_description VARCHAR
    );

--Ревизская сказка
CREATE TABLE IF NOT EXISTS revision_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    place_id BIGINT REFERENCES places(id)
    );

CREATE TABLE IF NOT EXISTS people_from_revision_documents (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES revision_documents(id),

    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    gender VARCHAR(10),
    previous_age SMALLINT,
    current_age SMALLINT,
    household VARCHAR(255),
    landowner_id BIGINT REFERENCES landowners(id),
    family_status_id BIGINT REFERENCES family_statuses(id),
    social_status_id BIGINT REFERENCES social_statuses(id),
    departure_year SMALLINT,
    departure_reason VARCHAR(255),

    --Для женщин дополнительно
    marriage_place_id BIGINT REFERENCES places(id),
    marriage_document BOOLEAN DEFAULT FALSE,

    image VARCHAR,
    image_description VARCHAR
    );
