import * as z from "zod";

/**
 * Assign custom metadata to a Zod schema. We cannot use `.meta()` method
 * because it discards the type of the metadata.
 *
 * @param schema
 * @param metadata
 * @returns
 */
export function meta<T extends z.ZodTypeAny, M extends Record<string, any>>(
    schema: T,
    metadata: M
): T & { _meta: M } {
    (schema as any)._meta = metadata;
    return schema.meta(metadata) as any as T & { _meta: M };
}

type FinalType<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type InferObjectFieldsWithMetadata<T extends z.ZodObject<any>> = {
    [K in keyof T["shape"] as T["shape"][K] extends z.ZodTypeAny & { _meta: infer M }
        ? K
        : never]: T["shape"][K] extends z.ZodTypeAny & { _meta: infer M } ? M : never;
};

export function getObjectMetadata<T extends z.ZodObject<any>>(
    schema: T
): FinalType<InferObjectFieldsWithMetadata<T>> {
    const metadata = {} as any;
    for (const key in schema.shape) {
        metadata[key] = z.globalRegistry.get(schema.shape[key]);
    }
    return metadata;
}
