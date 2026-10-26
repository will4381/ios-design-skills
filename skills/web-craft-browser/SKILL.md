---
name: web-craft-browser
description: Assess or implement browser capabilities that improve web-app feel, with Safari/WebKit, mobile and installed-mode constraints, feature detection, and fallbacks. Use for haptics, keyboard/viewport behavior, sharing, clipboard, pickers, navigation, storage, and related API decisions.
---

# Web Craft Browser

Read [working contract](../web-craft/references/working-contract.md). Begin with the desired user outcome and actual browser support policy. Distinguish Safari on iPhone/iPad/macOS, installed web apps, embedded webviews, Chromium, Firefox, and native wrappers when relevant.

Read only the affected sections of [browser capabilities](references/browser-capabilities.md); for tactile feedback also read [haptics](references/haptics.md). Research is dated. Before adopting a feature or asserting current availability, consult current first-party release notes/docs and compatibility records for the exact API/property/subfeature. Flagged previews do not establish a shipping baseline.

For each recommendation provide: benefit; target environments; narrow presence/support check; secure-context, activation, permission, and embedding requirements; cancellation/error behavior; fallback; and the test that would prove it works. Do not request permissions, access the clipboard, start capture, or send notifications just to inspect support.

## Important distinctions

- Safari's real HTML switch feedback is not arbitrary browser haptics. Do not use hidden fake switches or assume a library polyfills unavailable hardware APIs.
- API presence is weaker than behavioral support: `showPicker()` differs by input subtype; `navigator.vibrate` presence does not prove vibration; `share` depends on payload and activation.
- VisualViewport is not VirtualKeyboard. Safe areas and dynamic viewport units do not alone solve keyboard coordination.
- OPFS is not a general filesystem picker; installed-mode push is not ordinary-tab support; a service worker is not an always-running background worker.
- Runtime checks, rejected promises, denial, cancellation, and absent hardware need useful outcomes. Do not put essential functionality exclusively behind an enhancement.

Within authorized implementation scope, reuse the app's established abstractions and semantic controls. Avoid user-agent branching unless a verified bug cannot be handled more narrowly; document any workaround's affected versions and removal condition. Browser research alone does not justify replacing the router, installing a PWA, or adding a native wrapper.

Test the actual target behavior where available and report documentation evidence separately from runtime proof. Use [Web Craft Verify](../web-craft-verify/SKILL.md) for device/context coverage.
