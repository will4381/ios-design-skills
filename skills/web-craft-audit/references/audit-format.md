# Audit output

Keep the report proportional to the task. Start with the most consequential finding or the absence of established defects, not a generic checklist score.

Record scope: journey/routes, actor/role, data conditions, browser/device/context, source revision or worktree when available, and requested exclusions.

For each actionable finding:

| Field | Required meaning |
|---|---|
| Trigger | Exact action and relevant state, including input type |
| Impact | What the user loses, cannot do, misunderstands, or must repeat |
| Evidence | Reproduction, file/line, trace, or dated source; label its evidence class |
| Cause | Established cause, or a clearly marked hypothesis and next discriminating check |
| Fix | Smallest appropriate change, including shared consumers if relevant |
| Acceptance | Observable behavior that would show the issue is resolved |
| Priority | Critical/high/medium/low with reason, not an unsupported numeric score |

Example: “Returning from detail resets the list to its first row after data revalidation” is useful when tied to a reproduction or code path. “Navigation feels less native” alone is not a finding.

Separate optional styling suggestions from defects. Group duplicates by root cause. End with coverage and untested states, plus a practical implementation order if requested. Do not imply a screenshot audit covered keyboard, network recovery, device permissions, or haptics.
