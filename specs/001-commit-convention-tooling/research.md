# Phase 0 Research: Commit Convention Tooling

No `[NEEDS CLARIFICATION]` markers were present in the Technical Context, so
this phase documents the tooling decisions rather than resolving open
questions.

## Decision: Commit message enforcement

**Decision**: Use `@commitlint/cli` + `@commitlint/config-conventional`,
invoked from a `husky` `commit-msg` hook.

**Rationale**: This is the de facto standard combination for Node.js
projects wanting Conventional Commits enforcement — well maintained, zero
config beyond a types list, and runs entirely client-side (fits the
project's "no CI/CD pipeline" constraint). `husky` is the standard way to
install/version git hooks through `npm install` so a fresh clone gets
enforcement automatically without a manual step.

**Alternatives considered**:
- **Hand-rolled shell regex in `.git/hooks/commit-msg` directly**: rejected
  — `.git/hooks/` isn't versioned by git, so it wouldn't survive a fresh
  clone or be shareable, violating FR-008.
- **`commitizen`** (interactive commit prompt): rejected — adds an
  interactive CLI step to every commit; the spec only asks for validation,
  not a guided-authoring experience. Can be added later without conflicting
  with this setup if wanted.
- **CI-side enforcement (e.g. a GitHub Action that lints PR commits)**:
  rejected — this project has no CI/CD pipeline per the constitution, and
  CI-side enforcement fails SC-002 (rejected in the same terminal session,
  not after a round trip to GitHub).

## Decision: Branch name enforcement

**Decision**: A short inline shell check inside the same `pre-commit` husky
hook, reading the current branch name and testing it against
`^(feat|fix|docs|chore|refactor|test|style|perf|build|ci)/[a-z0-9-]+$`,
skipped entirely when the branch is `main`.

**Rationale**: The check is a single regex comparison. Per the project
constitution's YAGNI principle, a dedicated package (e.g.
`branch-name-lint`) would be a premature abstraction for something this
small; a few lines of shell inside the existing hook infrastructure is
simpler to read, audit, and maintain.

**Alternatives considered**:
- **`branch-name-lint` (or similar) npm package**: rejected — pulls in a
  second dependency and its own config file for logic that fits in five
  lines of shell.
- **Enforcing at `git branch`/checkout time**: rejected — git has no native
  hook that fires on branch creation before the fact; `pre-commit` is the
  earliest point that reliably works across `git switch -c`, `git
  checkout -b`, and branches created by other tools (e.g. `gh pr create`
  flows).

## Decision: Convention reference location

**Decision**: `CONTRIBUTING.md` at the repo root.

**Rationale**: Conventional, discoverable location; GitHub surfaces
`CONTRIBUTING.md` automatically when opening a PR or issue, satisfying
SC-003 ("located and understood in under one minute") without extra
signposting.

**Alternatives considered**:
- **A section appended to `README.md`**: rejected — the README is already
  focused on local setup instructions; mixing in contribution conventions
  would make it longer without a clear win, and `CONTRIBUTING.md` is the
  more conventional location GitHub tooling expects.
