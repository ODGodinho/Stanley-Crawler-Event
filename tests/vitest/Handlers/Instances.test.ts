import { type HandlerInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory";
import { BaseHandler } from "@handlers/BaseHandler";

import { container } from "../SingletonTest";

const handlers = Object.values(ContainerName).filter((value) => String(value).includes("handler.factory"));

describe.each(handlers)("Container Instance Handler", (handlerName: ContainerName) => {
    test(`Instance Handler ${handlerName.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<HandlerInterface>>(handlerName);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as PageClassEngine)).toBeInstanceOf(BaseHandler);
    });
});
