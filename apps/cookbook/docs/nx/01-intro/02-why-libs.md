---
title: Why libs?
description: Do we really need to split apps into libs?
---

# Do we really need to split apps into libs?

:::note
**TL;DR: no, but you probably should!**
:::

First, let's clarify what we mean by a lib _(or library)_.
Nx libs are not necessarily published to npm or built separately.
They can be just folders with code and generally a single entry point _(e.g. `index.ts`)_ exposing what the library needs to expose.

Back to the initial question, tiny apps that are already well organized might not need to be split into libs, but otherwise, splitting apps into libs is a good idea to get the following benefits:

- Clear separation of concerns,
- Faster linting/testing etc... thanks to Nx caching and parallelization,
- Implementation details stay contained in libs _(i.e. app code is not polluted with implementation details)_,
- Lower risk of cyclic dependencies,
- Embracing change _(e.g. ready to reuse libs in future apps, or just open-source them whenever needed)_,
- We can easily apply a linting rule that enforces architectural styles _(e.g. Tactical DDD, Hexagonal Architecture, ...)_,
- We can use different tooling for different libs in order to transition progressively _(e.g. transitioning from Jest to Vitest)_.
