# Browser capabilities for app-quality interactions

Research snapshot: **October 25, 2026**. Recheck affected features against the app's minimum browser versions before implementation. “Safari supports it” does not mean all deployed iPhones, embedded webviews, installed apps, or related subfeatures behave identically.

Support statements below combine WebKit release notes with selected MDN browser-compat-data records retrieved on this date. The [machine-readable evidence](support-evidence.json) retains source paths, raw support statements, and hashes. `mirror` is an upstream inheritance directive, not an independently tested platform result; `preview`, flags, partial support, removed versions, and version numbers for future releases must not be interpreted as universal shipping support. Runtime presence also does not establish permission, hardware, or successful behavior.

## Layout, scrolling, and motion

| Capability | Practical use | Safari considerations and fallback |
|---|---|---|
| `svh`, `lvh`, `dvh` | Choose a stable or browser-chrome-responsive height | Dynamic height may resize during scrolling. Start with natural flow; do not treat `dvh` as a universal keyboard-height measurement. |
| `env(safe-area-inset-*)` | Keep edge controls clear of relevant system areas | Add ordinary spacing, handle landscape, and test browser and installed mode. Safe areas do not solve every viewport obstruction. |
| `VisualViewport` | Observe the visual viewport for a specific measured layout problem | Available in Safari; use height, offsets, scale, and consistent coordinates as appropriate. Coalesce updates and clean up listeners. Avoid guessing keyboard visibility from height alone. |
| `VirtualKeyboard` | Explicit keyboard geometry/overlay control where supported | MDN records no Safari support. Preserve a CSS/normal-scroll path and optionally a measured VisualViewport adaptation. |
| `touch-action` and Pointer Events | Declare gesture intent and track custom direct manipulation | Apply narrowly. Preserve pinch zoom and native scroll. Handle cancellation and lost capture; do not globally call `preventDefault()` to make one widget work. |
| `overscroll-behavior` | Control scroll chaining where appropriate | MDN records a Safari limitation for containers with no scrollable overflow. Test empty/short overlays; do not mistake this property for complete body scroll locking. |
| Scroll anchoring / `overflow-anchor` | Reduce displacement from asynchronous content | Safari 27 ships support. Reserve media geometry and retain stable list identities; use app anchoring policies for chat and virtualized lists. Older targets still need stable layout. |
| `scroll-margin`, `scroll-padding` | Keep targets visible below sticky UI | Verify focused fields, hash navigation, and validation targets. Avoid repeatedly forcing scroll while the user is reading or typing. |
| `scrollend` | Respond to completed scrolling | MDN records Safari 26.2 support. Feature-detect on the relevant target. A debounced scroll fallback is an approximation, so do not use it for critical correctness. |
| `scrollbar-gutter` | Reserve space for classic scrollbars | Safari 18.2 support is recorded. Overlay scrollbars and nested locks need separate checks; do not add a second compensation to an existing scroll-lock primitive. |
| CSS/WAAPI transforms and opacity | Predetermined motion with browser scheduling | Prefer existing motion primitives. Eligibility for off-main-thread work is contextual; profile actual layers, rasterization, and interruption. |
| `animation-timeline: scroll()/view()` | Declarative scroll-linked effects | Safari 26 introduced support; 26.4 added threaded execution. Preserve static content and reduced-motion behavior. Do not infer that all animated properties become cheap or that JS scroll handlers move to the compositor. |
| View Transitions | Connect visual states across supported navigation/update paths | `document.startViewTransition` is recorded from Safari 18. Same-document and cross-document support are separate checks. Snapshot transitions are not a complete interactive back-swipe system; preserve navigation if skipped. |
| CSS anchor positioning | Keep a popover positioned relative to its trigger | `anchor-name` is recorded from Safari 26. Check the actual positioning features used and collision behavior; retain the app's established positioning fallback for older targets. |
| `content-visibility` | Avoid rendering offscreen content where useful | Safari 18 support is recorded. Provide appropriate intrinsic sizing; verify focus, reading order, search, measurements, and scroll restoration. It is not a reason to hide essential content. |

