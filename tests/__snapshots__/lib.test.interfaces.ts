import type { ColumnType } from "kysely";

type my_enum_example = "good" | "bad" | "ugly" | "dont know";

interface various_types {
  bigserial: bigint;
  serial: number;
  test_int32: number;
  test_int64: bigint;
  test_bigint: number;
  test_float32: number;
  test_float64: number;
  test_decimal: number;
  test_uuid: string;
  test_string: string;
  test_varchar: string;
  test_boolean: boolean;
  test_datetime: Date;
  test_datetime2: Date;
  test_datepart: Date;
  test_timepart: string;
  test_jsonb: any;
  test_json: any;
  test_enum: undefined;
  test_array: string[];
  text_array_ints: number[];
  test_bytea: Uint8Array;
  test_xml: string;
  test_default: string;
  test_default_int: number;
  test_default_now: Date;
  test_default_decimal: number;
  test_default_uuid: string;
  test_check_int_between: number;
}

interface test_foreignkeys {
  test_pk: string;
  test_fk_to_various_types: bigint;
  test_fk_to_self: string;
}

