---
title: Property Binding
slug: /angular/property-binding
---

Property binding in Angular lets you set values for child elements' DOM properties or child Angular [components inputs](../../03-component-interaction/02-inputs/index.md), using the `[property]` syntax.

In opposition to [interpolation](../03-interpolation/index.md), property binding can set values for properties that are not strings.

## Example

```ts
@Component({
  selector: 'mc-logo',
  // highlight-next-line
  template: `<img [src]="logoUri" [alt]="name" width="64" height="64" />`,
})
export class Logo {
  readonly logoUri = 'https://marmicode.io/assets/logo.svg';
  readonly name = 'Marmicode';
}
```

Here, `[src]="logoUri"` and `[alt]="name"` are property bindings. Angular will keep the image element properties in sync with the `logoUri` and `name` properties.

## Why use property binding?

- **Any value type**: Bind booleans, numbers, or objects — not just strings. e.g. `[disabled]="isDisabled"`
- **Overrides interpolation**: Property binding takes precedence if both are used.
