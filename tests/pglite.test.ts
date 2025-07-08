import { createPgLiteDialect } from "./pglite.ts";
import { PGlite } from "@electric-sql/pglite";
import * as k from "kysely";
import { expect, test } from "vitest";
import type { Database } from "./__snapshots__/output_kysely.ts";
import * as fs from "node:fs/promises";

test("kysely db schema", async () => {
    const pglite = new PGlite();
    const schemaSql = await fs.readFile(__dirname + "/schema.sql", "utf-8");
    await pglite.exec(schemaSql);

    const db = new k.Kysely<Database>({
        dialect: createPgLiteDialect(pglite),
        plugins: [new k.CamelCasePlugin()],
    });

    await db
        .insertInto("various_types")
        .values({
            testArray: ["a", "b", "c"],
            testNotNull: "not null value",
            testNotNullArray: ["not null", "array"],
            textArrayInts: [1, 2, 3],
        })
        .execute();
});
