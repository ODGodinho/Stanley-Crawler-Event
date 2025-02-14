import { type PageInterface } from "@odg/chemical-x";

import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory";
import { BasePage } from "@pages/BasePage";

import { container } from "../SingletonTest";

const pages = Object.values(ContainerName).filter((value) => String(value).includes("page.factory"));

describe.each(pages)("Container Instance Page", (pageName: ContainerName) => {
    test(`Instance Page ${pageName.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<PageInterface>>(pageName);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as PageClassEngine)).toBeInstanceOf(BasePage);
    });
});