Sources: [viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length), [safe-area layout](https://webkit.org/blog/7929/designing-websites-for-iphone-x/), [scroll target offsets](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), [Safari 26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/), [Safari 27](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/). Exact support records: [MDN BCD](https://github.com/mdn/browser-compat-data), snapshot linked above.

## Controls, editing, and system actions

| Capability | Useful behavior | Conditions and fallback |
|---|---|---|
| Native inputs and autofill hints | Appropriate keyboard, password-manager, address, and code assistance | Keep real labels, names, types, autocomplete tokens, and composition behavior. Hints do not guarantee a specific keyboard or implement submit logic. |
| `showPicker()` | Open a supported input picker from a user action | Subtype matters: the retrieved BCD records iOS support for file input, but no iOS support for programmatic date/time/color picker subfeatures. Keep the input itself operable; method existence is insufficient. |
| Customizable select / `appearance: base-select` | Style an actual select instead of rebuilding selection semantics | Safari 27 support is recorded. Gate the styling with a matching CSS support check and preserve a normal select on older targets. Test keyboard, touch, long options, and assistive technology. |
| `<dialog>`, popover, `inert` | Appropriate top-layer and background interaction behavior | Modal dialog and nonmodal popover serve different jobs. Early iOS popover releases had light-dismiss limitations; use minimum-version testing. Existing accessible library components may already solve this. |
| Web Share / `navigator.canShare` | Native sharing of links and supported files | Secure context, user activation, policy, and payload support matter. Validate actual file payloads with `canShare`. Handle cancellation and rejected promises; offer copy/download where appropriate. |
| Async Clipboard | Reliable explicit copy/paste actions | Secure context and user-gesture restrictions apply, especially in WebKit. An unrelated awaited request may lose the needed activation. Prepare content when feasible, handle rejection, and keep manual copy/paste available. |
| File input / capture hint | Choose a file or use a relevant device capture path | Cancellation is normal. A capture hint is not a guaranteed camera UI. Validate content on the server, preserve selection/retry state, and release temporary preview resources. |
| `showOpenFilePicker` / `showSaveFilePicker` | Direct file-system picker workflows on supporting browsers | MDN records no Safari support. Use file input and download/export paths as appropriate. Safari's origin-private filesystem support is a different capability. |
| WebAuthn / conditional mediation | Passkeys integrated with existing authentication | Verify conditional mediation before using it; server challenges and verification remain necessary. Preserve recovery and the existing auth design. Never treat a biometric UI as proof of application authorization. |
| Camera/microphone / `getUserMedia` | User-requested capture, calls, or scanning | Requires a secure context, permission, and appropriate embedding policy. Handle denial, missing devices, and track termination; stop tracks when the task ends. |
| Media playback | Inline media with truthful play/pause state | Handle the `play()` promise and autoplay restrictions. Do not claim playback before it starts. Preserve user controls, mute behavior, captions where appropriate, and background/foreground handling. |

Sources: [share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [WebKit clipboard](https://webkit.org/blog/10855/async-clipboard-api/), [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [WebAuthn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API), [camera/microphone](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), [media playback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play). Input subtype and file-picker records are preserved in the snapshot.

## Lifecycle, installation, and optional hardware

| Capability | Useful behavior | Conditions and fallback |
|---|---|---|
| History and Navigation API | Routes with intentional Back/Forward behavior | BCD records Navigation API from Safari 26.2. Preserve ordinary URLs/history for older targets and respect the existing router. Do not introduce a second navigation owner. |
| bfcache, `pageshow`, `visibilitychange` | Resume context without unnecessary reloads | Reconcile freshness and subscriptions on resume. These signals are not a promise that mobile termination will run cleanup. Save meaningful work incrementally. |
| Service worker + Cache Storage | Deliberate offline and asset-update behavior | Cache only within correct account/data boundaries, handle stale versions and logout, and do not assume an always-running background process. No mandatory service worker for a small polish task. |
| IndexedDB / StorageManager / OPFS | Local drafts and suitable structured or file-like storage | Handle errors and eviction. Persistence requests are not guaranteed, and local storage is not an irreplaceable backup. OPFS is not access to the user's general filesystem. |
| Push and notifications | Opt-in updates with a clear user benefit | iOS/iPadOS Home Screen web apps support Web Push from 16.4 with permission requested from direct interaction. The retrieved Notification record retains installed-mode constraints. Test ordinary tab and installed mode separately. |
| Badging | Useful unread/outstanding counts on supported installed apps | iOS Home Screen support is recorded from 16.4; visibility follows notification settings. Reconcile and clear counts; do not fabricate urgency. |
| `beforeinstallprompt` | A browser-provided install prompt where available | MDN records no Safari support. Offer accurate instructions only when useful; do not present a button that promises a Safari prompt this API cannot open. |
| Background Sync | Deferred work in supporting browsers | MDN records no Safari support for SyncManager. Use recoverable pending state and foreground retry; do not promise delivery after the app is closed. |
| Screen Wake Lock | Keep a user-requested reading/cooking/presentation task visible | Safari support is recorded from 16.4, with standalone iOS limitations before 18.4. Handle rejection and release; reacquire only if still wanted and appropriate. Never enable it app-wide for polish. |
| Haptics | Reinforce a meaningful physical interaction | Read [haptics](haptics.md). Genuine switch feedback on iPhone and arbitrary `navigator.vibrate()` are different capabilities. |
| Device/network information | Optional adaptation where the browser exposes it | Retrieved records show no Safari support for `navigator.connection`, `getBattery`, or `deviceMemory`. Make reasonable defaults and measured performance work without them. Avoid using these as an excuse for device fingerprinting. |
| Emerging device-posture/viewport-segment APIs | Specialized layouts when explicitly needed | Safari 27.1 describes these as previews behind feature flags on relevant hardware. Do not count flagged previews as a general production baseline. |

Sources: [pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event), [WebKit storage](https://webkit.org/blog/14403/updates-to-storage-policy/), [Home Screen push and badging](https://webkit.org/blog/13878/), [wake lock](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API), [Safari 27.1](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/).

## How to apply this inventory

Choose an API only when it improves a named user task. For each proposed use, record: minimum supported browsers; ordinary tab versus installed or embedded context; secure-context/activation/permission constraints; narrow feature check; failure/cancel path; fallback; and evidence date.

Safe presence checks can establish candidates, not outcomes: `typeof navigator.share === 'function'`, `'visualViewport' in window`, or `CSS.supports('appearance', 'base-select')`. Do not call permission-prompting, clipboard-reading, recording, or notification APIs merely to audit availability.

Feature detection plus exception handling plus real target testing is stronger than user-agent guessing. Test actual subfeatures and composited interactions. A package that exposes a uniform API does not create missing browser or hardware capabilities.
