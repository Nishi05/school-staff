--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    genre_name character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    name character varying,
    recruit_type character varying,
    salary character varying,
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: schools_genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools_genres (
    id integer NOT NULL,
    school_id integer,
    genre_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: schools_genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_genres_id_seq OWNED BY public.schools_genres.id;


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: schools_genres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_genres ALTER COLUMN id SET DEFAULT nextval('public.schools_genres_id_seq'::regclass);



--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: -
--
COPY public.genres (id, genre_name, created_at, updated_at) FROM stdin;
1	?????????	2021-05-17 00:00:00	2021-05-17 00:00:00
2	?????????	2021-05-17 00:00:00	2021-05-17 00:00:00
3	??????	2021-05-17 00:00:00	2021-05-17 00:00:00
4	??????????????????	2021-05-17 00:00:00	2021-05-17 00:00:00
\.

--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, recruit_type, salary, description, created_at, updated_at) FROM stdin DELIMITER ',';
1,???????????????,??????????????????,??????,?????????????????????,2021-05-17 00:00:00,2021-05-17 00:00:00
2,???????????????,???????????????,??????1000???,????????????????????????,2021-05-17 00:00:00,2021-05-17 00:00:00
4,??????????????????,???????????????,??????1100???,????????????????????????????????????,2021-05-17 00:00:00,2021-05-17 00:00:00
3,????????????????????????,??????????????????,??????,???????????????,2021-05-17 00:00:00,2021-05-17 00:00:00
\.


--
-- Data for Name: schools_genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools_genres (id, school_id, genre_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.genres_id_seq', 9, true);


--
-- Name: schools_genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_genres_id_seq', 1, false);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 4, true);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: schools_genres schools_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_genres
    ADD CONSTRAINT schools_genres_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: schools_genres fk_school_genries_genre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_genres
    ADD CONSTRAINT fk_school_genries_genre_id FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- Name: schools_genres fk_school_genries_school_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools_genres
    ADD CONSTRAINT fk_school_genries_school_id FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- PostgreSQL database dump complete
--