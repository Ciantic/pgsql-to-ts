import type { GenOpts, Column, EnumDef, SqlParseResult, PgTypes, Mapper } from "../parser.ts";
import { HEADER, identityf } from "../utils.ts";
import type { BaseSchema } from "valibot";

type ValibotLibrary = typeof import("valibot");

/**
 * Fake Valibot
 *
 * This function creates a proxy that simulates the Valibot API, but instead returns strings.
 *
 * ```typescript
 * const v = fakeValibot();
 *
 * v.string(); // returns "v.string()"
 * v.pipe(v.string(), v.number()); // returns "v.pipe(v.string(), v.number())"
 * ```
 */
function fakeValibot(): ValibotLibrary {
    return new Proxy(
        {},
        {
            get: (target, prop) => {
                if (typeof prop !== "string") {
                    throw new Error(`Symbols are not supported`);
                }
                return (...args: any[]) => {
                    return `v.${prop}(${args.join(", ")})`;
                };
            },
        }
    ) as any;
}

export const v: ValibotLibrary = fakeValibot();

const TYPES_WITH_COMPARISON_OP = ["int4", "int8", "float4", "float8", "numeric"] as PgTypes[];

const comparisonOperator = (c: Column, original: any) => {
    // Numeric types are strings when coming from postgres, valibot doesn't have
    // minValue/maxValue/notValue/value for decimal strings. However we can use
    // the same logic for small values by coercing the value to a number before
    // comparison.
    //
    // https://github.com/fabian-hiller/valibot/issues/1247
    if (c.type === "numeric") {
        if (c.checkSimple?.operator === ">") {
            return `v.pipe(${original}, v.check(i => +i > ${c.checkSimple.min}))`;
        } else if (c.checkSimple?.operator === ">=") {
            return `v.pipe(${original}, v.check(i => +i >= ${c.checkSimple.min}))`;
        } else if (c.checkSimple?.operator === "<") {
            return `v.pipe(${original}, v.check(i => +i < ${c.checkSimple.max}))`;
        } else if (c.checkSimple?.operator === "<=") {
            return `v.pipe(${original}, v.check(i => +i <= ${c.checkSimple.max}))`;
        } else if (c.checkSimple?.operator === "BETWEEN") {
            return `v.pipe(${original}, v.check(i => +i >= ${c.checkSimple.min} && +i <= ${c.checkSimple.max}))`;
        } else if (c.checkSimple?.operator === "=") {
            return `v.pipe(${original}, v.check(i => +i === ${c.checkSimple.value}))`;
        } else if (c.checkSimple?.operator === "!=") {
            return `v.pipe(${original}, v.check(i => +i !== ${c.checkSimple.value}))`;
        }
        return original;
    }
    if (c.checkSimple?.operator === ">") {
        return v.pipe(original, v.minValue(c.checkSimple.min), v.notValue(c.checkSimple.min));
    } else if (c.checkSimple?.operator === ">=") {
        return v.pipe(original, v.minValue(c.checkSimple.min));
    } else if (c.checkSimple?.operator === "<") {
        return v.pipe(original, v.maxValue(c.checkSimple.max), v.notValue(c.checkSimple.max));
    } else if (c.checkSimple?.operator === "<=") {
        return v.pipe(original, v.maxValue(c.checkSimple.max));
    } else if (c.checkSimple?.operator === "=") {
        return v.pipe(original, v.value(c.checkSimple.value));
    } else if (c.checkSimple?.operator === "!=") {
        return v.pipe(original, v.notValue(c.checkSimple.value));
    } else if (c.checkSimple?.operator === "BETWEEN") {
        return v.pipe(original, v.minValue(c.checkSimple.min), v.maxValue(c.checkSimple.max));
    }
    return original;
};

