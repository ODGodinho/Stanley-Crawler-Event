import zod from "zod";

import { CustomValidator } from "~/Validator";

export const configValidator = zod.object({
    USE_HEADLESS: CustomValidator.zodStringBoolean(),
    APP_NAME: zod.string().nullish(),
});

export type ConfigType = zod.infer<typeof configValidator>;
