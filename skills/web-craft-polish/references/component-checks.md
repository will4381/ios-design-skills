# Component finish checks

Select relevant rows; do not invent issues or force all checks onto a trivial component.

| Component | Details that often distinguish a finished implementation |
|---|---|
| Button/link | Correct semantics, contact feedback, cancellation, keyboard activation, stable pending dimensions, readable disabled reason, appropriate new-tab behavior |
| Form field | Persistent label, suitable input/autofill hints, caret/selection/IME, paste, undo, validation timing, associated error, keyboard-open reachability |
| Toggle/checkbox | Real boolean state and label, form behavior, keyboard operation, pending/rejected change, no hidden side-effect controls |
| Menu/popover | Trigger alignment, collision handling, input-appropriate navigation, outside dismissal, meaningful focus return, no hover-only essentials |
| Dialog/sheet | Modal versus nonmodal behavior, scroll ownership, nested dismissal, dirty-draft policy, keyboard, restored page position, cleaned-up inert/scroll locks |
| List/table | Stable identity, selection, variable height, empty/error distinctions, long text, incremental updates, useful desktop density, restored anchor |
| Search | Immediate editing, stale-response protection, composition-aware submission, result count/status, useful empty/error/canceled states |
| Composer/chat | Following only when appropriate, anchored reading, draft persistence, attachment retry, reachable caret, explicit send/newline behavior |
| Toast/status | Proportional feedback, truthful completion, useful recovery action, no focus theft or announcement flood, safe area/keyboard placement |
| Media/file | Reserved geometry, decoding/loading state, cancel/reselect, meaningful alt/captions, failure recovery, preview resource cleanup |

Across components, compare text baseline, icon weight, control dimensions, hit regions, focus visibility, contrast, and spacing through every relevant state. Test long content, enlarged text, narrow width, dark appearance, reduced motion, and forced colors where relevant. RTL and locale handling deserve explicit cases when the product supports them.

Do not replace ordinary controls with custom widgets solely to match a screenshot. Reuse accessible house components and inspect their behavior before overriding them.
