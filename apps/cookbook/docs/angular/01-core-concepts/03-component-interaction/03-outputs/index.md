---
title: Outputs
slug: /angular/outputs
---

Data flow is bidirectionnal.
Child components have to notify their parent components when some things happen.

For instance, a rating component could notify its parent component when the rating changes.

To do so, the child component must define an output property.

## How to define component outputs?

Since Angular 17.3, components can define their output using the `output()` function.

```ts
import { output } from '@angular/core';

@Component({
  ...
  template: `@for (level of levels; track level) {
    <mc-rating [rating]="level" (click)="onLevelClick(level)"/>
  }`
})
class CookbookPreview {
  readonly levels = [1, 2, 3, 4, 5];
  readonly ratingChange = output<number>();

  protected onLevelClick(level: number) {
    this.ratingChange.emit(level);
  }
}
```

:::tip
For such a simple use case, you can emit the rating directly in the template: `(click)="ratingChange.emit(level)"`.

That said the `onLevelClick` method makes it easier to add a breakpoint or a log when debugging.
:::

## How to listen to child component outputs?

Child components outputs are emitted using [event binding](../../01-components/05-event-binding/index.md):

```ts
@Component({
  template: `<mc-rating (ratingChange)="onratingChange($event)" />`,
})
class CookbookPreview {
  onratingChange(rating: number) {
    console.log('rating changed', rating);
  }
}
```

## How to migrate legacy `@Output()`?

Before `output()`, components defined their outputs using the `@Output()` decorator.

<div className="bad">

```ts
@Component({...})
class Rating {
  @Output() ratingChange = new EventEmitter<number>();
}
```

</div>

:::tip
You can automatically migrate your legacy `@Output()` to `output()` using the Angular CLI `output-migration` generator:

```sh
nx g @angular/core:output-migration

# or if you are using the Angular CLI
ng g @angular/core:output-migration
```

:::
