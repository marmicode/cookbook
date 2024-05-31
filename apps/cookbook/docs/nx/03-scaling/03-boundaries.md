---
slug: /nx/boundaries
---

# Enforce Boundaries

Once you [have established the organization of your workspace and libraries](./02-organize-libs.md), and the underlying rules, you will probably want to enforce them.

As a matter of fact, even with the best intentions, it is easy to break the rules we've defined even with a small team and workspace, let alone with a larger team and/or workspace.

## The `@nx/enforce-module-boundaries` eslint rule

Here is where the [Nx eslint plugin](https://nx.dev/nx-api/eslint-plugin) _(`@nx/eslint-plugin`)_ comes into play. More precisely, the `depConstraints` option of the [`@nx/enforce-module-boundaries` rule](https://nx.dev/nx-api/eslint-plugin/documents/enforce-module-boundaries) allows you to enforce the boundaries you have defined for your workspace. For instance, it will prevent you from importing a library from another library that isn't supposed to depend on it.

The `depConstraints` option is a list of constraints that define which projects can depend on which other projects. These constraints are tag-based, hence the need to [tag your libraries first](./02-organize-libs.md#tags-and-categories).
