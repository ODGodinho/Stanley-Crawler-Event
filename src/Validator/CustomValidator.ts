import zod from "zod";

/**
 * Class with custom validators
 *
 * @class ConfigValidator
 */
export class CustomValidator {

    public static zodStringBoolean(): zod.ZodUnion<
        readonly [zod.ZodBoolean, zod.ZodPipe<zod.ZodString, zod.ZodTransform<boolean, string>>]
    > {
        return zod.union([
            zod.boolean(),
            zod.string().transform((data): boolean => data === "true"),
        ]);
    }

    public static zodStringNumber(): zod.ZodUnion<
        readonly [zod.ZodNumber, zod.ZodPipe<zod.ZodString, zod.ZodTransform<number, string>>]
    > {
        return zod.union([
            zod.number(),
            zod.string()
                .transform((data): number => Number(String(data).trim()))
                .refine((data) => !Number.isNaN(data), { message: "Invalid number" }),
        ]);
    }

}
