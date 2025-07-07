-- PostgreSQL schema
CREATE TYPE my_enum_example AS ENUM ('good', 'bad', 'ugly', 'dont know');

CREATE TABLE special_key (
    "test_pk" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY
);

CREATE TABLE "various_types" (
    "bigserial" bigserial primary key,
    "serial" serial,
    "test_int32" integer,
    "test_int64" bigint,
    "test_bigint" numeric,
    "test_float32" real,
    "test_float64" double precision,
    "test_decimal" decimal(10, 2),
    "test_uuid" uuid,
    "test_string" text,
    "test_varchar" varchar(255),
    "test_boolean" boolean,
    "test_datetime" timestamptz,
    "test_datetime2" timestamp,
    "test_datepart" date,
    "test_timepart" time,
    "test_jsonb" jsonb,
    "test_json" json,
    "test_enum" my_enum_example,
    "test_array" text[],
    "text_array_ints" integer[],
    "test_bytea" bytea,
    "test_xml" xml,
    -- "test_point" point,
    -- "test_circle" circle,
    "test_default" text default 'default value',
    "test_default_int" integer default 42 not null,
    "test_default_now" timestamptz default current_timestamp not null,
    "test_default_decimal" decimal(10, 2) default 0.00 not null,
    "test_default_uuid" uuid default gen_random_uuid() not null,
    "test_check_int_between" integer check ("test_check_int_between" > 0 and "test_check_int_between" < 100),
    "test_not_null" text not null,
    "test_not_null_array" text[] not null
);

CREATE TABLE "test_foreignkeys" (
    "test_pk" uuid primary key,
    "test_fk_to_various_types" bigint references "various_types" ("bigserial"),
    "test_fk_to_self" uuid references "test_foreignkeys" ("test_pk")
);