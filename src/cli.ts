import { parseArgs } from "node:util";

const args = parseArgs({
    options: {
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
    },
});

if (args.values.help) {
    console.log("Usage: pg-to-ts [options]");
    console.log("Options:");
    console.log("  -h, --help     Show this help message");
    console.log("  -v, --version  Show version information");
    process.exit(0);
}
if (args.values.version) {
    console.log("pg-to-ts version 0.0.1"); // Replace with actual version
    process.exit(0);
}
