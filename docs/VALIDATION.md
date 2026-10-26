# Collection validation

Validated October 25, 2026. This record describes the skill package, not the quality of any target app.

## Executed checks

- All seven skill directories passed the skill-creator `quick_validate.py` validator.
- All seven UI metadata files parsed; short descriptions meet the metadata length constraint and default prompts name their corresponding skill.
- Implicit invocation remains enabled by default. No explicit-only policy was added.
- Internal Markdown links were checked after repository packaging; all resolve inside the repository.
- The compatibility snapshot parsed and contains 19 public MDN BCD source records with source paths and SHA-256 hashes; relevant picker and select subfeatures are retained.
- All eight tests of the packaged motion model passed, including all damping regimes, ODE/derivative checks, retargeting, frame-cadence equivalence, overshoot, resistance, inertia, and invalid inputs.

## Author scenario review

The following are manual reviews of the authored instructions, **not independent agent executions or browser tests**. Each case was checked against the listed instruction path. Their purpose is to expose ambiguous scope and false capability claims.

| Scenario | Instruction outcome reviewed | Where |
|---|---|---|
| “Deep audit; no app changes” | Expand coverage without editing app code or performing live submissions | Shared working contract; audit skill |
| “Plan a better comments flow” | Produce concrete state, focus, draft, scroll, and recovery decisions without implementation | Flows skill and flow contract |
| “Fix this approved flow” | Proceed with scoped implementation and checks without redundant permission requests | Shared contract; flows skill |
| “Make everything mint” with a named flow | Deep quality work within that flow; no unrelated redesign or invented score | Shared contract; coordinator |
| “Add vibration to every iPhone button” | Explain missing general Safari vibration; preserve semantics and optional feedback | Browser skill; haptics reference |
| “A library uses a hidden switch to buzz” | Do not rely on a fake control as a production haptic API | Haptics reference |
| “showPicker exists, so our date button works on iPhone” | Check the exact input subtype and preserve operable native input | Browser capability reference and snapshot |
| “Fix keyboard overlap with VirtualKeyboard on Safari” | Identify unsupported API; use measured layout/viewport alternatives | Browser skill and capability reference |
| “The headless WebKit test passed; mark iPhone haptics verified” | Mark physical haptics as not tested; separate evidence layers | Verification skill and matrix |
| “Audit browser API support” | Read support metadata without triggering permissions, capture, clipboard access, or notifications | Browser skill |
| “Review source; I will test the browser” | Respect source-only scope and provide remaining manual checks | Audit/verification skills; prompt recipes |
| “Installed push exists, so use it in every Safari tab” | Preserve installed-context and permission distinctions | Browser skill and capability reference |
| “The spring matches a 300 ms iOS duration” | Distinguish response from settling, units, initial velocity, and component-specific evidence | Motion skill and mathematical reference |
| “Reduced motion hides content because no end event fired” | Require state completion and content visibility independent of animation | Shared rulebook; motion/polish skills |

## Not established

No target app was changed, audited, deployed, or benchmarked during collection creation. No physical keyboard, haptic, touch, refresh-rate, or installed-web-app behavior was tested for this package. No independent agent forward-test was performed. Static validation cannot prove how a future model will apply the instructions; refine them based on actual use.

Browser capability sources were checked as dated research, not runtime compatibility tests. Future work must refresh relevant support and verify the actual target environment. Existing simulator-derived equations retain their original evidence limits.

## Installation

All seven skill directories were installed into the author's configured Codex skills directory without overwriting existing skills. Every installed file was compared byte-for-byte by SHA-256 against its packaged source. All seven subsequently appeared in the available skill catalog. End-to-end behavior in independent future tasks remains untested.
