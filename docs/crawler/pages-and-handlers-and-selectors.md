# Pages, Handlers & Selectors

This guide covers the three most common automation elements in the template: Pages, Handlers, and Selectors. It focuses on the strict responsibilities of each component, observable identifiers, and retry boundaries.

You **MUST** adhere to the rules defined in this document.

---

## Pages

### What is a Page?

Each Page represents a single action or intent in the crawler, strictly following the Page Object Pattern.

**CRITICAL RULE (Intent vs URL):**
Pages are intent-oriented, NOT URL-oriented.
- **IF** the same URL has 3 different intents (e.g., Home, Search, Best Flights all happen on `latam.com`), you **MUST** create 3 separate Pages. You **MUST NOT** merge them into a single Page just because the URL is the same.
- **IF** an intent spans across multiple URLs, you still follow the intent logic, but keep responsibilities segregated.

### Page Lifecycle

```
Page.setPage(pageEngine)
    │
    └── execute()         ← You MUST implement interaction logic here
          │
          └── attempt()   ← Returns max retry attempts (auto-retry on failure)
```

### What a Page MUST DO

A Page **MUST**:
- Navigate to URLs.
- Fill out fields.
- Click elements.
- Await elements strictly necessary for the immediate action.
- Consume typed state necessary for its own step.

### What a Page MUST NOT DO (Anti-Patterns)

A Page **MUST NOT**:
- Decide if the flow advanced successfully (This is the Handler's job).
- Dispatch the next step of the flow.
- Reinvent state that already exists in the typed payload.
- Contain inline business logic or conditional flow routing.

### How to Create a Page

You **MUST ALWAYS** use the official scaffolding command to create pages.

```bash
yarn odg make:page <PageName>
# Useful Flags:
#   --selectors       Creates the selectors file together
#   --event           Creates the event listener that triggers the page
#   --handler-from    Creates the handler that precedes this page
#   --handler-to      Creates the handler that succeeds this page
```

> **RULE:** When creating a page, handler, selectors, and events, you **MUST ALWAYS** prefer using `make:page` with the additional flags + `--register` to automatically create enums.

#### Manual Steps After Scaffold

| File | What you MUST do |
| --- | --- |
| `src/Pages/<Name>Page.ts` | Inherit from `BasePage` (Done by command) |
| `src/Pages/index.ts` | Re-export the new Page (Done by command) |
| `src/app/Enums/ContainerName.ts` | Add `"<Name>Page" = "<name>.page"` (Done by command if `--register` flag is used) |
| `src/Selectors/<Name>Selector.ts` | Create selectors (If `--selectors` was omitted, Manual Action Required) |

**Note:** When the `--register` flag is used, **no manual action** is required for adding enums or updating barrel files.

#### BasePage Injected Dependencies
`BasePage` already injects the following via `@$inject`:
- `this.log`: `LoggerInterface`
- `this.config`: `ConfigInterface<ConfigType>`
- `this.page`: `PageClassEngine` (Available if browser is enabled)
- `this.$$s`: `typeof Selectors`

---

## Handlers

### What is a Handler?

A Handler waits for confirmation that a Page executed successfully or failed.

### CRITICAL RULE: Validation Strategy
You **MUST** choose the validation strategy based on the context:

1. **HTML Selectors Validation:**
   - **WHEN** the handler evaluates HTML elements appearing on a page, you **MUST** use `Promise.race([identifySuccess(), identifyFailure()])` to resolve the fastest outcome.
2. **Request Validation (Axios/Browser API):**
   - **WHEN** the handler evaluates a single HTTP request and must handle multiple potential outcomes (e.g., success, wrong password, rate limit), you **MUST** use the Nullish Coalescing Operator (`??`).
   - Example: `identifyError1 ?? identifyError2 ?? identifyAnyError ?? successSolution.bind(this)`

### CRITICAL RULE: Infinite Loop Prevention in Handlers

**WHEN** writing a `failureSolution()` that cannot recover and needs to trigger a retry:
- You **MUST** dispatch the page event again (e.g., `await this.bus.dispatch(EventName.MyPageEvent)`).
- You **MUST NOT** return `RetryAction.Retry` after dispatching the event internally, as this bypasses the attempt counter and creates an infinite loop.
- **INSTEAD**, you **MUST** throw an exception (e.g., `throw new Exception("Login failed, retrying...")`). This forces the flow into the `retrying()` method, which safely relies on the `@attemptableFlow` counter.

| 🔴 [BAD] - Infinite Loop | 🟢 [GOOD] - Controlled Retry |
| --- | --- |
| `await this.bus.dispatch(EventName.X);`<br>`return RetryAction.Retry;` | `await this.bus.dispatch(EventName.X);`<br>`throw new Exception("Failed");` |

### Handler Naming Convention

- **`ExampleHandler`**:
  - Use when the handler validates an expected result independent of page transitions (e.g., `LoginHandler` validates if login worked, regardless of where it came from).
- **`OriginToDestinationHandler`**:
  - Use when the handler validates a specific transition between an origin and a destination (e.g., `HomeToLoginHandler`).

### Observable Identifiers

Before marking success, the handler **MUST** pick a strong observable identifier.
Order of preference:
1. Completed request with a compatible response.
2. Expected URL change.
3. Visible selector of the *next* step.
4. Disappearance of the previous state combined with the presence of new state.

Weak identifiers that you **MUST NOT** use alone:
- Clicking a button without verifying the consequence.
- Absence of exceptions.
- Logs indicating an action was tried.

---

## Selectors

### What are Selectors?

Selectors are TypeScript constants that centralize CSS/XPath selectors into a typed structure.

**CRITICAL IMPLEMENTATION RULE:** Selectors identified during the planning phase or in specs are **placeholders**. During the implementation phase, you **MUST** manually inspect the real target page to identify the final, correct CSS selectors.

**CRITICAL RULE:** You **MUST NEVER** write inline selectors inside Pages or Handlers.

| 🔴 [BAD] - Inline Selector | 🟢 [GOOD] - Centralized Selector |
| --- | --- |
| `await this.page.click('.btn-submit');` | `await this.page.click(this.$$s.myPage.buttons.submit);` |

### Dynamic Selectors

**WHEN** you need a dynamic selector (e.g., a selector that depends on a runtime variable like `userId`), you **MUST NOT** use string interpolation inside the Page file.
You **MUST** use the `unicorn` method from `@odg/chemical-x/Str`.

**[GOOD] Example for Dynamic Selectors:**
In `src/Selectors/MySelector.ts`:
```typescript
export const mySelector = {
    userButton: "#user-{{userId}}",
};
```

In `MyPage.ts`:
```typescript
import { Str } from "@odg/chemical-x";

const dynamicSelector = new Str(this.$$s.mySelector.userButton).unicorn({
    userId: "123"
});
await this.page.click(dynamicSelector);
```

### Standard Selector Structure
```typescript
export const myPageSelector = {
    searchInput: "input[name=\"q\"]",
    buttons: {
        submit: "button[type=\"submit\"]",
    },
    states: {
        success: ".result h3",
        empty: ".no-results",
        error: ".alert-error",
    },
};
```
Useful groupings: `inputs`, `buttons`, `states`, `elements`, `alerts`.
