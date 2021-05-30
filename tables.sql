use M<>;



drop table if exists AdvisingSession;
drop table if exists AdvisingBlock;
drop table if exists Advisee;
drop table if exists Advisor;

create table Advisee (
	student_id int primary key,
    first_name varchar(20),
    last_name varchar(20),
    h_password varchar(32),
    email varchar(40) UNIQUE
);

create table Advisor (
	advisor_id int primary key,
	first_name varchar(20),
    last_name varchar(20),
    h_password varchar(32),
    email varchar(40) UNIQUE,
    lock_time int default 0
);

create table AdvisingBlock (
	advisor_id int not null,
    is_deleted bool default null,
    start_day datetime not null,
    session_length int not null,
    num_sessions_in_day int not null,
    foreign key (advisor_id) references Advisor(advisor_id) on delete cascade
);

create table AdvisingSession (
	advisor_id int not null,
    student_id int default null,
    duration int not null,
    comments varchar(256) default null,
    missed bool default false,
    approved bool default false,
    booked bool default false,
    start_time datetime not null,
    lookup_key varchar(40) unique, -- hashed advisor_id + start_time  sha1
    foreign key (advisor_id) references AdvisingBlock(advisor_id) on delete cascade
    /*foreign key (student_id) references Advisee(student_id) on delete cascade*/
    );
    
-- create I-- NDEX
    
INSERT INTO Advisor
	(advisor_id, first_name, last_name, h_password, email, lock_time)
VALUES
    --= REMOVED

insert into Advisee
	(student_id, first_name, last_name, h_password, email)
VALUES
    --- REMOVED

-- -- Sanjay 
-- update AdvisingSession SET
-- 	student_id = 987654321, booked = true 
-- WHERE  advisor_id = 12345 AND start_time = "2019-04-15 08:40:00";

-- update AdvisingSession SET
-- 	approved = true
-- WHERE  advisor_id = 12345 AND start_time = "2019-04-15 08:00:00";

-- -- select * from Advisor;
-- SELECT 
-- 	a.advisor_id,
--     ads.student_id,
--     ab.session_length,
--     ads.start_time,
--     ads.approved,
--     ads.booked
-- 	FROM Advisor a
--     LEFT JOIN AdvisingBlock ab ON
--         a.advisor_id = ab.advisor_id 
--     LEFT JOIN AdvisingSession ads ON 
--         ab.advisor_id = ads.advisor_id
-- 	WHERE a.advisor_id = 12345;
--     
-- SELECT 
--     ab.session_length,
--     ads.start_time,
--     ads.approved,
--     ads.booked
-- 	FROM Advisor a
--     LEFT JOIN AdvisingBlock ab ON
--         a.advisor_id = ab.advisor_id 
--     LEFT JOIN AdvisingSession ads ON 
--         ab.advisor_id = ads.advisor_id
-- 	WHERE a.advisor_id = 12345 AND ads.start_time > NOW()
--     ORDER BY ads.start_time ASC ;

-- -- completed appointments 
-- select 
-- 	count(*)
-- 	FROM Advisor a 
--     LEFT JOIN AdvisingBlock ab ON
--         a.advisor_id = ab.advisor_id 
--     LEFT JOIN AdvisingSession ads ON 
--         ab.advisor_id = ads.advisor_id
-- 	WHERE ads.approved = true and ads.booked = true;
--    
-- -- appointments not booked -- 
-- select 
-- 	count(*)
-- 	FROM Advisor a 
--     LEFT JOIN AdvisingBlock ab ON
--         a.advisor_id = ab.advisor_id 
--     LEFT JOIN AdvisingSession ads ON 
--         ab.advisor_id = ads.advisor_id
-- 	WHERE ads.approved = false and ads.booked = true;
--     
-- -- slots not booked 
-- select 
-- 	count(*)
-- 	FROM Advisor a 
--     LEFT JOIN AdvisingBlock ab ON
--         a.advisor_id = ab.advisor_id 
--     LEFT JOIN AdvisingSession ads ON 
--         ab.advisor_id = ads.advisor_id
-- 	WHERE ads.booked = false;
