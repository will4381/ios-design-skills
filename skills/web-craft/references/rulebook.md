# Making a web app feel exceptional

Research date: October 25, 2026. Scope: mobile and desktop web, informed by Apple’s interaction guidance, current WebKit documentation, and static inspection of the iOS 27.0 arm64 simulator runtime, build 24A434.

**The central recommendation:** make the app respond immediately, preserve the user’s place and intent, and remain controllable while it changes. Visual styling and motion should reinforce those behaviors. Evaluate complete sequences, especially when the user changes direction, opens the keyboard, goes Back, or encounters a slow connection.

This is a general implementation guide, not an audit of a particular app. The rules and suggested tuning below are my engineering recommendations. Apple-documented behavior and facts established by binary inspection are identified separately. The inspected mechanisms are not necessarily new in iOS 27.

For the actual equations, velocity-preserving spring implementation, recovered edge resistance, and rendering cost models, continue with the [motion and rendering technical specification](../../web-craft-motion/references/motion-and-rendering-spec.md).

For the smaller interaction details, use the [48-detail supplement](microdetails.md). The [Web Craft skill collection](../SKILL.md) turns these guides into reusable discussion, audit, flow-change, motion, browser-capability, polish, and verification workflows with quick, focused, and deep coverage.

**What the binary investigation established**

I exported Apple’s cached iOS 27 simulator runtime, mounted it read-only, extracted QuartzCore and UIKitCore, and disassembled selected spring routines. The reconstructed code converts duration and bounce into physical coefficients; settling depends on motion parameters, including initial velocity. UIKit’s inspected two-axis settling calculation takes the longer result when the axis velocities differ. Its standard scroll-deceleration constants are 0.998 and 0.99.

These facts support a spring model with continuity, but do not reveal a universal preset for every iOS control. The numerical scroll constants alone do not specify a complete scrolling algorithm. Detailed evidence, addresses, limitations, and reconstructed equations are in [the binary findings](../../web-craft-motion/references/ios27-binary-findings.md).

Apple independently documents continuity of position and velocity, including carrying gesture velocity into a spring. Its examples include springs with no bounce. [Apple: Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/)

**1–5. Input should feel connected to the hand**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 1. Acknowledge input before waiting for work. | Give a button, row, or toggle an immediate local pressed or pending state. Do not await a request before showing that the action was received. | Under a slow network, the first response to a tap remains immediate. |
| 2. Separate press feedback from committing an action. | Show feedback on contact; use the control’s normal activation behavior to commit. Sliding away, scrolling, or cancellation must not accidentally submit. Make row activation and any separate row actions unambiguous. | Press a row, slide away, then scroll; no accidental navigation or duplicate activation occurs. Keyboard activation still works. |
| 3. Direct manipulation should track directly. | During a drag, update position from the active pointer. Reserve a spring for release or retargeting; avoid adding a trailing spring between the finger and the object. | Reverse direction sharply. The object remains attached to the finger. |
| 4. Interrupt from the current visual state. | Re-grabbing a moving sheet starts at its current position. Retargeting preserves velocity where appropriate; taking direct control should not fight the finger. | Open, close, and reopen rapidly. No teleport, stale animation, or ignored input occurs. |
| 5. Treat canceled gestures as a normal state. | Track one pointer, handle cancellation and lost capture, and restore a valid state. Use pointer capture for a committed custom drag. | Rotate, switch apps, add a second finger, or let the browser take over scrolling. Nothing stays stuck. |

