# Haptics without pretending the web has universal native controls

Verified documentation/compatibility snapshot: October 25, 2026. Recheck for the target browser and hardware. No physical haptic test has been performed for this collection.

## Three distinct paths

1. **A real system control.** WebKit documents iPhone haptic feedback for user-operated `<input type="checkbox" switch>` from iOS 18. Use it when the product action is actually an on/off setting, with a real label and checked state. Other browsers may render a normal checkbox. [WebKit switch feedback](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/)
2. **General browser vibration.** MDN compatibility records no Safari support for `navigator.vibrate()`. Other implementations can still be limited by activation, hardware, settings, or context. Feature detection and a successful return value are not proof that a person felt anything. [MDN vibrate](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate), [support evidence](support-evidence.json)
3. **A native host integration.** An existing native wrapper may provide a native haptic bridge. Use it only within an explicitly supported host and authorized scope; browser tabs still need a complete no-haptics experience. Building or adopting a native wrapper is a product/architecture decision, not an incidental polish fix.

## Decision rule

If the interaction is a genuine toggle, consider the semantic system control. If optional vibration is available elsewhere, use restrained feedback for an appropriate selection, boundary, or completion. If precise arbitrary iPhone haptics are a hard requirement, explain the native-integration boundary rather than claiming a web polyfill solves it.

Do not hide a switch under unrelated buttons, synthesize fake toggles, or introduce controls solely to trigger a side effect. Such workarounds can distort semantics, focus, gesture ownership, and future behavior. Evaluate a haptics library's implementation before adopting it; a shared JavaScript API is not evidence of platform parity.

## Quality checks

- The visual and accessible state conveys the result without haptics or sound.
- Feedback corresponds to the actual semantic event, not rerenders, pointer jitter, or duplicate handlers.
- A canceled gesture does not announce a completed action.
- Dragging through many positions cannot trigger an uncontrolled stream of feedback; use meaningful boundaries and an appropriate cadence.
- Error and success are tied to their real states, particularly for server-authoritative actions.
- The product respects its feedback preference and relevant platform settings; do not use audio as an unexpected substitute when vibration is absent.
- Test a real device with feedback available, unavailable, and disabled. Report those tests separately from mocks and desktop browser checks.

For a real HTML switch, include scrolling that starts on the switch, canceled presses, keyboard activation, label activation, and form submission in the regression check. Correct toggle semantics matter more than the tactile effect.
