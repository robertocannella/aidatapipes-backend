<!--
Sync Impact Report
Version change: (none) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections: Core Principles (I-V), Technology & Deployment Constraints,
  Development Workflow, Governance
Removed sections: none
Follow-up TODOs: none
-->
# AIDataPipes Backend Constitution

## Core Principles

### I. Simplicity & Low Fixed Cost First
This is a personal, low-traffic project with a single maintainer and no
meaningful production traffic. Every infrastructure and architecture decision
MUST default to the simplest option that works, and MUST avoid
enterprise-scale patterns (load balancers, container orchestration,
auto-scaling, managed per-resource-billing services) unless a concrete,
current need requires them. Complexity is added only in response to an
actual, observed problem, never in anticipation of hypothetical scale.

### II. Flat, Predictable Costs
Infrastructure choices MUST prefer flat, predictable monthly billing over
usage-based or metered billing. When comparing hosting options, a fixed-price
option is preferred over a variable-price one unless the variable option is
demonstrably cheaper at this project's actual (near-zero) traffic level.

### III. YAGNI (You Aren't Gonna Need It)
Code and configuration MUST NOT include abstractions, feature flags,
extensibility hooks, or defensive handling for scenarios that cannot occur in
a single-maintainer personal project. Three similar lines of code are
preferred over a premature abstraction.

### IV. Minimal, Stable Deployment Topology
The standard deployment is a single VM running Docker Compose with two
services: the app container and Caddy (reverse proxy plus automatic HTTPS via
Let's Encrypt). Changes to the deployment MUST preserve or simplify this
topology. Adding new moving parts (additional servers, orchestrators, load
balancers, NAT gateways, etc.) requires an explicit, stated need from the
maintainer; it is never a default choice.

### V. Secrets Never Committed
Database connection strings, JWT signing keys, and other secrets MUST NOT be
committed to git in any form. They live only in a local, gitignored `.env`
file on the deployment host. Any change that would require a secret to be
hardcoded or checked in MUST be rejected or redesigned.

## Technology & Deployment Constraints

The backend is a Node.js/Express API using Mongoose against MongoDB Atlas. It
is packaged with a single Dockerfile and deployed via Docker Compose (app +
Caddy) on one Lightsail VM with a static IP. HTTPS is provided automatically
by Caddy via Let's Encrypt; there is no manual certificate management.
GitHub hosts the source repository.

## Development Workflow

This is a single-maintainer project. Commits are made directly to `main`;
pull requests are not required and branch protection is not enabled. There is
no CI/CD pipeline. Changes should be manually verified against the running
app (or a local Docker build) before being considered done. Automated test
coverage is currently minimal and is not a blocking requirement for shipping
a change, though adding tests is welcome when convenient.

## Governance

This constitution supersedes ad-hoc practice whenever "what's simplest"
conflicts with "what's more robust/scalable": simplicity wins unless the
maintainer explicitly asks for more robustness for a stated reason.
Amendments are made via the `/speckit-constitution` command and require a
version bump per the policy below. Any proposed complexity (new
infrastructure, new abstraction, new dependency) must be justified against an
actual, current need, not a hypothetical one.

Versioning policy: MAJOR for backward-incompatible governance/principle
removals or redefinitions, MINOR for a new principle or materially expanded
guidance, PATCH for clarifications and non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
