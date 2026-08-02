# Project Wiring Quick Reference

Wiring steps (Config/Event/Container chains), architecture spine, and post-scaffold checks follow the shared `odg` skill (architecture.md, configs.md, events.md, execution.md) — this file states only project-specific orchestration choices below.

### 3. Orchestration Pattern
- **Service-driven**: Service dispatches Event AND executes the Handler.
- **Event-driven**: Listener executes Page AND executes the Handler (since no Service is present).
