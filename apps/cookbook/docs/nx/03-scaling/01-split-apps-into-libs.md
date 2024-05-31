---
slug: /nx/split-apps-into-libs
---

# Split Apps into Libs

## Do You Really Need to Split Apps into Libs?

**_TL;DR: no, but you probably should!_**

First, let's clarify what we mean by a lib _(or library)_.
Nx libs are not necessarily published to npm or built separately.
They can be just folders with code and generally a single entry point _(e.g. `index.ts`)_ exposing what the library needs to expose.

Back to the initial question, tiny apps that are already well organized might not need to be split into libs, but otherwise, splitting apps into libs is a good idea to get the following benefits:

- Clear separation of concerns,
- Faster linting/testing etc... thanks to Nx caching and parallelization,
- Implementation details stay contained in libs _(i.e. app code is not polluted with implementation details)_,
- Lower risk of cyclic dependencies,
- Embracing change _(e.g. ready to reuse libs in future apps, or just open-source them whenever needed)_,
- You can easily apply a linting rule that enforces architectural styles _(e.g. Tactical DDD, Hexagonal Architecture, ...)_,
- You can use different tooling for different libs in order to transition progressively _(e.g. transitioning from Jest to Vitest)_.

## Creating Libraries

In order to create a new library, you can use the following command:

```sh
nx g lib <library-name>
```

This will usually prompt you to choose the type of library you want to create _(e.g. Angular, React, Nest, Node, ...)_ depending on the Nx plugins available in your workspace.

```
? Which generator would you like to use? …
> @nx/angular:library
  @nx/js:library
  @nx/nest:library
  @schematics/angular:library
```

_You can also skip the prompt by simply specifying the generator you want to use: `nx g @nx/angular:library <library-name>`_

If `<library-name>` is a path, the library will be created in the specified directory, and the last part of the path will be used as the library name:

```sh
nx g @nx/angular:library libs/my-lib
```

will generate the following files:

```
libs/my-lib
├── README.md
├── project.json
├── src
│ ├── index.ts
│ ├── lib
│ │ └── my-lib
│ │ └── my-lib.component.ts
├── tsconfig.json
└── ... (other files)
```

and update the `tsconfig.base.json` which is used by all the projects in the workspace, in order to allow importing the library using the `@myorg/my-lib` path.

```json
{
  ...
  "compilerOptions": {
    ...
    "paths": {
      "@marmicode/my-lib": ["libs/my-lib/src/index.ts"]
    }
  }
}
```

_You can override this behavior using the `--directory` and `--importPath` options._

Note that you can also create a library using the Nx Console and its IDE integrations.
Cf. https://nx.dev/getting-started/editor-setup

:::tip tip: Preview changes
The `--dry-run` option allows you to preview the changes before applying them.

Nx Console will also preview the changes while you are creating the library.

To stay on the safe side, make sure to commit or throw away your changes before creating a library. 😉
:::

## Non-Buildable vs. Buildable vs Publishable libs

There are three types of libraries in Nx: **Non-buildable**, **Buildable**, and **Publishable**.

- **Non-buildable** libraries are just a way to organize code within a workspace.
  - They are the default behavior of the generators.
  - They are meant to be used by other projects in the workspace.
  - They are **not** built separately.
  - They are **not** published to a registry _(e.g. NPM)_.
  - Apps using them will use the source code directly.
- **Buildable** libraries are useful to enable [incremental build](https://nx.dev/recipes/angular/setup-incremental-builds-angular) if needed.
  - They are created by passing the `--buildable` option when generating the library.
  - They are built separately.
  - They are **not** meant to be published to a registry. _(e.g. their `package.json` will usually have the `private` option set to true)_
  - Apps using them should use the built version.
- **Publishable** libraries are meant to be used inside and outside the workspace.
  - They are created by passing the `--publishable` option when generating the library.
  - They are built separately.
  - They are meant to be published to a registry.
  - Apps using them should use the built version.

All these libraries are used similarly within the workspace _(i.e. using the import path defined in the `tsconfig.base.json`: `@marmicode/my-lib`)_.

:::warning
As non-buildable libraries are not built separately, the build behavior will depend on the configuration of the apps using them.

For example, given the following scenario:

- a workspace with two apps **A** and **B** using the same non-buildable library,
- app **A** has `strictNullChecks` enabled,
- app **B** has `strictNullChecks` disabled.

No matter what's in the local `tsconfig.json` of the library itself, the library will be built with `strictNullChecks` enabled when building app **A**, and with `strictNullChecks` disabled when building app **B**.
:::

## Moving code to libraries progressively

Moving code to libraries should be done progressively.

_We will elaborate on this in a future dedicated chapter as you will need a good strategy to avoid cyclic dependencies hell._

:::tip tip: quickly move existing code to a library
Meanwhile, we dive into a migration strategy later, here is a little trick that will help you quickly move existing code to a library.

1. Move the code you want to the desired library folder. _(We recommend using WebStorm for this as it will automatically update the imports in a more reliable way, especially when moving multiple files simultaneously)_

2. Export the desired symbols through the library's `index.ts`. _(e.g. `export * from './lib/my-file.ts';`)_

3. Run the following command to **automagically fix the imports** updated by the IDE in the first step: **`nx run-many -t lint --fix`**

_This will turn imports like this `import { myThing } from '../../../../libs/my-lib/src/lib/my-file';` into `import { myThing } from '@marmicode/my-lib';` thanks to the built-in `@nx/enforce-module-boundaries` eslint rule._
:::

## Additional Resources

- Nx Console: https://nx.dev/getting-started/editor-setup
- Incremental Build: https://nx.dev/recipes/angular/setup-incremental-builds-angular
