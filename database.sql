create database ecommerce1;
use ecommerce1;
create table user(id int primary key auto_increment,firstName 
varchar(15),lastName varchar(15),phone varchar(12),email varchar(50),
password varchar(100) );


create table product(id int primary key auto_increment,title varchar(100),
description varchar(1000),price float,category int ,
company int);

create table category(id int primary key auto_increment,title varchar(100),
description varchar(1000));

create table company(id int primary key auto_increment,title varchar(100),
description varchar(1000));


alter table user add unique(email);

alter table user add column isActive int(1);
alter table user drop column isActive;
alter table user add column status varchar(20);

//status
//0 => non-verified
//1 => active
//2 => suspended