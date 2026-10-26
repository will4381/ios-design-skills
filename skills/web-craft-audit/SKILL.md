---
name: web-craft-audit
description: Audit web-app interaction quality across real journeys, including mobile Safari, keyboard and touch behavior, state continuity, accessibility, and perceived performance. Use for evidence-backed UX findings and prioritization, not an automatic redesign.
---

# Web Craft Audit

Read the collection's [working contract](../web-craft/references/working-contract.md). Audit mode is read-only by default. A request for a deep audit expands coverage, not mutation authority. If the user separately authorizes fixes, keep that scope explicit.

Inspect the actual route, role, data state, and component path. Start with the named journey; for a broad audit, select representative frequent and consequential journeys from the app rather than inventing generic screens. Respect a request to leave browser review to the user.

Trace the complete sequence: entry → input → feedback → persistence → return/recovery. Inspect the shared controls involved. Screenshots can establish appearance; they cannot establish cancellation, scroll restoration, keyboard behavior, or persistence.

Use the [audit format](references/audit-format.md). Sample relevant checks from the [rulebook](../web-craft/references/rulebook.md) and [microdetails](../web-craft/references/microdetails.md). For a browser-support claim, read the affected portion of [browser capabilities](../web-craft-browser/references/browser-capabilities.md) and verify current target support. For motion mechanics, use the motion skill only when that is part of the issue.

Distinguish reproduced defects, code-established defects, hypotheses, and optional aesthetic improvements. Trace a suspected root cause before prescribing a library replacement or a global fix. Group repeated symptoms caused by the same primitive; retain examples showing affected contexts.

Rank by user harm, frequency, and confidence. Include concrete triggers and acceptance checks. Report unavailable devices and unvisited states as coverage gaps. Do not turn an exhaustive checklist into fabricated findings or a numeric “native feel” score.
