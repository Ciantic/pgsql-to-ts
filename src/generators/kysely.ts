import {
    DEFAULT_GENOPTS,
    type Column,
    type EnumDef,
    type GenOpts,
    type SqlParseResult,
} from "../parser.ts";
import {
    generateTypescriptColumnType,
    generateTypeScriptEnums,
    PGTYPE_TO_TYPESCRIPT,
} from "./typescript.ts";
import { HEADER } from "../utils.ts";

/**
 * Generate Kysely column type for a given column.
 *
 * For instance `string` or `ColumnType<string, string | undefined, string>`.
 */
function generateKyselyColumnType(
    { column, enums }: { column: Column; enums: EnumDef[] },
    options: GenOpts = DEFAULT_GENOPTS
): string {
    const columnType = column.type as keyof typeof PGTYPE_TO_TYPESCRIPT;
    let typeName = generateTypescriptColumnType({ column, enums }, options);

    if (columnType === "serial" || columnType === "bigserial") {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    } else if (column.generatedWhen === "always") {
        typeName = `ColumnType<${typeName}, never, never>`;
    } else if (column.generatedWhen === "by default") {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    } else if (column.default) {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    }
    return typeName;
}

/**
 * Generate Kysely database schema from the parsed SQL result.
 *
 * For instance, it generates a TypeScript type that looks like:
 * ```typescript
 * export type Database = {
 *   special_key: {
 *     testPk: number;
 *   },
 *   various_types: {
 *     bigserial: ColumnType<bigint, bigint | undefined, bigint>;
 *     serial: ColumnType<number | null, number | null | undefined, number | null>;
 *     testInteger: number | null;
 *   },
 * }
 * ```
 */
export function generateKyselyDatabase(
    result: SqlParseResult,
    opts: GenOpts = DEFAULT_GENOPTS
): string {
    const indent = opts.indent;
    const items: string[] = [...HEADER];
    items.push(`import type { ColumnType } from "kysely";\n`);
    items.push(generateTypeScriptEnums(result.enums, opts));
    items.push(`export type Database = {`);

    for (const table of result.tables) {
        // ret += `${indent}${table.name}: ${renameTables(table.name)},\n`;
        items.push(`${indent}${table.name}: {`);
        for (const column of table.columns) {
            const typeName = generateKyselyColumnType({ column, enums: result.enums }, opts);
            items.push(`${indent}${indent}${opts.renameColumns(column.name)}: ${typeName};`);
        }
        items.push(`${indent}},`);
    }
    items.push("}");
    items.push(``);
    return items.join("\n");
}
