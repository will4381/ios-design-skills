---
name: web-craft-motion
description: Audit or implement responsive web motion, including spring timing, velocity continuity, gesture handoff, reduced motion, and rendering costs. Use when interaction mechanics or animation quality are central to the task.
---

# Web Craft Motion

Read [working contract](../web-craft/references/working-contract.md). Identify the interaction's purpose, frequency, input type, geometry, existing engine, and requested edit scope. Motion must not delay repeated work or become a requirement for content visibility or state completion.

For equations, units, interruption, and rendering, consult the relevant sections of [motion and rendering spec](references/motion-and-rendering-spec.md). [Binary findings](references/ios27-binary-findings.md) document selected iOS 27 simulator routines; they are not measured physical-device presets or exact shaders. Do not label proposed coefficients “the iOS default.”

## Mechanics

- During functional direct manipulation, track the pointer in a consistent coordinate space; do not add trailing spring lag unless that compliance is intentional.
- On release, use recent signed visible velocity. After nonlinear resistance, account for the transform's derivative. Handle canceled gestures and degenerate distances.
- On retargeting, preserve current position and velocity where appropriate. Reading a destination instead of a displayed value causes jumps. Test reversal and re-grabbing.
- Specify time and velocity units. A library's `bounce`, `duration`, or normalized initial velocity may have different semantics. Perceptual response and settling are different quantities.
- Use elapsed-time sampling or the established engine. Never multiply velocity by an unexplained per-frame decay constant. Avoid `transition: all` and indiscriminate spring overshoot on opacity/text.
- Choose motion by use, not a universal duration ceiling. Keep frequent keyboard work immediate or sufficiently restrained; do not ban all keyboard-triggered motion as an absolute rule.

## Rendering and validation

Prefer eligible declarative motion when it fits; inspect main-thread work, layout/paint, raster area, layers, and frame pacing. `translate3d` and `will-change` are not universal performance fixes. Reduce costly animated blur or large surfaces before introducing a rendering framework.

Use the project's existing engine first. The dependency-free [reference math](assets/motion-model.mjs) and [tests](assets/motion-model.test.mjs) are optional calibration tools, not a production gesture component. If adapting them, run the tests and add checks for the changed behavior rather than copying an untested solver.

Verify rapid repetition, reversal, pointer cancel, background/resume, reduced motion, and relevant target devices. Separate analytic correctness from visual/performance proof. Use [Web Craft Verify](../web-craft-verify/SKILL.md) for reporting evidence without claiming iPhone parity from desktop automation.