export const PGTYPES_TO_VALIBOT = {
    bigserial: (c: Column) => v.bigint(),
    bool: (c: Column) => v.boolean(),
    date: (c: Column) => v.date(),
    float4: (c: Column) => v.number(),
    float8: (c: Column) => v.number(),
    int4: (c: Column) => v.pipe(v.number(), v.integer()),
    int8: (c: Column) => v.bigint(),
    json: (c: Column) => v.any(),
    jsonb: (c: Column) => v.any(),
    numeric: (c: Column) => v.pipe(v.string(), v.decimal()),
    serial: (c: Column) => v.pipe(v.number(), v.integer()),
    text: (c: Column) => v.string(),
    time: (c: Column) => v.string(),
    uuid: (c: Column) => v.pipe(v.string(), v.uuid()),
    varchar: (c: Column) => v.string(),
    timestamp: (c: Column) => v.date(),
    timestamptz: (c: Column) => v.date(),
    bytea: (c: Column) => v.any(),
    xml: (c: Column) => v.string(),
} satisfies Record<PgTypes, (c: Column) => BaseSchema<any, any, any>>;

function generateValibotEnums(enums: EnumDef[], options: GenOpts = {}): string {
    return enums.map((e) => generateValibotEnumType(e, options)).join("\n");
}

function generateValibotEnumType({ name, values }: EnumDef, options: GenOpts = {}): string {
    const renameEnums = options.renameEnums ?? identityf;
    const formattedValues = values.map((v) => `"${v}"`).join(", ");
    return `export const ${renameEnums(name)} = v.picklist([${formattedValues}]);`;
}

function generateValibotColumnSchema(
    { column, enums }: { column: Column; enums: EnumDef[] },
    options: GenOpts = {}
) {
    const renameEnums = options.renameEnums ?? identityf;
    const v = fakeValibot();
    const typeMap = (options.mappingToValibot ?? (PGTYPES_TO_VALIBOT as any)) as Mapper;
    const columnType = column.type as PgTypes;
    let typeFunc = "";

    if (columnType in typeMap) {
        typeFunc = typeMap[columnType](column);
    } else if (enums.map((e) => e.name).includes(columnType)) {
        typeFunc = renameEnums(columnType);
    } else {
        throw new Error(`Unknown column type: ${columnType}`);
    }
    if (TYPES_WITH_COMPARISON_OP.includes(columnType)) {
        typeFunc = comparisonOperator(column, typeFunc);
    }
    if (column.array) {
        typeFunc = v.array(typeFunc as any) as any;
    }

    if (typeof column.defaultSimple !== "undefined") {
        typeFunc = v.nullish(typeFunc as any, JSON.stringify(column.defaultSimple)) as any;
    } else if (!column.notnull) {
        typeFunc = v.nullish(typeFunc as any) as any;
    }
    return typeFunc;
}

function generateValibotTableSchemas(
    { tables, enums }: SqlParseResult,
    options: GenOpts = {}
): string {
    const indent = options.indent ?? "  ";
    const renameTables = options.renameTables ?? identityf;
    const renameColumns = options.renameColumns ?? identityf;
    const items: string[] = [];
    for (const table of tables) {
        const tableName = renameTables(table.name);
        const columns: string[] = [];

        for (const column of table.columns) {
            const columnName = renameColumns(column.name);
            const type = generateValibotColumnSchema({ column, enums }, options);
            columns.push(`${indent}${columnName}: ${type}`);
        }

        items.push(`export const ${tableName} = v.object({`);
        items.push(columns.join(",\n"));
        items.push(`});`);
        items.push(``);
    }

    return items.join("\n");
}

export function generateValibotSchemas(result: SqlParseResult, options: GenOpts = {}): string {
    const items = [...HEADER] as string[];
    items.push(`import * as v from "valibot";`);
    items.push(``);
    items.push(generateValibotEnums(result.enums, options));
    if (result.enums.length > 0) {
        items.push(``);
    }
    items.push(generateValibotTableSchemas(result, options));
    return items.join("\n");
}
