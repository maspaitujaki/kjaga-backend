DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

CREATE TYPE "gender" AS ENUM (
  'male',
  'female'
);

CREATE TABLE "users" (
  "id" char(36) PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "gender" gender,
  "birthdate" date,
  "age" integer,
  "akg_type" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "foods" (
  "name" varchar,
  "id" integer PRIMARY KEY
);

CREATE TABLE "portions" (
  "id" integer PRIMARY KEY,
  "food_id" integer,
  "name" varchar,
  "energy(kkal)" float,
  "fat(g)" float,
  "cholesterol(mg)" float,
  "protein(g)" float,
  "carbohydrates(g)" float,
  "fiber(g)" float,
  "sugar(g)" float,
  "sodium(mg)" float,
  "kalium(mg)" float
);

ALTER TABLE "portions" ADD FOREIGN KEY ("food_id") REFERENCES "foods" ("id");

COPY foods(name, id)
FROM 'D:\Bangkit Capstone\backend\migrate\food.csv'
DELIMITER ','
CSV HEADER;

COPY portions(id, food_id, name, "energy(kkal)", "fat(g)", "cholesterol(mg)", "protein(g)", "carbohydrates(g)", "fiber(g)", "sugar(g)", "sodium(mg)", "kalium(mg)" )
FROM 'D:\Bangkit Capstone\backend\migrate\portion.csv'
DELIMITER ','
CSV HEADER;