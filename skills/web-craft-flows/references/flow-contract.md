# Flow contract

For the named task, establish:

| Question | Capture |
|---|---|
| Who and why? | Actor, role/account scope, goal, and prerequisites |
| Where does it begin? | Route/deep link, originating view, focus, scroll, and current selection |
| What changes? | User action, local state, pending request, confirmed durable state |
| What remains? | Draft, filters, scroll anchor, parent context, undo/retry information |
| What can interrupt? | Cancel, Back, tab switch, keyboard change, pointer cancel, offline, auth expiry, resize |
| What is success? | User-visible completion plus required persistence/authorization outcome |
| What is recovery? | Meaningful error, retained work, retry/undo, and safe return path |

Map idle/editing/validating/pending/confirmed/failed/canceled only where those states exist. Keep independent domain lifecycles distinct. An account approval, application approval, and submission approval may be different operations; never unify them merely because they share the word “approved.”

For each transition, specify entry action, state owner, side effect, focus destination, scroll policy, and recovery. An ephemeral panel may preserve context; a durable destination may need a route. Choose by task, not fashion.

Acceptance cases should include the normal path, relevant interruption, and the most consequential failure. Examples: a failed save preserves the draft; returning restores the originating item; two rapid submissions cannot create duplicates; canceling composition does not submit; dismissing a child overlay leaves its parent usable.

Plan scope includes a concrete proposal and affected primitives. Change scope includes implementation and appropriate verification. The same contract supports both without automatically granting edit permission.
