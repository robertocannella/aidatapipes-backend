---
description: "Task list for Commit Convention Tooling"
---

# Tasks: Commit Convention Tooling

**Input**: Design documents from `/specs/001-commit-convention-tooling/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not requested in the feature specification — validation is manual,
against the scenarios in `quickstart.md`, per this project's constitution
(no automated test suite required to ship a change).

**Organization**: Tasks are grouped by user story so each can be completed
and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to the repository root

## Phase 1: Setup

**Purpose**: Get the hook toolchain installed and scaffolded

- [X] T001 Add `husky`, `@commitlint/cli`, and `@commitlint/config-conventional`
      as devDependencies and add a `"prepare": "husky"` script, in
      `package.json`
- [X] T002 Run `npx husky init` to scaffold the `.husky/` directory

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared rule definitions both hooks and the doc depend on

**⚠️ CRITICAL**: Must be complete before Phase 3/4/5

- [X] T003 Create `commitlint.config.js` at the repo root: extend
      `@commitlint/config-conventional`, set the allowed `type-enum` to
      `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`,
      `build`, `ci` (FR-002), and add an `ignores` entry so
      `fixup!`/`squash!`-prefixed messages are skipped (FR-003; merge
      commits are already exempted by commitlint's own defaults)

**Checkpoint**: Rule definitions exist — hook implementation can now begin

---

## Phase 3: User Story 1 - Reject non-conforming commit messages (Priority: P1) 🎯 MVP

**Goal**: A commit with a non-conforming message is rejected locally;
a conforming one succeeds; merge/fixup commits are exempt

**Independent Test**: Run the "Validate: commit message enforcement"
commands in `specs/001-commit-convention-tooling/quickstart.md`

### Implementation for User Story 1

- [X] T004 [US1] Create `.husky/commit-msg` running
      `npx --no -- commitlint --edit "$1"`
- [X] T005 [US1] Make `.husky/commit-msg` executable (`chmod +x .husky/commit-msg`)
- [X] T006 [US1] Run the commit-message scenarios from
      `specs/001-commit-convention-tooling/quickstart.md` and confirm each
      matches its expected outcome (FR-001, FR-003)

**Checkpoint**: Commit-message enforcement is fully functional and testable
independently

---

## Phase 4: User Story 2 - Reject non-conforming branch names (Priority: P2)

**Goal**: A commit on a branch whose name doesn't match
`type/short-description` is rejected, except on `main`

**Independent Test**: Run the "Validate: branch name enforcement" commands
in `specs/001-commit-convention-tooling/quickstart.md`

### Implementation for User Story 2

- [X] T007 [US2] Create `.husky/pre-commit`: read the current branch with
      `git rev-parse --abbrev-ref HEAD`; if it is `main`, exit 0
      immediately (FR-005); otherwise test it against
      `^(feat|fix|docs|chore|refactor|test|style|perf|build|ci)/[a-z0-9-]+$`
      and exit non-zero with a clear message naming the expected pattern if
      it doesn't match (FR-004)
- [X] T008 [US2] Make `.husky/pre-commit` executable
      (`chmod +x .husky/pre-commit`)
- [X] T009 [US2] Run the branch-name scenarios from
      `specs/001-commit-convention-tooling/quickstart.md` and confirm each
      matches its expected outcome, including the `main` exemption

**Checkpoint**: Commit-message AND branch-name enforcement both work
independently

---

## Phase 5: User Story 3 - Quick reference for the convention (Priority: P3)

**Goal**: A discoverable file listing the allowed types, message format, and
one example each of a commit message and a branch name

**Independent Test**: Run the "Validate: convention reference" step in
`specs/001-commit-convention-tooling/quickstart.md`

### Implementation for User Story 3

- [X] T010 [P] [US3] Create `CONTRIBUTING.md` at the repo root documenting
      the Conventional Commits message format, the full allowed-type list
      (matching `commitlint.config.js` from T003), the branch naming
      pattern from T007, one example commit message, and one example
      branch name (FR-006)

**Checkpoint**: All three user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Tie the feature together and prove it end-to-end

- [X] T011 [P] Add a one-line pointer to `CONTRIBUTING.md` in `README.md` so
      it's discoverable from the project's existing entry point
- [X] T012 Run every scenario in
      `specs/001-commit-convention-tooling/quickstart.md` end-to-end and
      confirm SC-001, SC-002, and SC-003 are met
- [X] T013 Commit this feature's own changes using a conventional commit
      message on a conventionally-named branch — the first real proof the
      hooks work (dogfooding)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational; independent of
  each other and may be done in any order
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Parallel Opportunities

- T010 (US3 doc) can be written in parallel with T004-T009 (US1/US2 hooks)
  — different file, no code dependency, though its content should match
  the type list landed in T003
- T011 (README pointer) can run in parallel with T012 (final validation)

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. Complete Phase 3 (User Story 1 — commit message enforcement)
3. **STOP and VALIDATE** independently before continuing

### Incremental Delivery

1. Setup + Foundational → hook toolchain ready
2. User Story 1 → commit messages enforced (MVP)
3. User Story 2 → branch names enforced
4. User Story 3 → reference doc in place
5. Polish → wired into README, validated end-to-end, dogfooded
