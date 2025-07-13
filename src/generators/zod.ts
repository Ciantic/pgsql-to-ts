import type { GenOpts, Column, EnumDef, SqlParseResult, PgTypes, Mapper } from "../parser.ts";
import { HEADER, identityf } from "../utils.ts";

export type ZodLibrary = typeof import("zod");

/**
 * Fake Zod
 *
 * This function creates a proxy that simulates the Zod API, but instead returns strings.
 *
 * ```typescript
 * const z = fakeZod();
 *
 * z.string(); // returns "z.string()"
 * z.string().min(5); // returns "z.string().min(5)"
 * ```
 */
function fakeZod(): ZodLibrary {
    const createProxy = (path: string[] = []): any => {
        return new Proxy(
            {},
            {
                get: (target, prop) => {
                    if (typeof prop !== "string") {
                        if (prop === Symbol.toPrimitive) {
                            return () => path.join(".");
                        }
                        throw new Error(`Symbols are not supported`);
                    }

                    const newPath = [...path, prop];

                    return (...args: any[]) => {
                        const methodCall = `${newPath.join(".")}(${args
                            .map((v) => {
                                if (v instanceof RegExp) {
                                    return v.toString();
                                }
                                return JSON.stringify(v);
                            })
                            .join(", ")})`;

                        // Return a new proxy that starts with this method call
                        return createProxy([methodCall]);
                    };
                },
            }
        );
    };

    return createProxy(["z"]) as any;
}

export const z: ZodLibrary = fakeZod();

const TYPES_WITH_COMPARISON_OP = ["int4", "int8", "float4", "float8", "numeric"] as PgTypes[];

const comparisonOperator = (c: Column, original: any) => {
    if (c.type === "numeric") {
        if (c.checkSimple?.operator === ">") {
            return `${original}.refine(v => +v > ${c.checkSimple.min})`;
        } else if (c.checkSimple?.operator === ">=") {
            return `${original}.refine(v => +v >= ${c.checkSimple.min})`;
        } else if (c.checkSimple?.operator === "<") {
            return `${original}.refine(v => +v < ${c.checkSimple.max})`;
        } else if (c.checkSimple?.operator === "<=") {
            return `${original}.refine(v => +v <= ${c.checkSimple.max})`;
        } else if (c.checkSimple?.operator === "=") {
            return `${original}.refine(v => v === ${c.checkSimple.value})`;
        } else if (c.checkSimple?.operator === "!=") {
            return `${original}.refine(v => v !== ${c.checkSimple.value})`;
        }
    }
    if (c.checkSimple?.operator === ">") {
        return `${original}.gt(${c.checkSimple.min})`;
    } else if (c.checkSimple?.operator === ">=") {
        return `${original}.gte(${c.checkSimple.min})`;
    } else if (c.checkSimple?.operator === "<") {
        return `${original}.lt(${c.checkSimple.max})`;
    } else if (c.checkSimple?.operator === "<=") {
        return `${original}.lte(${c.checkSimple.max})`;
    } else if (c.checkSimple?.operator === "=") {
        // For exact values, we can use literal schema
        return `z.literal(${c.checkSimple.value})`;
    } else if (c.checkSimple?.operator === "!=") {
        // Zod doesn't have a direct "not equal" validator, so we use refine
        return `${original}.refine(val => val !== ${c.checkSimple.value}, { message: "Value must not equal ${c.checkSimple.value}" })`;
    } else if (c.checkSimple?.operator === "BETWEEN") {
        return `${original}.gte(${c.checkSimple.min}).lte(${c.checkSimple.max})`;
    }
    return original;
};

export const PGTYPES_TO_ZOD = {
    bigserial: (c: Column) => z.bigint(),
    bool: (c: Column) => z.boolean(),
    date: (c: Column) => z.date(),
    float4: (c: Column) => z.number(),
    float8: (c: Column) => z.number(),
    int4: (c: Column) => z.int(),
    int8: (c: Column) => z.bigint(),
    json: (c: Column) => z.any(),
    jsonb: (c: Column) => z.any(),
    numeric: (c: Column) => z.string().regex(/^-?\d+(\.\d+)?$/),
    serial: (c: Column) => z.int(),
    text: (c: Column) => z.string(),
    time: (c: Column) => z.string(),
    uuid: (c: Column) => z.uuid(),
    varchar: (c: Column) => z.string(),
    timestamp: (c: Column) => z.date(),
    timestamptz: (c: Column) => z.date(),
    bytea: (c: Column) => z.any(),
    xml: (c: Column) => z.string(),
} satisfies Record<PgTypes, (c: Column) => any>;

function generateZodEnums(enums: EnumDef[], options: GenOpts = {}): string {
    return enums.map((e) => generateZodEnumType(e, options)).join("\n");
}

function generateZodEnumType({ name, values }: EnumDef, options: GenOpts = {}): string {
    const renameEnums = options.renameEnums ?? identityf;
    const formattedValues = values.map((v) => `"${v}"`).join(", ");
    return `export const ${renameEnums(name)} = z.enum([${formattedValues}]);`;
}

function generateZodColumnSchema(
    { column, enums }: { column: Column; enums: EnumDef[] },
    options: GenOpts = {}
) {
    const renameEnums = options.renameEnums ?? identityf;
    const z = fakeZod();
    const typeMap = (options.mappingToZod ?? (PGTYPES_TO_ZOD as any)) as Mapper;
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
        typeFunc = `z.array(${typeFunc})`;
    }

    if (!column.notnull) {
        typeFunc = `${typeFunc}.nullable()`;
    }

    return typeFunc;
}

function generateZodTableSchemas({ tables, enums }: SqlParseResult, options: GenOpts = {}): string {
    const indent = options.indent ?? "  ";
    const renameTables = options.renameTables ?? identityf;
    const renameColumns = options.renameColumns ?? identityf;
    const items: string[] = [];

    for (const table of tables) {
        const tableName = renameTables(table.name);
        const columns: string[] = [];

        for (const column of table.columns) {
            const columnName = renameColumns(column.name);
            const type = generateZodColumnSchema({ column, enums }, options);
            columns.push(`${indent}${columnName}: ${type}`);
        }

        items.push(`export const ${tableName} = z.object({`);
        items.push(columns.join(",\n"));
        items.push(`});`);
        items.push(``);
        items.push(`export type ${tableName} = z.infer<typeof ${tableName}>;`);
        items.push(``);
    }

    return items.join("\n");
}

export function generateZodSchemas(result: SqlParseResult, options: GenOpts = {}): string {
    const items = [...HEADER] as string[];
    items.push(`import { z } from "zod";`);
    items.push(``);
    items.push(generateZodEnums(result.enums, options));
    if (result.enums.length > 0) {
        items.push(``);
    }
    items.push(generateZodTableSchemas(result, options));
    return items.join("\n");
}
