export const HEADER = [
    `// This file is generated from SQL schema file by sql-to-ts.`,
    `// Do not edit manually.`,
    ``,
];

export const identityf = <T>(v: T): T => v;

export function omitUndefined<T extends Record<string, any>>(
    obj: T
): { [key in keyof T as T[key] extends undefined ? never : key]: T[key] } {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result as T;
}
