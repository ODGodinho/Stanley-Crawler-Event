# Container, Config & Enums

This guide covers how to register dependencies in the container, configure environment variables, and properly close enums and typed contracts after scaffolding.

You **MUST** adhere to the rules defined in this document.

---

## Container

### What is the Container?

The Container (`src/app/Container.ts`) is the Composition Root of the project. All bindings, scopes, and bootstrapping live here.

**CRITICAL RULE:** Business layers **MUST NEVER** instantiate dependencies directly using `new` and **MUST NEVER** call `container.get()`. You **MUST ALWAYS** use constructor injection via `@$inject(ContainerName.X)`.

### Bootstrapping Flow

```
Container.setUp()
    │
    ├── bindKernel()     ← Config, ConsoleLogger, Logger, Container (self)
    ├── ODGDecorators.loadModule(this)   ← Pages, Handlers, Listeners with @ODGDecorators
    ├── bindCrawler()    ← BrowserManager (Playwright/Puppeteer)
    ├── Kernel.init()    ← Initializes ProcessKernel
    └── bindStanley()    ← Requester (Axios), JSONLogger, EventBus
```

### Decorator vs. Manual Binding

| Situation | Approach |
| --- | --- |
| Domain Classes (Listener, Service) | `@ODGDecorators.injectable(ContainerName.X, "Singleton")` |
| Pages and Handlers (managed lifecycle) | `@ODGDecorators.injectable(ContainerName.X)` (No singleton) |
| Factories/Libs/Dynamic Values | Manual binding in `Container.ts` |

### How to Register a New Dependency

#### 1. Declare the Name in Enum
File: `src/app/Enums/ContainerName.ts`
```typescript
export enum ContainerName {
    // Services
    "MyCrawlerService" = "my.crawler.service",
}
```
You **MUST** use `PascalCase` for keys and `dot.case` for values.

#### 2. Inject via Constructor
```typescript
import { $inject } from "~/ContainerInject";
import { ContainerName } from "@enums";

@injectable()
export class MyClass {
    public constructor(
        @$inject(ContainerName.Logger) private readonly log: LoggerInterface,
        @$inject(ContainerName.MyCrawlerService) private readonly service: MyCrawlerService,
    ) {}
}
```

---

## Config

### Adding a New Environment Variable

**CRITICAL RULE:** You **MUST NEVER** read values directly from `process.env`. You **MUST ALWAYS** read values through the typed `config` service.

| 🔴 [BAD] | 🟢 [GOOD] |
| --- | --- |
| `const headless = process.env.USE_HEADLESS;` | `const headless = await this.config.get(ConfigName.USE_HEADLESS);` |

#### 1. Declare the Key in Enum
File: `src/app/Enums/ConfigName.ts`
```typescript
export enum ConfigName {
    MY_NEW_VAR = "MY_NEW_VAR", // ← Step 1: Add here
}
```

#### 2. Add Zod Validation
File: `src/Configs/index.ts`
```typescript
export const configValidator = zod.object({
    [ConfigName.MY_NEW_VAR]: zod.string(), // ← Step 2: Mandatory Zod validation
});
```

#### 3. Add to `.env.example` and Tests
File: `.env.example`
```ini
# Step 3: Add placeholder and comment
MY_NEW_VAR=default_value
```

**CRITICAL RULE (Tests):** If you add a **required** (not `.optional()`) variable to the Zod schema, you **MUST** also add a dummy value to `tests/vitest/init.ts` in the `process.env` block, otherwise the test suite will fail to boot.

#### 4. Read the Value in Business Logic
```typescript
class MyClass {
    public constructor(@$inject(ContainerName.Config) private readonly config: MyConfig) {}

    public async doSomething() {
        const value = await this.config.get(ConfigName.MY_NEW_VAR);
    }
}
```

### Mandatory Post-Scaffold Checklist for Configs

Whenever a new flow requires configuration, you **MUST** close the entire chain:
1. Update `src/app/Enums/ConfigName.ts`.
2. Update `src/Configs/index.ts`.
3. Update `.env.example` with comments.
4. Update `tests/vitest/init.ts` (if required key).
5. Read via `config.get(ConfigName.X)`.
