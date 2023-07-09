import { type HandlerInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageOrHandlerFactory";
import { BaseHandler } from "@handlers/BaseHandler";

import { container } from "../SingletonTest";

const pages = [
    ContainerName.SearchHandlerFactory,
];

describe.each(pages)("Container Instance Handler", (handlerName: ContainerName) => {
    test(`Instance Handler ${handlerName.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<HandlerInterface>>(handlerName);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as PageClassEngine)).toBeInstanceOf(BaseHandler);
    });
});
