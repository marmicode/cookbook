---
title: Hierarchy
slug: /angular/hierarchy
---

As mentioned in the [Why Components](../../01-components/01-why-components/index.md) chapter, your application is real estate.
Each component can rent a part of its real estate to child components.

Many questions can arise then. Let's focus on the following:

- How do we split the components?
- What are their respective responsabilities?

## How does it work?

A component can reuse another component by importing it and using its selector in the template:

```ts
@Component({
  ...
  imports: [Rating],
  template: `<mc-rating/>`
})
class CookbookPreview {}
```

:::tip
Do not bother importing components manually in the `imports` array.

In most cases, your IDE should do it for you when you use the component in the template.
:::

## The different types of components

It is common to split components into two categories:

- **Container** components: they are responsible for orchestrating the data, business logic, and the presentation.
- **Presentational** components: they are responsible for the presentation of the data that container components provide. This makes them more reusable.

| Type               | Responsabilities                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Container**      | <ul><li>Orchestration.</li><li>Interacting with business logic Services _(such as one that fetches data from a server)_.</li></ul> |
| **Presentational** | <ul><li>UI.</li><li>Styling.</li><li>Interaction with "utilitarian" Services _(such as a price formatter)_.</li></ul>              |

:::note What is a service?
Services are nothing more than reusable TypeScript classes that you can call from components.

We dive into the [Dependency Injection](../../05-dependency-injection/index.md) chapter.
:::

:::tip Some container components can reuse each other

**Container components can reuse some other container components** to avoid the "fat tree" problem — a single container component with many presentation children.

**Presentational components** are also allowed to reuse each other.
:::

🤔 Now you are wondering how these components interact.
That's what we cover in the [next chapter](../02-inputs/index.md).
