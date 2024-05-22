---
draft: true
slug: /nx/organize-libs
---

# 🚧 Organize libs

Now that you've decided to split your apps into libraries, you might already have a couple of questions in mind:

- how should we organize these libraries?
- how should we categorize them?
- how should we name them?
- how granular should they be?

While there is no one-size-fits-all answer to these questions, here is some guidance to help you make informed decisions.

## Choosing the right granularity

Deciding on the right granularity for your libraries is crucial: too big, and you lose some of the benefits of splitting your apps into libraries; too granular, and you might introduce useless complexity.

### Too big

Creating excessively large libraries could diminish some of the benefits of splitting apps into libraries:

- It could result in a monolithic library that is challenging to maintain and understand.
- It might not fully leverage Nx's caching and parallelization capabilities.
- Progressive migration could become more difficult (e.g., transitioning from Jest to Vitest, or changing lint or build options).

### Too granular

On the other hand, creating excessively granular libraries might introduce unnecessary complexity:

- It could increase the cognitive load for developers who might struggle to understand the purpose of each library.
- It will require more boilerplate as each new symbol must be re-exported by the library's public API _(i.e. `index.ts`)_ before being used in other apps and libraries.
- It might defeat the purpose of parallelization by over-parallelizing.
- It could lead to highly coupled libraries or libraries that export implementation details.

### The right size

Before deciding on the granularity of your libraries, here are some important factors to consider:

- **Workspace ambitions**: what are the goals of your workspace? Is it a small isolated application that is not meant to last, or is it a long-term product that will evolve over time? Are you planning to merge other repositories into this workspace?
  For instance, in the extreme case where one or two developers are building a small isolated application that is not meant to last, you might not need to split it into libs.

- **Team's experience**: how experienced is your team with the technologies and architectural styles you are using?
  Paradoxically, if the separation of concerns is not natural to your team, creating many libraries with clear and enforced boundaries will help them understand and apply the architecture better.

:::note
While you can always start with relatively large libraries and gradually split them into smaller ones, note that it is generally easier to merge libraries than to split them. 😉
:::

## Library categorization

You are free to organize your libraries in any way that makes sense to you, your team, and your organization.
However, it is essential to define some rules to avoid ending up with a mess of libraries that are hard to understand and maintain.
In addition, this will allow us to leverage certain [Nx features that will enforce these rules](./03-boundaries.md) and assist everyone on the team in following them.

### Tags & Categories

Nx allows us to tag our applications and libraries with custom tags.

These tags can be provided when the application or library is generated using the `--tags` option:

```sh
nx g lib my-lib --tags=my-category
```

or afterwards by updating the `tags` property in the `project.json` file:

```json
{
  "name": "my-lib",
  "tags": ["my-category"],
  ...
}
```

Tags can be used to categorize libraries based on different criteria. This is useful for:

- [enforcing boundaries and architectural rules](./03-boundaries.md),
- or simply running tasks on specific categories of apps and libraries
  _(e.g. `nx run-many -t test --projects=tags:my-category`)_,

### Layered Architecture Style

### Hexagonal Architecture Style

### Tactical DDD's Bounded Contexts

- Multi-dimensional categorization
- Choosing the right types and boundaries depending on context
- Dimensions to consider : platform, scope, type, ..., departments? teams?
- Tactical DDD
- Hexagonal Architecture

## Workspace structure

## Additional resources

- Enterprise Angular: https://www.angulararchitects.io/en/ebooks/micro-frontends-and-moduliths-with-angular/
