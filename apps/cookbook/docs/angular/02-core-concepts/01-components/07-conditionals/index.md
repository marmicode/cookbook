---
title: Conditionals
slug: /angular/conditionals
---

[Property binding](../04-property-binding/index.md) and [Event binding](../05-event-binding/index.md) are powerful mechanisms, but you will often need to branch between multiple options.

## `@if`

The `@if` control flow allows you to conditionally display a block of the view based on the truthiness of an expression.

```
@if (name) {
  <h1>Hello, {{ name }}!</h1>
}
```

You can also use `@else` to render a fallback:

```
@if (name) {
  <h1>Hello, {{ name }}!</h1>
} @else {
  <h1>Hello, guest!</h1>
  <a href="/signin">Sign In</a>
}
```

## `@switch`

When you need to branch between multiple options, `@switch` gives you a clean way to avoid deep `@if` nesting:

```
@switch (recipe.difficulty) {
  @case ('easy') {
    <span>🟢 Easy — great for beginners</span>
  }
  @case ('medium') {
    <span>🟠 Medium — some prep involved</span>
  }
  @case ('hard') {
    <span>🔴 Hard — experienced cooks</span>
  }
  @default {
    <span>❓ Unknown difficulty</span>
  }
}
```

:::info
The new control flow syntax _(e.g. `@if/else`, `@switch/case`, etc...)_ are a drop-in replacement for the old microsyntax _(i.e. [`*ngIf`](https://angular.dev/api/common/NgIf), [`*ngSwitch`](https://angular.dev/api/common/NgSwitch), etc...)_.
:::

:::tip
`@switch` is type-safe.

```
@switch (recipe.difficulty) {
  ...
  @case (42) { // ❌ NG8: Type '42' is not comparable to type 'Difficulty'.
    <span>🔑 Secret recipe</span>
  }
  ...
}
```

:::
