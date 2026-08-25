# Implementation Plan: Commit Convention Tooling

**Branch**: `001-commit-convention-tooling` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-commit-convention-tooling/spec.md`

## Summary

Enforce Conventional Commits message format and a `type/short-description`
branch naming pattern locally at commit time, using git hooks that activate
automatically via the project's existing `npm install` step — no CI/CD
dependency, no runtime/production impact.

## Technical Context

**Language/Version**: Node.js / JavaScript (ESM), matching the existing project

**Primary Dependencies**: `husky` (git hook manager) and `@commitlint/cli` +
`@commitlint/config-conventional` (commit message format enforcement) as
devDependencies. Branch-name validation is a small inline shell check inside
a hook rather than a separate package (YAGNI — the check is a single regex).

**Storage**: N/A

**Testing**: Manual verification against the acceptance scenarios in
spec.md (this project has no automated test suite; not a blocker per
constitution).

**Target Platform**: Local developer machine — hooks run client-side at
commit time, never in CI or production.

**Project Type**: Repository/dev tooling configuration (not a runtime
feature of the deployed application).

**Performance Goals**: Hook execution must stay near-instant (sub-second) so
it doesn't disrupt the normal commit workflow.

**Constraints**: Must not depend on a CI/CD pipeline (this project has
none). Must not add anything to the production Docker image — the
Dockerfile already runs `npm ci --omit=dev`, so devDependencies are
naturally excluded. Must activate automatically from the existing `npm
install` step, no separate manual setup command.

**Scale/Scope**: Single maintainer, low commit volume — no scale concerns.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicity & Low Fixed Cost First** — PASS. Purely local tooling, zero
  infrastructure or hosting cost.
- **II. Flat, Predictable Costs** — PASS (N/A). Open-source npm packages,
  no billing implications.
- **III. YAGNI** — PASS. `husky` + `commitlint` is the minimal standard
  combination for this exact, explicitly-requested need; branch-name
  checking is a few inline shell lines rather than a second dependency.
- **IV. Minimal, Stable Deployment Topology** — PASS (N/A). devDependencies
  only; the Dockerfile already excludes them (`npm ci --omit=dev`), so the
  deployed app and its image are unaffected.
- **V. Secrets Never Committed** — PASS (N/A). No secrets involved.

No violations. Complexity Tracking table is omitted (not needed).

## Project Structure

### Documentation (this feature)

```text
specs/001-commit-convention-tooling/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md         # Phase 1 output (validation guide)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

`data-model.md` and `contracts/` are intentionally omitted: this feature has
no data entities and no external interface — it only configures git hooks
and repo-local tooling.

### Source Code (repository root)

This feature adds no new application source directories. It adds
configuration files at the existing repo root, alongside the project's
current flat layout (`routes/`, `models/`, `startup/`, `middleware/`,
`config/`):

```text
.husky/
├── commit-msg            # runs commitlint against the commit message
└── pre-commit             # runs the branch-name check (skipped on `main`)

commitlint.config.js       # allowed commit types + Conventional Commits rules
CONTRIBUTING.md            # convention quick reference (FR-006)
package.json                # + husky/commitlint devDependencies, "prepare": "husky" script
```

**Structure Decision**: Single existing Node/Express project. No new source
directories are introduced; only git-hook configuration and devDependencies
at the repo root.

## Complexity Tracking

*No violations — table omitted.*
