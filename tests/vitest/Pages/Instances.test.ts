import type { PageInterface } from "@odg/chemical-x";

import { ContainerName } from "@enums";
import { BasePage } from "@pages/BasePage";

import { container } from "../SingletonTest";

const pages = Object.values(ContainerName).filter((value) => value.endsWith(".page"));

describe.each(pages)("Container Instance Page", (pageName: ContainerName) => {
    test(`Instance Page ${pageName.toString()}`, async () => {
        const callable = container.get<PageInterface>(pageName);

        expect(callable).toBeInstanceOf(BasePage);
    });
});
