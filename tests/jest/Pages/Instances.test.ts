import { type PageInterface } from "@odg/chemical-x";

import { type MyPage } from "@engine";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageFactory";
import { BasePage } from "@pages/BasePage";

import { container } from "../SingletonTest";

const pages = [
    ContainerName.SearchPage,
];

describe.each(pages)("Container Instance Page", (page: ContainerName) => {
    test(`Instance Page ${page.toString()}`, async () => {
        const callable = container.container.get<PageOrHandlerFactoryType<PageInterface>>(page);

        expect(typeof callable).toBe("function");
        expect(callable(undefined as unknown as MyPage)).toBeInstanceOf(BasePage);
    });
});
