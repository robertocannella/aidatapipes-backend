# Contributing

## Commit messages

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(optional-scope): description
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`

Example:

```
fix: correct outdoor temp query
```

Merge commits and `fixup!`/`squash!`-prefixed commits are exempt.

This is enforced automatically by a git hook (`.husky/commit-msg`) after
running `npm install`.

## Branch names

Branch names must follow the same `type/short-description` pattern, using
the same type list above.

Example:

```
feat/commit-convention-tooling
```

Direct commits on `main` are exempt from this check.

This is enforced automatically by a git hook (`.husky/pre-commit`) after
running `npm install`.
