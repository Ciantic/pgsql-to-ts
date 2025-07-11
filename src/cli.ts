import * as tool from "./index.ts";
import * as fs from "node:fs/promises";
import * as readline from "node:readline/promises";
import { parseArgs } from "node:util";

function readStdin() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        const lines: string[] = [];
        rl.on("line", (line) => {
            lines.push(line);
        });
        rl.on("close", () => {
            resolve(lines.join("\n"));
        });
    });
}

function printHelp() {
    console.log("Usage: pgsql-to-ts [options] <schema.sql>");
    console.log("Convert PostgreSQL schema to TypeScript types.");
    console.log("");
    console.log("Pass '-' as the input file to read from stdin.");
    console.log("");
    console.log("Options:");
    console.log("  -h, --help                     Show this help message");
    console.log("  -v, --version                  Show version information");
    console.log("  --output-kysely <file.ts>      Output Kysely file");
    console.log("  --output-typescript <file.ts>  Output TypeScript file");
    process.exit(0);
}

function appArgs() {
    return parseArgs({
        allowPositionals: true,
        options: {
            help: { type: "boolean", short: "h" },
            version: { type: "boolean", short: "v" },
            "output-kysely": { type: "boolean", default: false },
            "output-typescript": { type: "boolean", default: false },
        },
    });
}

async function main() {
    const args = appArgs();

    if (args.values.version) {
        console.log("pgsql-to-ts version 0.0.1"); // Replace with actual version
        process.exit(0);
    }

    if (args.values.help) {
        printHelp();
    }

    if (args.positionals.length === 0) {
        printHelp();
    }

    const inputSchemaFile = args.positionals[0];
    if (typeof inputSchemaFile === "undefined") {
        console.error("Error: Input file is required.");
        printHelp();
        process.exit(1);
    }

    // Read readline to the end
    const sql =
        inputSchemaFile === "-" ? await readStdin() : await fs.readFile(inputSchemaFile, "utf-8");

    console.log("Processing SQL schema...", sql);
}

await main();
