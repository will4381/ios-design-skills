# Small details that make web apps feel exceptionally well made

Companion to the [rulebook](rulebook.md) and [motion specification](../../web-craft-motion/references/motion-and-rendering-spec.md). Updated October 25, 2026. These are interaction recommendations and test prompts, not additional iOS binary findings. Select relevant checks for the actual task; do not add every feature to every app.

## Editing and composition

1. **Enter must not accidentally send unfinished composed text.** Test Japanese/Chinese IME composition and dictation; composing a character and submitting a form are different actions. Use composition state and native form behavior, and verify event ordering on target browsers.
2. **Editing in the middle stays in the middle.** Formatting, validation, and rerenders must preserve caret and selection. Delay aggressive normalization until a meaningful boundary when possible.
3. **Input hints match real data.** Names, emails, codes, addresses, and prose need different capitalization, spelling, keyboard, autofill, and return-key choices. `enterkeyhint` changes a label; it does not implement the action.
4. **Paste and undo remain ordinary.** Accept pasted verification codes, preserve native editing history, and avoid splitting a simple field into inaccessible single-character boxes. Masking must not make corrections painful.

Reference: [MDN input semantics](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input), [UI events](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events), [enterKeyHint](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint).

## Focus and overlays

5. **Opening has a deliberate focus destination.** A modal's focus policy should account for task, content, and input method. Automatically opening the mobile keyboard is not always helpful.
6. **Closing has a deliberate return destination.** If the trigger was removed, focus a meaningful successor. Closing a child overlay should not dismiss its parent or leave the document inert.
7. **Escape and outside click have distinct jobs.** Dismiss only the appropriate top layer. Do not discard a dirty draft merely because the user tapped the backdrop; define recovery or confirmation where data loss warrants it.
8. **Choose the correct primitive.** A popover is not automatically modal, and an ARIA attribute does not implement focus containment. Use existing accessible components or appropriate native primitives before rebuilding them.

