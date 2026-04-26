# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

This is a **Rush + PNPM** monorepo publishing a family of React form library packages:

| Package | Path | Published |
|---|---|---|
| `@ilbrando/utils` | `packages/utils` | Yes |
| `@ilbrando/simple-form` | `packages/simple-form` | Yes |
| `@ilbrando/simple-form-joy` | `packages/simple-form-joy` | Yes |
| `@ilbrando/simple-form-material-ui` | `packages/simple-form-material-ui` | Yes |
| `@ilbrando/eslint-plugin` | `tools/eslint-plugin` | Yes |
| `@ilbrando/example-joy` | `examples/joy` | No |
| `@ilbrando/example-storybook` | `examples/storybook` | No |

## Common Commands

Always use rush commands and never npx og pnpm directly.

Run these from the repo root:

```bash
rush install        # Install all dependencies
rush build          # Build all packages (incremental)
rush rebuild        # Full rebuild of all packages
rush test           # Run all tests
rush eslint         # Lint all packages
rush change         # Create a change file (required before merging features/fixes)
```

To target a single package:
```bash
rush build --only @ilbrando/simple-form
rush test --only @ilbrando/simple-form
```

To run commands directly inside a package (faster for local dev):
```bash
# Vitest (simple-form, utils, eslint-plugin)
cd packages/simple-form
rush-pnpm run test                        # all tests

# Playwright component tests (simple-form-joy)
cd packages/simple-form-joy
rush-pnpm run test
rush-pnpm run test-ui              # interactive UI mode
```

## Architecture

### Package dependency graph

```
@ilbrando/utils
    └─ @ilbrando/simple-form (core form logic)
          ├─ @ilbrando/simple-form-joy (Joy UI bindings)
          └─ @ilbrando/simple-form-material-ui (Material-UI bindings)
```

### @ilbrando/simple-form

The central library. Provides:
- Type-safe form state management via React hooks
- A field validation framework (validators compose functionally)
- Localization support
- No UI — consumers (simple-form-joy, simple-form-material-ui) supply components

### @ilbrando/simple-form-joy / simple-form-material-ui

Each package wires simple-form's core hooks into pre-built UI components for their respective MUI variant (Joy UI or Material-UI). Both support theme customization via MUI's `extendTheme`.

### @ilbrando/utils

Generic TypeScript utilities (text, object, array helpers). No React dependency.

### @ilbrando/eslint-plugin

Custom ESLint rules shared by all packages. The notable rule is `@ilbrando/prefer-type`, which enforces the `type` keyword for type-only imports/exports.

## Tooling

- **Language**: TypeScript 6 in strict mode; ES modules (`"type": "module"`)
- **Build**: `tsdown` (produces CJS + ESM bundles per package)
- **Dev server**: Vite (used by material-ui package and example apps)
- **Unit tests**: Vitest with happy-dom (simple-form, utils)
- **Component tests**: Playwright CT (simple-form-joy)
- **Formatting**: Prettier — `printWidth=220`, no trailing commas, `arrowParens=avoid`
- **Linting**: ESLint flat config (`eslint.config.mjs`) in each package; `--max-warnings=0`

## Versioning and Publishing

Rush's change file system manages semantic versioning. Before merging any feature or fix:

```bash
rush change   # prompts for a description and bump type (patch/minor/major)
```

CI (`ci.yml`) verifies change files exist on PRs. Publishing to npm is done manually via the `release.yml` workflow.


## Code style

- Use Typescript.
- Never use `any` or `as` - everything should be 100% type safe.
- Use functional programming patterns.
- Use snake case for files.
- Use camel case for variables and functions
  - Exception: React components use Pascal case.
- Use Pascal case for types.
- Always use types and never interfaces.
- For null/undefined checks always use `hasValue` from `@ilbrando/utils` instead of JavaScript truthiness or explicit `=== null` / `=== undefined` checks.
- Exhaustive switches: always add a `default: assertNever(value)` case (using `assertNever` from `@ilbrando/utils`) so TypeScript catches unhandled variants when the union grows.
