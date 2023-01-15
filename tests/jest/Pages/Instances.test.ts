import { type PageInterface } from "@odg/chemical-x";

import { ContainerName } from "../../../src/app/Enums";
import { type PageOrHandlerFactoryType } from "../../../src/app/Factory/PageFactory";
import { type MyPage } from "../../../src/engine";
import { BasePage } from "../../../src/Pages/BasePage";
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
