import * as v from "valibot";

/**
 * Infer only fields with metadata from object schema.
 */
export type InferObjectFieldsWithMetadata<T extends v.ObjectSchema<any, any>> = {
    [K in keyof T["entries"] as T["entries"][K] extends v.SchemaWithPipe<
        readonly [any, v.MetadataAction<any, any>]
    >
        ? K
        : never]: v.InferMetadata<T["entries"][K]>;
};
/*
const TestInferringSchema = v.object({
    fieldWithoutMetadata: v.pipe(v.number(), v.integer()),

    someFieldWithMetadata: v.pipe(v.string(), v.metadata({ name: "foo" })),
    someOtherFieldWithMetadata: v.pipe(v.array(v.string()), v.metadata({ name: "bar" })),
});

const foo = {
    someFieldWithMetadata: {
        name: "foo",
    },
    someOtherFieldWithMetadata: {
        name: "bar",
    },
} as const satisfies InferObjectFieldsWithMetadata<typeof TestInferringSchema>;
*/
