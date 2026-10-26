# The mechanics of a native-feeling web app

Quantitative companion to the [40-rule guide](../../web-craft/references/rulebook.md). Written October 25, 2026. This document turns motion, gesture handling, rendering, and visual construction into equations, algorithms, and measurable constraints. It applies to mobile and desktop web; it is not a proposal to reproduce every iOS visual convention on desktop.

## How to interpret the evidence

- **Recovered:** manually reconstructed from selected functions in the arm64 iOS Simulator 27.0, build 24A434, UIKitCore and QuartzCore binaries. Addresses and hashes are in [binary findings](ios27-binary-findings.md) and [evidence JSON](ios27-binary-evidence.json).
- **Documented:** supported by the linked platform documentation.
- **Model:** standard mathematics, a derivation, or a proposed web implementation. This is not a claim that Apple uses that exact implementation everywhere.
- **Measure:** behavior or parameter values that must be established on a particular device, OS, browser, and component.

The equations are useful because they predict behavior. They cannot establish taste, prove that one parameter feels best, or reveal undisassembled shaders. For those cases, use explicit constraints and measured comparisons instead of inventing a mathematical authority.

## 1. Define the state and units first

**Model.** An animated scalar has a state, not just a start and end:

\[
s(t)=[x(t),v(t)],\qquad v=\dot x,\qquad a=\ddot x.
\]

Use seconds for time, CSS pixels for translation, radians for rotation, and dimensionless values for scale and opacity. Velocity uses the corresponding unit per second. A vector spring can apply the scalar solution to each axis with a shared clock.

Do not mix milliseconds and seconds: converting a velocity from px/ms to px/s multiplies it by 1,000. A normalized velocity relative to signed travel \(\Delta x\) is \(v_n=v/\Delta x\). This conversion becomes ill-conditioned when travel approaches zero; keep absolute velocity in the underlying solver. A stationary target does not imply a stationary object.

**Design contract:** gesture state, rendered state, and logical destination remain distinct. A destination may already be committed while the displayed object is still approaching it.

## 2. The spring equation and Apple's parameter mapping

**Recovered + standard physical model.** For a fixed target \(x_*\):

\[
m\ddot x+c\dot x+k(x-x_*)=0,
\qquad \omega_0=\sqrt{k/m},
\qquad \zeta=\frac{c}{2\sqrt{km}}.
\]

Here \(\omega_0\) sets the timescale and \(\zeta\) sets damping. The inspected UIKit conversion functions and QuartzCore perceptual-duration initializer map response \(T\) and bounce \(b\) as follows:

\[
\zeta=\begin{cases}1-b&b\ge0\\1/(1+b)&b<0\end{cases},
\quad m=1,\quad k=(2\pi/T)^2,\quad c=2\zeta\sqrt{k}.
\]

For positive response and ordinary valid inputs, this gives:

| Behavior | Damping | Consequence at zero initial velocity |
|---|---|---|
| Underdamped | \(0<\zeta<1\) | Oscillates across its target |
| Critically damped | \(\zeta=1\) | Fast nonoscillating return |
| Overdamped | \(\zeta>1\) | Slower nonoscillating return |

Nonzero initial velocity can change overshoot behavior even in the last two cases. The inspected QuartzCore state evaluator has all three solution forms; its configuration can also prevent true overdamping. This is why matching a parameter name across libraries is insufficient.

Apple discusses springs as a way to maintain continuous motion and distinguish perceptual duration from settling. [Apple: Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/)

## 3. Solve the motion analytically

**Model, consistent with the recovered solution families.** Let \(y=x-x_*\), \(y_0=x_0-x_*\), \(v_0=\dot x(0)\), and \(\alpha=\zeta\omega_0\).

For \(\zeta<1\), set \(\omega_d=\omega_0\sqrt{1-\zeta^2}\):

\[
y(t)=e^{-\alpha t}\left[y_0\cos(\omega_dt)+\frac{v_0+\alpha y_0}{\omega_d}\sin(\omega_dt)\right].
\]

