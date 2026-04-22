# Project Wiring Quick Reference

This is a high-level summary for AI agents to quickly understand the project architecture and wiring requirements.

## Core Architecture
- **Pages**: Logic for interacting with the page (`src/Pages/`).
- **Handlers**: Logic for validating step success/gate (`src/Handlers/`).
- **Selectors**: Centralized DOM selectors (`src/Selectors/`).
- **Listeners**: Triggered by events to execute Pages/Handlers (`src/app/Listeners/`).
- **Bus**: Orchestrates transitions via `bus.dispatch(EventName.X, { page })`.

## Mandatory Wiring Steps

### 1. Adding a Configuration Key
1. **`src/app/Enums/ConfigName.ts`**: Add the key to the enum.
2. **`src/Configs/index.ts`**: Add the key to the `configValidator` (Zod schema).
3. **`.env.example`**: Add a placeholder with a comment.
4. **`tests/vitest/init.ts`**: Add a test default value if the key is required.

### 2. Adding an Event
1. **`src/app/Enums/EventName.ts`**: Add the event name.
2. **`@types/EventsInterface.d.ts`**: Add the payload type to `EventBaseInterface`.
3. **`src/app/Enums/ContainerName.ts`**: Add the Listener to the `// Events` section (dotted format).

### 3. Orchestration Pattern
- **Service-driven**: Service dispatches Event AND executes the Handler.
- **Event-driven**: Listener executes Page AND executes the Handler (since no Service is present).

## CLI Post-Scaffold Checks
When using `yarn odg make:** --register`:
- **`ContainerName.ts`**: Verify values are `dotted.format` (not `PascalCase`).
- **`ContainerName.ts`**: Ensure entries are in the correct section (`// Pages`, `// Handlers`, `// Events`).
- **Selectors**: Auto-generated selectors are placeholders; you **MUST** update them with real values identified via manual page inspection during implementation.
