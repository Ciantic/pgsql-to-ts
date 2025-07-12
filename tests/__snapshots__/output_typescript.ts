// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

export type MyEnumExample = "good" | "bad" | "ugly" | "dont know";

export interface SpecialKey {
    testPk: number;
}

export interface VariousTypes {
    bigserial: bigint;
    serial: number | null;
    testInteger: number | null;
    testBigint: bigint | null;
    testNumeric: string | null;
    testFloat4: number | null;
    testFloat8: number | null;
    testDecimal: string | null;
    testUuid: string | null;
    testText: string | null;
    testVarchar: string | null;
    testBoolean: boolean | null;
    testTimestamptz: Date | null;
    testTimestamp: Date | null;
    testDate: Date | null;
    testTime: string | null;
    testJsonb: any | null;
    testJson: any | null;
    testEnum: MyEnumExample | null;
    testArrayText: string[] | null;
    textArrayInteger: number[] | null;
    testBytea: Uint8Array | null;
    testXml: string | null;
    testDefault: string | null;
    testDefaultInt: number;
    testDefaultNow: Date;
    testDefaultDecimal: string;
    testDefaultUuid: string;
    testCheckIsGt0: number | null;
    testCheckIsGte0: number | null;
    testCheckIsLte100: number | null;
    testCheckIsLt100: number | null;
    testCheckEqual42: number | null;
    testCheckNotEqual42: number | null;
    testCheckIntBetween: number | null;
    testCheckDecimalGt0: string | null;
    testCheckFoo: number | null;
    testNotNull: string;
    testNotNullArray: string[];
}

export interface TestForeignkeys {
    testPk: string;
    testFkToVariousTypes: bigint | null;
    testFkToSelf: string | null;
}

