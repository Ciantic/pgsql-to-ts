// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import * as v from "valibot";

export const MyEnumExample = v.picklist(["good", "bad", "ugly", "dont know"]);

export const SpecialKey = v.object({
  testPk: v.pipe(v.number(), v.integer())
});

export const VariousTypes = v.object({
  bigserial: v.bigint(),
  serial: v.pipe(v.number(), v.integer()),
  testInteger: v.pipe(v.number(), v.integer()),
  testBigint: v.bigint(),
  testNumeric: v.pipe(v.string(), v.decimal()),
  testFloat4: v.number(),
  testFloat8: v.number(),
  testDecimal: v.pipe(v.string(), v.decimal()),
  testUuid: v.pipe(v.string(), v.uuid()),
  testText: v.string(),
  testVarchar: v.string(),
  testBoolean: v.boolean(),
  testTimestamptz: v.date(),
  testTimestamp: v.date(),
  testDate: v.date(),
  testTime: v.string(),
  testJsonb: v.any(),
  testJson: v.any(),
  testEnum: MyEnumExample,
  testArrayText: v.array(v.string()),
  textArrayInteger: v.array(v.pipe(v.number(), v.integer())),
  testBytea: v.any(),
  testXml: v.string(),
  testDefault: v.string(),
  testDefaultInt: v.pipe(v.number(), v.integer()),
  testDefaultNow: v.date(),
  testDefaultDecimal: v.pipe(v.string(), v.decimal()),
  testDefaultUuid: v.pipe(v.string(), v.uuid()),
  testCheckIsGt0: v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.notValue(0)),
  testCheckIsGte0: v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0)),
  testCheckIsLte100: v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100)),
  testCheckIsLt100: v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100), v.notValue(100)),
  testCheckEqual42: v.pipe(v.pipe(v.number(), v.integer()), v.value(42)),
  testCheckNotEqual42: v.pipe(v.number(), v.integer()),
  testCheckIntBetween: v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.maxValue(100)),
  testCheckDecimalGt0: v.pipe(v.pipe(v.string(), v.decimal()), v.minValue(0 as any), v.notValue("0")),
  testCheckFoo: v.pipe(v.number(), v.integer()),
  testNotNull: v.string(),
  testNotNullArray: v.array(v.string())
});

export const TestForeignkeys = v.object({
  testPk: v.pipe(v.string(), v.uuid()),
  testFkToVariousTypes: v.bigint(),
  testFkToSelf: v.pipe(v.string(), v.uuid())
});
