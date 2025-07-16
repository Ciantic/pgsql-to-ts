import { assertType, expectTypeOf, test, describe } from "vitest";
import { getObjectMetadata, meta } from "../src/generators/zod.helpers.ts";
import * as z from "zod";

const TestSchema1 = z.object({
    fieldWithoutMetadata: z.number().int(),
    someFieldWithMetadata: meta(z.string(), { name: "foo" as const }),
    someOtherFieldWithMetadata: meta(z.array(z.string()), { name: "bar" as const }),
    // someThirdField: meta(z.array(z.string()), { name: "bar" as const }),
});

describe("Zod helpers", () => {
    test("my types work properly", () => {
        const zoo = getObjectMetadata(TestSchema1);

        const test = {
            someFieldWithMetadata: { name: "foo" },
            someOtherFieldWithMetadata: { name: "bar" },
        } as const satisfies typeof zoo;

        expectTypeOf(zoo).toEqualTypeOf<{
            someFieldWithMetadata: { name: "foo" };
            someOtherFieldWithMetadata: { name: "bar" };
        }>();
    });
});
