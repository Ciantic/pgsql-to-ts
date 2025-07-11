import * as v from "valibot";
import type { EnumDef, SqlParseResult } from "../parser.ts";
import type { GenOpts } from "./typescript.ts";
import { HEADER } from "../utils.ts";

const PGTYPES_TO_VALIBOT = {
    bigserial: () => v.bigint(),
    bool: () => v.boolean(),
    date: () => v.date(),
    float4: () => v.number(),
    float8: () => v.number(),
    int4: () => v.number(),
    int8: () => v.bigint(),
    json: () => v.any(),
    jsonb: () => v.any(),
    numeric: () => v.string(),
    serial: () => v.number(),
    text: () => v.string(),
    time: () => v.string(),
    uuid: () => v.uuid(),
    varchar: () => v.string(),
    timestamp: () => v.date(),
    timestamptz: () => v.date(),
    bytea: () => v.array(v.number()),
    xml: () => v.string(),
};

// const PGTYPES_TO_VALIBOT: typeof PGTYPE_TO_TYPESCRIPT = {
//     bigserial: "v.bigint()",
//     bool: "v.boolean()",
//     date: "v.date()",
//     float4: "v.number()",
//     float8: "v.number()",
//     int4: "v.number()",
//     int8: "v.bigint()",
//     json: "v.any()",
//     jsonb: "v.any()",
//     numeric: "v.string()",
//     serial: "v.number()",
//     text: "v.string()",
//     time: "v.string()",
//     uuid: "v.uuid()",
//     varchar: "v.string()",
//     timestamp: "v.date()",
//     timestamptz: "v.date()",
//     bytea: "v.uint8Array()",
//     xml: "v.string()",
// };

function generateValibotEnums(enums: EnumDef[], options: GenOpts = {}): string {
    // TODO: Implement Valibot enums generation
    return "";
}

function generateValibotTableSchemas(
    { tables, enums }: SqlParseResult,
    options: GenOpts = {}
): string {
    // TODO: Implement Valibot table schemas generation
    return "";
}

export function generateValibotSchemas(result: SqlParseResult, options: GenOpts = {}): string {
    const items = [...HEADER] as string[];
    items.push(generateValibotEnums(result.enums, options));
    items.push(generateValibotTableSchemas(result, options));
    return items.join("\n");
}
