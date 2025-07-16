import { HEADER } from "../utils.ts";
import {
    DEFAULT_GENOPTS,
    type Column,
    type EnumDef,
    type GenOpts,
    type Mapper,
    type SqlParseResult,
} from "../parser.ts";

/**
 * This typemap is dependent on PostgreSQL driver (e.g. node-postgres or PgLite)
 * and how it maps PostgreSQL types to JavaScript types.
 */
export const PGTYPE_TO_TYPESCRIPT = {
    bigserial: (c: Column) => "bigint",
    bool: (c: Column) => "boolean",
    date: (c: Column) => "Date",
    float4: (c: Column) => "number",
    float8: (c: Column) => "number",
    int4: (c: Column) => "number",
    int8: (c: Column) => "bigint",
    json: (c: Column) => "any",
    jsonb: (c: Column) => "any",
    numeric: (c: Column) => "string",
    serial: (c: Column) => "number",
    text: (c: Column) => "string",
    time: (c: Column) => "string",
    uuid: (c: Column) => "string",
    varchar: (c: Column) => "string",
    timestamp: (c: Column) => "Date",
    timestamptz: (c: Column) => "Date",
    bytea: (c: Column) => "Uint8Array",
    xml: (c: Column) => "string",
    // point: "Point",
    // circle: "Circle",
};

/**
 * Generate TypeScript enums from the parsed SQL enums.
 *
 * For instance, `export type MyEnum = "good" | "bad" | "ugly" | "dont know";`
 */
export function generateTypeScriptEnums(enums: EnumDef[], opts: GenOpts = DEFAULT_GENOPTS): string {
    let result = "";
    for (const { name, values } of enums) {
        const formattedValues = values.map((v) => `"${v}"`).join(" | ");
        result += `export type ${opts.renameEnums(name)} = ${formattedValues};\n`;
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
    opts: GenOpts = DEFAULT_GENOPTS
): string {
    const enumNames = enums.map(({ name }) => name);
    const typeMap = (opts.mappingToTypescript ?? PGTYPE_TO_TYPESCRIPT) as Mapper;
    const columnType = column.type as keyof typeof typeMap;
    let typeName = "";

    if (columnType in typeMap) {
        typeName = typeMap[columnType](column);
    } else if (enumNames.includes(columnType)) {
        typeName = opts.renameEnums(columnType);
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
    opts: GenOpts = DEFAULT_GENOPTS
): string {
    const indent = opts.indent;
    let result = "";

    for (const table of tables) {
        result += `export interface ${opts.renameTables(table.name)} {\n`;
        for (const column of table.columns) {
            const typeName = generateTypescriptColumnType({ column, enums }, opts);
            result += `${indent}${opts.renameColumns(column.name)}: ${typeName};\n`;
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
export function generateTypeScript(
    result: SqlParseResult,
    options: GenOpts = DEFAULT_GENOPTS
): string {
    const items = [...HEADER] as string[];
    items.push(generateTypeScriptEnums(result.enums, options));
    items.push(generateTypeScriptTables(result, options));
    return items.join("\n");
}
