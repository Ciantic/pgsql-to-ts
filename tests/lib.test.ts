import {
    DEFAULT_GENOPTS,
    generateKyselyDatabase,
    generateTypeScript,
    generateValibotSchemas,
    generateZodSchemas,
    generateTypeScriptJson,
    parseSql,
} from "../src/index.ts";
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
        await expect(
            generateTypeScriptJson(result, {
                ...DEFAULT_GENOPTS,
                renameEnums: snakeCaseToPascalCase,
                renameColumns: snakeCaseToCamelCase,
                renameTables: snakeCaseToPascalCase,
            })
        ).toMatchFileSnapshot(__dirname + "/__snapshots__/output_parsed.ts");
    });

    test("Generate kysely database", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateKyselyDatabase(parsed, {
            ...DEFAULT_GENOPTS,
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_kysely.ts");
    });

    test("Generate typescript types", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateTypeScript(parsed, {
            ...DEFAULT_GENOPTS,
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_typescript.ts");
    });

    test("Generate valibot schemas", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateValibotSchemas(parsed, {
            ...DEFAULT_GENOPTS,
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_valibot.ts");
    });

    test("Generate zod schemas", async () => {
        const parsed = await parseSql(await schemaSql);
        const result = await generateZodSchemas(parsed, {
            ...DEFAULT_GENOPTS,
            renameEnums: snakeCaseToPascalCase,
            renameColumns: snakeCaseToCamelCase,
            renameTables: snakeCaseToPascalCase,
        });
        await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_zod.ts");
    });
});
