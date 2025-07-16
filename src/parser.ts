import { deparse, parse } from "pgsql-parser";
import type { ColumnDef, CreateEnumStmt, CreateStmt, Node, ParseResult } from "@pgsql/types";
import { identityf, omitUndefined } from "./utils.ts";

export type PgTypes =
    | "bigserial"
    | "bool"
    | "date"
    | "float4"
    | "float8"
    | "int4"
    | "int8"
    | "json"
    | "jsonb"
    | "numeric"
    | "serial"
    | "text"
    | "time"
    | "uuid"
    | "varchar"
    | "timestamp"
    | "timestamptz"
    | "bytea"
    | "xml";

export type Mapper = {
    [k in PgTypes]: (c: Column) => string;
};

export const SCHEMA_KINDS = ["select", "insert", "update", "update_key"] as const;

export type SchemaKind = (typeof SCHEMA_KINDS)[number];

/**
 * Options for code generation.
 *
 */
export type GenOpts = {
    indent: string;
    mappingToTypescript?: Mapper;
    mappingToValibot?: Mapper;
    mappingToZod?: Mapper;
    mappingToArktype?: Mapper;
    renameEnums: (name: string) => string;
    renameColumns: (name: string) => string;
    renameTables: (name: string) => string;
    renameSchemas: (name: string, kind: SchemaKind) => string;
    rowVersionColumnNames: string[];
    updatedAtColumnNames: string[];
    createdAtColumnNames: string[];
};

export const DEFAULT_GENOPTS = {
    indent: "    ",
    rowVersionColumnNames: ["concurrency_stamp", "version"],
    updatedAtColumnNames: ["updated_at", "last_modified"],
    createdAtColumnNames: ["created_at", "inserted_at"],
    renameEnums: identityf,
    renameColumns: identityf,
    renameTables: identityf,
    renameSchemas(name: string, kind: SchemaKind) {
        return this?.renameTables?.(name + "_" + kind) ?? name + "_" + kind;
    },
} as const satisfies GenOpts;

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

type CheckSimpleRule =
    | {
          operator: ">" | ">=";
          min: number;
      }
    | {
          operator: "<" | "<=";
          max: number;
      }
    | {
          operator: "=" | "!=";
          value: number;
      }
    | {
          operator: "BETWEEN";
          min: number;
          max: number;
      };

