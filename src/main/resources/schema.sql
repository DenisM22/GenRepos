-- Справочники
--
-- \COPY first_names(first_name) FROM 'C:/Users/denis/Downloads/first_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY last_names(last_name) FROM 'C:/Users/denis/Downloads/last_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY middle_names(middle_name) FROM 'C:/Users/denis/Downloads/middle_names.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY parishes(parish) FROM 'C:/Users/denis/Downloads/parishes.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY volosts(volost) FROM 'C:/Users/denis/Downloads/volosts.csv' DELIMITER ',' CSV ENCODING 'UTF8';
-- \COPY places(place) FROM 'C:/Users/denis/Downloads/places.csv' DELIMITER ',' CSV ENCODING 'UTF8';

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

CREATE TABLE IF NOT EXISTS parishes (
    parish VARCHAR(255) PRIMARY KEY
    );

CREATE TABLE IF NOT EXISTS volosts (
    volost VARCHAR(255) PRIMARY KEY,
    parish VARCHAR REFERENCES NOT NULL parihes(parish)
    );

CREATE TABLE IF NOT EXISTS places (
    place VARCHAR(255) PRIMARY KEY,
    volost VARCHAR REFERENCES NOT NULL volosts(volost)
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

--Метрическая книга
CREATE TABLE IF NOT EXISTS metric_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    parish VARCHAR(255),
    place VARCHAR(255),
    image VARCHAR
    );

--Исповедная ведомость
CREATE TABLE IF NOT EXISTS confessional_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    parish VARCHAR(255),
    place VARCHAR(255),
    landowner VARCHAR(255),
    household VARCHAR(255),
    image VARCHAR
    );

--Ревизская сказка
CREATE TABLE IF NOT EXISTS revision_documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at SMALLINT,
    parish VARCHAR(255),
    volost VARCHAR(255),
    place VARCHAR(255),
    landowner VARCHAR(255),
    household VARCHAR(255),
    image VARCHAR
    );

CREATE TABLE birth_records (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),

    --Ребенок
    birth_date DATE,
    newborn_name VARCHAR(255),
    family_status VARCHAR(255),
    place VARCHAR(255),
    landowner VARCHAR(255),

    --Отец
    father_first_name VARCHAR(255),
    father_last_name VARCHAR(255),
    father_middle_name VARCHAR(255),
    father_social_status VARCHAR(255),
    father_is_dead BOOLEAN DEFAULT FALSE,

    --Мать
    mother_first_name VARCHAR(255),
    mother_middle_name VARCHAR(255),
    mother_family_status VARCHAR(255),

    --Крестный
    godparent_first_name VARCHAR(255),
    godparent_last_name VARCHAR(255),
    godparent_middle_name VARCHAR(255),
    godparent_place VARCHAR(255),
    godparent_family_status VARCHAR(255),
    godparent_social_status VARCHAR(255),
);

CREATE TABLE death_records (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),

    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    death_date DATE NOT NULL,
    age SMALLINT,
    place VARCHAR(255),
    family_status VARCHAR(255),
    social_status VARCHAR(255),
    death_cause VARCHAR(255),
    burial_place VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS marriage_records (
    id BIGSERIAL PRIMARY KEY,
    
    document_id BIGINT NOT NULL REFERENCES metric_documents(id),
    marriage_date INT REFERENCES fuzzy_dates(id),

    --Жених
    groom_first_name VARCHAR(255),
    groom_last_name VARCHAR(255),
    groom_middle_name VARCHAR(255),
    groom_social_status VARCHAR(255),
    groom_place VARCHAR(255),
    groom_landowner VARCHAR(255),
    groom_age SMALLINT,
    groom_marriage_number SMALLINT,

    --Отец жениха
    groom_father_first_name VARCHAR(255),
    groom_father_last_name VARCHAR(255),
    groom_father_middle_name VARCHAR(255),
    groom_father_social_status VARCHAR(255),

    --Невеста
    bride_first_name VARCHAR(255),
    bride_last_name VARCHAR(255),
    bride_middle_name VARCHAR(255),
    bride_social_status VARCHAR(255),
    bride_place VARCHAR(255),
    bride_landowner VARCHAR(255),
    bride_age SMALLINT,
    bride_marriage_number SMALLINT,

    --Отец невесты
    bride_father_first_name VARCHAR(255),
    bride_father_last_name VARCHAR(255),
    bride_father_middle_name VARCHAR(255),
    bride_father_social_status VARCHAR(255),

    --Поручитель
    guarantor_first_name VARCHAR(255),
    guarantor_last_name VARCHAR(255),
    guarantor_middle_name VARCHAR(255),
    guarantor_role VARCHAR(100),
    guarantor_social_status VARCHAR(100),
    guarantor_family_status VARCHAR(100),
    guarantor_place VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS people_from_confessional_documents (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES confessional_documents(id),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    middle_name VARCHAR(255),
    birth_date INT REFERENCES fuzzy_dates(id),
    death_date INT REFERENCES fuzzy_dates(id),
    family_status VARCHAR(255),
    social_status VARCHAR(255),
    description VARCHAR(255)
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
    family_status VARCHAR(255),
    social_status VARCHAR(255),
    description VARCHAR(255),
    departure_year SMALLINT,

    --Для женщин
    marriage_place VARCHAR(255),
    marriage_document BOOLEAN DEFAULT FALSE
    );
