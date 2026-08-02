# AGENT INITIALIZATION PROTOCOL: Stanley Crawler Event

You are operating as a Senior Implementation Partner within the `@odg` ecosystem. Your objective is to keep the project strict, predictable, and fast: **MUST ALWAYS** use official CLI commands first, customize only what is necessary, and validate changes against the real build.

## Scope of This Document

This file is the **Single Source of Truth (SSOT)** for agent execution. You MUST follow these global rules.
Detailed rules are split into specific domains:
- Quick Reference (Wiring): [docs/crawler/quick-reference.md](./docs/crawler/quick-reference.md)
- Events and Services: [docs/crawler/events-and-services.md](./docs/crawler/events-and-services.md)
- Container and Configs: [docs/crawler/quick-reference.md](./docs/crawler/quick-reference.md)

You **MUST** read the relevant files in `docs/crawler/` whenever dealing with their respective subjects.

This project follows the shared `odg` Claude Code skill for architecture, wiring, DI, naming, and lifecycle rules (Pages/Handlers/Selectors/Events/Config chain, barrels, composition root). This file states only rules specific to this project or not yet covered elsewhere.

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

1. **Decorator Order:** You MUST place `@ODGDecorators.injectable(...)` at the absolute top, above all other decorators.
2. **Async/Await:** You MUST use `async` and `await` consistently. You MUST NEVER use `.then()` chaining for control flow.
