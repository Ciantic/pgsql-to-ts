import { deparse, parse } from "pgsql-parser";
import type { ColumnDef, CreateEnumStmt, CreateStmt, Node, ParseResult } from "@pgsql/types";

// https://doxygen.postgresql.org/parsenodes_8h.html#aa2da3f289480b73dbcaccf0404657c65
export type FKCONSTR_ACTION =
    | "c" // FKCONSTR_ACTION_CASCADE
    | "a" // FKCONSTR_ACTION_NOACTION
    | "r" // FKCONSTR_ACTION_RESTRICT
    | "d" // FKCONSTR_ACTION_SETDEFAULT
    | "n"; // FKCONSTR_ACTION_SETNULL

export type FKCONSTR_MATCHTYPE =
    | "f" // FKCONSTR_MATCH_FULL
    | "p" // FKCONSTR_MATCH_PARTIAL
    | "s"; // FKCONSTR_MATCH_SIMPLE

// https://pglast.readthedocs.io/en/v3/parsenodes.html#pglast.enums.parsenodes.pglast.enums.parsenodes.ConstrType

export type Column = {
    name: string;
    type: string;
    array: boolean;
    notnull: boolean;
    primarykey: boolean;
    generated_when?: "always" | "by default";
    unique: boolean;
    default?: string;
    check?: string;
    foreignKey?: {
        table: string;
        column: string;
        updateAction: FKCONSTR_ACTION;
        deleteAction: FKCONSTR_ACTION;
        matchType: FKCONSTR_MATCHTYPE;
    };
};

export type Table = {
    name: string;
    columns: Column[];
};

export type SqlParseResult = {
    tables: Table[];
    enums: EnumDef[];
};

type EnumDef = {
    name: string;
    values: string[];
};

function sval(node: Node | undefined): string {
    if (node && "String" in node && node.String.sval) {
        return node.String.sval;
    }
    throw new Error("Node does not contain a String property.");
}

function omitUndefined<T extends Record<string, any>>(
    obj: T
): { [key in keyof T as T[key] extends undefined ? never : key]: T[key] } {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result as T;
}

async function parseColumn({ colname, typeName, constraints }: ColumnDef): Promise<Column> {
    const colName = colname;
    const typeNames = typeName?.names;
    let notnull = false;
    let primarykey = false;
    let unique = false;
    let array = false;
    let generated_when: Column["generated_when"] | undefined = undefined;
    let defaultValue = undefined as string | undefined;
    let defaultCheck = undefined as string | undefined;
    let foreignkeyRelation = undefined as Column["foreignKey"] | undefined;

    if (!colName) {
        console.warn("No column name found in ColumnDef.");
        throw new Error("Column name is required.");
    }
    if (!typeNames) {
        console.warn("No type names found in ColumnDef.");
        throw new Error("Type names are required.");
    }
    const type = typeNames
        .map(sval)
        .filter((name) => name !== "pg_catalog")
        .join(".");

    if (typeName.arrayBounds && typeName.arrayBounds.length > 0) {
        array = true;
    }

    for (const constraint of constraints || []) {
        if ("Constraint" in constraint) {
            const {
                Constraint: {
                    contype,
                    pktable,
                    pk_attrs,
                    fk_matchtype,
                    fk_del_action,
                    fk_upd_action,
                    raw_expr,
                },
            } = constraint;
            if (!contype) {
                console.warn("No constraint type found.");
                continue;
            } else if (contype === "CONSTR_NOTNULL") {
                notnull = true;
            } else if (contype === "CONSTR_PRIMARY") {
                // Primary key constraints are combination of unique and notnull
                unique = true;
                notnull = true;
                primarykey = true;
            } else if (contype === "CONSTR_UNIQUE") {
                unique = true;
            } else if (contype === "CONSTR_FOREIGN") {
                if (!pktable) {
                    console.warn("Foreign key constraint missing pktable.");
                    continue;
                }
                if (!pk_attrs) {
                    console.warn("Foreign key constraint missing pk_attrs.");
                    continue;
                }

                foreignkeyRelation = {
                    table: pktable?.relname || "",
                    column: sval(pk_attrs[0]),
                    updateAction: fk_upd_action as FKCONSTR_ACTION,
                    deleteAction: fk_del_action as FKCONSTR_ACTION,
                    matchType: fk_matchtype as FKCONSTR_MATCHTYPE,
                };
            } else if (contype === "CONSTR_DEFAULT") {
                if (raw_expr) {
                    defaultValue = await deparse(raw_expr);
                }
            } else if (contype === "CONSTR_CHECK") {
                if (raw_expr) {
                    defaultCheck = await deparse(raw_expr);
                }
            } else if (contype === "CONSTR_IDENTITY") {
                if (constraint.Constraint.generated_when === "a") {
                    generated_when = "always";
                } else if (constraint.Constraint.generated_when === "d") {
                    generated_when = "by default";
                }
            } else {
                console.warn("Unknown constraint type:", contype);
            }
        }
    }

    return omitUndefined({
        name: colName,
        type,
        array,
        notnull,
        primarykey,
        unique,
        foreignKey: foreignkeyRelation,
        default: defaultValue,
        check: defaultCheck,
    });
}

