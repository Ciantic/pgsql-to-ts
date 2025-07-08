import type { ColumnType } from "kysely";

export type MyEnumExample = "good" | "bad" | "ugly" | "dont know";

export interface SpecialKey {
    testPk: number;
}
export interface VariousTypes {
    bigserial: ColumnType<bigint, bigint | undefined, bigint>;
    serial: ColumnType<number | null, number | null | undefined, number | null>;
    testInt32: number | null;
    testInt64: bigint | null;
    testBigint: number | null;
    testFloat32: number | null;
    testFloat64: number | null;
    testDecimal: number | null;
    testUuid: string | null;
    testString: string | null;
    testVarchar: string | null;
    testBoolean: boolean | null;
    testDatetime: Date | null;
    testDatetime2: Date | null;
    testDatepart: Date | null;
    testTimepart: string | null;
    testJsonb: any | null;
    testJson: any | null;
    testEnum: MyEnumExample | null;
    testArray: (string | null)[];
    textArrayInts: (number | null)[];
    testBytea: Uint8Array | null;
    testXml: string | null;
    testDefault: ColumnType<string | null, string | null | undefined, string | null>;
    testDefaultInt: ColumnType<number, number | undefined, number>;
    testDefaultNow: ColumnType<Date, Date | undefined, Date>;
    testDefaultDecimal: ColumnType<number, number | undefined, number>;
    testDefaultUuid: ColumnType<string, string | undefined, string>;
    testCheckIntBetween: number | null;
    testNotNull: string;
    testNotNullArray: string[];
}
export interface TestForeignkeys {
    testPk: string;
    testFkToVariousTypes: bigint | null;
    testFkToSelf: string | null;
}

export type Database = {
  special_key: SpecialKey,
  various_types: VariousTypes,
  test_foreignkeys: TestForeignkeys,
}