Reference: [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [autofocus](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus).

## Touch, pointer, and selection

9. **Expanded hit regions must not overlap ambiguously.** Include icon-button padding, label activation, row secondary actions, and disabled neighbors in the test.
10. **A press is not a completed action.** Show contact feedback, but preserve cancel, drag, scroll, and normal keyboard activation semantics. Never submit a destructive action on pointer-down just to feel fast.
11. **Long press and selection still belong to the user.** Avoid blanket `user-select: none`, context-menu suppression, and removal of link previews. Restrict drag selection suppression to the appropriate active interaction.
12. **Mixed inputs work in one session.** A touch-capable laptop may also have a mouse and keyboard. Respond to actual input capabilities and events instead of declaring the whole device permanently “mobile.”

## Scrolling and reading

13. **Sticky headers do not cover focused or linked content.** Use appropriate scroll offsets and test keyboard focus, validation errors, anchor links, and find-in-page.
14. **New content has an anchoring policy.** In a chat, follow new messages only when the reader is already at the end; otherwise preserve their place and offer a clear way to jump to new content.
15. **Virtualized rows preserve identity and accessibility.** Test variable heights, returning to a deep item, selection, keyboard movement, and search expectations. Introduce virtualization because measured scale requires it.
16. **Scrolling does not silently become selection or dismissal.** Test diagonals, overscroll, boundaries, and starting a scroll on a control. Short content and empty sheets matter too.

Safari 27 ships scroll anchoring, but dynamic lists still need an app-level policy. [WebKit Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/)

## Lifecycle and durable work

17. **Returning from another app is a supported state.** Reconcile expired authentication, interrupted requests, changed server data, and released device resources without erasing a draft.
18. **Browser Back restoration differs from a fresh load.** Handle `pageshow` and restored pages appropriately; avoid duplicating listeners or restarting work that is already represented in the restored state.
19. **Save useful work while it exists.** Do not rely on an unload callback as the only opportunity to preserve data. Storage can fail or be cleared; communicate meaningful unsaved states.
20. **Updating the web app does not ambush an edit.** A new service worker or asset version should not force a reload halfway through typing. Reconcile persisted data and schema changes deliberately.

Reference: [MDN pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event), [beforeunload limits](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event), [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/).

## Loading, errors, and trust

21. **Loading belongs to the changing region.** Keep useful surroundings, control dimensions, and existing results stable. Do not run decorative skeleton shimmer indefinitely.
22. **Empty, filtered-empty, unauthorized, offline, and failed are different.** Give each state an appropriate next action; do not label a failed request “No results.”
23. **Success feedback is proportional.** A small save can confirm near the action; avoid a stack of global toasts for routine work. Do not announce success before the required persistence completes.
24. **Undo and retry have real semantics.** Undo must reverse the action it names; retry must not duplicate a completed request. Preserve a recoverable draft when its outcome is uncertain.

## Text, numbers, and assets

25. **Changing numerals do not make controls wobble.** Use tabular numerals for aligned changing measurements, reserve appropriate width, and avoid applying numeric typography indiscriminately to prose.
26. **Labels survive real content.** Test long names, translations, narrow widths, browser zoom, and large text. Essential content cannot be available only through a hover tooltip.
27. **Fonts and images have a loading strategy.** Reserve geometry, choose appropriate image sources, and check font fallback metrics. Avoid lazy-loading the primary image that the user is waiting to see.
28. **Optical alignment survives state changes.** Check icon weight, baseline, caret, checkmark, spinner, and selected border together. Avoid fake precision from a perfect static screenshot.

## Layout and surfaces

29. **Mobile browser chrome and the software keyboard are separate variables.** Choose viewport units deliberately and test expanding/collapsing browser controls, zoom, and orientation. `100dvh` alone is not a complete keyboard solution.
30. **Safe-area padding does not replace ordinary spacing.** Check all relevant edges, landscape, and installed mode. Preserve space for the user's content as well as for hardware/system areas.
31. **Desktop scrollbars do not shift the page on modal open.** Use a tested scroll-lock approach and appropriate stable gutters where supported; verify nested overlays and overlay-scrollbar systems.
32. **Compact content stays structurally clear.** Prefer flat sections and aligned rows in compact panels; add another card only when it represents a meaningful separate object or action. Adapt this collection's default to the app's established design language.

## Accessibility and preferences

33. **Focus is visible against every surface.** Check dark mode, translucent backgrounds, selected items, and forced-color environments; a shadow alone may not survive those environments.
34. **Status updates are announced selectively.** Announce meaningful completion, errors, and result counts without narrating every keystroke or animation frame.
35. **Reduced motion preserves the result.** No invisible element, delayed cleanup, or stuck modal should depend on an animation finishing. Maintain readable contrast even when transparency-preference detection is unavailable.
36. **Direction and locale affect behavior.** Test RTL alignment, directional icons, wrapping, date/time formatting, and mixed-direction user content. Do not reverse media-playback symbols merely because the locale is RTL.

Reference: [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors), [reduced transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency).

## System integration

37. **Share and copy acknowledge the actual outcome.** Cancellation is not necessarily an error. Show “Copied” only after success and keep a usable fallback when the operation is unavailable.
38. **File selection has a complete lifecycle.** Handle cancel, reselecting the same file, size/type validation, preview disposal, upload failure, and retry. A client-side accept filter does not replace server validation.
39. **Authentication cooperates with the platform.** Use proper autofill semantics and the application's existing password-manager/passkey integration. Do not replace the auth architecture as a polish exercise.
40. **Permissions appear at the moment of value.** Explain the benefit before a relevant user-triggered request. Denial should leave a usable alternative; do not ask for every device permission on launch.

Reference: [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [WebKit Clipboard](https://webkit.org/blog/10855/async-clipboard-api/), [MDN WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API).

## Haptics, sound, and hardware

41. **A genuine switch can get system feedback.** WebKit documents haptics for user interaction with `<input type="checkbox" switch>` on iPhone. Keep actual toggle semantics and a visible label; this is not an arbitrary buzz API.
42. **General vibration is optional and unevenly supported.** Current MDN compatibility data records no Safari support for `navigator.vibrate()`. Hardware, settings, and user activation can still prevent feedback where the method exists.
43. **Never make a hidden fake switch a dependency for feedback.** It can interfere with form semantics, focus, gestures, and future browser behavior. An application requiring precise native haptics needs an explicitly scoped native integration.
44. **Use sensory effects only when they convey something.** Selection, boundaries, completion, and errors can benefit; vibrating or playing sound for every tap quickly becomes noise. Sound needs appropriate activation, mute behavior, and an equivalent visual indication.

Reference: [WebKit iOS 18 switch haptics](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/), [MDN vibration](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).

## Performance and perceived readiness

45. **The screen looks ready when it is ready to accept input.** Prevent hydration delays from creating apparently interactive dead controls; preserve semantic navigation and useful content while enhancement initializes.
46. **Do not force the browser to recalculate layout repeatedly.** Batch relevant reads and writes and inspect expensive pointer, scroll, and resize handlers. Remove work before adding more layers or dependencies.
47. **Prefetch with a budget.** Prioritize probable next destinations when useful, respect authenticated scope, and avoid fetching entire datasets or mutating endpoints speculatively. Do not depend on unavailable device/network APIs to behave reasonably.
48. **Verify a complete journey under interruption.** Switch apps, rotate, dismiss the keyboard, go Back, lose the network, and resume. Then repeat with keyboard-only input and reduced motion. Static appearance is only one piece of evidence.

For implementation, use the [browser capability guide](../../web-craft-browser/references/browser-capabilities.md) and [skill collection](../SKILL.md). Capabilities are dated research, not an evergreen support guarantee. No target app or physical device was tested for this supplement.
