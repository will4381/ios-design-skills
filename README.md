# iOS Design Skills

A collection of seven Codex skills for making mobile and desktop web apps feel responsive, coherent, and carefully finished. Informed by iOS interaction design, Safari/WebKit behavior, browser APIs, and quantitative motion models.

Use it to discuss improvements, audit an existing app, plan better flows, implement scoped changes, or verify the result. It covers the details between screens and states: touch cancellation, keyboard handling, drafts, focus, navigation memory, loading, accessibility, motion, and device integration.

## Skills

| Skill | Purpose |
|---|---|
| [`$web-craft`](skills/web-craft/SKILL.md) | Coordinate the work and select relevant specialties |
| [`$web-craft-audit`](skills/web-craft-audit/SKILL.md) | Find and prioritize evidence-backed interaction defects |
| [`$web-craft-flows`](skills/web-craft-flows/SKILL.md) | Plan or implement complete flow improvements |
| [`$web-craft-motion`](skills/web-craft-motion/SKILL.md) | Springs, gesture mechanics, interruption, timing, and rendering |
| [`$web-craft-browser`](skills/web-craft-browser/SKILL.md) | Safari/WebKit, browser APIs, haptics, support conditions, and fallbacks |
| [`$web-craft-polish`](skills/web-craft-polish/SKILL.md) | Editing, focus, typography, geometry, and component states |
| [`$web-craft-verify`](skills/web-craft-verify/SKILL.md) | Verify behavior and distinguish actual evidence from untested assumptions |

The repository name is `ios-design-skills`; the `web-craft` invocation names are retained across the collection. These skills target web apps inspired by native interaction quality, including appropriate desktop behavior.

## Install

Clone the repository:

```sh
gh repo clone will4381/ios-design-skills
```

Copy all seven directories inside `skills/` into your Codex skills directory, normally `$CODEX_HOME/skills` or `~/.codex/skills`. Keep them as siblings because they share references. Check for existing skill names before copying and preserve any local customizations.

You can also ask Codex:

```text
Use $skill-installer to install all seven skills under skills/ from
https://github.com/will4381/ios-design-skills. Keep the collection together
and preserve existing customized skills.
```

Each skill uses a standard `SKILL.md` with YAML frontmatter, plus `agents/openai.yaml` metadata and relevant references or assets. Normal automatic discovery remains enabled. A new chat or reload may be needed after installation.

## Choose mode and depth

Modes and depth are independent. A deeper audit does not authorize app edits.

| Mode | Result |
|---|---|
| `discuss` | Explore options and tradeoffs without app changes |
| `audit` | Inspect and report actionable findings without app changes |
| `plan` | Define the proposed flow, implementation scope, and acceptance checks |
| `change` | Implement the requested improvement within its authorized scope |
| `verify` | Check the result and report coverage and remaining gaps |

| Depth | Coverage |
|---|---|
| `quick` | One surface or journey and the highest-impact details |
| `focused` | The named flow, shared primitives, and relevant alternate states; default |
| `deep` | Critical journeys across the agreed area, state transitions, browser assumptions, and available device/input coverage |

## Example prompts

### Audit an app

```text
Use $web-craft. Mode: audit. Depth: deep.
Inspect this app's three most frequent mobile and desktop journeys.
No app changes. Prioritize input, keyboard, navigation memory, loading,
accessibility, motion, and Safari differences. Give evidence, user impact,
a proposed fix, and an acceptance check for each finding.
```

### Improve a flow

```text
Use $web-craft-flows. Mode: change. Depth: focused.
Improve the comments flow from opening an item through typing, submitting,
dismissing, and Back. Preserve drafts, scroll, focus, permissions, and
server-state meaning. Reuse existing components and verify the full journey.
```

### Review browser capabilities

```text
Use $web-craft-browser. Mode: plan. Depth: focused.
Review useful APIs for our supported Safari, Chromium, and Firefox versions,
including haptics, sharing, clipboard, keyboard handling, and installed mode.
Check the exact subfeatures, activation/permission conditions, and fallbacks.
No app edits.
```

More examples are in the [prompt recipes](skills/web-craft/references/prompt-recipes.md).

## Included references

- [40 interaction rules](skills/web-craft/references/rulebook.md)
- [48 smaller details](skills/web-craft/references/microdetails.md)
- [Motion equations and rendering models](skills/web-craft-motion/references/motion-and-rendering-spec.md)
- [iOS 27 simulator binary findings and limits](skills/web-craft-motion/references/ios27-binary-findings.md)
- [Safari and browser capability matrix](skills/web-craft-browser/references/browser-capabilities.md)
- [Haptics guidance](skills/web-craft-browser/references/haptics.md)
- [Verification matrix](skills/web-craft-verify/references/verification-matrix.md)
- [Validation record](docs/VALIDATION.md)

## Reference math tests

The JavaScript reference uses standard Node modules and has no package dependencies:

```sh
node --test skills/web-craft-motion/assets/motion-model.test.mjs
```

The eight tests cover initial conditions, damping regimes, derivatives, retargeting, elapsed-time consistency, overshoot, boundary resistance, inertia, and invalid inputs. The model is a calibration/reference asset, not a complete gesture component.

## Evidence and scope

Browser support research is dated **October 25, 2026**. Refresh relevant facts before implementation; preview, flagged, partial, or future-version records are not general shipping guarantees. Feature presence does not prove permission, hardware, or successful behavior.

iOS evidence concerns selected routines in an arm64 iOS Simulator 27.0 build. It does not establish universal component presets, physical-device performance, or exact glass shaders. Proposed tuning, standard mathematical models, documented platform behavior, and recovered routines are identified separately.

The skills preserve user intent, the existing design system, and explicit no-change requests. They do not grant permission to deploy, change unrelated architecture, access device resources, or mutate live data. A passing build or desktop preview is not proof of iPhone keyboard, touch, or haptic quality.
