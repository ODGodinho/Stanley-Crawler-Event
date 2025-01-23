import zod from "zod";

import { ConfigName } from "@app/Enums";
import { CustomValidator } from "~/Validator";

export const configValidator = zod.object({
    [ConfigName.USE_HEADLESS]: CustomValidator.zodStringBoolean(),
    [ConfigName.APP_NAME]: zod.string().nullish(),
    [ConfigName.HANDLER_TIMEOUT]: CustomValidator.zodStringNumber(),
    [ConfigName.HANDLER_ATTEMPT]: CustomValidator.zodStringNumber(),
    [ConfigName.PAGE_ATTEMPT]: CustomValidator.zodStringNumber(),
});

export type ConfigType = zod.infer<typeof configValidator>;
