import { generateTypeScript, parseSql } from "../src/lib.ts";
import { expect, test } from "vitest";
import fs from "node:fs/promises";

function sql(strings: TemplateStringsArray, ...values: any[]) {
    return String.raw({ raw: strings }, ...values);
}

const schemaSql = sql`
    -- PostgreSQL schema
    CREATE TYPE my_enum_example AS ENUM ('good', 'bad', 'ugly', 'dont know');

    CREATE TABLE
        "various_types" (
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
            "test_default_int" integer default 42,
            "test_default_now" timestamptz default current_timestamp,
            "test_default_decimal" decimal(10, 2) default 0.00,
            "test_default_uuid" uuid default gen_random_uuid(),
            "test_check_int_between" integer check ("test_check_int_between" > 0 and "test_check_int_between" < 100)
        );

    CREATE TABLE
        "test_foreignkeys" (
            "test_pk" uuid primary key,
            "test_fk_to_various_types" bigint references "various_types" ("bigserial"),
            "test_fk_to_self" uuid references "test_foreignkeys" ("test_pk")
        );
`;

test("parseSql parses the Create table statements", async () => {
    const result = await parseSql(schemaSql);
    // await fs.writeFile("lib.test.result.json", JSON.stringify(result, null, 4));
    await expect(result).toMatchFileSnapshot("./__snapshots__/lib.test.result.jsonc");
});

test("generateTypeScriptInterfaces generates TypeScript interfaces", async () => {
    const parsed = await parseSql(schemaSql);
    const result = await generateTypeScript(parsed);
    await expect(result).toMatchFileSnapshot("./__snapshots__/lib.test.interfaces.ts");

    // await fs.writeFile("lib.test.interfaces.ts", result);
    // expect(result).toMatchSnapshot();
});
