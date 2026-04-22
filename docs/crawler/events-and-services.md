# Events, Listeners & Services

This guide covers the orchestration layer of the template: event contracts, listeners that execute pages, and services that initiate the flow.

You **MUST** adhere to the rules defined in this document.

---

## Events

### What are Events?

Events are typed contracts for the asynchronous bus. The event name lives in `EventName` and the payload lives in `@types/EventsInterface.d.ts`. The bus decouples whoever initiates a step from whoever executes it.

### Payload Modeling Rule

**Minimum payload for a simple step:**
```typescript
export interface EventBrowserParameters {
    page: PageClassEngine;
}
```

**Payload for chained flows:**
```typescript
export interface SearchFlowContext {
    query: string;
    email: string;
}

export interface EventFlowParameters extends EventBrowserParameters {
    flowContext: SearchFlowContext;
}
```

### How to Create an Event

1. You **MUST** add the name in the enum `src/app/Enums/EventName.ts`.
2. You **MUST** add the corresponding payload in `@types/EventsInterface.d.ts`.
3. You **MUST ONLY** dispatch the event from a Service or Handler. You **MUST NEVER** dispatch an event directly from a Page.

## Listeners

### What is a Listener?

A listener listens to a specific event and executes a corresponding action. In this project, they are primarily used to trigger Pages.

### Listener Responsibilities

A Listener **MUST**:
- Receive the typed payload.
- Prepare the page with `setPage(...)`.
- Prepare shared state when it exists.
- Execute the page (`await pageObject.execute()`).
- **Execute the handler** (`await handlerObject.execute()`) **IF** the flow is event-driven and there is no Service orchestrating the step (e.g., chained events).

A Listener **MUST NOT**:
- Validate the success of the flow (This is the Handler's job).
- Decide retries.
- Dispatch steps of different contexts.

### Automatic Registration

The decorator `@ODGDecorators.registerListener(EventName.X, ContainerName.X, {})` registers the listener automatically in the `EventServiceProvider`. As long as the class is exported via the barrel, it enters the boot cycle automatically.

---

## Services

### What is a Service?

A Service is the entry orchestration point of the flow. It creates context and the page, mounts the initial shared state, and dispatches the first step.

### Service Responsibilities

A Service **MUST**:
- Create the `browser.newContext()` and `context.newPage()`.
- Assemble the initial payload of the flow.
- Dispatch the first events/handlers according to the main flowchart.
- Execute the handler of the first step when the flow requires a local gate.
- Close the context at the end.

A Service **MUST NOT**:
- Reconstruct state that should live in a typed payload.
- Decide step success by reading selectors directly (It MUST use a Handler for this).

### Synchronous Flow (No Events)

**IF** the user requests a flow without events (synchronous procedural execution), you **MUST** inject the Page directly into the Service and execute it.

**[GOOD] Example of Non-Event Flow:**
```typescript
class MyCrawlerService {
    public constructor(
        @$inject(ContainerName.MyPage) private readonly myPage: MyPage
    ) {}

    public async execute(page: PageClassEngine): Promise<void> {
        await this.myPage.setPage(page).execute();
    }
}
```

---

## Canonical Chained Flow (Event-Driven)

If using the event-driven architecture, you **MUST** follow this canonical chain:

```text
Service.execute()
    │
    ├── creates page + flowContext
    │
    ├── dispatch(SearchEvent, { page, flowContext })
    │         └── SearchEventListener.handler(...)
    │                   ├── SearchPage.execute()
    │                   └── SearchHandler.execute()
    │
    ├── dispatch(LoginEvent, { page, flowContext })
    │         └── LoginEventListener.handler(...)
    │                   ├── LoginPage.execute()
    │                   └── LoginHandler.execute()
    │
    ├── dispatch(AccountEvent, { page, flowContext })
    │         └── AccountEventListener.handler(...)
    │                   └── AccountPage.execute()
    |
    ├── AccountToSettingsHandler.execute() // Validating page transition
    |
    ├── dispatch(SettingsEvent, { page, flowContext })
    └── finish
```
