---
title: Reactive Forms
slug: /angular/reactive-forms
---

Reactive Forms are a more programmatic way of defining forms. Therefore, they provide more control and flexibility.

Reactive Forms start with pure TypeScript.

```ts
import { FormControl } from '@angular/forms';

@Component(...)
class RecipeForm {
    // highlight-next-line
    protected readonly titleCtrl = new FormControl<string | null>(null);
}
```

### 1. Create a `FormControl`

The [`FormControl`](https://angular.dev/api/forms/FormControl) has all sorts of methods and properties that allow you to interact with it. Here are some examples:

```ts
class FormControl<T> {
  setValue(value: T): void;
  value: T;
  valueChanges: Observable<T>;
  valid: boolean;
  dirty: boolean;
  ...
}
```

You can then bind the `titleCtrl` to the UI with `formControl` directive.

```ts
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    ...
    // highlight-next-line
    imports: [ReactiveFormsModule],
    template: `
        <form>
            // highlight-next-line
            <input type="text" [formControl]="titleCtrl" />
        </form>
    `
})
class RecipeForm {
    protected readonly titleCtrl = new FormControl<string | null>(null);
}
```

### 2. Things become more interesting with `FormGroup` _(and [friends](https://angular.dev/guide/forms/reactive-forms#classes))_

You can group multiple `FormControl`s together into a `FormGroup`.

:::info Form controls are flexible
It is even possible to nest `FormGroup`s inside each other and create dynamic forms.
:::

```ts
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    ...
    imports: [ReactiveFormsModule],
    template: `
        // highlight-start
        <form [formGroup]="recipeForm">
            <input type="text" formControlName="title" />
            <input type="text" formControlName="description" />
        </form>
        // highlight-end
    `
})
class RecipeForm {
    // highlight-start
    protected readonly recipeForm = new FormGroup({
        title: new FormControl<string | null>(null),
        description: new FormControl<string | null>(null),
    });
    // highlight-end
}
```

### 3. Add a submit event listener

```ts
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    ...
    imports: [ReactiveFormsModule],
    template: `
        // highlight-next-line
        <form [formGroup]="recipeForm" (ngSubmit)="createRecipe()">
            <input type="text" formControlName="title" />
            <input type="text" formControlName="description" />
        </form>
    `
})
class RecipeForm {
    protected readonly recipeForm = new FormGroup({
        title: new FormControl<string | null>(null),
        description: new FormControl<string | null>(null),
    });

    // highlight-start
    createRecipe() {
        console.log(this.recipeForm.value);
        // ^ { title: 'Babaganoush', description: 'Smoky eggplant dip.' }

        this.recipeForm.reset();
    }
    // highlight-end
}
```

:::tip Prefer `ngSubmit` to `submit`

While things might seem to work well with `submit` event, it is better to use `ngSubmit` as they are not triggered exactly at the same time.  
Angular listens to `submit` events and triggers the `ngSubmit` after doing some important internal work such as updating the model.
:::

## Additional Resources

- 📝 [**Reactive Forms** by Angular](https://angular.dev/guide/forms/reactive-forms)
