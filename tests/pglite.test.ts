import { createPgLiteDialect } from "./pglite.ts";
import { PGlite } from "@electric-sql/pglite";
import * as k from "kysely";
import { expect, describe, test } from "vitest";
import type { Database } from "./__snapshots__/output_kysely.ts";
import * as fs from "node:fs/promises";

describe("kysely", () => {
    test("kysely db schema", async () => {
        const pglite = new PGlite();
        const schemaSql = await fs.readFile(__dirname + "/schema.sql", "utf-8");
        await pglite.exec(schemaSql);

        const db = new k.Kysely<Database>({
            dialect: createPgLiteDialect(pglite),
            plugins: [new k.CamelCasePlugin()],
        });

        const value = {
            // bigserial is auto-generated, so we don't set it
            serial: 123,
            testInteger: 42,
            testBigint: 9223372036854775807n,
            testNumeric: "123.45",
            testFloat4: 3.14,
            testFloat8: 2.718281828,
            testDecimal: "99.99",
            testUuid: "550e8400-e29b-41d4-a716-446655440000",
            testText: "This is a test text",
            testVarchar: "Test varchar",
            testBoolean: true,
            testTimestamptz: new Date("2023-01-01T12:00:00Z"),
            testTimestamp: new Date("2023-01-01T12:00:00Z"),
            testDate: new Date("2023-01-01"),
            testTime: "12:30:45",
            testJsonb: { key: "value", number: 42 },
            testJson: { test: true, array: [1, 2, 3] },
            testEnum: "good" as const,
            testArrayText: ["hello", "world"],
            textArrayInteger: [1, 2, 3],
            testBytea: new Uint8Array([1, 2, 3, 4]),
            testXml: "<root><test>value</test></root>",
            testDefault: "custom value",
            testDefaultInt: 100,
            testDefaultNow: new Date("2023-06-15T10:30:00Z"),
            testDefaultDecimal: "50.25",
            testDefaultUuid: "123e4567-e89b-12d3-a456-426614174000",
            testCheckIsGt0: 10,
            testCheckIsGte0: 10,
            testCheckIsLt100: 50,
            testCheckIsLte100: 50,
            testCheckEqual42: 42,
            testCheckNotEqual42: 43,
            testCheckDecimalGt0: "10.00",
            testCheckIntBetween: 50,
            testNotNull: "This field cannot be null",
            testNotNullArray: ["required", "array", "values"],
        } satisfies k.InsertObject<Database, "various_types">;

        const [row] = await db
            .insertInto("various_types")
            .values(value)
            .returning(["bigserial"])
            .execute();
        if (!row || !row.bigserial) {
            throw new Error("Insert failed, no bigserial returned");
        }

        const output = await db
            .selectFrom("various_types")
            .selectAll()
            .where("bigserial", "=", row.bigserial)
            .executeTakeFirstOrThrow();

        expect(output).toStrictEqual({
            bigserial: row.bigserial,
            ...value,
            // Notice that the timestamp gets adjusted to local time, this is
            // the reason you should never use `timestamp`, use always
            // `timestamptz`
            testTimestamp: new Date("2023-01-01T10:00:00.000Z"),
        });
    });
});
