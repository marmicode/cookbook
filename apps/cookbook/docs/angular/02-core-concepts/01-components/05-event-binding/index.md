---
title: Event Binding
slug: /angular/event-binding
---

Event binding in Angular lets your components respond to user actions and browser events, using the `(event)` syntax.

## Example

Here is a component that collects recipes by drag-and-dropping them:

```ts
@Component({
  selector: 'mc-recipe-collector',
  template: `
    <h1>Drag and drop your recipes below</h1>
    <div
      aria-label="Recipe drop zone"
      role="region"
      // highlight-next-line
      (drop)="logRecipe($event)"
    >
      <p>Drop your recipes here</p>
    </div>
  `,
})
class RecipeCollector {
  // highlight-start
  logRecipe(event: Event) {
    console.log(event.dataTransfer?.files);
  }
  // highlight-end
}
```

Here, `(drop)="logRecipe($event)"` is an event binding. When the user drops a recipe file, Angular calls the `logRecipe()` method on your component. You can bind to any standard DOM event _(like `click`, `input`, `keyup`)_.
