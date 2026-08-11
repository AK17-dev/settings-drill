<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Project rules
- Forms use react-hook-form + a zod resolver. No hand-rolled validate() functions, no uncontrolled inputs.
- Every input has a <label htmlFor>; on error, aria-invalid="true" and aria-describedby point at the rendered error message's id.
- Cross-field validation (e.g. password confirm) lives in the zod schema via superRefine, not scattered in component logic — verify by breaking one rule and confirming the matching test fails before trusting a test suite.