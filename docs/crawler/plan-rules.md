# Instructions for Plans

This file applies ONLY to the planning phase. You **MUST NOT** describe step-by-step execution details here.

## Goal of the Plan

Every plan you generate **MUST**:
1. Translate the user's request into an operational contract.
2. List the official CLI scaffolding commands first.
3. Declare exactly what remains manual after scaffolding.
4. Define final validation steps.

If the minimal contract is already clear, the plan **MUST** end quickly with the final official command, avoiding unnecessary exploration.

## Pre-Planning Reading Requirement

Before writing the scaffolding tasks or generating a plan, you **MUST** read the relevant subpackage `agents.md` files (e.g., `node_modules/@odg/command/agents.md`). Do not guess CLI flags or assume manual steps that the CLI `--register` flag already automates.

## Minimum Operational Contract

Before proposing a plan, you **MUST** explicitly identify:
1. Flow steps.
2. Shared state.
3. Success gate per step.
4. Retry boundary.
5. Canonical CLI command per step.
6. Expected generated artifacts per step.
7. Unavoidable secondary CLI calls (and their justification).
8. Steps without official commands.
9. Validation strategy.

**Selector Placeholder Warning:** Selectors identified during the planning phase or in specs are **placeholders**. You **MUST** manually inspect the real target page during the implementation phase (Phase 3) to identify the final, correct CSS selectors. See [command-first-workflow.md](./command-first-workflow.md) for execution rules.

**CRITICAL RULE:** If the central piece is a page, you **MUST** plan `yarn odg make:page ... --register` with the final flags right away.
If selector and listener are part of the same page step, the plan **MUST** use `make:page` with flags instead of breaking it into multiple commands.

## When to Ask vs When to Assume

You **MUST** ask questions ONLY if the answer could fundamentally change the architecture:
- Observed selectors.
- Triggered event name.
- Handler responsible for the gate.
- Retry boundary.
- Destination after success.
- Use of credentials or sensitive configs.

If the answer does not change the architecture, payload, selector, or retry boundary, you **MUST** proceed with the conservative option and declare the assumption in the plan.

## Recommended Plan Structure

You **MUST** follow this order:
1. Summarized operational contract.
2. Canonical command per step.
3. Expected artifacts per step.
4. Justified exceptions to preferred commands.
5. Unavoidable manual adjustments.
6. Validation steps.
7. Relevant assumptions.

If scaffolding is involved, the plan **MUST** clearly separate:
1. Post-scaffold structural stabilization.
2. Subsequent manual semantics.

If an artifact depends on a specific CLI flag, the plan **MUST** state this explicitly. The absence of this artifact after scaffolding **MUST NOT** be treated as a bug until you verify if the correct flag was used.

## Budget Rule

If naming, path, payload, gate, and retry are already clear, the plan **MUST NOT** create generic investigation steps before the first scaffold.

## Artifact Resolution

If competing artifacts exist, classify them as:
- Canonical
- Compatible legacy
- Obsolete
- Suspicious

Without explicit user instruction, you **MUST ALWAYS** prefer a single canonical path and avoid unnecessary legacy compatibility.

## Exception Rule

You are allowed to deviate from the preferred CLI command ONLY WHEN:
1. The CLI does not cover the correct artifact.
2. The generated naming would be incompatible with the step contract.
3. The local documentation already logs a known scaffolding limitation.

In these cases, the plan **MUST** declare the exception and propose the shortest alternative command sequence.
