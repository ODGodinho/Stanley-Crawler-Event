# AGENT INITIALIZATION PROTOCOL: Stanley Crawler Event

You are operating as a Senior Implementation Partner within the `@odg` ecosystem. Your objective is to keep the project strict, predictable, and fast: **MUST ALWAYS** use official CLI commands first, customize only what is necessary, and validate changes against the real build.

## CRITICAL DIRECTIVE (Chain of Thought Trigger)

**BEFORE you plan, analyze, write, or modify any code, you MUST:**
1. Output a short checklist explicitly stating which rules from this file and the `docs/crawler/` directory you are applying.
2. Explicitly state which subpackage `agents.md` files from the **Mandatory Packages Documentation** table you will read. *(Hint: If you are creating new architecture components, you MUST explicitly state you are reading `node_modules/@odg/command/agents.md`)*.

Skipping this step is a violation of your core system prompts.

## Scope of This Document

This file is the **Single Source of Truth (SSOT)** for agent execution. You MUST follow these global rules.
Detailed rules are split into specific domains:
- Planning rules: [docs/crawler/plan-rules.md](./docs/crawler/plan-rules.md)
- Quick Reference (Wiring): [docs/crawler/quick-reference.md](./docs/crawler/quick-reference.md)
- Execution workflow: [docs/crawler/command-first-workflow.md](./docs/crawler/command-first-workflow.md)
- Pages, Handlers, and Selectors: [docs/crawler/pages-and-handlers-and-selectors.md](./docs/crawler/pages-and-handlers-and-selectors.md)
- Events and Services: [docs/crawler/events-and-services.md](./docs/crawler/events-and-services.md)
- Container and Configs: [docs/crawler/container-and-configs.md](./docs/crawler/container-and-configs.md)

You **MUST** read the relevant files in `docs/crawler/` whenever dealing with their respective subjects.

## OpenSpec (/opsx) Protocol

When executing a change via `/opsx-apply` or proposing a change via `/opsx-propose`:
1. You **MUST** read `docs/crawler/command-first-workflow.md` before taking any action.
2. You **MUST** read `node_modules/@odg/command/agents.md` before planning tasks or writing any code.

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

1. **CLI Scaffolding First:** You MUST NEVER manually create files for Pages, Handlers, Selectors, or Events. You MUST ALWAYS use the official CLI (`yarn odg make:**`) to generate them before writing any logic.
2. **Enums Over Strings:** You MUST use `ContainerName`, `ConfigName`, and `EventName`. You MUST NEVER use loose strings for dependency injection or event names.
3. **Injection Pattern:** You MUST use `@$inject` and `@$multiInject` from `~/ContainerInject`. You MUST NEVER use direct Inversify injections (`@inject`).
4. **Decorator Order:** You MUST place `@ODGDecorators.injectable(...)` at the absolute top, above all other decorators.
5. **Selectors:** You MUST keep selectors in `src/Selectors/` as typed constants. You MUST NEVER write inline CSS/XPath selectors inside Pages or Handlers.
6. **Strict Typing:** You MUST NOT use `any` or `unknown` unless technically unavoidable.
7. **Environment Variables:** You MUST read configurations exclusively via `config.get(ConfigName.X)`. You MUST NEVER read from `process.env`.
8. **Barrels (`index.ts`):** You MUST keep barrel files updated whenever you create or delete public files.
9. **Async/Await:** You MUST use `async` and `await` consistently. You MUST NEVER use `.then()` chaining for control flow.
10. **Composition Root:** You MUST keep all wiring and manual bindings inside the composition root (`src/app/Container.ts`).
11. **Linting:** You MUST run `lint eslint --fix` after your manual adjustments and after every `yarn odg make:**` command.
12. **Sensible Configs:** All configs MUST exist inside `.env.example`. You MUST NEVER place sensitive data (like real passwords) in `.env.example`; leave them empty or use placeholder values.
13. **Class Structure:** You MUST respect access modifier ordering (`public`, then `protected`, then `private`). You MUST respect element ordering (`properties`, then `constructor`, then `methods`).

## Absolute Anti-Patterns (NEVER DO THESE)

| 🔴 [BAD] - YOU MUST NEVER DO THIS | 🟢 [GOOD] - YOU MUST DO THIS INSTEAD |
| --- | --- |
| Create a new Page, Handler, Selector, or Event file manually using file creation tools. | Run `yarn odg make:page`, `make:handler`, etc., to generate the architecture first. |
| Call `container.get()` inside a Page, Handler, Listener, or Service. | Use typed constructor injection (`@$inject(ContainerName.X)`). |
| Write inline selectors like `page.click('.btn')`. | Centralize selectors in `src/Selectors/` and use `this.$$s.mySelector`. |
| Manually instantiate domain services via `new Service()`. | Register them in the Container and inject them. |
| Read configuration via `process.env.MY_VAR`. | Read via `await this.config.get(ConfigName.MY_VAR)`. |

## Source of Truth (Conflict Resolution)

If the text editor, filesystem, language service, and build tools diverge, you **MUST** resolve conflicts using this exact priority order:

1. Real build output: `tsc` or `yarn build`
2. Test output: `vitest run` or `yarn test`
3. Real file content on disk
4. Editor diagnostics

**RULE:** If there is a divergence between the editor and the build, the build ALWAYS wins.

When divergence occurs, you MUST:
1. Log the divergence in a short sentence in your response.
2. Stop trusting the editor state for that specific file.
3. Proceed by relying ONLY on `tsc` builds and `diff` checks until the state is stabilized.

## Conditionally Use RTK (Rust Token Killer)

The project leverages `rtk` to optimize commands.
- You **MUST** evaluate if `rtk` is available on the system (e.g., using `command -v rtk`).
- **IF AVAILABLE**: You **MUST** prefix all shell commands with `rtk` (e.g., `rtk yarn odg make:page...`, `rtk tsc`).
- **IF NOT AVAILABLE**: You **MUST** fallback to standard commands (e.g., `yarn odg make:page...`, `yarn build`).
