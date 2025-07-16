# Instructions

## Project overview

This is an NodeJS command line tool and library written in TypeScript.

This tool takes in a SQL file in PostgreSQL syntax and outputs TypeScript definitions of tables, Kysely database definition, and Valibot, Zod schemas.

## Development commands

-   `deno task test-once` Runs all tests and typechecks the `./src/` and `./tests/`
-   `deno task test-coverage` Runs test and outputs coverage to `./coverage/coverage-final.json`
-   `deno task build` Builds the tool and outputs files to `./dist/`, it also cleans the dist.
