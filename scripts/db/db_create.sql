CREATE USER "przepisy" LOGIN ENCRYPTED PASSWORD 'przepisy' VALID UNTIL 'infinity';
CREATE DATABASE "przepisy" WITH OWNER = "przepisy" ENCODING = 'UTF8' CONNECTION LIMIT = 100;

GRANT ALL ON DATABASE "przepisy" TO "przepisy";
