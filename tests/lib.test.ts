import { generateTypeScript, parseSql } from "../src/lib.ts";
import { expect, test } from "vitest";
import fs from "node:fs/promises";

function sql(strings: TemplateStringsArray, ...values: any[]) {
    return String.raw({ raw: strings }, ...values);
}

const schemaSql = fs.readFile(__dirname + "/schema.sql", "utf-8");

function snakeCaseToCamelCase(str: string): string {
    // E.g. "my_enum_example" -> "myEnumExample"
    return str
        .replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replaceAll(/^[a-z]/g, (letter) => letter.toLowerCase());
}

function snakeCaseToPascalCase(str: string): string {
    // E.g. "my_enum_example" -> "MyEnumExample"
    return str
        .replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        .replaceAll(/^[a-z]/g, (letter) => letter.toUpperCase());
}

test("parseSql parses the Create table statements", async () => {
    const result = await parseSql(await schemaSql);
    // await fs.writeFile("lib.test.result.json", JSON.stringify(result, null, 4));
    await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_parsed.jsonc");
});

test("generateTypeScriptInterfaces generates TypeScript interfaces", async () => {
    const parsed = await parseSql(await schemaSql);
    const result = await generateTypeScript(parsed, {
        renameEnums: snakeCaseToPascalCase,
        renameColumns: snakeCaseToCamelCase,
        renameTables: snakeCaseToPascalCase,
    });
    await expect(result).toMatchFileSnapshot(__dirname + "/__snapshots__/output_kysely.ts");

    // await fs.writeFile("lib.test.interfaces.ts", result);
    // expect(result).toMatchSnapshot();
});
