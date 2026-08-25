# Feature Specification: Commit Convention Tooling

**Feature Branch**: `001-commit-convention-tooling`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Set up commit convention tools for branches and commit names."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reject non-conforming commit messages (Priority: P1)

As the maintainer, when I write a commit message that doesn't follow the
Conventional Commits format, the commit is rejected locally with a clear
error explaining what's wrong, so bad commit messages never enter the
project's history.

**Why this priority**: This is the core value of the feature — consistent,
machine-parseable commit history — and delivers value on its own even before
branch naming is enforced.

**Independent Test**: Run `git commit -m "fixed a bug"` (no type prefix) and
confirm the commit is rejected with an explanation; run
`git commit -m "fix: correct outdoor temp query"` and confirm it succeeds.

**Acceptance Scenarios**:

1. **Given** a staged change, **When** the maintainer commits with a message
   that has no recognized type prefix (e.g. `"updated stuff"`), **Then** the
   commit is rejected and an error names the expected format.
2. **Given** a staged change, **When** the maintainer commits with a
   correctly formatted message (e.g. `"fix: correct outdoor temp query"`),
   **Then** the commit succeeds.
3. **Given** an auto-generated merge commit (e.g. from `gh pr merge`),
   **When** it is created, **Then** it is not rejected even though it doesn't
   match the type-prefix format.

---

### User Story 2 - Reject non-conforming branch names (Priority: P2)

As the maintainer, when I create a commit on a branch whose name doesn't
follow the naming convention (`type/short-description`), I get a clear
rejection, so branch names stay consistent and easy to scan in `git branch`
or GitHub's branch list.

**Why this priority**: Useful on its own, but secondary to commit-message
quality since branch names are more cosmetic and easier to rename after the
fact than commit history is to rewrite.

**Independent Test**: Create a branch named `my-cool-change`, make a commit,
and confirm it's rejected; rename the branch to `feat/my-cool-change` and
confirm the same commit succeeds.

**Acceptance Scenarios**:

1. **Given** a branch named without a recognized type prefix (e.g.
   `random-branch`), **When** the maintainer commits on it, **Then** the
   commit is rejected and an error explains the expected pattern.
2. **Given** a branch named `feat/short-description`, **When** the
   maintainer commits on it, **Then** the commit succeeds.
3. **Given** the maintainer is committing directly on `main`, **When** they
   commit, **Then** the branch-naming check does not apply (direct commits
   to `main` are an accepted workflow for this project).

---

### User Story 3 - Quick reference for the convention (Priority: P3)

As the maintainer, I can find a short reference listing the allowed commit
types and branch prefixes inside the repository, so I don't have to guess or
search externally when a rejection message doesn't jog my memory.

**Why this priority**: Nice-to-have documentation; the enforcement tooling's
own error messages already carry most of this information, so this is
lower-value than the enforcement itself.

**Independent Test**: Open the repository's convention reference file and
confirm it lists every allowed type and shows one example commit message and
one example branch name.

**Acceptance Scenarios**:

1. **Given** the maintainer wants to know the allowed commit types, **When**
   they open the convention reference in the repo, **Then** they find the
   full list and an example within a few lines.

---

### Edge Cases

- What happens when committing directly on `main`? Commit-message format is
  still enforced; the branch-naming check (User Story 2) does not apply.
- What happens with an auto-generated merge commit message (e.g. `Merge pull
  request #13 from ...`)? It is exempt from the message-format check.
- What happens with a `fixup!`/`squash!` prefixed commit (used with `git
  rebase --autosquash`)? It is exempt from the message-format check.
- What happens if the maintainer bypasses the check with `git commit
  --no-verify`? Out of scope — local hooks are inherently bypassable, and
  that's an accepted tradeoff for a single-maintainer project.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST reject a commit whose message does not match the
  Conventional Commits format (`type(optional-scope): description`) before
  the commit is created.
- **FR-002**: System MUST accept at least these commit types: `feat`, `fix`,
  `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`.
- **FR-003**: System MUST exempt auto-generated merge commit messages and
  `fixup!`/`squash!`-prefixed messages from the format check.
- **FR-004**: System MUST reject a commit made on a non-`main` branch whose
  name does not match `type/short-description`, using the same type list as
  FR-002.
- **FR-005**: System MUST NOT apply the branch-naming check when committing
  directly on `main`.
- **FR-006**: System MUST document the convention (allowed types, message
  format, one example commit message, one example branch name) in a file
  inside the repository.
- **FR-007**: Enforcement MUST run locally at commit time and MUST NOT
  depend on a CI/CD pipeline (this project has none, per project
  constitution).
- **FR-008**: A fresh clone of the repository MUST have enforcement active
  after running the project's existing install step (`npm install`), with no
  additional manual setup.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every commit made after setup follows the Conventional Commits
  format — verifiable by inspecting `git log` for non-conforming messages.
- **SC-002**: An invalid commit message is rejected in the same terminal
  session it was attempted in, with no round trip to GitHub required to
  discover the problem.
- **SC-003**: The convention reference can be located and understood in
  under one minute without leaving the repository.

## Assumptions

- Only the maintainer works on this repository locally today; if
  collaborators join later, the existing `npm install` step is sufficient
  onboarding since it's already part of this project's setup.
- Node.js/npm is already this project's toolchain (per `package.json`), so
  enforcement tooling should build on npm rather than introduce a separate
  language runtime.
- "main" is exempt from the branch-naming check because direct commits to
  `main` are an accepted, already-documented workflow for this project (see
  project constitution).
