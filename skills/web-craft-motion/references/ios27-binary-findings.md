# iOS 27 animation binary findings

Inspected October 25, 2026. These are static observations and a manual reconstruction of selected routines from Apple’s arm64 **iOS Simulator 27.0, build 24A434**. This is scoped binary analysis, not a reconstruction of the entire OS or a measurement of physical iPhone behavior.

**Acquisition and provenance**

The local Xcode installation reported version 27.0, build 27A266a. Running Apple’s `xcodebuild -downloadPlatform iOS -buildVersion 27.0 -architectureVariant arm64 -exportPath …` reported an already-cached download and exported its bundle. The command returned exit status 70 despite reporting the export; I independently verified the exported metadata, mounted the image read-only, and read `SystemVersion.plist`, which identified version 27.0 and build 24A434. The image’s checksum verification completed successfully during mounting.

The runtime stores framework code in a shared cache. I used the ipsw project’s utility, version 3.1.739, to extract QuartzCore and UIKitCore, then Xcode’s `llvm-objdump` to disassemble selected symbols. The utility archive matched its published SHA-256 checksum. UIKitCore extraction with optional Objective-C symbol enrichment encountered a parser error; ordinary extraction succeeded and retained the local symbols used below. No simulator installation or OS update was performed.

[Apple: Runtime download command](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components), [ipsw: Shared-cache extraction](https://blacktop.github.io/ipsw/docs/guides/dyld/)

| Artifact | Identifier |
| --- | --- |
| QuartzCore Mach-O UUID | `1C85C80F-98F9-35AA-A568-7951FA31EBF2` |
| QuartzCore extracted SHA-256 | `5678dd80f386d1b9af6d34a8bcf84edf8256cfded5f949d45347e22d9bba6482` |
| UIKitCore Mach-O UUID | `E9CBEBE9-BFEE-3385-AF52-D32C606E46BE` |
| UIKitCore extracted SHA-256 | `dd7028fd8ac9330e54449d7cb88cc64337b2474175d9e7d4359da6ff8a75e5a1` |
| ipsw utility archive SHA-256 | `c09e8eba02c332f5b50d15f94383e59dd35646d70f6ea9e78d185e9afda6abc2` |

The extracted-file hashes identify this extraction, whose metadata may differ from another tool’s output. Addresses below are unslid virtual addresses in this particular simulator build.

**1. Duration and bounce convert to physical coefficients**

UIKitCore’s `+[UISpringTimingParameters _convertBounce:toDampingRatio:]` at `0x1c3c8fb9c` implements the following relationship for ordinary finite inputs:

```text
dampingRatio = 1 - bounce          when bounce >= 0
dampingRatio = 1 / (1 + bounce)    when bounce < 0
```

Its `_convertDampingRatio:response:toMass:stiffness:damping:` at `0x1c3c8fb28` supplies:

```text
mass = 1
stiffness = (2π / response)²
damping = 2 × dampingRatio × sqrt(stiffness)
```

The public duration/bounce initializer at `0x1c3c8f494` calls those converters and retains the initial-velocity components. The constant at `0x1c5718288` decodes to `6.283185307179586`, confirming the `2π` factor.

QuartzCore’s `-[CASpringAnimation initWithPerceptualDuration:bounce:]` at `0x1c3afab74` corroborates the mapping: it enables overdamping, computes stiffness using `(2π / duration)²`, computes damping using `4π × dampingRatio / duration`, and sets animation duration from the settling calculation. These equations describe the valid, positive-duration case; they are not a complete production API including input validation and exceptional values.

For a proposed response of 0.30 s:

| Bounce | Damping ratio | Mass | Stiffness | Damping |
| --- | ---: | ---: | ---: | ---: |
| −0.5 | 2.0 | 1 | 438.6491 | 83.7758 |
| 0 | 1.0 | 1 | 438.6491 | 41.8879 |
| 0.2 | 0.8 | 1 | 438.6491 | 33.5103 |

These are calculated examples, **not defaults recovered for sheets, buttons, or navigation**. Arithmetic self-checks verified round-trip recovery of duration and bounce for all three rows. Matching coefficients in another animation engine still requires checking units, integration, stopping thresholds, and velocity conventions.

**Web implication:** choose a coherent spring behavior and preserve velocity. A single Bézier curve and duration cannot encode every starting velocity. Do not copy a library’s `bounce` or `duration` parameter across implementations and assume identical semantics.

**2. Perceptual arrival and complete settling are distinct**

QuartzCore’s `-[CASpringAnimation settlingDuration]` at `0x1c3afa6d4` loads the constant at `0x1c3baf8e0`, decoded as `0.001`, and passes it to `durationForEpsilon:`. The perceptual-duration getter at `0x1c3afac28` uses `2π × sqrt(mass / stiffness)` for finite stiffness.

The inspection establishes a tolerance-based settling path and a separate perceptual parameter. It does **not** establish that every animated property is guaranteed to be within exactly 0.1% of its target when the public animation completes; the full tolerance algorithm was not reconstructed.

**Web implication:** optimize the initial response and perceived arrival. Do not block the next action until a spring’s tiny remaining tail has ended.

**3. Settling accounts for release velocity in both axes**

UIKitCore’s `-[UISpringTimingParameters settlingDuration]` at `0x1c3c8fa24` reads initial velocity, calls `__durationOfSpringAnimation`, and, when axis velocities differ, computes the second duration and takes the maximum. This is the observed implicit-duration path.

The SDK additionally documents initial velocity normalized to the total animation distance per second. That convention must be translated when a web engine expects pixels per second or another unit. Handle near-zero remaining distance explicitly.

**Web implication:** a fast flick and a slow release should not collapse into the same prerecorded motion. Sample recent signed velocity near release; averaging the entire gesture can misrepresent a pause or reversal.

**4. Scroll constants are real, but insufficient to clone scrolling**

| UIKitCore exported constant | Address | Decoded double |
| --- | --- | ---: |
| `UIScrollViewDecelerationRateNormal` | `0x1c56d8678` | 0.998 |
| `UIScrollViewDecelerationRateFast` | `0x1c56d8680` | 0.99 |

These constants were read from the extracted binary using Mach-O segment address mapping. They are not safe to interpret as per-frame multipliers without reconstructing the consuming algorithm and its timebase. The follow-up below reconstructs the boundary-resistance formula; gesture recognition and the complete scroll integrator remain outside the established findings.

**Web implication:** prefer browser scrolling for ordinary content. Replacing it with a guessed decay loop creates more work and can lose native gesture behavior.

**5. A default initializer is not a universal design token**

`-[UISpringTimingParameters init]` at `0x1c3c8f224` reads shared parameters after invoking `__UILoadDefaultSpringParameters`. The loader includes a user-defaults lookup path. This inspection does not identify the active parameters chosen by each system component at runtime.

**Web implication:** use a small, purpose-based motion vocabulary and validate it in the target app. Do not advertise one extracted number as “the iOS 27 animation.”

**Evidence limits**

The work includes static disassembly, manual reconstruction, SDK inspection, constant decoding, and arithmetic assertions. It does not include executing the inspected routines, comparing rendered output against those equations, measuring a physical iPhone, reverse-engineering SpringBoard or Liquid Glass shaders, or auditing a target web app. The broader rulebook combines these narrow findings with documented APIs and explicitly proposed engineering practices.

Machine-readable provenance and constants: [ios27-binary-evidence.json](ios27-binary-evidence.json).

**Follow-up: spring evaluation and boundary resistance**

The deeper inspection traced QuartzCore's `CA::Render::SpringAnimation::State::update` at `0x1c3b45928`, `eval(double)` at `0x1c3b459cc`, and `eval_derivative(double)` at `0x1c3b45aac`. They select an exponentially decaying sine/cosine solution, a linear-times-exponential critical solution, or a two-exponential overdamped solution. True overdamping depends on the configuration flag. QuartzCore's indirect symbol table independently identifies the exponential and sine/cosine stubs. These are static observations; the native routines were not executed to compare outputs.

`durationForEpsilon:` at `0x1c3afadd4` clamps epsilon to at least `0.000001` and has different calculation paths by damping regime. Its underdamped path uses an exponential-envelope estimate; the other paths include sampled evaluation. The complete stopping heuristic is not claimed as reconstructed.

UIKitCore's `__UIScrollViewRubberBandOffsetWithoutDecorationForOffset` at `0x1c4e3f35c` applies this formula beyond a boundary, for positive extent L and coefficient c:

```text
R(d) = sign(d) × L × (1 − 1 / (1 + c × abs(d) / L))
```

Here d is the signed distance beyond the boundary; the result is added to the relevant boundary. In-bounds offsets remain unchanged. The separate coefficient selector at `0x1c4e3f3f8` has these argument-selected defaults and internal preference-override paths:

| Selector input | Default coefficient | Constant location |
|---|---:|---|
| 1 | 0.715 | `0x1c5722430` |
| 2 or 4 | 0.17 | `0x1c571a948` |
| 3 | 0.4 | `0x1c5718058` |
| 5 | 0.5 | Immediate instruction value |
| Other/default branch | 0.55 | `0x1c5718380` |

The semantic meaning of these selector inputs and the active choices for particular system components were not established. The derivative and velocity handoff discussed in the [technical specification](motion-and-rendering-spec.md) are mathematical derivations from this function, not additional recovered UIKit behavior.

A scroll-deceleration consumer was also inspected, but external-call identification in the ordinarily extracted UIKit image was not sufficiently reliable to claim its complete algorithm. The reference implementation therefore labels exponential inertia as a standard model rather than a UIKit clone.
