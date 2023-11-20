--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female'
);


ALTER TYPE public.gender OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: foods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.foods (
    name character varying,
    id integer NOT NULL
);


ALTER TABLE public.foods OWNER TO postgres;

--
-- Name: portions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portions (
    id integer NOT NULL,
    food_id integer,
    name character varying,
    "energy(kkal)" double precision,
    "fat(g)" double precision,
    "cholesterol(mg)" double precision,
    "protein(g)" double precision,
    "carbohydrates(g)" double precision,
    "fiber(g)" double precision,
    "sugar(g)" double precision,
    "sodium(mg)" double precision,
    "kalium(mg)" double precision
);


ALTER TABLE public.portions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character(36) NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    username character varying NOT NULL,
    gender public.gender,
    birthdate date,
    age integer,
    akg_type character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: foods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.foods (name, id) FROM stdin;
Nasi Putih	1917
Ayam Goreng	2449
Kari Ayam	1915
\.


--
-- Data for Name: portions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portions (id, food_id, name, "energy(kkal)", "fat(g)", "cholesterol(mg)", "protein(g)", "carbohydrates(g)", "fiber(g)", "sugar(g)", "sodium(mg)", "kalium(mg)") FROM stdin;
4698	1917	1 Gram	1	0	0	0.03	0.28	0	0	4	0
9853	1917	100 Gram	129	0.28	0	2.66	27.9	0.4	0.05	365	35
2692	1917	1 Porsi	135	0.29	0	2.79	29.3	0.4	0.05	383	37
9305	2449	100 Gram	260	14.55	57	21.93	10.76	1.4	0.26	350	323
4772	2449	1 Porsi	781	43.64	171	65.8	32.29	4.2	0.79	1050	969
8756	2449	1 Buah	391	21.82	86	32.9	16.15	2.1	0.39	525	485
9255	1915	1 Bungkus	320	12	0	7	45	2	2	1350	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, username, gender, birthdate, age, akg_type, created_at, updated_at) FROM stdin;
\.


--
-- Name: foods foods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.foods
    ADD CONSTRAINT foods_pkey PRIMARY KEY (id);


--
-- Name: portions portions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portions
    ADD CONSTRAINT portions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: portions portions_food_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portions
    ADD CONSTRAINT portions_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.foods(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

