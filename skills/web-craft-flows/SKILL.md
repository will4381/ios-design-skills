---
name: web-craft-flows
description: Plan or implement improvements to complete web-app flows, preserving navigation, drafts, focus, permissions, and server-state meaning. Use for simplifying tasks or changing interactions across screens and components.
---

# Web Craft Flows

Read [working contract](../web-craft/references/working-contract.md). Honor plan/discussion/no-edit requests. An explicit request to implement or fix a flow authorizes scoped edits; do not add a separate approval gate for ordinary reversible implementation choices.

Map the current task using [flow contract](references/flow-contract.md): actor, entry point, goal, prerequisites, states, completion, interruption, and recovery. Trace what the app actually renders and what its backend actually permits. Do not equate an optimistic visual state with a confirmed business outcome.

Propose a before/after sequence in terms of user actions and state. Surface the likely next action directly, distinguish separate lifecycles, and remove unnecessary decisions only when the remaining path preserves necessary meaning. Keep shareable destinations addressable and Back predictable. Avoid changing authorization or durable state semantics as a visual cleanup.

For implementation, find existing routes, controls, validation, data mutations, and tests. Make the smallest complete change at the appropriate shared layer; inspect affected consumers. Preserve drafts, cancellation, focus, IME editing, pending/error states, and account boundaries. Reuse the component stack and existing motion engine.

Adapt presentation to input and space: mobile reach/keyboard/safe areas, desktop panes/shortcuts/selection, and hybrid inputs. Do not merely enlarge the phone layout or introduce a sheet for every operation.

Verify the complete authorized journey and its relevant recovery cases with [Web Craft Verify](../web-craft-verify/SKILL.md). If live submission is outside scope, use an available test fixture or report the unverified step. Report final behavior, concrete checks, and remaining risks; do not stop at a proposed implementation when changes were requested and can be completed.
