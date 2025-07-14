// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import { z } from "zod";

export const MyEnumExample = z.enum(["good", "bad", "ugly", "dont know"]);

export const SpecialKey = z.object({
    testPk: z.int()
});

export type SpecialKey = z.infer<typeof SpecialKey>;

export const VariousTypes = z.object({
    bigserial: z.bigint(),
    serial: z.int().nullish(),
    testInteger: z.int().nullish(),
    testBigint: z.bigint().nullish(),
    testNumeric: z.string().regex(/^-?\d+(\.\d+)?$/).nullish(),
    testFloat4: z.number().nullish(),
    testFloat8: z.number().nullish(),
    testDecimal: z.string().regex(/^-?\d+(\.\d+)?$/).nullish(),
    testUuid: z.uuid().nullish(),
    testText: z.string().nullish(),
    testVarchar: z.string().nullish(),
    testBoolean: z.boolean().nullish(),
    testTimestamptz: z.date().nullish(),
    testTimestamp: z.date().nullish(),
    testDate: z.date().nullish(),
    testTime: z.string().nullish(),
    testJsonb: z.any().nullish(),
    testJson: z.any().nullish(),
    testEnum: MyEnumExample.nullish(),
    testArrayText: z.array(z.string()).nullish(),
    textArrayInteger: z.array(z.int()).nullish(),
    testBytea: z.any().nullish(),
    testXml: z.string().nullish(),
    testDefault: z.string().nullish().default("default value"),
    testDefaultInt: z.int().default(42),
    testDefaultNow: z.date(),
    testDefaultDecimal: z.string().regex(/^-?\d+(\.\d+)?$/).default("0.00"),
    testDefaultUuid: z.uuid(),
    testCheckIsGt0: z.int().gt(0).nullish(),
    testCheckIsGte0: z.int().gte(0).nullish(),
    testCheckIsLte100: z.int().lte(100).nullish(),
    testCheckIsLt100: z.int().lt(100).nullish(),
    testCheckEqual42: z.literal(42).nullish(),
    testCheckNotEqual42: z.int().nullish(),
    testCheckIntBetween: z.int().gte(0).lte(100).nullish(),
    testCheckDecimalGt0: z.string().regex(/^-?\d+(\.\d+)?$/).refine(v => +v > 0).nullish(),
    testCheckFoo: z.int().nullish(),
    testNotNull: z.string(),
    testNotNullArray: z.array(z.string())
});

export type VariousTypes = z.infer<typeof VariousTypes>;

export const TestForeignkeys = z.object({
    testPk: z.uuid(),
    testFkToVariousTypes: z.bigint().nullish(),
    testFkToSelf: z.uuid().nullish()
});

export type TestForeignkeys = z.infer<typeof TestForeignkeys>;
