import type { ConfigInterface } from "@odg/config";
import zod from "zod";

import { ConfigName } from "../app/Enums/index.js";
import { CustomValidator } from "../Validator/index.js";

export const configValidator = zod.object({
    [ConfigName.USE_HEADLESS]: CustomValidator.zodStringToBoolean(),
    [ConfigName.APP_NAME]: zod.string().nullish(),
    [ConfigName.HANDLER_TIMEOUT]: CustomValidator.zodStringToNumber(),
    [ConfigName.HANDLER_ATTEMPT]: CustomValidator.zodStringToNumber(),
    [ConfigName.PAGE_ATTEMPT]: CustomValidator.zodStringToNumber(),
    [ConfigName.BROWSER_CONNECT]: zod.string().nullish(),
});

export type ConfigType = zod.infer<typeof configValidator>;

export type MyConfig = ConfigInterface<ConfigType>;
