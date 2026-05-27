import type { HandlerInterface } from "@odg/chemical-x";

import { ContainerName } from "#enums";
import { BaseHandler } from "#handlers/BaseHandler.js";

import { container } from "../SingletonTest.js";

const handlers = Object.values(ContainerName).filter((value) => value.endsWith(".handler"));

describe.each(handlers)("Container Instance Handler", (handlerName: ContainerName) => {
    test(`Instance Handler ${handlerName.toString()}`, async () => {
        const callable = container.get<HandlerInterface>(handlerName);

        expect(callable).toBeInstanceOf(BaseHandler);
    });
});
