CREATE DATABASE PHOENIX;
USE PHOENIX;
CREATE TABLE USERS(
ID int PRIMARY KEY NOT NULL AUTO_INCREMENT,
NAME varchar(200) NOT NULL,
USERNAME varchar(200) UNIQUE NOT NULL,
PASSWORD varchar(100) NOT NULL,
EMAIL varchar(200) NOT NULL UNIQUE constraint emailvalid check(EMAIL like '%_@__%.__%'),
MOBILE varchar(20) UNIQUE constraint mobilevalid check(MOBILE regexp '^[0-9]{10}$'),
GNAME JSON )
ENGINE=InnoDB DEFAULT CHARSET=latin1;
show tables;
select * from users;
use phoenix;
