import * as esbuild from "esbuild";
import * as fs from "node:fs/promises";

// MIT LICENSE
// https://github.com/sant123/esbuild-plugin-rewrite-relative-import-extensions/blob/main/rewriteRelativeImportExtensionsPlugin.ts
export const rewriteTsImportsPlugin: esbuild.Plugin = {
    name: "rewrite-ts-imports",
    setup(build) {
        const tsImportRegex = /(?<=(?:import|export\s*[*{])[^"']+["'])([^"']+)(?=["'])/g;
        build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
            let source = await fs.readFile(args.path, "utf8");

            return {
                contents: source.replaceAll(tsImportRegex, (match) => {
                    if (match.startsWith("./") || match.startsWith("../")) {
                        // Replace ".ts" with ".js" for relative imports
                        return match.replace(/\.ts$/, ".js");
                    }
                    return match;
                }),
                loader: args.path.endsWith(".ts") ? "ts" : "js",
            };
        });
    },
};

await esbuild.build({
    entryPoints: ["./src/**/*.ts"],
    sourcemap: true,
    format: "esm",
    platform: "node",
    bundle: false,
    outdir: "dist",
    plugins: [rewriteTsImportsPlugin],
});
