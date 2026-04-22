# Command-First Workflow for AI Agents

This file governs the execution phase. For planning rules, see [docs/crawler/plan-rules.md](./plan-rules.md).

- Full CLI Guide: [@odg/command/agents.md](../../node_modules/@odg/command/agents.md)

**CRITICAL IMPLEMENTATION RULE:** Selectors identified during the planning phase or in specs are **placeholders**. During the implementation phase, you **MUST** manually inspect the real target page to identify the final, correct CSS selectors.

You **MUST** adhere to the following rigid state machine when building features:
`PHASE 1: SCAFFOLD -> PHASE 2: STRUCTURAL VALIDATION -> PHASE 3: MANUAL SEMANTICS`.

## Execution Rule (PHASE 1: SCAFFOLD)

**Zero-Shot Scaffolding Warning:** Do NOT waste time manually researching the boilerplate architecture or creating empty files. Your first action for any new feature MUST be running the `make:**` command. The command will provide the correct structure automatically.

If an official command exists to create the shell of an artifact, you **MUST** run the command before writing code manually.

**Scaffold Priority:**
1. `yarn odg make:page ... --selectors --event --register` when the central piece is a new page and it also requires a selector and a listener.
2. `yarn odg make:page ... --register` when the page is the central piece but selector/listener are not part of the same step.
3. `yarn odg make:handler ... --register` when a handler exists without a new page.
4. `yarn odg make:event ... --register` when only the event/listener is missing.
5. `yarn odg make:selector ... --register` when only the selector is missing.

### CLI Flags `--handler-to` vs `--handler-from`
You **MUST** determine the flag based on the user's requested logic:
- **`--handler-from=Home`**: Use this when you are generating the *Destination* page and you need to validate that the crawler successfully transitioned *from* Home. (Generates `HomeToDestinationHandler`).
- **`--handler-to=Search`**: Use this when you are generating the *Origin* page and you need to validate that the crawler successfully transitioned *to* Search. (Generates `OriginToSearchHandler`).

## Command Selection Rule

Before executing the scaffold, you **MUST** declare internally which command is the canonical one for the step.

1. If the step originates around a new page, you **MUST NOT** start with `make:event` or `make:selector`.
2. If the step needs a page, selector, and listener, you **MUST** prefer a single `make:page` with flags instead of three separate commands.
3. You **MUST NOT** break a single step into `make:page`, `make:selector`, and `make:event` purely for convenience. A second command is only allowed if there is a real CLI limitation.

## Stop Conditions Post-Scaffold (PHASE 2: STRUCTURAL VALIDATION)

After every scaffold, you **MUST** pause feature expansion and validate the generated structure.

**CRITICAL RULE:** If any of the following occur, you **MUST NOT** proceed to business logic (Phase 3). You **MUST** stabilize the structure first:
1. A barrel points to a non-existent path.
2. A broken import.
3. An enum is registered with an incompatible path.
4. A build failure caused by the newly generated structural wiring.

**Mandatory `ContainerName.ts` Post-Scaffold Check:**
The CLI auto-registration often introduces minor structural bugs. You **MUST** manually fix these before writing logic:
- **Correct Section**: Move the entry to the correct section (`// Pages`, `// Handlers`, `// Events`).

In these cases, you **MUST** treat it as a scaffolding defect and fix ONLY the minimum required to re-establish the canonical path.

## RTK (Rust Token Killer) Evaluation Rule

The project uses `rtk` for command optimization.
- You **MUST** evaluate if `rtk` is available by running `command -v rtk`.
- **IF AVAILABLE**: You **MUST** prefix shell commands with `rtk`.
- **IF NOT AVAILABLE**: You **MUST** use standard commands.

Examples (Assuming RTK is available):
```bash
rtk git status
rtk yarn odg make:page <Name> --register
rtk lint eslint --fix
rtk tsc
```

## Validation Sequence

After your manual adjustments:
1. `tsc` (or `rtk tsc`) to confirm real compilation.
2. `yarn lint:fix` (or `rtk lint eslint --fix`) to fix formatting.
3. `yarn test` (or `rtk vitest run`) to run relevant tests.

## Divergence During Execution

If the code editor's diagnostics and the `tsc` build diverge:
1. You **MUST** log the divergence.
2. You **MUST** stop trusting the editor state for that file.
3. You **MUST** use the real build (`tsc`) and filesystem diffs as the source of truth.
