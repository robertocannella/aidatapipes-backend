# Quickstart: Validating Commit Convention Tooling

## Prerequisites

- Repository cloned locally.
- Run `npm install` (already the project's standard setup step — this is
  what activates the git hooks, per FR-008).

## Validate: commit message enforcement (User Story 1)

```bash
# Should be rejected:
git commit --allow-empty -m "updated stuff"

# Should succeed:
git commit --allow-empty -m "fix: correct outdoor temp query"
```

Expected outcome: the first command fails with an error naming the expected
Conventional Commits format; the second succeeds.

```bash
# A merge commit should not be blocked:
git merge --no-ff <some-branch>
```

Expected outcome: merge commits succeed regardless of message format
(FR-003).

## Validate: branch name enforcement (User Story 2)

```bash
git checkout -b random-branch
git commit --allow-empty -m "fix: test"
```

Expected outcome: rejected — branch name doesn't match
`type/short-description`.

```bash
git checkout -b feat/short-description
git commit --allow-empty -m "fix: test"
```

Expected outcome: succeeds.

```bash
git checkout main
git commit --allow-empty -m "fix: test"
```

Expected outcome: succeeds — the branch-naming check does not apply on
`main` (FR-005).

## Validate: convention reference (User Story 3)

```bash
cat CONTRIBUTING.md
```

Expected outcome: file exists at the repo root, lists every allowed commit
type from FR-002, and shows one example commit message and one example
branch name.

## Cleanup

The commands above use `--allow-empty` and are safe to run directly on a
throwaway local branch; delete any test branches afterward with `git branch
-D <branch-name>`.
