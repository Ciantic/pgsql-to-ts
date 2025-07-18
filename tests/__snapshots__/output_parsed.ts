// This file is generated from SQL schema file by pgsql-to-ts.
// Do not edit manually.

export const schema = {
  "tables": {
    "special_key": {
      "index": 0,
      "rename": "SpecialKey",
      "name": "special_key",
      "columns": {
        "test_pk": {
          "index": 0,
          "rename": "testPk",
          "name": "test_pk",
          "type": "int4",
          "notnull": true,
          "generatedWhen": "always",
          "primarykey": true,
          "unique": true
        }
      }
    },
    "various_types": {
      "index": 1,
      "rename": "VariousTypes",
      "name": "various_types",
      "columns": {
        "bigserial": {
          "index": 0,
          "rename": "bigserial",
          "name": "bigserial",
          "type": "bigserial",
          "notnull": true,
          "primarykey": true,
          "unique": true
        },
        "serial": {
          "index": 1,
          "rename": "serial",
          "name": "serial",
          "type": "serial"
        },
        "test_integer": {
          "index": 2,
          "rename": "testInteger",
          "name": "test_integer",
          "type": "int4"
        },
        "test_bigint": {
          "index": 3,
          "rename": "testBigint",
          "name": "test_bigint",
          "type": "int8"
        },
        "test_numeric": {
          "index": 4,
          "rename": "testNumeric",
          "name": "test_numeric",
          "type": "numeric"
        },
        "test_float4": {
          "index": 5,
          "rename": "testFloat4",
          "name": "test_float4",
          "type": "float4"
        },
        "test_float8": {
          "index": 6,
          "rename": "testFloat8",
          "name": "test_float8",
          "type": "float8"
        },
        "test_decimal": {
          "index": 7,
          "rename": "testDecimal",
          "name": "test_decimal",
          "type": "numeric",
          "typeParams": [
            10,
            2
          ]
        },
        "test_uuid": {
          "index": 8,
          "rename": "testUuid",
          "name": "test_uuid",
          "type": "uuid"
        },
        "test_text": {
          "index": 9,
          "rename": "testText",
          "name": "test_text",
          "type": "text"
        },
        "test_varchar": {
          "index": 10,
          "rename": "testVarchar",
          "name": "test_varchar",
          "type": "varchar",
          "typeParams": [
            255
          ]
        },
        "test_boolean": {
          "index": 11,
          "rename": "testBoolean",
          "name": "test_boolean",
          "type": "bool"
        },
        "test_timestamptz": {
          "index": 12,
          "rename": "testTimestamptz",
          "name": "test_timestamptz",
          "type": "timestamptz"
        },
        "test_timestamp": {
          "index": 13,
          "rename": "testTimestamp",
          "name": "test_timestamp",
          "type": "timestamp"
        },
        "test_date": {
          "index": 14,
          "rename": "testDate",
          "name": "test_date",
          "type": "date"
        },
        "test_time": {
          "index": 15,
          "rename": "testTime",
          "name": "test_time",
          "type": "time"
        },
        "test_jsonb": {
          "index": 16,
          "rename": "testJsonb",
          "name": "test_jsonb",
          "type": "jsonb"
        },
        "test_json": {
          "index": 17,
          "rename": "testJson",
          "name": "test_json",
          "type": "json"
        },
        "test_enum": {
          "index": 18,
          "rename": "testEnum",
          "name": "test_enum",
          "type": "my_enum_example"
        },
        "test_array_text": {
          "index": 19,
          "rename": "testArrayText",
          "name": "test_array_text",
          "type": "text",
          "array": true
        },
        "text_array_integer": {
          "index": 20,
          "rename": "textArrayInteger",
          "name": "text_array_integer",
          "type": "int4",
          "array": true
        },
        "test_bytea": {
          "index": 21,
          "rename": "testBytea",
          "name": "test_bytea",
          "type": "bytea"
        },
        "test_xml": {
          "index": 22,
          "rename": "testXml",
          "name": "test_xml",
          "type": "xml"
        },
        "test_default": {
          "index": 23,
          "rename": "testDefault",
          "name": "test_default",
          "type": "text",
          "default": "'default value'",
          "defaultSimple": "default value"
        },
        "test_default_int": {
          "index": 24,
          "rename": "testDefaultInt",
          "name": "test_default_int",
          "type": "int4",
          "notnull": true,
          "default": "42",
          "defaultSimple": 42
        },
        "test_default_now": {
          "index": 25,
          "rename": "testDefaultNow",
          "name": "test_default_now",
          "type": "timestamptz",
          "notnull": true,
          "default": "CURRENT_TIMESTAMP"
        },
        "test_default_decimal": {
          "index": 26,
          "rename": "testDefaultDecimal",
          "name": "test_default_decimal",
          "type": "numeric",
          "typeParams": [
            10,
            2
          ],
          "notnull": true,
          "default": "0.00",
          "defaultSimple": "0.00"
        },
        "test_default_uuid": {
          "index": 27,
          "rename": "testDefaultUuid",
          "name": "test_default_uuid",
          "type": "uuid",
          "notnull": true,
          "default": "gen_random_uuid()"
        },
        "test_check_is_gt0": {
          "index": 28,
          "rename": "testCheckIsGt0",
          "name": "test_check_is_gt0",
          "type": "int4",
          "check": "test_check_is_gt0 > 0",
          "checkSimple": {
            "operator": ">",
            "min": 0
          }
        },
        "test_check_is_gte0": {
          "index": 29,
          "rename": "testCheckIsGte0",
          "name": "test_check_is_gte0",
          "type": "int4",
          "check": "test_check_is_gte0 >= 0",
          "checkSimple": {
            "operator": ">=",
            "min": 0
          }
        },
        "test_check_is_lte100": {
          "index": 30,
          "rename": "testCheckIsLte100",
          "name": "test_check_is_lte100",
          "type": "int4",
          "check": "test_check_is_lte100 <= 100",
          "checkSimple": {
            "operator": "<=",
            "max": 100
          }
        },
        "test_check_is_lt100": {
          "index": 31,
          "rename": "testCheckIsLt100",
          "name": "test_check_is_lt100",
          "type": "int4",
          "check": "test_check_is_lt100 < 100",
          "checkSimple": {
            "operator": "<",
            "max": 100
          }
        },
        "test_check_equal42": {
          "index": 32,
          "rename": "testCheckEqual42",
          "name": "test_check_equal42",
          "type": "int4",
          "check": "test_check_equal42 = 42",
          "checkSimple": {
            "operator": "=",
            "value": 42
          }
        },
        "test_check_not_equal42": {
          "index": 33,
          "rename": "testCheckNotEqual42",
          "name": "test_check_not_equal42",
          "type": "int4",
          "check": "test_check_not_equal42 <> 42"
        },
        "test_check_int_between": {
          "index": 34,
          "rename": "testCheckIntBetween",
          "name": "test_check_int_between",
          "type": "int4",
          "check": "test_check_int_between BETWEEN 0 AND 100",
          "checkSimple": {
            "operator": "BETWEEN",
            "min": 0,
            "max": 100
          }
        },
        "test_check_decimal_gt0": {
          "index": 35,
          "rename": "testCheckDecimalGt0",
          "name": "test_check_decimal_gt0",
          "type": "numeric",
          "typeParams": [
            10,
            2
          ],
          "check": "test_check_decimal_gt0 > 0",
          "checkSimple": {
            "operator": ">",
            "min": 0
          }
        },
        "test_not_null": {
          "index": 36,
          "rename": "testNotNull",
          "name": "test_not_null",
          "type": "text",
          "notnull": true
        },
        "test_not_null_array": {
          "index": 37,
          "rename": "testNotNullArray",
          "name": "test_not_null_array",
          "type": "text",
          "array": true,
          "notnull": true
        }
      }
    },
    "test_foreignkeys": {
      "index": 2,
      "rename": "TestForeignkeys",
      "name": "test_foreignkeys",
      "columns": {
        "test_pk": {
          "index": 0,
          "rename": "testPk",
          "name": "test_pk",
          "type": "uuid",
          "notnull": true,
          "primarykey": true,
          "unique": true
        },
        "test_fk_to_various_types": {
          "index": 1,
          "rename": "testFkToVariousTypes",
          "name": "test_fk_to_various_types",
          "type": "int8",
          "foreignKey": {
            "table": "various_types",
            "column": "bigserial",
            "updateAction": "a",
            "deleteAction": "a",
            "matchType": "s"
          }
        },
        "test_fk_to_self": {
          "index": 2,
          "rename": "testFkToSelf",
          "name": "test_fk_to_self",
          "type": "uuid",
          "foreignKey": {
            "table": "test_foreignkeys",
            "column": "test_pk",
            "updateAction": "a",
            "deleteAction": "a",
            "matchType": "s"
          }
        }
      }
    }
  },
  "enums": {
    "my_enum_example": {
      "index": 0,
      "rename": "MyEnumExample",
      "name": "my_enum_example",
      "values": [
        "good",
        "bad",
        "ugly",
        "dont know"
      ]
    }
  }
} as const;