Apple describes responsive, interruptible, redirectable interfaces. The web implementation recommendations above translate that principle into pointer handling. [Apple: Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/), [MDN: Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [MDN: pointercancel](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event)

**6–10. Motion should explain the interface**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 6. Give movement a reason. | Use motion to connect states, explain origin, or acknowledge an action. Remove decorative movement from frequent work. | Every recurring animation has a purpose you can state in one sentence. |
| 7. Use springs for dynamic movement. | Use a velocity-aware spring for release, snapping, and dynamic retargeting. Start with no bounce or restrained bounce. | A flick continues naturally; a slow release settles without an artificial stop-and-restart. |
| 8. Establish a consistent spatial language. | Child navigation, modal presentation, and tab changes should communicate different relationships. Anchor a popover to its trigger and reverse a transition coherently. | People can predict where Back or dismiss will take them. |
| 9. Keep the interaction available during motion. | Do not disable the whole interface until an entrance or exit finishes. Correctly manage focus and hit targets when surfaces overlap. | Rapid Escape, Back, and reactivation leave one coherent screen. |
| 10. Tune the response and the tail separately. | The first visible reaction should be fast even when the final settling tail is longer. Shorten or remove animation for repeated keyboard operations. | Repeating an action twenty times remains comfortable and efficient. |

Apple’s motion guidance favors purposeful, brief feedback and cancellation. `UIViewPropertyAnimator` exposes interruptibility and interaction controls; the web needs equivalent behavior through its own primitives. [Apple: Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Apple: UIViewPropertyAnimator](https://developer.apple.com/documentation/uikit/uiviewpropertyanimator)

**11–15. Scrolling and sheets should have clear ownership**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 11. Use browser scrolling for ordinary content. | Start with native overflow scrolling. Add snapping only where the content needs discrete positions. Avoid replacing document scrolling with a JavaScript physics engine. | Momentum, trackpad input, selection, and accessibility navigation remain usable. |
| 12. Decide whether a gesture scrolls content or moves a sheet. | Use an established sheet primitive. Define ownership at content boundaries and resting heights, including direction reversal. A drag handle can have its own gesture region. Avoid competing nested scroll regions on the same axis. | Scroll within a long sheet, reach its boundary, and reverse direction. Content and sheet do not fight, jump, or dismiss unexpectedly. |
| 13. Respect browser gestures. | Apply `touch-action` narrowly. Preserve pinch zoom, normal panning, and browser Back. Do not claim every gesture at the document root. | Pinch zoom and edge navigation still work where the browser provides them. |
| 14. Preserve the content under the reader’s eyes. | Reserve image dimensions, keep stable list identities, and avoid inserting content above the reader without anchoring. | Late images and new results do not shove the current paragraph or item away. |
| 15. Restore the page exactly after dismissing an overlay. | Scroll locking must preserve the original position and release cleanly. Account for desktop scrollbar width and nested overlays. | Open and dismiss a sheet halfway down a page: no jump, width change, or remaining scroll lock. |

UIKit explicitly models sheet resting heights and the interaction between scrolling and expansion. Safari 27 adds scroll anchoring, but app-level layout choices still matter. [Apple: UISheetPresentationController](https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller), [WebKit: Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/), [MDN: touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)

**16–20. Navigation should preserve the user’s work**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 16. Preserve each primary section’s state. | Keep appropriate scroll position, filters, selection, navigation depth, and unfinished input when switching sections. Temporary panels preserve the context underneath them. | Open an item, switch sections, return, and go Back. The same item and surrounding context are still in place. |
| 17. Keep the application frame stable. | Retain navigation and useful existing content while the changing region loads. Avoid repeatedly tearing down the whole screen. | Moving between nearby screens does not flash a blank app shell. |
| 18. Give Back a precise meaning. | Integrate routes and history deliberately. Specify whether an overlay is a history entry, and restore the previous view coherently. | Browser Back, Forward, app Back, and a direct URL behave consistently. |
| 19. Restore content before restoring its position. | Coordinate cached data, list rendering, and scroll restoration. For changing long lists, an item identity plus offset can be more stable than a pixel position alone. | Returning to an item deep in a list does not first land at the top and visibly jump. |
| 20. Match presentation to the job. | Use a sheet for a bounded task that benefits from surrounding context; use a route for a durable destination. Support deep links for shareable content. | Reloading or opening an important destination in a new tab works. |

Apple’s tab-bar guidance explicitly preserves navigation state within sections. Web history provides scroll-restoration controls, but application state and asynchronous rendering require deliberate coordination. [Apple: Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars), [MDN: scrollRestoration](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration)

**21–25. Loading should preserve confidence**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 21. Distinguish pending from confirmed. | Make safe, reversible changes optimistic where useful. Show explicit pending state for server-authoritative actions such as approval or payment. | A failed request never leaves the screen claiming a completed action. |
| 22. Keep useful data visible during refresh. | Revalidate in the background where appropriate. Replace content with a blocking loader only when the old state cannot safely be used. | Refreshing a list does not repeatedly replace it with skeletons. |
| 23. Match placeholders to the final geometry. | Reserve media space and stable row heights. Avoid flashing a spinner for a request that finishes almost immediately. | Loading completes without a major layout shift or a distracting loader flash. |
| 24. Preserve drafts and provide recovery. | Failed saves retain edits and offer a targeted retry. Scope persisted drafts and caches to the correct account and workspace. | A network failure or navigation round trip does not erase an unfinished form. |
| 25. Make repeated actions unambiguous. | Prevent duplicate submission while preserving readable feedback. Reconcile out-of-order responses; ignore stale search results. | Rapid taps and fast query changes cannot produce duplicates or revert the UI to older results. |

These are application-engineering recommendations, not claims extracted from Apple’s binaries. They make an interface feel dependable because the user does not need to reconstruct lost context or guess whether an action happened.

**26–30. Keyboard and text editing are core interactions**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 26. Design the keyboard-open layout. | Keep the focused editing area and relevant action reachable. Coordinate composers, sheets, bottom bars, and the changing viewport. Dismissing the keyboard should restore a useful reading position rather than arbitrarily resetting the page. | Type into a composer and the last form field; select text, rotate, and dismiss the keyboard. No hidden caret, floating gap, trapped action, or unexplained jump remains. |
| 27. Treat the visual viewport separately when necessary. | Start with normal document flow and CSS viewport units; use `VisualViewport` only where a measured browser behavior requires it. Do not infer keyboard size from one device. | Test browser controls expanded/collapsed, zoom, orientation, and standalone mode separately. |
| 28. Use semantic fields. | Supply appropriate `type`, `inputmode`, `autocomplete`, labels, and return-key hints. Preserve native password-manager and autofill behavior. | Email, telephone, password, and verification-code fields offer suitable system assistance. |
| 29. Preserve editing mechanics. | Support selection, copy/paste, undo, composition, and caret position. Avoid replacing an input element during each render. | Paste, select, edit in the middle, use an IME, and undo without a caret jump. |
| 30. Make focus intentional. | On opening a modal, choose useful focus; on closing it, return to the trigger or a sensible successor. Associate validation errors with fields. | Keyboard and screen-reader users can complete and leave the flow without losing their place. |

The on-screen keyboard can shrink the visual viewport independently of the layout viewport. Autofill relies on form semantics and field metadata. [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport), [MDN: autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete)

**31–35. Visual craft should make the structure effortless to read**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 31. Make touch targets forgiving and reachable. | Use about 44–48 CSS px as an initial web touch-target goal, with spacing between controls. An icon can be smaller than its hit area, but neighboring hit areas must not compete. Place frequent actions deliberately for handheld use. | Test near-edge taps and one-handed use with both hands. Adjacent actions remain distinguishable without precision pointing. |
| 32. Build a small, consistent typography system. | Use semantic text roles, a coherent size/weight rhythm, reliable fonts, and predictable line heights. Align icons optically with text. | Different screens feel related, and important labels are immediately distinguishable. |
| 33. Use depth to explain hierarchy. | Separate content, navigation, and transient surfaces with restrained material, borders, shadows, and occlusion. Keep compact dialogs mostly flat. | The active layer is obvious without turning every row into another card. |
| 34. Use glass selectively. | Restrict translucent treatment to places where seeing underlying content is useful. Maintain contrast over both bright and dark content; provide a solid fallback. | Scrolling a photograph under a toolbar never makes its labels unreadable. |
| 35. Finish geometry across every interaction state. | Coordinate corner radii, insets, image ratios, icon weights, and text baselines. Preserve control dimensions and alignment across idle, pressed, selected, pending, disabled, and error states unless a change serves the task. | Loading a button does not change its width; selecting a label does not shift its neighbors; validation does not move the active target unexpectedly. |

The web target range above is a proposed starting point, not a conversion guarantee between CSS pixels and native points. Apple’s accessibility table lists 44×44 pt as the default iOS control size. Apple places Liquid Glass primarily in the controls/navigation layer and recommends restrained use. [Apple: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Apple: Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Apple: UI design tips](https://developer.apple.com/design/tips/)

**36–40. Adapt to desktop, accessibility, and real rendering limits**

| Rule | What to implement | Acceptance check |
| --- | --- | --- |
| 36. Give desktop its own interaction treatment. | Use the available width for useful columns, panes, and density. Support Escape, Tab, shortcuts, text selection, familiar context menus, middle-click, and open-in-new-tab behavior. | Desktop feels like an efficient work surface, not an enlarged phone screen. |
| 37. Make hover an enhancement. | Avoid essential actions that require hover. Gate decorative hover feedback to suitable input capabilities and test hybrid devices. | The same control works with mouse, keyboard, pen, and touch. |
| 38. Preserve accessibility through every state. | Respect reduced motion; provide text zoom/reflow, visible focus, adequate contrast, accessible names, and alternatives to drag-only actions. Do not disable pinch zoom. | Reduced motion, 200% zoom, keyboard-only input, and VoiceOver retain the complete workflow. |
| 39. Keep animated work small and measurable. | Prefer transform/opacity for movement and fading. Profile blur, shadows, layout animations, and large layers. Avoid unnecessary app renders on each pointer move. | Motion stays responsive during data loading on the slowest supported device. |
| 40. Make motion a progressive enhancement. | Content remains visible if JavaScript, observers, hydration, or a transition API fails. State completion cannot depend solely on an animation-end event. | Disabling animation or interrupting it cannot hide content or strand the workflow. |

Transform and opacity are useful performance defaults, not guarantees that an animation runs off the main thread. CSS/WAAPI, JS-driven animation, compositing, and raster cost need actual profiling. Apple also adapts motion to input modality and accessibility settings. [web.dev: High-performance animations](https://web.dev/articles/animations-guide), [Apple: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

**A small motion vocabulary to start with**

These are proposed web tuning ranges. They are not recovered Apple defaults. Test them with the actual geometry, content, devices, and repetition frequency.

| Interaction | Starting point | Essential behavior |
| --- | --- | --- |
| Press acknowledgment | First visible response ideally within 50 ms; any visual settling roughly 60–120 ms | Response begins immediately. A small fill change often works better than scaling an entire row. |
| Compact button press | Optional scale around 0.98 | Avoid making long buttons, text fields, or large surfaces visibly squash. |
| Tooltip / small popover | Roughly 120–180 ms | Appropriate anchor; neighboring tooltips can appear without repeating the initial delay. |
| Menu / compact modal | Roughly 160–240 ms | Fast comprehension; clean focus and dismissal. |
| Sheet / large transition | Roughly 250–400 ms perceptual response | Velocity-aware release, interruption, and restrained bounce. The spring tail can outlast the perceived arrival. |
| Repeated keyboard action | Immediate | No animation wait in the workflow. |
| Reduced motion | Instant state change or brief fade | Preserve meaning without large travel, zoom, or bounce. |

Use a small number of semantic motion tokens across shared components. Avoid `transition: all`. A CSS easing curve is suitable for a predetermined transition, but cannot by itself encode an arbitrary release velocity. Use the animation system already present in the app when it supports the required behavior; do not add several competing motion libraries.

**Eight interaction qualities to review together**

These extend the individual rules into checks across component boundaries. They are engineering recommendations, not additional findings from the iOS binary inspection.

| Quality | What to look for across the workflow |
| --- | --- |
| Forgiving touch | A near-edge tap activates the intended target, contact gives feedback, and sliding away or scrolling cancels correctly. A row and its secondary action never both activate from one tap. |
| Clear gesture ownership | A list, sheet, and browser each retain their intended gestures. Crossing a boundary or reversing direction does not cause a surprise jump or dismissal. |
| An integrated keyboard | Opening, editing, selecting, autofilling, and dismissing work as one sequence. The composer and caret remain reachable, and the return-key action matches the task. |
| Memory of place | Detail views, tabs, temporary panels, and drafts preserve the context needed to resume. Back returns to the right item, not merely the right route. |
| Layout that fits the task and hand | Frequent actions are reachable, lists use space efficiently, and content, toolbars, and temporary panels have distinct roles. Check safe areas and landscape; make separate density and placement decisions for desktop. |
| Continuity through network work | Useful content stays visible during refresh, media space is reserved, and pending actions are distinguishable from confirmed ones. Failed requests preserve edits and offer a targeted retry. |
| Consistency through visual states | Typography, icons, spacing, separators, selection, and disabled states follow one system. Compare the same control before, during, and after loading, including focus and error states. |
| Cooperation with the device | Keep selection, copy/paste, password managers, sharing, file picking, accessibility preferences, and familiar dismissal usable where supported. Optional haptics reinforce meaning without becoming the only feedback or a prerequisite for completion. |

Apple's guidance supports predictable scrolling and appropriate keyboard behavior. System integration on the web still requires checking the supported browsers and providing useful fallbacks. [Apple: Scroll views](https://developer.apple.com/design/human-interface-guidelines/scroll-views), [Apple: Virtual keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards)

**A complete journey to review at normal speed**

Use this example alongside the app's actual frequent journeys: **scroll a feed → open an item → open comments → type a reply → dismiss comments → go Back**.

| Step | Passing behavior |
| --- | --- |
| Scroll and open | Scrolling does not accidentally activate a row. Opening retains enough origin state to return to the same item. |
| Open comments | The panel has a clear relationship to the item. Its scrolling and dismissal gestures do not compete, and the background retains its position. |
| Type and edit | Keyboard appearance preserves a reachable caret and composer. Selection, paste, autofill where applicable, and return-key behavior remain coherent. |
| Dismiss and return | Unsent input remains recoverable under an explicit draft policy. Focus and reading position return sensibly; Back restores the feed around the originating item. |
| Repeat with a slow or failed request | Existing content stays useful. Pending and failed actions are clear; retry preserves input and does not duplicate a submission. |
| Repeat on desktop and with accessibility settings | Keyboard navigation, Escape, selection, zoom, and reduced motion preserve the same task outcome. |

For an initial app audit, prioritize keyboard behavior, navigation memory, touch handling, and loading continuity alongside motion. A polished component is not sufficient evidence that the complete journey works well.

**What the web can reproduce, and where the boundary is**

The web can implement immediate feedback, state continuity, velocity-aware custom dragging, strong typography, accessible forms, and fast navigation. Browser scrolling already supplies important native behavior. Removing the address bar does not automatically create any of the app-level state or interaction rules above.

View Transitions can connect screen states visually, but the API’s snapshot-based presentation is not automatically an interactive, finger-controlled navigation system. Use it where its lifecycle fits; keep navigation functional if it is unavailable or skipped. [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

Full native haptic control, exact system transitions, keyboard animation coordination, and OS gesture arbitration are not portable web primitives. Treat optional vibration or system-mediated feedback as an enhancement. Do not make a flow depend on precise haptic timing. [MDN: Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

Handle safe-area insets on all relevant edges, including landscape, while retaining ordinary layout padding. Test mobile Safari and an installed web app independently. Installation changes the presentation and lifecycle context; it does not certify interaction quality. [WebKit: Safe-area layout](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

**Implementation order**

1. Choose three frequent journeys: list → detail → Back; open → scroll → dismiss a sheet; fill → submit → recover a form.
2. Fix lost state, accidental activation, keyboard obstruction, layout jumps, and delayed acknowledgment.
3. Put the fixes in the shared button, row, overlay, navigation, and form primitives. Keep the application’s existing component and accessibility conventions.
4. Define the small motion vocabulary above, then add velocity and interruption to the interactions that need them.
5. Refine typography, density, geometry, and materials after the journeys remain reliable under interruption and load.

**How to judge whether it actually feels better**

Test on physical iPhones with both 60 Hz and high-refresh displays, an Android device, and desktop Safari/Chrome/Firefox within the product’s support policy. Include a slower device, slow network, keyboard-open states, reduced motion, zoom, and keyboard-only operation. Test at normal speed first; slow-motion inspection is useful for finding discontinuities but is not a substitute for using the interface.

| Measurement | How to use it |
| --- | --- |
| Input acknowledgment | Measure the time to the first meaningful visual response. The 50 ms target above is an aspirational product target, not an Apple specification. |
| Frame pacing | At 60 Hz a frame interval is about 16.7 ms; at 120 Hz it is about 8.3 ms. These are total frame intervals, not entirely available JavaScript budgets. Track missed frames and long stalls. |
| Interaction latency | Monitor field responsiveness where supported. INP’s “good” threshold is 200 ms or less at the 75th percentile; this does not measure all eventual network work or continuous dragging. |
| State restoration | Score the three journeys for exact preservation of scroll, filters, selection, edits, and focus. Treat any unexpected reset as a defect. |
| Interruption | Re-grab, reverse, cancel, double-tap, navigate Back, and resize while motion is active. No invisible blocker or stale completion may remain. |
| Reliability | Failed requests, canceled animation, missing APIs, and background/foreground transitions must leave a usable interface. |

[web.dev: INP](https://web.dev/articles/inp), [MDN: PerformanceEventTiming](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming), [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

No app code was changed or benchmarked for this guide. Physical-device calibration and an audit of the target app remain outstanding.