async function parseTable({ tableElts, relation }: CreateStmt): Promise<Table> {
    const tableName = relation?.relname;
    if (!tableName) {
        console.warn("No table name found in CreateStmt.");
        throw new Error("Table name is required.");
    }

    if (!tableElts) {
        console.warn("No table elements found in CreateStmt.");
        throw new Error("Table elements are required.");
    }

    const table: Table = {
        name: tableName,
        columns: [],
    };

    // Iterate columns
    for (const node of tableElts || []) {
        if ("ColumnDef" in node) {
            console.log("Parsing column:", node.ColumnDef);
            console.dir(node.ColumnDef, { depth: 999 });
            table.columns.push(await parseColumn(node.ColumnDef));
        }
    }

    return table;
}

function parseEnum({ typeName, vals }: CreateEnumStmt): { enumName: string; values: string[] } {
    if (!typeName || !vals) {
        console.warn("No values or type name found for CreateEnumStmt.");
        throw new Error("Enum type name and values are required.");
    }

    // Extract enum type name
    const enumTypeName = typeName?.map(sval).join(".");
    if (!enumTypeName) {
        console.warn("No enum type name found in CreateEnumStmt.");
        throw new Error("Enum type name is required.");
    }

    // Extract enum values
    const enumValues = vals?.map(sval);
    if (!enumValues || enumValues.length === 0) {
        console.warn("No enum values found in CreateEnumStmt.");
        throw new Error("Enum values are required.");
    }

    return {
        enumName: enumTypeName,
        values: enumValues,
    };
}

export async function parseSql(str: string): Promise<SqlParseResult> {
    const enums: EnumDef[] = [];
    const tables: Table[] = [];
    const tableParse = (await parse(str)) as ParseResult;
    if (!tableParse.stmts) {
        throw new Error("No statements found in the parsed result.");
    }

    for (const { stmt } of tableParse.stmts) {
        if (!stmt) {
            console.warn("No statement found in the current iteration.");
            continue;
        }

        if ("CreateStmt" in stmt) {
            tables.push(await parseTable(stmt.CreateStmt));
        } else if ("CreateEnumStmt" in stmt) {
            const { enumName, values } = parseEnum(stmt.CreateEnumStmt);
            enums.push({ name: enumName, values });
        }
    }

    return { tables, enums };
}

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
    numeric: "number",
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

type GenOpts = {
    indent?: string;
    mapping?: typeof PGTYPE_TO_TYPESCRIPT;
    renameEnums?: (name: string) => string;
    renameColumns?: (name: string) => string;
    renameTables?: (name: string) => string;
};

const identityf = <T>(v: T): T => v;

function generateTypeScriptEnums(enums: EnumDef[], options: GenOpts = {}): string {
    let result = "";
    const renameEnums = options.renameEnums ?? identityf;
    for (const { name, values } of enums) {
        const formattedValues = values.map((v) => `"${v}"`).join(" | ");
        result += `export type ${renameEnums(name)} = ${formattedValues};\n`;
    }
    return result;
}

function generateKyselyColumnType(
    { column, enums }: { column: Column; enums: EnumDef[] },
    options: GenOpts = {}
): string {
    const enumNames = enums.map(({ name }) => name);
    const renameEnums = options.renameEnums ?? identityf;
    const typeMap = options.mapping ?? PGTYPE_TO_TYPESCRIPT;
    const columnType: keyof typeof typeMap = column.type as keyof typeof typeMap;
    let typeName = "";

    if (columnType in typeMap) {
        typeName = typeMap[columnType];
    } else if (enumNames.includes(columnType)) {
        typeName = renameEnums(columnType);
    } else {
        throw new Error(`Unknown type: ${column.type}`);
    }

    if (!column.notnull) {
        typeName += " | null";
    }

    if (column.array) {
        if (typeName.search(" ") > 0) {
            typeName = `(${typeName})`;
        }
        typeName = typeName + "[]";
    }

    if (columnType === "serial" || columnType === "bigserial") {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    } else if (column.generated_when === "always") {
        typeName = `ColumnType<${typeName}, never, never>`;
    } else if (column.generated_when === "by default") {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    } else if (column.default) {
        typeName = `ColumnType<${typeName}, ${typeName} | undefined, ${typeName}>`;
    }
    return typeName;
}

function generateTypeScriptTables(
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
            const typeName = generateKyselyColumnType({ column, enums }, options);
            result += `${indent}${renameColumns(column.name)}: ${typeName};\n`;
        }
        result += "}\n";
    }
    return result;
}

function generateKyselyDatabase(result: SqlParseResult, options: GenOpts = {}): string {
    const indent = options.indent ?? "  ";
    const renameTables = options.renameTables ?? identityf;
    const renameColumns = options.renameColumns ?? identityf;
    let ret = `export type Database = {\n`;

    for (const table of result.tables) {
        ret += `${indent}${table.name}: ${renameTables(table.name)},\n`;
        // ret += `${indent}${table.name}: {\n`;
        // for (const column of table.columns) {
        //     const typeName = generateKyselyColumnType({ column, enums: result.enums }, options);
        //     ret += `${indent}${indent}${renameColumns(column.name)}: ${typeName};\n`;
        // }
        // ret += `${indent}},\n`;
    }
    ret += "}";
    return ret;
}

export function generateTypeScript(result: SqlParseResult, options: GenOpts = {}): string {
    const typeMap = PGTYPE_TO_TYPESCRIPT;
    const prefix = `import type { ColumnType } from "kysely";\n\n`;
    const items = [] as string[];
    items.push(generateTypeScriptEnums(result.enums, options));
    items.push(generateTypeScriptTables(result, options));
    items.push(generateKyselyDatabase(result, options));
    return `${prefix}${items.join("\n")}\n`;
}
