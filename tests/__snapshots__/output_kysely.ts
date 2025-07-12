// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

import type { ColumnType } from "kysely";

export type MyEnumExample = "good" | "bad" | "ugly" | "dont know";

export type Database = {
  special_key: {
    testPk: ColumnType<number, never, never>;
  },
  various_types: {
    bigserial: ColumnType<bigint, bigint | undefined, bigint>;
    serial: ColumnType<number | null, number | null | undefined, number | null>;
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
    testDefault: ColumnType<string | null, string | null | undefined, string | null>;
    testDefaultInt: ColumnType<number, number | undefined, number>;
    testDefaultNow: ColumnType<Date, Date | undefined, Date>;
    testDefaultDecimal: ColumnType<string, string | undefined, string>;
    testDefaultUuid: ColumnType<string, string | undefined, string>;
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
  },
  test_foreignkeys: {
    testPk: string;
    testFkToVariousTypes: bigint | null;
    testFkToSelf: string | null;
  },
}
