---
draft: true
slug: /nx/implicit-libraries
---

# 🚧 Implicit Libraries

## Project Crystal

Since version 18 _(and actually a little before that)_, Nx has been able to infer tasks based on the project structure. This means that Nx plugins can automagically add new targets _(e.g. implicitly add a `test` target with the right configuration when it detects a Vitest configuration file)_. This is called [Project Crystal](https://nx.dev/concepts/inferred-tasks).

## Implicit Libraries

### The Boilerplate Problem

A common drawback when creating libraries is the boilerplate. Even though they are generally generated and taken care of by Nx _(using [generators](../06-glossary.md#generators) and [migrations](../06-glossary.md#migration))_, it can clutter the workspace and add some cognitive load.

Here is a typical non-buildable library structure:

```sh
libs/web/catalog/ui
├── .eslintrc.json
├── README.md
├── project.json
├── src
│   ├── index.ts
│   ├── lib
│   │   ├── my-lib.spec.ts
│   │   └── my-lib.ts
│   └── test-setup.ts
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── vite.config.ts
```

### Shared Configuration Files

You will notice that many libraries share similar configuration files. The similarities are often per platform, but there could be other groupings.

Interestingly, most tools provide options that allow us to target specific folders and files _(e.g. `eslint [dir]`, `vitest --root [dir]`, ...)_. This means that we could provide configurations that are shared by multiple libraries but use different options to target specific libraries.

For example, if you [group your libraries per platform](./02-organize-libs.md#file-structure), you could move the configuration files to the common platform folder:

```sh
libs/web
# highlight-next-line
├── .eslintrc.json    👈
├── catalog/ui
│   ├── README.md
│   ├── project.json
│   └── src
│       ├── index.ts
│       └── lib
│           ├── catalog.spec.ts
│           └── catalog.ts
├── cart/ui
│   ├── README.md
│   ├── project.json
│   └── src
│       ├── index.ts
│       └── lib
│           ├── cart.spec.ts
│           └── cart.ts
# highlight-start
├── tsconfig.json      👈
├── tsconfig.lib.json  👈
├── tsconfig.spec.json 👈
└── vite.config.ts     👈
# highlight-end
```

You will need to mainly adjust the paths in the configuration files. Here are some examples:

```diff title=".eslintrc.json"
- "extends": ["../../../.eslintrc.json"],
+ "extends": ["../../.eslintrc.json"]
```

```diff title="tsconfig*.json"
-  "extends": "../../../tsconfig.base.json",
+  "extends": "../../tsconfig.base.json",

- "exclude": ["./vite.config.ts", "src/**/*.spec.ts", "src/**/*.test.ts"]
+ "exclude": ["./vite.config.ts", "**/*.spec.ts", "**/*.test.ts"]
```

:::tip tip: some plugins will still add targets
If you enabled the `@nx/eslint` plugin _(`plugins: ["@nx/eslint/plugin"]` in `nx.json`)_, the `lint` target will be added to both libraries even if there is no eslint configuration file in the library.  
:::

While we could add a `test` target to each library as follows, this would defeat the purpose of implicit libraries.

```ts title="project.json"
"targets": {
  "test": {
    "command": "vitest",
    "options": {
      "cwd": "{projectRoot}",
      "root": "."
    }
  }
}
```

## Additional Resources

- 📝 Inferred Tasks by Nx: https://nx.dev/concepts/inferred-tasks
- 📝 Discovering Nx Project Crystal Magic by Jonathan Gelin: https://jgelin.medium.com/discovering-nx-project-crystals-magic-7f42faf2a135
- 📺 Project Crystal by Nx: https://youtu.be/wADNsVItnsM
