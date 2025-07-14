// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import * as v from "valibot";

export const MyEnumExample = v.picklist(["good", "bad", "ugly", "dont know"]);

export const SpecialKey = v.object({
    testPk: v.pipe(v.number(), v.integer())
});

export const VariousTypes = v.object({
    bigserial: v.bigint(),
    serial: v.nullish(v.pipe(v.number(), v.integer())),
    testInteger: v.nullish(v.pipe(v.number(), v.integer())),
    testBigint: v.nullish(v.bigint()),
    testNumeric: v.nullish(v.pipe(v.string(), v.decimal())),
    testFloat4: v.nullish(v.number()),
    testFloat8: v.nullish(v.number()),
    testDecimal: v.nullish(v.pipe(v.string(), v.decimal())),
    testUuid: v.nullish(v.pipe(v.string(), v.uuid())),
    testText: v.nullish(v.string()),
    testVarchar: v.nullish(v.string()),
    testBoolean: v.nullish(v.boolean()),
    testTimestamptz: v.nullish(v.date()),
    testTimestamp: v.nullish(v.date()),
    testDate: v.nullish(v.date()),
    testTime: v.nullish(v.string()),
    testJsonb: v.nullish(v.any()),
    testJson: v.nullish(v.any()),
    testEnum: v.nullish(MyEnumExample),
    testArrayText: v.nullish(v.array(v.string())),
    textArrayInteger: v.nullish(v.array(v.pipe(v.number(), v.integer()))),
    testBytea: v.nullish(v.any()),
    testXml: v.nullish(v.string()),
    testDefault: v.nullish(v.string(), "default value"),
    testDefaultInt: v.nullish(v.pipe(v.number(), v.integer()), 42),
    testDefaultNow: v.date(),
    testDefaultDecimal: v.nullish(v.pipe(v.string(), v.decimal()), "0.00"),
    testDefaultUuid: v.pipe(v.string(), v.uuid()),
    testCheckIsGt0: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.notValue(0))),
    testCheckIsGte0: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0))),
    testCheckIsLte100: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100))),
    testCheckIsLt100: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.maxValue(100), v.notValue(100))),
    testCheckEqual42: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.value(42))),
    testCheckNotEqual42: v.nullish(v.pipe(v.number(), v.integer())),
    testCheckIntBetween: v.nullish(v.pipe(v.pipe(v.number(), v.integer()), v.minValue(0), v.maxValue(100))),
    testCheckDecimalGt0: v.nullish(v.pipe(v.pipe(v.string(), v.decimal()), v.check(i => +i > 0))),
    testCheckFoo: v.nullish(v.pipe(v.number(), v.integer())),
    testNotNull: v.string(),
    testNotNullArray: v.array(v.string())
});

export const TestForeignkeys = v.object({
    testPk: v.pipe(v.string(), v.uuid()),
    testFkToVariousTypes: v.nullish(v.bigint()),
    testFkToSelf: v.nullish(v.pipe(v.string(), v.uuid()))
});
