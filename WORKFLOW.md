I built a profile/password settings form three times to isolate two variables independently: the presence of repo-level agent instructions (AGENTS.md), and prompt specificity.



Round 1a (vague, AGENTS.md present): One sentence — "build a settings form for my app" — in a session where the Next.js 16 scaffold's auto-generated AGENTS.md was still in the repo. The result was unexpectedly complete: a Server Action (app/settings/actions.ts), field-level validation, and aria-invalid/aria-describedby wiring, verified manually via curl. This wasn't the "lazy" baseline I intended — the agent read AGENTS.md's instruction to check the framework docs before coding, which supplied context I hadn't provided. I kept this branch (round-1-vague) as a separate data point rather than discarding it.



Round 1b (vague, AGENTS.md removed): Same one-sentence prompt, AGENTS.md deleted, fresh worktree to avoid session bleed. This is the true baseline (round-1-clean). The agent still asked two scoping questions (form fields, persistence) before building — a vague prompt produces clarifying questions before it produces bad code, which I hadn't anticipated. Result: hand-rolled useState + manual validate() function, no persistence, zero tests.



Round 2 (spec-driven): Fresh session, plan mode, a prompt specifying react-hook-form + zod, exact a11y wiring, a persistence module in lib/, and a required test-and-verify step. Diffed against round-1-clean: page.test.tsx went from 0 to 153 lines; the manual validate() function was replaced by schema.ts (41 lines, zod + superRefine for the password cross-field logic); lib/settings.ts (27 lines) added real persistence in place of console.log.



Correctness: Round 1's validate() had a latent bug — when newPassword was empty, confirmPassword was still checked against it, so a user could get both "new password required" and a redundant "passwords don't match" simultaneously. Round 2's zod superRefine explicitly guards against this (verified: I weakened the length check and re-ran tests — exactly 1 of 7 failed, confirming the suite exercises real behavior, not just a passing shell).



Accessibility: Both rounds correctly wired aria-invalid/aria-describedby — I'd assumed round 1 would skip this and was wrong. The gap wasn't presence of ARIA, it was verification: round 1 had no automated check that the wiring stayed correct under change.



Review effort: Round 1a/1b took under 5 minutes each; round 2 took \~15 minutes of prompting plus plan review, but needed zero manual fixes afterward. Round 1's output would need a human to add tests and fix the password bug before merge — that work wasn't visible in the "fast" timing.



Biggest surprise: the vague-prompt penalty this drill assumes is partly absorbed by 2026 tooling defaults (scaffold-level agent instructions, agents that ask clarifying questions). The remaining, reliable gap is verification: tests and persistence, not markup quality.

