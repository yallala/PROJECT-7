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


-- TODO add queries for remaining table