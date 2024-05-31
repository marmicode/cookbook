---
slug: /nx/boundaries
---

# Enforce Boundaries

Once you [have established the organization of your workspace and libraries](./02-organize-libs.md), and the underlying rules, you will probably want to enforce them.

As a matter of fact, even with the best intentions, it is easy to break the rules we've defined even with a small team and workspace, let alone with a larger team and/or workspace.

## The `@nx/enforce-module-boundaries` eslint rule

Here is where the [Nx eslint plugin](https://nx.dev/nx-api/eslint-plugin) _(`@nx/eslint-plugin`)_ comes into play. More precisely, the `depConstraints` option of the [`@nx/enforce-module-boundaries` rule](https://nx.dev/nx-api/eslint-plugin/documents/enforce-module-boundaries) allows you to enforce the boundaries you have defined for your workspace. For instance, this will analyze the "imports" in your workspace and prevent you from importing a library from another library that isn't supposed to depend on it.

The `depConstraints` option is a list of constraints that define which projects can depend on which other projects. These constraints are tag-based, hence the need to [tag your libraries first](./02-organize-libs.md#tags-and-categories).

### Defining a Constraint

The following constraint will allow libraries with the `type:ui` tag to **only** depend on libraries with either the `type:ui` or `type:model` tags:

```json
"depConstraints": [
  {
    "sourceTag": "type:ui",
    "onlyDependOnLibsWithTags": ["type:ui", "type:model"]
  }
],
```

This means that given the following code _(a library with `type:ui` depending on a library with `type:infra`)_:

```ts
// libs/catalog/ui/index.ts
import { RecipeRepository } from '@marmicode/catalog/infra';
```

the eslint rule will produce the following error:

```sh
libs/catalog/ui/index.ts
1:1  error  A project tagged with "type:ui" can only depend on libs tagged with "type:ui", "type:model"  @nx/enforce-module-boundaries

✖ 1 problem (1 error, 0 warnings)
```

:::info
Note that if a project doesn't match any constraint _(i.e. `sourceTag`)_, the default behavior is to produce the following error:

```sh
1:1  error  A project without tags matching at least one constraint cannot depend on any libraries  @nx/enforce-module-boundaries

✖ 1 problem (1 error, 0 warnings)
```

While this behavior can be overriden by adding a passthrough constraint: `{"sourceTag": "*", "onlyDependOnLibsWithTags": ["*"]}`, we do not recommend it as it could hide both configuration errors and constraints violations.
:::
