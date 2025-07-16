// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import * as v from "valibot";

export const MyEnumExample = v.picklist(["good", "bad", "ugly", "dont know"]);

export const SpecialKeySelect = v.object({
    testPk: v.pipe(v.number(), v.integer()),
});

export const SpecialKeyInsert = v.object({
    testPk: v.optional(v.pipe(v.number(), v.integer())),
});

export const SpecialKeyUpdate = v.object({
    testPk: v.optional(v.pipe(v.number(), v.integer())),
});

export const SpecialKeyUpdateKey = v.object({
    testPk: v.pipe(v.number(), v.integer()),
});

export const VariousTypesSelect = v.object({
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
    testCheckDecimalGt0: v.nullable(v.pipe(v.pipe(v.string(), v.decimal()), v.check(i => +i > 0))),
    testCheckFoo: v.nullable(v.pipe(v.number(), v.integer())),
    testNotNull: v.string(),
    testNotNullArray: v.array(v.string()),
});

export const VariousTypesInsert = v.object({
    bigserial: v.optional(v.bigint()),
    serial: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testInteger: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testBigint: v.optional(v.nullable(v.bigint())),
    testNumeric: v.optional(v.nullable(v.pipe(v.string(), v.decimal()))),
    testFloat4: v.optional(v.nullable(v.number())),
    testFloat8: v.optional(v.nullable(v.number())),
    testDecimal: v.optional(v.nullable(v.pipe(v.string(), v.decimal()))),
    testUuid: v.optional(v.nullable(v.pipe(v.string(), v.uuid()))),
    testText: v.optional(v.nullable(v.string())),
    testVarchar: v.optional(v.nullable(v.string())),
    testBoolean: v.optional(v.nullable(v.boolean())),
    testTimestamptz: v.optional(v.nullable(v.date())),
    testTimestamp: v.optional(v.nullable(v.date())),
    testDate: v.optional(v.nullable(v.date())),
    testTime: v.optional(v.nullable(v.string())),
    testJsonb: v.optional(v.nullable(v.any())),
    testJson: v.optional(v.nullable(v.any())),
    testEnum: v.optional(v.nullable(MyEnumExample)),
    testArrayText: v.optional(v.nullable(v.array(v.string()))),
    textArrayInteger: v.optional(v.nullable(v.array(v.pipe(v.number(), v.integer())))),
    testBytea: v.optional(v.nullable(v.any())),
    testXml: v.optional(v.nullable(v.string())),
    testDefault: v.optional(v.nullable(v.string()), "default value"),
    testDefaultInt: v.optional(v.pipe(v.number(), v.integer()), 42),
    testDefaultNow: v.optional(v.date()),
    testDefaultDecimal: v.optional(v.pipe(v.string(), v.decimal()), "0.00"),
    testDefaultUuid: v.optional(v.pipe(v.string(), v.uuid())),
    testCheckIsGt0: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.notValue(0)))),
    testCheckIsGte0: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0)))),
    testCheckIsLte100: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100)))),
    testCheckIsLt100: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100), v.notValue(100)))),
    testCheckEqual42: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.value(42)))),
    testCheckNotEqual42: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testCheckIntBetween: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.maxValue(100)))),
    testCheckDecimalGt0: v.optional(v.nullable(v.pipe(v.pipe(v.string(), v.decimal()), v.check(i => +i > 0)))),
    testCheckFoo: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testNotNull: v.optional(v.string()),
    testNotNullArray: v.optional(v.array(v.string())),
});

export const VariousTypesUpdate = v.object({
    bigserial: v.optional(v.bigint()),
    serial: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testInteger: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testBigint: v.optional(v.nullable(v.bigint())),
    testNumeric: v.optional(v.nullable(v.pipe(v.string(), v.decimal()))),
    testFloat4: v.optional(v.nullable(v.number())),
    testFloat8: v.optional(v.nullable(v.number())),
    testDecimal: v.optional(v.nullable(v.pipe(v.string(), v.decimal()))),
    testUuid: v.optional(v.nullable(v.pipe(v.string(), v.uuid()))),
    testText: v.optional(v.nullable(v.string())),
    testVarchar: v.optional(v.nullable(v.string())),
    testBoolean: v.optional(v.nullable(v.boolean())),
    testTimestamptz: v.optional(v.nullable(v.date())),
    testTimestamp: v.optional(v.nullable(v.date())),
    testDate: v.optional(v.nullable(v.date())),
    testTime: v.optional(v.nullable(v.string())),
    testJsonb: v.optional(v.nullable(v.any())),
    testJson: v.optional(v.nullable(v.any())),
    testEnum: v.optional(v.nullable(MyEnumExample)),
    testArrayText: v.optional(v.nullable(v.array(v.string()))),
    textArrayInteger: v.optional(v.nullable(v.array(v.pipe(v.number(), v.integer())))),
    testBytea: v.optional(v.nullable(v.any())),
    testXml: v.optional(v.nullable(v.string())),
    testDefault: v.optional(v.nullable(v.string()), "default value"),
    testDefaultInt: v.optional(v.pipe(v.number(), v.integer()), 42),
    testDefaultNow: v.optional(v.date()),
    testDefaultDecimal: v.optional(v.pipe(v.string(), v.decimal()), "0.00"),
    testDefaultUuid: v.optional(v.pipe(v.string(), v.uuid())),
    testCheckIsGt0: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.notValue(0)))),
    testCheckIsGte0: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0)))),
    testCheckIsLte100: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100)))),
    testCheckIsLt100: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100), v.notValue(100)))),
    testCheckEqual42: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.value(42)))),
    testCheckNotEqual42: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testCheckIntBetween: v.optional(v.nullable(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.maxValue(100)))),
    testCheckDecimalGt0: v.optional(v.nullable(v.pipe(v.pipe(v.string(), v.decimal()), v.check(i => +i > 0)))),
    testCheckFoo: v.optional(v.nullable(v.pipe(v.number(), v.integer()))),
    testNotNull: v.optional(v.string()),
    testNotNullArray: v.optional(v.array(v.string())),
});

export const VariousTypesUpdateKey = v.object({
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
    testCheckDecimalGt0: v.pipe(v.pipe(v.string(), v.decimal()), v.check(i => +i > 0)),
    testCheckFoo: v.pipe(v.number(), v.integer()),
    testNotNull: v.string(),
    testNotNullArray: v.array(v.string()),
});

export const TestForeignkeysSelect = v.object({
    testPk: v.pipe(v.string(), v.uuid()),
    testFkToVariousTypes: v.nullable(v.bigint()),
    testFkToSelf: v.nullable(v.pipe(v.string(), v.uuid())),
});

export const TestForeignkeysInsert = v.object({
    testPk: v.optional(v.pipe(v.string(), v.uuid())),
    testFkToVariousTypes: v.optional(v.nullable(v.bigint())),
    testFkToSelf: v.optional(v.nullable(v.pipe(v.string(), v.uuid()))),
});

export const TestForeignkeysUpdate = v.object({
    testPk: v.optional(v.pipe(v.string(), v.uuid())),
    testFkToVariousTypes: v.optional(v.nullable(v.bigint())),
    testFkToSelf: v.optional(v.nullable(v.pipe(v.string(), v.uuid()))),
});

export const TestForeignkeysUpdateKey = v.object({
    testPk: v.pipe(v.string(), v.uuid()),
    testFkToVariousTypes: v.bigint(),
    testFkToSelf: v.pipe(v.string(), v.uuid()),
});
