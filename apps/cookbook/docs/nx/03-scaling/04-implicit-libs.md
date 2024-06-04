---
draft: true
slug: /nx/implicit-libs
---

# 🚧 Implicit libs

## Project Crystal

Since version 18 _(and actually a little before that)_, Nx has been able to infer tasks based on the project structure. This means that Nx plugins can automagically add new targets _(e.g. implicitly add a `test` target with the right configuration when it detects a Vitest configuration file)_. This is called [Project Crystal](https://nx.dev/concepts/inferred-tasks).

## Implicit Libraries

### The Boilerplate Problem

A common drawback when creating libraries is the boilerplate. Even though they are generally generated and taken care of by Nx _(using [generators](../06-glossary.md#generators) and [migrations](../06-glossary.md#migration))_, it can clutter the workspace and add some cognitive load.

Here is a typical non-buildable library structure:

```sh
libs/my-lib
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

## Additional Resources

- 📝 Inferred Tasks by Nx: https://nx.dev/concepts/inferred-tasks
- 📝 Discovering Nx Project Crystal Magic by Jonathan Gelin: https://jgelin.medium.com/discovering-nx-project-crystals-magic-7f42faf2a135
- 📺 Project Crystal by Nx: https://youtu.be/wADNsVItnsM