export type Column = {
    name: string;
    type: PgTypes | {};
    typeParams?: (string | number | boolean)[];
    array?: boolean;
    notnull?: boolean;
    primarykey?: boolean;
    generatedWhen?: "always" | "by default";
    unique?: boolean;
    default?: string;
    defaultSimple?: string;
    check?: string;
    checkSimple?: CheckSimpleRule;
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

export type EnumDef = {
    name: string;
    values: string[];
};

function parseSimpleDefaultValue(node: Node | undefined): string | number | boolean | undefined {
    if (!node) return undefined;
    if ("A_Const" in node && node.A_Const) {
        return constval(node);
    }
    return undefined;
}

/**
 * Parse given check equation into a KnownCheck object.
 *
 * Supported equations:
 *
 * - `column_name > 0`
 * - `"column_name" > 0`
 * - `column_name < 100`
 * - `column_name <= 100`
 * - `column_name = 42`
 * - `column_name != 42`
 * - `column_name >= 0`
 * - `column_name <= 100`
 * - `column_name BETWEEN 0 AND 100`
 */
function parseSimpleCheckRule(
    equation: string
): { column: string; rule: CheckSimpleRule } | undefined {
    const trimmed = equation.trim();
    const match = trimmed.match(
        /^(?<column>[\w"]+)\s*(?<operator>>=|<=|>|<|=|!=|BETWEEN)\s*(?<value>.+)$/
    );
    if (!match || !match.groups) {
        return undefined;
    }
    let { operator, value, column } = match.groups;
    if (!column || !operator || !value) {
        return undefined;
    }

    if (column.startsWith('"') && column.endsWith('"')) {
        column = column.slice(1, -1); // Remove quotes
    }

    if (operator === "BETWEEN") {
        const parts = value.split("AND").map((v) => v.trim());
        if (parts.length !== 2) return undefined;
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (isNaN(min) || isNaN(max)) return undefined;
        return { column, rule: { operator, min, max } };
    }

    const numValue = Number(value?.trim());
    if (isNaN(numValue)) return undefined;

    switch (operator) {
        case ">":
        case ">=":
            return { column, rule: { operator, min: numValue } };
        case "<":
        case "<=":
            return { column, rule: { operator, max: numValue } };
        case "=":
        case "!=":
            return { column, rule: { operator, value: numValue } };
        default:
            return undefined;
    }
}

function sval(node: Node | undefined): string {
    if (node && "String" in node && node.String.sval) {
        return node.String.sval;
    }
    throw new Error("Node does not contain a String property.");
}

function constval(node: Node | undefined): string | number | boolean {
    if (node && "A_Const" in node && node.A_Const.ival?.ival !== undefined) {
        return node.A_Const.ival.ival;
    } else if (node && "A_Const" in node && node.A_Const.fval?.fval !== undefined) {
        return node.A_Const.fval.fval;
    } else if (node && "A_Const" in node && node.A_Const.sval?.sval !== undefined) {
        return node.A_Const.sval.sval;
    } else if (node && "A_Const" in node && node.A_Const.boolval?.boolval !== undefined) {
        return node.A_Const.boolval.boolval;
    } else if (node && "A_Const" in node && node.A_Const.bsval?.bsval !== undefined) {
        return node.A_Const.bsval.bsval;
    } else if (node && "A_Const" in node && node.A_Const.isnull !== undefined) {
        return node.A_Const.isnull;
    }

    throw new Error("Node does not contain a valid constant value.");
}

async function parseColumn({ colname, typeName, constraints }: ColumnDef): Promise<Column> {
    const colName = colname;
    const typeNames = typeName?.names;
    let notnull = undefined as boolean | undefined;
    let primarykey = undefined as boolean | undefined;
    let unique = undefined as boolean | undefined;
    let array = undefined as boolean | undefined;
    let typeParams: (string | number | boolean)[] = [];
    let generatedWhen: Column["generatedWhen"] | undefined = undefined;
    let defaultSimpleValue: string | number | boolean | undefined = undefined;
    let defaultValue = undefined as string | undefined;
    let defaultCheck = undefined as string | undefined;
    let foreignkeyRelation = undefined as Column["foreignKey"] | undefined;
    let checkSimple: CheckSimpleRule | undefined = undefined;

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

    if (typeName.typmods && typeName.typmods.length > 0) {
        typeParams = typeName.typmods.map(constval);
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
                    defaultSimpleValue = parseSimpleDefaultValue(raw_expr);
                }
            } else if (contype === "CONSTR_CHECK") {
                if (raw_expr) {
                    defaultCheck = await deparse(raw_expr);
                    const parsed = parseSimpleCheckRule(defaultCheck);
                    if (parsed && parsed.column != colName) {
                        console.warn(
                            `Check constraint column "${parsed.column}" does not match column name "${colName}".`
                        );
                    } else {
                        checkSimple = parsed?.rule;
                    }
                }
            } else if (contype === "CONSTR_IDENTITY") {
                if (constraint.Constraint.generated_when === "a") {
                    generatedWhen = "always";
                } else if (constraint.Constraint.generated_when === "d") {
                    generatedWhen = "by default";
                }
            } else {
                console.warn("Unknown constraint type:", contype);
            }
        }
    }

    return omitUndefined({
        name: colName,
        typeParams: typeParams.length > 0 ? typeParams : undefined,
        type,
        array,
        notnull,
        generatedWhen,
        primarykey,
        unique,
        foreignKey: foreignkeyRelation,
        default: defaultValue,
        defaultSimple: defaultSimpleValue,
        check: defaultCheck,
        checkSimple,
    }) satisfies Column;
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

/**
 * Parse given SQL to objects representing tables and enums.
 */
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
