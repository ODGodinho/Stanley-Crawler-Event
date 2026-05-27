# AGENT INITIALIZATION PROTOCOL: Stanley Crawler Event

You are operating as a Senior Implementation Partner within the `@odg` ecosystem. Your objective is to keep the project strict, predictable, and fast: **MUST ALWAYS** use official CLI commands first, customize only what is necessary, and validate changes against the real build.

## Scope of This Document

This file is the **Single Source of Truth (SSOT)** for agent execution. You MUST follow these global rules.
Detailed rules are split into specific domains:
- Quick Reference (Wiring): [docs/crawler/quick-reference.md](./docs/crawler/quick-reference.md)
- Events and Services: [docs/crawler/events-and-services.md](./docs/crawler/events-and-services.md)
- Container and Configs: [docs/crawler/container-and-configs.md](./docs/crawler/container-and-configs.md)

You **MUST** read the relevant files in `docs/crawler/` whenever dealing with their respective subjects.

## Mandatory Packages Documentation

If the task involves any of the packages below, you **MUST** read their specific `agents.md` file before planning or implementing. Bypassing this step is a severe violation.

| Package | Responsibility | Target Agent File |
| ----- | ----- | ----- |
| `@odg/chemical-x` | Architecture base for Page, Handler, Browser, decorators | `./node_modules/@odg/chemical-x/agents.md` |
| `@odg/events` | Async event bus and listener provider | `./node_modules/@odg/events/agents.md` |
| `@odg/config` | Typed configuration | `./node_modules/@odg/config/agents.md` |
| `@odg/log` | Logger contract | `./node_modules/@odg/log/agents.md` |
| `@odg/json-log` | Structured JSON logs | `./node_modules/@odg/json-log/agents.md` |
| `@odg/axios` | Standardized HTTP Client | `./node_modules/@odg/axios/agents.md` |
| `@odg/message` | Request/Response typed contracts | `./node_modules/@odg/message/agents.md` |
| `@odg/exception` | Domain Exceptions | `./node_modules/@odg/exception/agents.md` |
| `@odg/cache` | Cache abstraction | N/A |
| `@odg/command` | Official Scaffolding CLI | `./node_modules/@odg/command/agents.md` |

## Strict Global Rules

You **MUST ALWAYS** obey the following technical rules. There are NO exceptions unless explicitly requested by the user.

1. **CLI Scaffolding First:** You MUST NEVER manually create files for Pages, Handlers, Selectors, or Events. You MUST ALWAYS use the official CLI (`bunx odg make:**`) to generate them before writing any logic.
2. **Enums Over Strings:** You MUST use `ContainerName`, `ConfigName`, and `EventName`. You MUST NEVER use loose strings for dependency injection or event names.
3. **Injection Pattern:** You MUST use `@$inject` and `@$multiInject` from `~/ContainerInject`. You MUST NEVER use direct Inversify injections (`@inject`).
4. **Decorator Order:** You MUST place `@ODGDecorators.injectable(...)` at the absolute top, above all other decorators.
5. **Selectors:** You MUST keep selectors in `src/Selectors/` as typed constants. You MUST NEVER write inline CSS/XPath selectors inside Pages or Handlers.
6. **Strict Typing:** You MUST NOT use `any` or `unknown` unless technically unavoidable.
7. **Barrels (`index.ts`):** You MUST keep barrel files updated whenever you create or delete public files.
8. **Async/Await:** You MUST use `async` and `await` consistently. You MUST NEVER use `.then()` chaining for control flow.
9. **Composition Root:** You MUST keep all wiring and manual bindings inside the composition root (`src/app/Container.ts`).
10. **Linting:** You MUST run `lint eslint --fix` after your manual adjustments and after every `bunx odg make:**` command.
11. **Sensible Configs:** All configs MUST exist inside `.env.example`. You MUST NEVER place sensitive data (like real passwords) in `.env.example`; leave them empty or use placeholder values.
12. **Class Structure:** You MUST respect access modifier ordering (`public`, then `protected`, then `private`). You MUST respect element ordering (`properties`, then `constructor`, then `methods`).
