-- createuser.sql
--
-- Creates a DB user for quick testing
-- https://blogs.oracle.com/opal/writing-nodejs-apps-for-oracle-autonomous-json-database

define USERNAME = &1

-- Uncomment if you want to clean up a previous user
-- begin execute immediate 'drop user &USERNAME cascade'; exception when others then if sqlcode <> -1918 then raise; end if; end;
-- /

create user &USERNAME;

alter user &USERNAME
      default tablespace data
      temporary tablespace temp
      account unlock
      quota unlimited on data;

grant  connect
     , resource
     to &USERNAME;

grant  create session
     , create table
     , create procedure
     , create sequence
     , create trigger
     , create view
     , create synonym
     , alter  session
     , create type
     , soda_app
     to &USERNAME;

password &USERNAME
