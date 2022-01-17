CREATE TABLE task
(
    id          UUID PRIMARY KEY,
    task_name   VARCHAR(255) NOT NULL,
    create_date VARCHAR(255),
    update_date VARCHAR(255),
    time        VARCHAR(255),
    project_id  UUID,
    FOREIGN KEY (project_id) references project (id)
    ON DELETE CASCADE,
    user_id     UUID,
    FOREIGN KEY (user_id) references admin (id)
    ON DELETE CASCADE
);

CREATE TABLE project
(
    id          UUID PRIMARY KEY,
    projectName VARCHAR(255),
    createDate  VARCHAR(255),
    updateDate  VARCHAR(255),
    time        VARCHAR(255),
    user_id     UUID,
    FOREIGN KEY (user_id) references admin (id)
);

CREATE TABLE admin
(
    id       UUID PRIMARY KEY,
    email    VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

