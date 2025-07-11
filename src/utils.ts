export const HEADER = [
    `// This file is generated from SQL schema file by pgsql-to-ts.`,
    `// Do not edit manually.`,
    ``,
];

export const identityf = <T>(v: T): T => v;

export function omitUndefined<T extends Record<string, any>>(
    obj: T
): { [key in keyof T as undefined extends T[key] ? never : key]: T[key] } {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result as T;
}

// const someObject = {
//     foo: "bar",
//     bar: 42,
//     baz: undefined,
// };

// const otherObject = omitUndefined(someObject);
// // { foo: string, bar: number }
