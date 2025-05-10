---
title: Loops
slug: /angular/loops
---

You will often need to display lists — such as recipes or ingredients. Angular’s `@for` block is the declarative way to do that.

## Example

```
@for (recipe of recipes; track recipe.id) {
  <mc-recipe-preview [recipe]="recipe" />
}
```

:::info
Angular has to track items to optimize DOM updates.

In opposition to the old [`*ngFor`](https://angular.dev/api/common/NgFor) directive, the new `@for` block requires you to specify how to track each item.
:::

:::tip Tracking by index
If you want to track items by their index, because they don't have an `id` and reference equality is not enough, you can use the `$index` variable:

```
@for (ingredient of recipe.ingredients; track $index) {
  <li>{{ ingredient }}</li>
}
```

:::

## Contextual Variables

You will often need to display item numbers or use odd/even styles. That's why the `@for` block provides [contextual variables](https://angular.dev/api/core/@for#index-and-other-contextual-variables):

- `index` — the current item's index,
- `first` — `true` if the current item is the first one,
- `last` — `true` if the current item is the last one,
- `even` — `true` if the current item's index is even,
- `odd` — `true` if the current item's index is odd.

These variables can be used like this:

```
@for (step of recipe.steps; track $index) {
  <li>#{{ $index + 1 }}. {{ step.description }}</li>
}
```

## Empty Lists

`@for` supports `@empty` block to handle the case where the list is empty:

```
@for (step of recipe.steps; track $index) {
  <li>#{{ $index + 1 }}. {{ step.description }}</li>
} @empty {
  <p>No ingredients.</p>
}
```

:::tip `@empty` vs HTML Semantics
In most cases, you will want to loop inside a container element, like `ul` or `ol`, while displaying the empty error message outside of it. In that case, prefer using an `@if` block instead of violating HTML semantics.

```
<ul>
  @for (step of recipe.steps; track step.id) {
    <li>#{{ $index + 1 }}. {{ step.description }}</li>
  }
</ul>

@if (recipe.steps.length === 0) {
  <p role="alert" aria-live="polite">No recipes found.</p>
}
```

:::

<!-- Empty States

You can handle the case where the list is empty using @empty:

@for (meal of mealPlan; track meal.id) {
<mc-meal-card [meal]="meal" />
} @empty {

  <p>Your meal planner is empty. Add a recipe to get started.</p>
} -->
