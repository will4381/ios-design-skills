# Prompt recipes

Replace the app, route, or flow in a prompt with the actual target. The labels are plain-language instructions, not CLI options. Existing user constraints and authorization still apply.

## Discussion and prioritization

> Use $web-craft. Mode: discuss. Depth: focused. Explain what would make the named flow feel more connected and dependable on mobile and desktop. Separate the likely user benefit from implementation effort. No app edits and no invented findings about screens you have not inspected.

## Fast check of one component

> Use $web-craft-polish. Mode: audit. Depth: quick. Inspect this component's idle, focused, pressed, pending, disabled, and error states. Prioritize actual usability defects and geometry shifts. Keep the findings concise. No app changes.

## Broad interaction audit

> Use $web-craft-audit. Mode: audit. Depth: deep. Audit the agreed app area using its actual frequent journeys and shared primitives. Include keyboard, IME, touch cancellation, Back/Forward, draft recovery, loading, accessibility, and browser differences. Rank root causes by impact and frequency, separate observed/source-confirmed/hypothetical findings, and report untested environments. No app changes.

## Flow proposal before implementation

> Use $web-craft-flows. Mode: plan. Depth: focused. Redesign the named flow around the user's goal. Show the current and proposed sequence, state transitions, focus/scroll/draft policy, failure and cancellation paths, and acceptance checks. Preserve authorization and business-state meaning. No implementation yet.

## Implement a specific improvement

> Use $web-craft-flows. Mode: change. Depth: focused. Implement the approved flow improvements in the named scope. Reuse existing primitives and inspect their consumers. Finish relevant error/recovery, keyboard, accessibility, and responsive behavior, then run appropriate checks. Do not redesign unrelated screens.

## Motion mechanics

> Use $web-craft-motion. Mode: audit. Depth: focused. Inspect this drag/release transition. Check units, measured release velocity, position/velocity continuity, resistance, interruption, settling, reduced motion, and rendering cost. Distinguish evidence from proposed tuning; do not claim Apple defaults without specific evidence.

## Safari and device capabilities

> Use $web-craft-browser. Mode: plan. Depth: focused. Determine which browser APIs materially improve this flow. Verify support for our minimum Safari, Chromium, and Firefox versions and relevant installed or embedded contexts. Include activation/permission conditions, exact subfeatures, cancellation, failure, and fallbacks. No permission prompts or app edits during the audit.

## Haptics without broken semantics

> Use $web-craft-browser. Mode: discuss. Depth: focused. Explain haptics options for actual settings toggles and action buttons on iPhone Safari and Android browsers. Check current documentation, distinguish real switch feedback from general vibration and native bridges, and reject hidden-control workarounds as a production dependency.

## Finish to a high quality bar

> Use $web-craft. Mode: change. Depth: deep. Make the named journey exceptionally polished within the existing design system. Prioritize input, state continuity, editing, focus, loading, and accessibility before decorative effects. Then use $web-craft-verify for the affected environments. Report actual checks and outstanding device proof rather than calling untested behavior complete.

## Verify without modifying

> Use $web-craft-verify. Mode: verify. Depth: focused. Validate the named changes using available safe fixtures. Separate source, automated, browser, and physical-device evidence. Report pass/fail/not-tested for the relevant cases. Do not modify app files or submit live transactions.

## Source-only review

> Use $web-craft-audit. Mode: audit. Depth: focused. Review the named source paths only; leave browser review to me. Identify code-established issues, label hypotheses, and provide a short manual test plan. Do not claim visual, haptic, or physical-device verification.
