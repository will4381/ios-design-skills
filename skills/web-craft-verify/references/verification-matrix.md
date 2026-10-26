# Verification matrix

Pick the smallest set that proves the requested change and addresses its actual risks. Never interpret this inventory as authorization to mutate live data or request permissions.

| Area | Representative checks | Evidence needed |
|---|---|---|
| Activation | Contact, release, cancel, keyboard, rapid repeat, separate row action | Interaction trace or meaningful automated test |
| Editing | Mid-string edit, selection, paste, undo, IME, validation | Browser/input-method testing; source inspection alone is partial |
| Keyboard/viewport | Last field, composer, chrome expanded/collapsed, rotate, zoom, dismiss | Real mobile keyboard for a mobile-complete claim |
| Navigation | List/detail/Back, Forward, direct link, tabs, draft return | State and scroll/focus observations |
| Overlay | Nested open/close, Escape, backdrop, dirty draft, scroll lock | Browser interaction with restored underlying state |
| Async state | Slow request, error, retry, stale response, duplicate prevention | Controlled fixture or authorized test environment |
| Motion | Reverse, re-grab, release velocity, cancel, background/resume | Math tests where applicable plus browser/device behavior |
| Accessibility | Focus/name/role, keyboard, zoom/reflow, reduced motion, status announcements | Relevant automated checks plus manual assistive testing where required |
| Browser API | Present/absent, exact subtype, denied/canceled/released, embedding and installed context | Dated docs plus runtime test of the selected capability |
| Haptics | Genuine semantic event, no duplicate feedback, absent/disabled capability | Physical hardware; mocks prove only control flow |
| Rendering | Layout/paint/raster work, frame pacing under representative load | Identified device/browser trace; average FPS alone is insufficient |
| Lifecycle/storage | Resume, expired session, bfcache, offline work, failed storage/update | Controlled lifecycle and persistence checks |

For each relevant case record environment, scenario, expected result, observed result, and status: pass, fail, not tested, or not applicable with reason. Record browser/OS versions when behavior depends on them. Keep screenshots/recordings/traces tied to the scenario rather than a generic “tested” claim.

Use physical-device coverage proportional to the claim: real touch, software keyboard, haptics, refresh behavior, installed mode, and sensor access cannot all be established by resizing a desktop viewport. Android, desktop Safari/Chromium/Firefox, hybrid inputs, and assistive technology matter according to the product's actual support policy.

When access is unavailable, complete independent source/logic checks and produce the exact remaining manual scenarios. Do not mark the flow release-ready merely because the available checks pass. If the user has left browser review to themselves, do not run it.
