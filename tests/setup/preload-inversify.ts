import { mock } from "bun:test";

import * as inversify from "inversify";

await mock.module("inversify", () => ({
    ...inversify,
    __esModule: true,
}));
