import { type HandlerInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageFactory";
import { BaseHandler } from "@handlers/BaseHandler";

import { container } from "../SingletonTest";

const pages = [
    ContainerName.SearchHandler,
];

describe.each(pages)("Container Instance Handler", (page: ContainerName) => {
    test(`Instance Handler ${page.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<HandlerInterface>>(page);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as PageClassEngine)).toBeInstanceOf(BaseHandler);
    });
});
