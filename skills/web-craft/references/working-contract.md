# Modes, depth, and evidence

This contract is shared by the installed Web Craft collection. Read it once per task. User instructions, repository conventions, and existing authorization take precedence over collection defaults.

## Mode is independent of depth

| Mode | Outcome and allowed work |
|---|---|
| discuss | Explain possibilities and tradeoffs. No repository edits. |
| audit | Inspect permitted sources and interactions; report evidence-backed findings. No app edits, dependency installs, or production submissions. Save a report only when requested or clearly part of the deliverable. |
| plan | Produce a concrete before/after flow or implementation plan with acceptance checks. No app edits. |
| change | Implement the requested improvement within the authorized scope. Existing permission persists; do not ask again for routine reversible work. |
| verify | Run relevant checks within the authorized test environment. Do not silently turn verification into an implementation pass or perform real purchases, messages, or destructive actions as tests. |

Infer mode from the user's verbs and context. “No changes,” “let's chat,” or “audit only” overrides an implementation-oriented skill. Explicit requests to fix or implement authorize scoped changes; a separate permission ritual is unnecessary. If the user only asks for ideas or the intended scope cannot be inferred, remain in discussion/audit while clarifying the missing detail.

## Depth determines coverage, never permission

| Depth | Practical scope |
|---|---|
| quick | One named surface or journey, a short evidence pass, and the highest-impact findings. Use when the user requests a quick check or the change is small. |
| focused — default | The named flow and its shared primitives; usually one to three representative journeys. Include relevant loading/error, interruption, keyboard, accessibility, and responsive states. |
| deep | Inventory the agreed app area, map critical journeys and state transitions, inspect browser capability assumptions, and test the relevant device/input matrix as available. Group root causes and report coverage gaps. Do not extend into unrelated product areas. |

“Mint” means attention to detail plus honest verification; it is not a measurable score or permission to redesign the app. If used as a quality request, use deep coverage within the requested scope and an explicit verification pass. Missing hardware does not become a pass.

## Work from the actual product

Establish the repository/worktree, requested route or journey, user role/account context, browser targets, and existing component/motion stack from available evidence. For edits, inspect affected callers and preserve unrelated changes. Trace the actual path used by the interface; a backend endpoint existing does not prove a usable flow.

Prefer existing accessible primitives, platform features, and dependencies already in the app. Do not replace routing, auth, storage, or component libraries merely to make polish easier. Do not make global CSS resets or blanket gesture suppression to cure a local defect. Change the smallest shared layer that fixes the authorized scope and check its affected consumers.

## Separate evidence types

Use labels where the distinction matters:

- **Observed:** reproduced in an identified browser/device and state.
- **Source-confirmed:** a specific code path establishes the behavior; no runtime reproduction claimed.
- **Documented support:** a dated primary source or compatibility record; still requires runtime handling.
- **Hypothesis:** plausible cause awaiting a specified check.
- **Not tested:** unavailable or deliberately excluded environment/behavior.

Do not invent performance measurements, user research, native equivalence percentages, or physical-device results. Builds and unit tests do not prove keyboard, haptic, touch, or visual behavior. Browser automation and a WebKit engine build do not automatically prove shipping iPhone Safari behavior.

## Report useful outcomes

For a finding, include trigger/state, user impact, evidence, proposed fix, and acceptance check. Distinguish functional/accessibility defects from aesthetic preferences. Rank by harm and frequency; use critical/high/medium/low with a brief reason rather than a fabricated numeric quality score.

For changes, report what changed, why, checks actually run, and remaining material limits. Recheck after new changes or failures; do not repeat broad suites without a reason. Stop when the authorized outcome and appropriate checks are complete.
