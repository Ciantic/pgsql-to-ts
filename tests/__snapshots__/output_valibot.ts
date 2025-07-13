// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import * as v from "valibot";

export const MyEnumExample = v.picklist(["good", "bad", "ugly", "dont know"]);

export const SpecialKey = v.object({
  testPk: v.pipe(v.number(), v.integer())
});

export const VariousTypes = v.object({
  bigserial: v.bigint(),
  serial: v.nullable(v.pipe(v.number(), v.integer())),
  testInteger: v.nullable(v.pipe(v.number(), v.integer())),
  testBigint: v.nullable(v.bigint()),
  testNumeric: v.nullable(v.pipe(v.string(), v.decimal())),
  testFloat4: v.nullable(v.number()),
  testFloat8: v.nullable(v.number()),
  testDecimal: v.nullable(v.pipe(v.string(), v.decimal())),
  testUuid: v.nullable(v.pipe(v.string(), v.uuid())),
  testText: v.nullable(v.string()),
  testVarchar: v.nullable(v.string()),
  testBoolean: v.nullable(v.boolean()),
  testTimestamptz: v.nullable(v.date()),
  testTimestamp: v.nullable(v.date()),
  testDate: v.nullable(v.date()),
  testTime: v.nullable(v.string()),
  testJsonb: v.nullable(v.any()),
  testJson: v.nullable(v.any()),
  testEnum: v.nullable(MyEnumExample),
  testArrayText: v.nullable(v.array(v.string())),
  textArrayInteger: v.nullable(v.array(v.pipe(v.number(), v.integer()))),
  testBytea: v.nullable(v.any()),
  testXml: v.nullable(v.string()),
  testDefault: v.nullable(v.string()),
  testDefaultInt: v.pipe(v.number(), v.integer()),
  testDefaultNow: v.date(),
  testDefaultDecimal: v.pipe(v.string(), v.decimal()),
  testDefaultUuid: v.pipe(v.string(), v.uuid()),
  testCheckIsGt0: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.notValue(0))),
  testCheckIsGte0: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0))),
  testCheckIsLte100: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100))),
  testCheckIsLt100: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100), v.notValue(100))),
  testCheckEqual42: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.value(42))),
  testCheckNotEqual42: v.nullable(v.pipe(v.number(), v.integer())),
  testCheckIntBetween: v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.maxValue(100))),
  testCheckDecimalGt0: v.nullable(v.pipe(v.pipe(v.string(), v.decimal()), v.minValue(0 as any), v.notValue("0"))),
  testCheckFoo: v.nullable(v.pipe(v.number(), v.integer())),
  testNotNull: v.string(),
  testNotNullArray: v.array(v.string())
});

export const TestForeignkeys = v.object({
  testPk: v.pipe(v.string(), v.uuid()),
  testFkToVariousTypes: v.nullable(v.bigint()),
  testFkToSelf: v.nullable(v.pipe(v.string(), v.uuid()))
});
