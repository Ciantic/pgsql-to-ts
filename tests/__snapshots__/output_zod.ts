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
  serial: z.int().nullable(),
  testInteger: z.int().nullable(),
  testBigint: z.bigint().nullable(),
  testNumeric: z.string().regex(/^-?\d+(\.\d+)?$/).nullable(),
  testFloat4: z.number().nullable(),
  testFloat8: z.number().nullable(),
  testDecimal: z.string().regex(/^-?\d+(\.\d+)?$/).nullable(),
  testUuid: z.uuid().nullable(),
  testText: z.string().nullable(),
  testVarchar: z.string().nullable(),
  testBoolean: z.boolean().nullable(),
  testTimestamptz: z.date().nullable(),
  testTimestamp: z.date().nullable(),
  testDate: z.date().nullable(),
  testTime: z.string().nullable(),
  testJsonb: z.any().nullable(),
  testJson: z.any().nullable(),
  testEnum: MyEnumExample.nullable(),
  testArrayText: z.array(z.string()).nullable(),
  textArrayInteger: z.array(z.int()).nullable(),
  testBytea: z.any().nullable(),
  testXml: z.string().nullable(),
  testDefault: z.string().nullable(),
  testDefaultInt: z.int(),
  testDefaultNow: z.date(),
  testDefaultDecimal: z.string().regex(/^-?\d+(\.\d+)?$/),
  testDefaultUuid: z.uuid(),
  testCheckIsGt0: z.int().gt(0).nullable(),
  testCheckIsGte0: z.int().gte(0).nullable(),
  testCheckIsLte100: z.int().lte(100).nullable(),
  testCheckIsLt100: z.int().lt(100).nullable(),
  testCheckEqual42: z.literal(42).nullable(),
  testCheckNotEqual42: z.int().nullable(),
  testCheckIntBetween: z.int().gte(0).lte(100).nullable(),
  testCheckDecimalGt0: z.string().regex(/^-?\d+(\.\d+)?$/).refine(v => +v > 0).nullable(),
  testCheckFoo: z.int().nullable(),
  testNotNull: z.string(),
  testNotNullArray: z.array(z.string())
});

export type VariousTypes = z.infer<typeof VariousTypes>;

export const TestForeignkeys = z.object({
  testPk: z.uuid(),
  testFkToVariousTypes: z.bigint().nullable(),
  testFkToSelf: z.uuid().nullable()
});

export type TestForeignkeys = z.infer<typeof TestForeignkeys>;
