import { type HandlerInterface } from "@odg/chemical-x";

import { ContainerName } from "../../../src/app/Enums";
import { type PageOrHandlerFactoryType } from "../../../src/app/Factory/PageFactory";
import { type MyPage } from "../../../src/engine";
import { BaseHandler } from "../../../src/Handlers/BaseHandler";
import { container } from "../SingletonTest";

const pages = [
    ContainerName.SearchHandler,
];

describe.each(pages)("Container Instance Handler", (page: ContainerName) => {
    test(`Instance Handler ${page.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<HandlerInterface>>(page);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as MyPage)).toBeInstanceOf(BaseHandler);
    });
});
