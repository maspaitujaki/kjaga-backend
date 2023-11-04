CREATE TYPE "gender" AS ENUM (
  'pria',
  'wanita'
);

CREATE TYPE "jenis_kelamin" AS ENUM (
  'pria',
  'wanita'
);

CREATE TYPE "tipe_makan" AS ENUM (
  'sarapan',
  'makan_siang',
  'makan_malam',
  'camilan'
);

CREATE TABLE "user" (
  "id" integer PRIMARY KEY,
  "email" varchar,
  "password" varchar,
  "created_date" timestamp,
  "username" varchar
);

CREATE TABLE "detail_pengguna" (
  "user_id" integer PRIMARY KEY,
  "jenis_kelamin" jenis_kelamin,
  "tanggal_lahir" date,
  "umur" integer,
  "jenis_akg" varchar
);

CREATE TABLE "jenis_kebutuhan_akg" (
  "id" varchar PRIMARY KEY,
  "jenis_kelamin" jenis_kelamin,
  "umur" integer,
  "energi" integer,
  "protein" integer,
  "lemak" integer,
  "karbohidrat" integer,
  "serat" integer
);

CREATE TABLE "makanan" (
  "nama" varchar,
  "id" integer PRIMARY KEY,
  "energi(kkal)" float,
  "lemak(g)" float,
  "kolesterol(mg)" float,
  "protein(g)" float,
  "karbohidrat(g)" float,
  "serat(g)" float,
  "gula(g)" float,
  "sodium(mg)" float,
  "kalium(mg)" float
);

CREATE TABLE "porsi" (
  "id" integer PRIMARY KEY,
  "id_makanan" integer,
  "nama" varchar,
  "total_berat(g)" integer
);

CREATE TABLE "log_bmi_pengguna" (
  "user_id" integer,
  "created_date" timestamp,
  "berat_badan(kg)" float,
  "tinggi_badan(cm)" integer,
  "bmi_index" float,
  PRIMARY KEY ("user_id", "created_date")
);

CREATE TABLE "log_makan_pengguna" (
  "user_id" integer,
  "tanggal" Date,
  "id_makanan" integer,
  "id_porsi" integer,
  "tipe" tipe_makan,
  "jumlah_porsi" integer,
  "url_foto_makanan" integer,
  PRIMARY KEY ("user_id", "tanggal")
);

ALTER TABLE "detail_pengguna" ADD FOREIGN KEY ("jenis_akg") REFERENCES "jenis_kebutuhan_akg" ("id");

ALTER TABLE "detail_pengguna" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "porsi" ADD FOREIGN KEY ("id_makanan") REFERENCES "makanan" ("id");

ALTER TABLE "log_bmi_pengguna" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "log_makan_pengguna" ADD FOREIGN KEY ("id_makanan") REFERENCES "makanan" ("id");

ALTER TABLE "log_makan_pengguna" ADD FOREIGN KEY ("id_porsi") REFERENCES "porsi" ("id");

ALTER TABLE "log_makan_pengguna" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