For \(\zeta=1\):

\[
y(t)=\left[y_0+(v_0+\omega_0y_0)t\right]e^{-\omega_0t}.
\]

For \(\zeta>1\), set \(r_1=-\omega_0(\zeta-\sqrt{\zeta^2-1})\), \(r_2=-\omega_0(\zeta+\sqrt{\zeta^2-1})\):

\[
A=\frac{v_0-r_2y_0}{r_1-r_2},\quad B=y_0-A,
\qquad y(t)=Ae^{r_1t}+Be^{r_2t}.
\]

Recover \(x=x_*+y\) and differentiate for velocity. The supplied [reference implementation](../assets/motion-model.mjs) uses an equivalent formulation that behaves well near critical damping, and avoids subtracting nearly equal numbers in the overdamped exponent.

Sample at elapsed wall time. Do not advance by a fixed amount once per frame. An analytic spring has the same trajectory at 60 and 120 Hz; the second display samples it more frequently. A dropped frame skips an observation instead of slowing the physical simulation.

The reference intentionally supports \(T>0\) and \(-1<b<1\). Undamped or divergent regimes, extreme floating-point magnitudes, gesture recognition, and DOM lifecycle management are outside its scope.

## 4. Response, arrival, overshoot, and settling are different quantities

**Derived.** With \(T=0.30\) seconds and \(b=0\), \(k=438.6491\) and \(c=41.8879\). For a stationary start, normalized remaining error is:

\[
E(t)=(1+\omega_0t)e^{-\omega_0t}.
\]

Solving for thresholds gives 90% arrival at **185.72 ms**, 99% at **316.96 ms**, and 99.9% at **440.86 ms**. These are calculations, not measured iPhone transition durations.

For an underdamped stationary start, first overshoot as a fraction of travel and first peak time are:

\[
M_p=e^{-\pi\zeta/\sqrt{1-\zeta^2}},
\qquad t_p=\frac{\pi}{\omega_0\sqrt{1-\zeta^2}}.
\]

At \(b=0.20\), \(\zeta=0.80\): overshoot is **1.516%**, not 20%. For 300 px travel, that is 4.55 px, with the first peak at 250 ms when \(T=0.30\) seconds. Release velocity changes these results.

**Recovered:** QuartzCore's public settling getter passes epsilon 0.001 to a tolerance calculation. Deeper inspection found an underdamped envelope estimate and separate handling for the other regimes. It is not simply “stop at the response time.” We have not reproduced its entire completion heuristic.

**Proposed stop rule:** require both position and velocity tolerances, in meaningful display units:

\[
|x-x_*|<\epsilon_x\quad\land\quad |v|<\epsilon_v.
\]

For example, start testing translation at \(\epsilon_x=0.1\) CSS px and \(\epsilon_v=1\) px/s. These are engineering choices. Use a different tolerance for opacity and scale. Snap only the negligible remainder; do not disable interaction while waiting for it.

## 5. Interruption must preserve position and velocity

**Model.** At redirection time \(t_r\), evaluate the old spring and initialize the new one with:

\[
x_{new}(0)=x_{old}(t_r),\qquad v_{new}(0)=v_{old}(t_r).
\]

That preserves position and velocity continuity, commonly called \(C^1\) continuity. Restarting with zero velocity produces an instantaneous velocity change. Restarting from the previous logical endpoint also produces a position jump.

Acceleration need not be continuous. With unchanged spring parameters and a changed target:

\[
\Delta a=\omega_0^2(x_{*,new}-x_{*,old}).
\]

This is a deliberate change of force. Smooth the target itself only when the interaction benefits from that extra smoothing; indiscriminate smoothing adds lag.

```js
import { spring } from './motion-model.mjs';

// now and startedAt share the same performance-clock timebase, in milliseconds.
const state = currentSpring((now - startedAt) / 1000);
currentSpring = spring({
  from: state.position,
  to: nextTarget,
  velocity: state.velocity,
  response: 0.30,
  bounce: 0.15,
});
startedAt = now;
```

