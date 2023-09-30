import zod from "zod";

import { CustomValidator } from "~/Validator";

export const configValidator = zod.object({
    USE_HEADLESS: CustomValidator.zodStringBoolean(),
    APP_NAME: zod.string().nullish(),
    HANDLER_TIMEOUT: CustomValidator.zodStringNumber(),
    HANDLER_ATTEMPT: CustomValidator.zodStringNumber(),
    PAGE_ATTEMPT: CustomValidator.zodStringNumber(),
});

export type ConfigType = zod.infer<typeof configValidator>;
