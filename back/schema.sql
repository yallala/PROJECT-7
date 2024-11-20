-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    firstname character varying(50) COLLATE pg_catalog."default" DEFAULT 'Utilisateur'::character varying,
    lastname character varying(50) COLLATE pg_catalog."default" DEFAULT 'Inconnu'::character varying,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    avatar character varying(255) COLLATE pg_catalog."default" DEFAULT 'none'::character varying,
    "isDelete" boolean DEFAULT false,
    "isAdmin" boolean DEFAULT false,
    "jobId" integer NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_email_key1 UNIQUE (email),
    CONSTRAINT users_email_key2 UNIQUE (email),
    CONSTRAINT users_email_key3 UNIQUE (email),
    CONSTRAINT "users_jobId_fkey" FOREIGN KEY ("jobId")
        REFERENCES public.jobs (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;



    -- Table: public.likes

-- DROP TABLE IF EXISTS public.likes;

CREATE TABLE IF NOT EXISTS public.likes
(
    id integer NOT NULL DEFAULT nextval('likes_id_seq'::regclass),
    "userId" integer NOT NULL,
    "articleId" integer NOT NULL,
    CONSTRAINT likes_pkey PRIMARY KEY (id),
    CONSTRAINT "likes_articleId_fkey" FOREIGN KEY ("articleId")
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.likes
    OWNER to postgres;

    -- Table: public.articles

-- DROP TABLE IF EXISTS public.articles;

CREATE TABLE IF NOT EXISTS public.articles
(
    id integer NOT NULL DEFAULT nextval('articles_id_seq'::regclass),
    article character varying(255) COLLATE pg_catalog."default" NOT NULL,
    image character varying(255) COLLATE pg_catalog."default" DEFAULT 'none'::character varying,
    "postDate" timestamp with time zone NOT NULL,
    "authorId" integer NOT NULL,
    CONSTRAINT articles_pkey PRIMARY KEY (id),
    CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.articles
    OWNER to postgres;