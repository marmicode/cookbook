---
title: Styling
slug: /angular/styling
---

Each Angular component can define its own styles, scoped to that component's template.

## Style Isolation

By default, Angular uses an **emulated encapsulation strategy** to prevent component styles from leaking out or being affected by parent or children component styles. _Each stylesheet rule is prefixed with a unique attribute selector (e.g. `_ngcontent-c0`) and styles are overriden to only apply to elements with that attribute to ensure that the styles are not applied globally._

## Encapsulation Modes

Angular supports two other modes:

- **None**: Styles are global — leak in and out

```ts
@Component({
  encapsulation: ViewEncapsulation.None,
  styles: `...`,
  ...
})
export class ... {}
```

- **ShadowDom**: Uses native Shadow DOM

```ts
@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: `...`,
  ...
})
export class ... {}
```

:::warning
Use **None** with caution — such component would spill out on parents, siblings, and children.
:::

## Dynamic Classes

You can bind to class names dynamically:

```
<h1 [class.favorite]="isUserFavorite">{{ name }}</h1>
```

If `isUserFavorite` is truthy, then the `favorite` class is added to the `<h1>` element.

## Dynamic Styles

You can bind to styles dynamically:

```
<div [style.color]="userFavoriteColor">
  {{ recipe.name }}
</div>
```

:::tip Use unitless binding for styles

Note that you do not have to build unit-aware strings for styles, you can let Angular do the work.

```
<div [style.fontSize.rem]="favoriteFontSize">
  {{ recipe.name }}
</div>
```

:::
