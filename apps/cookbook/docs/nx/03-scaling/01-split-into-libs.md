---
draft: true
slug: /nx/split-into-libs
---

# 🚧 Split apps into libs

## Do you really need to split apps into libs?

_TL;DR: no, but you probably should!_

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

## Creating libraries

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

## Buildable vs. non-buildable libs

TODO: describe difference between workspace libs and buildable libs and tsconfig behavior not being the same when building an app and what the IDE sees

## Choosing the right granularity

TODO: choosing the right library granularity depending on context

## Moving code to libraries progressively

TODO: describe strategy to split apps into libs progressively
TODO: show tip to fix imports when moving code around