The same rule applies to hover reversals, interrupted sheets, expanding selections, and repeated navigation. Apple's presentation layer offers access to the currently displayed values rather than only a model's destination. On the web, own the motion state or use an animation system that exposes reliable interruption behavior. [Apple: CALayer presentation](https://developer.apple.com/documentation/quartzcore/calayer/presentation%28%29)

## 6. Direct manipulation and release velocity

**Model.** During an ordinary drag, follow the pointer directly:

\[
x(t)=p(t)-p(0)+x(0).
\]

A spring chasing the finger adds a filter and visible lag. Apply spring dynamics after release, except where an elastic control intentionally requires compliance.

Estimate recent velocity with a short history of timestamped samples. Least-squares slope is:

\[
v=\frac{\sum_i(t_i-\bar t)(p_i-\bar p)}{\sum_i(t_i-\bar t)^2}.
\]

A 40–80 ms window is a proposed starting range, not a recovered iOS setting. A long window ignores recent reversals; two noisy samples can produce a bad fling. Feature-detect coalesced pointer events. Discard invalid timestamps; handle a zero denominator, stale history, pointer cancellation, and lost capture.

Use an explicit state machine: idle → pressed → dragging → settling, with cancellation paths. Activate a drag only after a directional threshold; do not activate a click after a completed drag. Keep keyboard activation and browser scrolling intact. Thresholds depend on pointer type and control geometry, so measure them rather than borrowing one unexplained number.

## 7. The recovered scroll-edge resistance equation

**Recovered:** for signed displacement \(d\) beyond a boundary, extent \(L>0\), and coefficient \(c>0\), the inspected UIKit function applies:

\[
R(d)=\operatorname{sign}(d)L\left(1-\frac{1}{1+c|d|/L}\right).
\]

It leaves in-bounds offsets unchanged. The resistance approaches a limit instead of growing linearly forever. The coefficient selector contains multiple defaults: 0.715, 0.17, 0.4, 0.5, and 0.55. Caller meanings and active device-specific choices were not established; 0.55 is not a universal iOS constant.

**Derived:**

\[
R'(d)=\frac{c}{(1+c|d|/L)^2},
\qquad v_{visible}=R'(d)v_{pointer}.
\]

When releasing an already compressed drag, feed the visible object's velocity into its spring. Feeding raw finger velocity can create a sudden energy change. This chain-rule consequence is a proposed handoff method, not a claim that the entire UIKit handoff was reconstructed.

Keep native browser scrolling for ordinary content. This equation is useful for a custom sheet, slider, or other bounded draggable control.

## 8. Inertia and snap destinations

**Model.** A simple velocity-dependent drag law is:

\[
\dot v=-\lambda v,\quad
v(t)=v_0e^{-\lambda t},\quad
x(t)=x_0+\frac{v_0}{\lambda}(1-e^{-\lambda t}).
\]

Its projected endpoint is \(x_\infty=x_0+v_0/\lambda\). With \(v_0=900\) px/s and \(\lambda=3\) s⁻¹, projected travel is 300 px. For candidate snap points \(s_j\), a basic choice is \(j^*=\arg\min_j|s_j-x_\infty|\), supplemented by directional rules and hysteresis to avoid unstable choices at a boundary.

For a multiplier \(r\) defined over timestep \(\Delta t\):

\[
\lambda=-\ln(r)/\Delta t,\qquad v(t+\delta)=v(t)e^{-\lambda\delta}.
\]

**Recovered limit:** UIKit exports normal 0.998 and fast 0.99. They cannot be inserted as per-frame multipliers without the correct timebase and surrounding algorithm. Inspection of a consuming scroll method did not establish a complete, trustworthy reconstruction. The reference `inertia()` is explicitly the standard exponential model above.

## 9. Bézier timing and coordinated properties

**Model.** A CSS cubic Bézier uses control points \(P_0=(0,0)\), \(P_1\), \(P_2\), \(P_3=(1,1)\):

\[
B(u)=(1-u)^3P_0+3(1-u)^2uP_1+3(1-u)u^2P_2+u^3P_3.
\]

At clock progress \(t/D\), solve \(B_x(u)=t/D\), then use \(B_y(u)\). Using \(u=t/D\) directly is generally wrong. Where \(B_x'(u)\ne0\), property velocity is:

\[
v(t)=\frac{x_1-x_0}{D}\frac{B_y'(u)}{B_x'(u)}.
\]

A fixed curve can be excellent for a known transition. It does not automatically adapt to arbitrary release velocities. CSS `linear()` can approximate a sampled spring, but a precomputed curve still needs a deliberate interruption strategy. [MDN: Easing functions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function)

Coordinate related properties on one clock: \(q_i(t)=f_i(t-t_i)\). Geometry can use a spring while opacity uses a monotonic curve. Clamp opacity to [0,1]; do not let a spring's overshoot create invalid alpha. Keep the semantic action available independently of the slowest property.

**Proposed initial vocabulary, not Apple defaults:**

| Intent | Response | Bounce | Constraint |
|---|---:|---:|---|
| Small control response | 0.18 s | 0 | Immediate feedback; no content displacement |
| Menu or panel settling | 0.30 s | 0 | Preserve position when reversed |
| Released draggable object | 0.40 s | 0.15 | Preserve measured visible velocity |

Tune these against real geometry and hardware. Repeated desktop tasks may benefit from little or no animation even when a longer mobile transition is pleasant.

## 10. Frame pacing, latency, and the render pipeline

**Documented + model.** Apple's app-side render loop performs layout/display preparation and commits a layer tree. Render-server work prepares rendering, the GPU executes work, and the display presents it. These stages are pipelined; rendering is not one synchronous function call. [Apple: Render loop](https://developer.apple.com/videos/play/tech-talks/10855/), [commit phase](https://developer.apple.com/videos/play/tech-talks/10856/), [render phase](https://developer.apple.com/videos/play/tech-talks/10857/)

The browser has analogous work: input/JavaScript → style → layout → paint/raster → compositing → presentation. Which processes and threads perform that work varies. [Chromium: RenderingNG architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture)

\[
T_{frame}=1000/f\ \text{ms}.
\]

At 60 Hz, a refresh period is 16.67 ms; at 120 Hz it is 8.33 ms. These are total periods, not a promise that JavaScript owns that whole budget. For an ideal pipeline, throughput is constrained by its slowest stage; latency includes traversal, queues, and synchronization. Do not simply add every stage's duration and call that the steady-state frame rate.

\[
L_{input\to photon}=L_{input}+L_{queue}+L_{update}+L_{render}+L_{present}.
\]

For a constant-speed drag, perceived tracking error is approximately \(e=vL\). At 1,000 px/s, 20 ms of latency is **20 px behind the finger**. Perfect easing does not repair that. Stable frame pacing also matters: the mean frame rate hides individual stalls. Measure frame intervals and input delay, including upper percentiles, on representative devices. Web interaction metrics and screen frame intervals measure different things.

Use `requestAnimationFrame` timestamps for elapsed-time sampling; callbacks generally pause in background tabs. Decide whether resuming should complete a transient transition or restart from a paused state. Do not accidentally integrate a huge suspended interval into an unstable numerical solver. [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

## 11. Make the compositor's job small

**Documented + engineering constraint.** Moving a reusable rasterized surface can avoid repeated layout and paint. Transforms and opacity are good candidates, but neither a CSS property nor a `translate3d` declaration is a universal guarantee of GPU-only work. Eligibility depends on the effect, content, browser, and layer structure.

Prefer declarative CSS or Web Animations for eligible predetermined motion; keep direct manipulation state small. A JavaScript animation sampled on a blocked main thread can stall even if each resulting transform is cheap to composite. WebKit documents compositor-thread scroll-driven animations in Safari 26.4, but that does not mean arbitrary JavaScript scroll handlers run there. [WebKit: Safari 26.4 features](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)

Batch geometry reads before style writes. Repeated read → write → read patterns can force synchronous work. Use `will-change` sparingly and temporarily after profiling. More layers increase memory and composition costs; a layer per element is not a quality strategy.

For RGBA8 surfaces, a first-order memory model is:

\[
P=W_{css}H_{css}\,DPR^2,\qquad M\approx4P\ \text{bytes}.
\]

A 390×844 CSS-pixel surface at DPR 3 has 2,962,440 physical pixels and needs approximately **11.3 MiB for one uncompressed RGBA8 buffer**. Multiple buffers, intermediate render targets, texture padding, HDR formats, and caches add more. A rough full-surface processing demand scales with \(P\times FPS\times passes\); actual GPU cost also depends on shader work, sampling, bandwidth, caching, and overlap.

## 12. Geometry, transforms, and layout transitions

**Model.** With column vectors, a useful transform composition is:

\[
p'=T(o)T(d)R(\theta)S(s_x,s_y)T(-o)p.
\]

Order matters. For transformed hit testing, map the pointer through \(M^{-1}\) before testing local geometry. CSS specifies transform composition and coordinate systems; mixing viewport and local coordinates produces gesture jumps. [W3C: CSS Transforms](https://www.w3.org/TR/css-transforms-1/)

For a FLIP transition from old rectangle \(F\) to final rectangle \(L\), using a top-left origin:

\[
\Delta x=F_x-L_x,\quad\Delta y=F_y-L_y,
\quad s_x=F_w/L_w,\quad s_y=F_h/L_h.
\]

Lay out the final geometry, apply the inverse translation/scale, then animate toward identity. Handle zero-sized rectangles. On interruption, measure or retain the current displayed geometry. Text that is scaled with its container can blur or stretch; use a separate content layer, clipping, or a deliberate layout transition when needed.

Round resting translation endpoints to the device grid only when useful: \(x_{snap}=\operatorname{round}(x\,DPR)/DPR\). Rounding every animation sample can introduce visible stepping. Fractional positions are legitimate during motion.

For circular nested corners, a geometrically consistent inner radius is \(r_{inner}=\max(r_{outer}-inset,0)\). A superellipse \(|x/a|^n+|y/b|^n=1\) is a useful smooth-corner family, but it does not prove Apple's exact continuous-corner construction. Shape, tangent, and curvature continuity matter more than attaching an “iOS radius” to every rectangle. Progressive enhancement can use supported corner-shape features with ordinary rounded-corner fallbacks.

## 13. Compositing, shadows, blur, and glass

**Standard graphics models, not recovered Apple shaders.** For premultiplied source-over colors:

\[
\alpha_o=\alpha_s+\alpha_b(1-\alpha_s),
\qquad C_o=C_s+C_b(1-\alpha_s).
\]

The premultiplication and color-space assumptions must agree; doing math on incompatible encodings creates fringes and incorrect luminance. Browser behavior follows applicable color and compositing specifications. [W3C: Compositing](https://www.w3.org/TR/compositing-1/)

A Gaussian blur kernel is:

\[
G_\sigma(x,y)=\frac{1}{2\pi\sigma^2}e^{-(x^2+y^2)/(2\sigma^2)},
\qquad I_{blur}=G_\sigma*I.
\]

A shadow can be modeled as a blurred opacity mask, offset and tinted: \(S(p)=a\,(G_\sigma*mask)(p-d)\). For a discrete kernel of width \(K\), naive 2D convolution costs \(O(PK^2)\); separability reduces that to \(O(PK)\). Real renderers use additional optimizations. Blur standard deviation and CSS shadow parameters are not universally interchangeable. [W3C: Filter Effects](https://www.w3.org/TR/filter-effects/)

For a *stylized* glass approximation, derive a surface normal from a height field:

\[
n=\operatorname{normalize}(-\partial h/\partial x,-\partial h/\partial y,1),
\qquad I_{refract}(u)=I_{background}(u+a\,n_{xy}).
\]

A common view-dependent reflectance approximation is \(F=F_0+(1-F_0)(1-\max(n\cdot v,0))^5\). Combine controlled refraction, blur, tint, highlights, and shadow. The displacement equation is an artistic approximation, not full ray-traced refraction and not a decompiled Liquid Glass shader. Apple describes Liquid Glass as dynamic and responsive to surrounding content; its exact internal coefficients are not established here. [Apple: Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/)

On the web, `backdrop-filter` gives a useful subset. A canvas or WebGL shader cannot freely sample arbitrary DOM behind it as a live texture. A full custom glass renderer needs control of its input scene and a measured performance budget. Use an opaque or translucent fallback that preserves contrast and legibility; do not make an unreadable control merely to reproduce an optical effect.

## 14. Turn the rest of “feel” into invariants

Some requirements are state contracts rather than differential equations:

The [microdetails supplement](../../web-craft/references/microdetails.md) expands editing, lifecycle, focus, system integration, and haptics. For dated Safari/WebKit support and fallback decisions, use the [browser capability reference](../../web-craft-browser/references/browser-capabilities.md). Support research is separate from physical-device proof.

| System | Contract to test |
|---|---|
| Navigation | Back restores the correct route, selection, filters, and scroll position; primary sections retain their own context |
| Drafts | Closing or navigating does not silently destroy recoverable user input |
| Optimistic updates | Immediate local state has a defined pending, committed, and failed transition |
| Layout stability | Reserve image/media geometry; asynchronous content does not move the active target |
| Focus | Opening a modal places focus appropriately; closing restores a valid origin |
| Keyboard and zoom | The active editing area and primary action remain reachable after viewport changes; keyboard dismissal restores useful context |
| Reduced motion | The same semantic result is reachable without movement or an animation-end dependency |
| Progressive enhancement | Essential content stays visible when hydration, animation scripts, or observers fail |
| Desktop input | Hover is optional; keyboard, selection, context menus, and wheel behavior remain coherent |
| Touch input | Intended targets remain reachable without precision pointing or hidden hover behavior; adjacent hit regions do not compete |
| Gesture ownership | Conflicting gestures have a defined owner and cancellation path, including at scroll boundaries and after direction reversal |
| Visual states | Control geometry and alignment remain stable through pressed, selected, loading, disabled, focus, and error states unless change is intentional |
| Device integration | Selection, paste, autofill, sharing, and file picking remain usable where supported; optional haptics are not required to understand or complete an action |
| Accessibility | Motion never carries the only indication of success, selection, or failure |

For layout instability, a useful local measure is displacement of the active control between stable states, \(\|p_{after}-p_{before}\|\). For state restoration, compare the meaningful snapshot before leaving with the restored snapshot after returning. Make these contracts concrete in the app's workflows; a visually smooth failure still feels broken.

### Operational checks beyond animation

**Proposed contracts and measurements, not recovered Apple algorithms.** Evaluate these across the full journey in the [rulebook](../../web-craft/references/rulebook.md), rather than only in isolated component previews.

| Quality | Observable check |
|---|---|
| Touch and cancellation | One successful semantic activation produces one action. A canceled press or recognized scroll produces no accidental activation. Test pointer and keyboard paths independently. |
| Gesture arbitration | Record which interaction owns a conflicting drag after recognition. Moving through a content boundary or reversing direction must follow the declared policy without losing position or leaving stale capture. Valid simultaneous gestures can have an explicit separate policy. |
| Keyboard coordination | Check the caret and active editing region against the currently visible, unoccluded viewport in consistent coordinates. A fixed composer or toolbar must not cover them; oversized fields must remain scrollable. Dismissal should not create an unexplained viewport jump. |
| Navigation memory | Compare the meaningful state before leaving and after returning: section, route, item identity, filters, selection, draft, and scroll anchor. Key it to the correct account and workspace; define a sensible fallback if the original item disappears. |
| Reach and density | Observe one-handed use with both hands, landscape, text enlargement, and desktop input. Count missed or corrected activations and unnecessary reach changes; do not assume one universal thumb zone fits every user or device. |
| Network continuity | Exercise pending → confirmed and pending → failed → retry. Preserve input and stable layout; reconcile responses without duplicate actions or older results overwriting newer intent. |
| Visual consistency | Compare each control's position, dimensions, baseline, and hit region across its states. Separate intended disclosure/layout changes from accidental loading or selection shifts. |
| Device cooperation | Complete the flow with native editing assistance and system pickers where available, then with optional capabilities absent. The semantic result must remain available without haptics, hover, or custom gestures. |

Three useful quantitative assertions are:

\[
N_{accidental\ activations\ after\ cancellation}=0,
\qquad N_{duplicate\ submissions\ per\ intended\ action}=0,
\qquad E_{restore}=\|p_{anchor,after}-p_{anchor,before}\|.
\]

The zero-count goals apply to the tested scenarios; they are not measured results for an app. Measure restoration error against the same content anchor and coordinate frame after content is ready. If content or viewport geometry changed intentionally, check preservation of reading context rather than requiring an impossible zero-pixel difference.

For keyboard visibility, measure unwanted overlap with an occluder \(O\), such as a fixed toolbar, using \(A_{overlap}=area(C\cap O)\), where \(C\) is the caret's required visible region. Aim for zero unwanted overlap and keep a route to any temporarily offscreen action. This is a layout validation model, not a portable formula for detecting keyboard height.

The practical priority is keyboard behavior, navigation memory, forgiving touch, and continuity through loading. Desktop requires its own treatment of keyboard navigation, hover, text selection, context menus, and multitasking; visual consistency does not require identical layouts or gestures on every device.

## 15. Calibrate the whole system

**Measure.** Record a specific native component, device, OS build, refresh behavior, start geometry, and interaction. Track positions at known timestamps. A simple spring fit minimizes:

\[
\min_{T,b,v_0}\sum_i w_i[x_{model}(t_i;T,b,v_0)-x_{observed,i}]^2.
\]

Account for recording cadence, display scaling, dropped frames, and measurement noise. Multiple models can fit a short trace; a fit is not proof of an internal implementation. Screen recording alone does not establish physical finger-to-photon latency. Use a suitable external capture or instrumented setup for that measurement.

Test a complete sequence: begin, reverse mid-flight, drag, pause, release, interrupt again, change viewport, lose focus, resume, and use reduced motion. Profile CPU/main-thread work, rasterization, layer count, GPU work where tooling permits, frame pacing, and memory. Repeat on real mobile Safari and desktop browsers under representative load; a desktop preview is not evidence of iPhone smoothness.

The implementation priority is: remove input delay and stalls; preserve state and interruption; make geometry stable; tune dynamics; then spend the remaining rendering budget on materials. No single equation or shader compensates for a broken earlier layer.

## Reference implementation and checks

- [motion-model.mjs](../assets/motion-model.mjs): analytic spring, boundary resistance and derivative, and a separately labeled exponential inertia model. No dependencies.
- [motion-model.test.mjs](../assets/motion-model.test.mjs): eight tests covering initial conditions, derivatives and ODE residuals, all three damping regimes, near-critical values, retargeting, 60/120 Hz sampling equivalence, overshoot, resistance, inertia, and invalid inputs.
- Run with a current Node runtime: `node --test ../assets/motion-model.test.mjs` from this reference directory.

All eight math tests passed. The interactive comparison was exercised in a desktop browser, including mid-flight reversal and a state-persistence fix. These checks establish the reference's tested mathematical behavior, not native rendering parity. Physical-device calibration, exact per-component iOS defaults, the complete scroll system, and Apple's internal glass shaders remain unverified.
