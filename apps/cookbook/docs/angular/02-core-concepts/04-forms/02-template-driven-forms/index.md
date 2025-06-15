---
title: Template-Driven Forms
slug: /angular/template-driven-forms
---

## How it works

:::info Browser's default form behavior
By default — without importing `FormsModule` — forms keep the default behavior of the HTML form elements.  
In other words, they will generally submit and cause a page reload.
:::

The main building blocks for Template-Driven Forms are:

- `FormsModule`
- `ngModel` directive

### 1. Import the `FormsModule`

The first step is to import the `FormsModule` in each component using the `<form>` tag or the `ngModel` directive.

```ts
import { FormsModule } from '@angular/forms';

@Component({
    ...
    // highlight-next-line
    imports: [FormsModule],
    template: `<form>...</form>`
})
class RecipeForm {}
```

Then you can start using the `ngModel` directive to bind any **signal** — or property if you really have to — to a form control _(e.g. input)_.

```ts
@Component({
    ...
    template: `
        <form>
            // highlight-next-line
            <input type="text" name="name" [(ngModel)]="title" />
        </form>
        <hr>
        <p>Title: {{ title() }}</p>
    `
})
class RecipeForm {
    protected readonly title = signal<string | null>(null);
}
```

### 2. Bind the `ngModel` directive to the form control

Whenever the input changes, it will update the `title` signal, and propage the changes in the application.

:::info `[(ngModel)]` is a shorthand for `[ngModel]` and `(ngModelChange)`

Whenever a component has an output with the same name as the input and the `Change` suffix, two-way binding (i.e. `[()]` _banana in a box_) shorthand becomes possible.

In this specific case:

- `[ngModel]` is used to bind the value of the input to the `title` signal.
- `(ngModelChange)` is used to update the `title` signal when the input changes.

```ts
<input type="text" name="name" [ngModel]="title()" (ngModelChange)="title.set($event)" />
```

:::

### 3. Add a submit event listener

```ts
@Component({
    ...
    template: `
        // highlight-next-line
        <form (ngSubmit)="createRecipe()">
            <input type="text" name="name" [(ngModel)]="title" />
            // highlight-next-line
            <button type="submit">Submit</button>
        </form>
        <hr>
        <p>Title: {{ title() }}</p>
    `
})
class RecipeForm {
    protected readonly title = signal<string | null>(null);

    // highlight-start
    createRecipe() {
        console.log('creating recipe with title:', this.title());
        ...
    }
    // highlight-end
}
```

:::tip Prefer `ngSubmit` to `submit`

While things might seem to work well with `submit` event, it is better to use `ngSubmit` as they are not triggered exactly at the same time.  
Angular listens to `submit` events and triggers the `ngSubmit` after doing some important internal work such as updating the model.
:::

## Additional Resources

- 📝 [**Template-Driven Forms** by Angular](https://angular.dev/guide/forms/template-driven-forms)
