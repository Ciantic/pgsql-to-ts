import { HEADER } from "../utils.ts";
import type { Column, EnumDef, SqlParseResult } from "../parser.ts";
import { identityf } from "../utils.ts";

/**
 * This typemap is dependent on PostgreSQL driver (e.g. node-postgres or PgLite)
 * and how it maps PostgreSQL types to JavaScript types.
 */
export const PGTYPE_TO_TYPESCRIPT = {
    bigserial: "bigint",
    bool: "boolean",
    date: "Date",
    float4: "number",
    float8: "number",
    int4: "number",
    int8: "bigint",
    json: "any",
    jsonb: "any",
    numeric: "string",
    serial: "number",
    text: "string",
    time: "string",
    uuid: "string",
    varchar: "string",
    timestamp: "Date",
    timestamptz: "Date",
    bytea: "Uint8Array",
    xml: "string",
    // point: "Point",
    // circle: "Circle",
};

export type GenOpts = {
    indent?: string;
    mappingToTypescript?: typeof PGTYPE_TO_TYPESCRIPT;
    mappingToValibot?: typeof PGTYPE_TO_TYPESCRIPT;
    mappingToZod?: typeof PGTYPE_TO_TYPESCRIPT;
    mappingToArktype?: typeof PGTYPE_TO_TYPESCRIPT;
    renameEnums?: (name: string) => string;
    renameColumns?: (name: string) => string;
    renameTables?: (name: string) => string;
};

/**
 * Generate TypeScript enums from the parsed SQL enums.
 *
 * For instance, `export type MyEnum = "good" | "bad" | "ugly" | "dont know";`
 */
export function generateTypeScriptEnums(enums: EnumDef[], options: GenOpts = {}): string {
    let result = "";
    const renameEnums = options.renameEnums ?? identityf;
    for (const { name, values } of enums) {
        const formattedValues = values.map((v) => `"${v}"`).join(" | ");
        result += `export type ${renameEnums(name)} = ${formattedValues};\n`;
    }
    return result;
}

/**
 * Generate TypeScript type for a column based on its PostgreSQL type.
 *
 * For instance `string` or `string | null`.
 */
export function generateTypescriptColumnType(
    { column, enums }: { column: Column; enums: EnumDef[] },
    options: GenOpts = {}
): string {
    const enumNames = enums.map(({ name }) => name);
    const renameEnums = options.renameEnums ?? identityf;
    const typeMap = options.mappingToTypescript ?? PGTYPE_TO_TYPESCRIPT;
    const columnType: keyof typeof typeMap = column.type as keyof typeof typeMap;
    let typeName = "";

    if (columnType in typeMap) {
        typeName = typeMap[columnType];
    } else if (enumNames.includes(columnType)) {
        typeName = renameEnums(columnType);
    } else {
        throw new Error(`Unknown type: ${column.type}`);
    }
    if (column.array) {
        if (typeName.search(" ") > 0) {
            typeName = `(${typeName})`;
        }
        typeName = typeName + "[]";
    }

    if (!column.notnull) {
        typeName += " | null";
    }

    return typeName;
}

/**
 * Generate TypeScript interfaces for the tables in the database.
 */
export function generateTypeScriptTables(
    { tables, enums }: SqlParseResult,
    options: GenOpts = {}
): string {
    const renameColumns = options.renameColumns ?? identityf;
    const renameTables = options.renameTables ?? identityf;
    const indent = options.indent ?? "    ";
    let result = "";

    for (const table of tables) {
        result += `export interface ${renameTables(table.name)} {\n`;
        for (const column of table.columns) {
            const typeName = generateTypescriptColumnType({ column, enums }, options);
            result += `${indent}${renameColumns(column.name)}: ${typeName};\n`;
        }
        result += "}\n\n";
    }
    return result;
}

/**
 * Generate TypeScript interfaces for the tables in the database.
 *
 * For instance, it generates a TypeScript interface that looks like:
 * ```typescript
 * export interface SpecialKey {
 *   testPk: number;
 * }
 *
 * export interface VariousTypes {
 *   bigserial: bigint;
 *   serial: number | null;
 *   testInteger: number | null;
 * }
 * ```
 */
export function generateTypeScript(result: SqlParseResult, options: GenOpts = {}): string {
    const items = [...HEADER] as string[];
    items.push(generateTypeScriptEnums(result.enums, options));
    items.push(generateTypeScriptTables(result, options));
    return items.join("\n");
}
