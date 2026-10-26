---
name: web-craft-verify
description: Verify interaction-quality changes through scoped source, automated, browser, and device checks, with explicit coverage and evidence limits. Use to assess whether a flow works well after changes or before claiming release readiness.
---

# Web Craft Verify

Read [working contract](../web-craft/references/working-contract.md). Establish the changed behavior or claim, authorized test environment, relevant browsers/devices, and existing test commands. Respect any instruction leaving browser review to the user.

Select checks from [verification matrix](references/verification-matrix.md) that cover the change and its material risks. Start with required project checks and targeted tests. Broaden only for a new change, failure, or unresolved concern. Use safe fixtures for submissions; do not test purchases, messages, or destructive actions against live data without the required authorization.

Separate these evidence layers:

1. Source review: affected callers, semantic controls, state, feature checks, and cleanup paths.
2. Automated logic checks: meaningful invariants, race/retry behavior, cancellation, and math where changed.
3. Browser interaction: actual rendered flow, focus, scroll, viewport, and recovery in identified browsers.
4. Physical device: software keyboard, real touch/gesture arbitration, haptics, and display/performance behavior.
5. Production/provider: only if explicitly within scope; local success does not establish live success.

A screenshot proves only the captured appearance. A passing build proves neither interaction quality nor accessibility. A headless WebKit result is not a physical iPhone Safari result. Do not fabricate measurements or use a global “mint”/percentage score as evidence.

Return pass/fail/not-tested/not-applicable per relevant journey and environment, with reproduction steps for failures and evidence for passes. If repair is authorized, make the scoped fix and rerun the affected checks. If this is verification-only, report actionable defects without silently editing the app.

Release readiness is conditional on the agreed acceptance criteria. List remaining blockers and unverified conditions; a requested high quality bar does not turn unavailable hardware or unknown backend outcomes into a pass.
