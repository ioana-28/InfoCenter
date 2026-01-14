CREATE TABLE chat_messages
(
    message_id   BIGINT                      NOT NULL,
    session_id   BIGINT                      NOT NULL,
    sender       VARCHAR(255)                NOT NULL,
    message_text TEXT                        NOT NULL,
    sent_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_chat_messages PRIMARY KEY (message_id)
);

ALTER TABLE chat_messages
    ADD CONSTRAINT FK_CHAT_MESSAGES_ON_SESSION FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id);



CREATE TABLE chat_messages
(
    message_id   BIGINT                      NOT NULL,
    session_id   BIGINT                      NOT NULL,
    sender       VARCHAR(255)                NOT NULL,
    message_text TEXT                        NOT NULL,
    sent_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_chat_messages PRIMARY KEY (message_id)
);

ALTER TABLE chat_messages
    ADD CONSTRAINT FK_CHAT_MESSAGES_ON_SESSION FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id);


CREATE SEQUENCE IF NOT EXISTS document_requests_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE document_requests
(
    request_id          BIGINT                      NOT NULL,
    student_id          BIGINT                      NOT NULL,
    document_type       VARCHAR(50)                 NOT NULL,
    details             TEXT,
    status              VARCHAR(20),
    requested_at        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    admin_response_date TIMESTAMP WITHOUT TIME ZONE,
    admin_reason        TEXT,
    drive_file_id       VARCHAR(255),
    CONSTRAINT pk_document_requests PRIMARY KEY (request_id)
);

ALTER TABLE document_requests
    ADD CONSTRAINT FK_DOCUMENT_REQUESTS_ON_STUDENT FOREIGN KEY (student_id) REFERENCES users (user_id);




CREATE TABLE faq_entries
(
    faq_id       BIGINT                      NOT NULL,
    question     TEXT                        NOT NULL,
    answer       TEXT,
    uploaded_by  BIGINT,
    submitted_by BIGINT,
    status       VARCHAR(20)                 NOT NULL,
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    answered_at  TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT pk_faq_entries PRIMARY KEY (faq_id)
);

ALTER TABLE faq_entries
    ADD CONSTRAINT FK_FAQ_ENTRIES_ON_SUBMITTED_BY FOREIGN KEY (submitted_by) REFERENCES users (user_id);

ALTER TABLE faq_entries
    ADD CONSTRAINT FK_FAQ_ENTRIES_ON_UPLOADED_BY FOREIGN KEY (uploaded_by) REFERENCES users (user_id);




CREATE TABLE roles
(
    role_id   BIGINT      NOT NULL,
    role_name VARCHAR(20) NOT NULL,
    CONSTRAINT pk_roles PRIMARY KEY (role_id)
);

ALTER TABLE roles
    ADD CONSTRAINT uc_roles_rolename UNIQUE (role_name);




CREATE TABLE university_documents
(
    doc_id      BIGINT                      NOT NULL,
    title       VARCHAR(200)                NOT NULL,
    file_url    TEXT                        NOT NULL,
    uploaded_by BIGINT                      NOT NULL,
    uploaded_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_university_documents PRIMARY KEY (doc_id)
);

ALTER TABLE university_documents
    ADD CONSTRAINT FK_UNIVERSITY_DOCUMENTS_ON_UPLOADED_BY FOREIGN KEY (uploaded_by) REFERENCES users (user_id);





CREATE TABLE users
(
    user_id       BIGINT                      NOT NULL,
    email         VARCHAR(100)                NOT NULL,
    password_hash VARCHAR(255)                NOT NULL,
    full_name     VARCHAR(100)                NOT NULL,
    role_id       BIGINT                      NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (user_id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT FK_USERS_ON_ROLE FOREIGN KEY (role_id) REFERENCES roles (role_id);


