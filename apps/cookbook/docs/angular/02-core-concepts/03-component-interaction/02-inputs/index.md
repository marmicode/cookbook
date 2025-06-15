---
title: Inputs
slug: /angular/inputs
---

Each component can forward data to its children through **inputs**.

## How to define component inputs?

Since Angular 17.1, components can define their input using the `input()` function.

```ts
import { input } from '@angular/core';

@Component({...})
class Rating {
  // highlight-next-line
  readonly rating = input<number>();
}
```

`input()` returns a readonly signal that can only be set from the parent component.

These inputs are optional, and their default value is `undefined` except if provided like this:

```ts
@Component({...})
class Rating {
  // highlight-next-line
  readonly rating = input(5);
}
```

## How to make them required?

Sometimes, you want to make an input required. For example, you want the parent component to necessarily provide a rating.

In that case, you have to use `input.required()`:

```ts
@Component({...})
class Rating {
  // highlight-next-line
  readonly rating = input.required<number>();
}
```

## How to forward data to a child component?

Parent components forward data to children using [property binding](../../01-components/04-property-binding/index.md):

```ts
@Component({
  // highlight-next-line
  template: `<mc-rating [rating]="rating()" />`,
})
class CookbookPreview {
  readonly rating = signal(3);
}
```

## How to migrate legacy `@Input()`?

Before `input()`, components defined their inputs using the `@Input()` decorator.

<div className="bad">

```ts
@Component({...})
class Rating {
  // highlight-next-line
  @Input() rating: number;
}
```

</div>

:::tip
You can automatically migrate your legacy `@Input()` to `input()` using the Angular CLI `signal-input-migration` generator:

```sh
nx g @angular/core:signal-input-migration

# or if you are using the Angular CLI
ng g @angular/core:signal-input-migration
```

:::
