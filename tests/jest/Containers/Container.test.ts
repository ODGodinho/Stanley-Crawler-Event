import { ContainerName } from "../../../src/app/Enums";
import { ExampleCrawlerService } from "../../../src/app/Services/ExampleCrawlerService";
import { type MyPage } from "../../../src/engine";
import { SearchPage } from "../../../src/Pages/Google/SearchPage";
import { container } from "../SingletonTest";

describe("Container Test", () => {
    test("Container GetAsync", async () => {
        const service = await container.getAsync(ContainerName.ExampleCrawlerService);

        expect(service).toBeInstanceOf(ExampleCrawlerService);
        expect(service).toHaveProperty("log");

        expect(service["log"]).not.toBeUndefined();
    });
});

describe("Container Instance Page", () => {
    test("Container SetUp", async () => {
        const page = container.get(ContainerName.SearchPage);
        expect(typeof page).toBe("function");
        expect(page(undefined as unknown as MyPage)).toBeInstanceOf(SearchPage);
    });
});
