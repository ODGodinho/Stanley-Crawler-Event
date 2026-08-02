/*
 * Dummy values for every REQUIRED config key (Zod fields without `.optional()`).
 * When you add a new required config via `bun odg make:config`, add its dummy here immediately.
 */
process.env.HANDLER_TIMEOUT ??= "5000";
process.env.HANDLER_ATTEMPT ??= "1";
process.env.PAGE_ATTEMPT ??= "1";
process.env.USE_HEADLESS ??= "true";
