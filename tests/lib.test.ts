import { generateKyselyDatabase, generateTypeScript, parseSql } from "../src/index.ts";
import { expect, describe, test } from "vitest";
import fs from "node:fs/promises";

const schemaSql = fs.readFile(__dirname + "/schema.sql", "utf-8");

function snakeCaseToCamelCase(str: string): string {
    // E.g. "my_enum_example" -> "myEnumExample"
    return str
        .replaceAll(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase())
        .replaceAll(/^[a-z0-9]/g, (letter) => letter.toLowerCase());
}

function snakeCaseToPascalCase(str: string): string {
    // E.g. "my_enum_example" -> "MyEnumExample"
    return str
        .replaceAll(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase())
        .replaceAll(/^[a-z0-9]/g, (letter) => letter.toUpperCase());
}

describe("library tests", () => {
    test("parseSql parses the Create table statements", async () => {
        const result = await parseSql(await schemaSql);
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_parsed.jsonc");
    });

    test("Generate kysely database", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateKyselyDatabase(parsed, {
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_kysely.ts");
    });

    test("Generate typescript types", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateTypeScript(parsed, {
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_typescript.ts");
    });
});
