import { deparse, parse } from "pgsql-parser";
import type { ColumnDef, Node, ParseResult } from "@pgsql/types";

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

type SqlParseOpts = {
    enumToPascalCase?: boolean;
    columnsToCamelCase?: boolean;
};

export type Column = {
    name: string;
    type: string;
    array: boolean;
    notnull: boolean;
    primarykey: boolean;
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
    enums: EnumTypes;
};

type EnumTypes = {
    [key: string]: string[];
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

function snakeCaseToPascalCase(str: string): string {
    return str
        .replace(/(_\w)/g, (m) => (m && m[1] && m[1].toUpperCase()) || "")
        .replace(/^\w/, (m) => m.toUpperCase());
}

function snakeCaseToCamelCase(str: string): string {
    return str
        .replace(/(_\w)/g, (m) => (m && m[1] && m[1].toUpperCase()) || "")
        .replace(/^\w/, (m) => m.toLowerCase());
}

export async function parseSql(str: string, options: SqlParseOpts = {}): Promise<SqlParseResult> {
    const enums: EnumTypes = {};
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
            const {
                CreateStmt: { tableElts, relation },
            } = stmt;

            const tableName = relation?.relname;
            if (!tableName) {
                console.warn("No table name found in CreateStmt.");
                continue;
            }

            if (!tableElts) {
                console.warn("No table elements found in CreateStmt.");
                continue;
            }
            const table: Table = {
                name: tableName,
                columns: [],
            };

            // Iterate columns
            for (const node of tableElts || []) {
                if ("ColumnDef" in node) {
                    table.columns.push(await parseColumn(node.ColumnDef));
                }
            }
            tables.push(table);
        } else if ("CreateEnumStmt" in stmt) {
            const {
                CreateEnumStmt: { typeName, vals },
            } = stmt;

            if (!typeName || !vals) {
                console.warn("No values or type name found for CreateEnumStmt.");
                continue;
            }

            // Extract enum type name
            const enumTypeName = typeName?.map(sval).join(".");
            if (!enumTypeName) {
                console.warn("No enum type name found in CreateEnumStmt.");
                continue;
            }

            // Extract enum values
            const enumValues = vals?.map(sval);
            if (!enumValues || enumValues.length === 0) {
                console.warn("No enum values found in CreateEnumStmt.");
                continue;
            }

            enums[enumTypeName] = enumValues;
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

function generateTypeScriptEnums(enums: EnumTypes): string {
    let result = "";
    for (const [enumName, values] of Object.entries(enums)) {
        const formattedValues = values.map((v) => `"${v}"`).join(" | ");
        result += `export type ${enumName} = ${formattedValues};\n`;
    }
    return result;
}

function generateTypeScriptTables(
    { tables, enums }: SqlParseResult,
    typeMap: typeof PGTYPE_TO_TYPESCRIPT | undefined = undefined
): string {
    if (!typeMap) {
        typeMap = PGTYPE_TO_TYPESCRIPT;
    }
    let result = "";
    for (const table of tables) {
        result += `interface ${table.name} {\n`;
        for (const column of table.columns) {
            const columnType: keyof typeof typeMap = column.type as keyof typeof typeMap;
            if (!(columnType in typeMap) && !(columnType in enums)) {
                throw new Error(`Unknown type: ${column.type}`);
            }
            const tsType = typeMap[columnType] + (column.array ? `[]` : "");
            result += `  ${column.name}: ${tsType};\n`;
        }
        result += "}\n\n";
    }
    return result;
}

export function generateTypeScript(result: SqlParseResult): string {
    const typeMap = PGTYPE_TO_TYPESCRIPT;
    const prefix = `import type { ColumnType } from "kysely";\n\n`;
    let tsEnums = generateTypeScriptEnums(result.enums);
    let tsTables = generateTypeScriptTables(result, typeMap);
    return `${prefix}${tsEnums}\n${tsTables}`;
}
