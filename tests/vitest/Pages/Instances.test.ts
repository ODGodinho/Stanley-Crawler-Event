import type { PageInterface } from "@odg/chemical-x";

import { ContainerName } from "../../../src/app/Enums/index.js";
import { BasePage } from "../../../src/Pages/BasePage.js";
import { container } from "../SingletonTest.js";

const pages = Object.values(ContainerName).filter((value) => value.endsWith(".page"));

describe.each(pages)("Container Instance Page", (pageName: ContainerName) => {
    test(`Instance Page ${pageName.toString()}`, async () => {
        const callable = container.get<PageInterface>(pageName);

        expect(callable).toBeInstanceOf(BasePage);
    });
});
