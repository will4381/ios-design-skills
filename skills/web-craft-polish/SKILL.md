---
name: web-craft-polish
description: Audit or refine the small non-animation details of web components, including editing, focus, touch targets, visual states, typography, layout stability, and accessible system behavior. Use for finishing an existing interface without an unrelated redesign.
---

# Web Craft Polish

Read [working contract](../web-craft/references/working-contract.md). Preserve the requested audit/change mode and the app's design language. Inspect actual components and shared variants before choosing changes.

Use [component checks](references/component-checks.md) to review relevant states. Consult [microdetails](../web-craft/references/microdetails.md) for overlooked interaction cases. Treat checklist items as prompts for investigation, not proof that a defect exists.

Prioritize native editing and composition, caret/selection preservation, focus return, gesture cancellation, reliable hit areas, stable loading geometry, text reflow, meaningful status, and error recovery. Review real long content and input methods, not only a curated short label.

Then refine typography roles, icon weights/baselines, spacing, separators, corners, and material contrast across idle, pressed, selected, pending, disabled, error, and focus states. Keep compact panels mostly flat as this collection's default; retain a separate card when it represents a meaningful object or interaction, or when the product's established design calls for it.

Do not remove text selection, zoom, focus indicators, context menus, native form assistance, or browser gestures globally in pursuit of an app-like appearance. Do not change server-state labels or hide failure states to simplify visuals. A placeholder is not a field label, and color alone is not a complete status signal.

For authorized changes, fix the appropriate shared primitive and inspect its consumers; avoid global rules that inadvertently restyle unrelated screens. Use local visual/interaction checks appropriate to the change. A small reversible spacing fix does not need a synthetic unit test, while changed behavior needs meaningful coverage.

Report the concrete improvement, affected states, and actual verification. If the user requested only discussion or an audit, provide findings/proposals and leave app files unchanged.
