import zod from "zod";

/**
 * Class with custom validators
 *
 * @class ConfigValidator
 */
export class CustomValidator {

    public static zodStringBoolean(): zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]> {
        return zod.union([
            zod.boolean(),
            zod.string().transform((data): boolean => data === "true"),
        ]);
    }

}
