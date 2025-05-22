---
title: Dependency Injection
slug: /angular/dependency-injection
---

Dependency Injection _(DI)_ is one of Angular's core features. It allows you to provide and share services, configuration, or values across your application in a clean, testable way.

## What is Dependency Injection?

Dependency Injection is one way to achieve **Inversion of Control** _(IoC)_.
Inversion of Control is a design pattern that allows you to **decouple the creation of objects from their use**.  
In other words, if `A` depends on `B`:

- `A` will not have to worry about how to create `B`.
- `A` will not have to worry about how to dispose of `B`.
- `A` will not have to worry about whether `B` is an implementation or an abstraction.

With Dependency Injection, the developer and/or the framework provides the dependencies to the dependent object.

## Dependency Injection in Angular

In Angular, Dependency Injection is achieved in two steps:

- **Configuring the dependencies (or services).** These are the recipes for creating the dependencies, as in "if you need a `RecipeRepository` service, here's how to create it".
- **Injecting or wiring the dependencies (or services)** into the dependent objects.

This means Angular is responsible for creating and sharing these dependencies (or services), so you don't have to.

- **Why?**
  - **Reusability:** Services can be shared across components.
  - **Testability:** You can easily swap dependencies for testing.
  - **Inversion of Control:** You can control the behavior of a third-party library by providing your own implementation of one of their dependencies they allow you to override. _(e.g. overriding the way dates are formatted in a date picker)_

## How to define a service?

To define a service, you simply need to add the `@Injectable` decorator.

```ts
import { Injectable } from '@angular/core';

// highlight-next-line
@Injectable()
export class RecipeRepository {
    searchRecipes(query: string) {
        ...
    }
}
```

:::warning `@Injectable()` is necessary even if it can work without it in some cases
Angular does not technically require the `@Injectable()` decorator to make the service injectable.

The decorator actually allows the service to inject other services itself.
:::

## How to inject a service?

You can inject the service into a component or another service using the `inject()` function.

:::warning `inject()` only works in an Injection Context

`inject()` can only be used in an [Injection Context](https://angular.dev/guide/di/dependency-injection-context).

In short, it only works in constructors or inside some callbacks of specific Angular functions such as route guards.
:::

```ts
import { inject, Component } from '@angular/core';

@Component({...})
class RecipeSearch {
    // highlight-next-line
    private readonly _repo = inject(RecipeRepository);

    searchRecipes() {
        this._repo.searchRecipes(...);
    }
}
```

`inject(RecipeRepository)` should return an instance of the service.

But in our case, this will fail with the following error:

```txt
NullInjectorError: R3InjectorError(Standalone[RecipeSearch])[RecipeRepository -> RecipeRepository -> RecipeRepository]:
  NullInjectorError: No provider for RecipeRepository!
```

Indeed, we did not provide an implementation of the `RecipeRepository` service.

## Where can you provide services?

Services can be provided at multiple levels, but let's focus on the two most common ones:

- **Application-level:** Provides the service at the root level (i.e. root injector level), which can be done either by:

A. configuring the app's `providers` in `app.config.ts`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    RecipeRepository, // this is a shorthand for the next one
    // or
    { provide: RecipeRepository, useClass: RecipeRepository },
    // or to create the implementation manually or dynamically
    {
      provide: RecipeRepository,
      useFactory: () =>
        inject(Mode) === 'a'
          ? inject(RecipeRepositoryA)
          : inject(RecipeRepositoryB),
    },
    // or if you already have the value for some reason
    { provide: RecipeRepository, useValue: myRecipeRepository },
    // or if you want to reuse an instance of a service that is already there
    { provide: RecipeRepository, useExisting: RecipeRepositoryA },
  ],
};
```

B. or ideally by adding the `providedIn: 'root'` option to the `@Injectable()` decorator:

```ts
@Injectable({ providedIn: 'root' })
export class RecipeRepository {
    ...
}
```

This makes the services accessible by everything in the application — unless shadowed.

:::tip Main advantage of `providedIn: 'root'` is tree-shakability
If you do not use `RecipeRepository`, it will not be bundled in your application.
:::

- **Component-level:**  
  Use the `providers` array in a component. The service is unique to that component and its children — unless shadowed.

```ts
@Injectable({ providedIn: 'root' })
export class RecipeService { ... }
```

## Additional Resources

- 📝 [**Dependency Injection** by Angular](https://angular.dev/guide/dependency-injection)
- 📝 [**`inject()` API** by Angular](https://angular.dev/api/core/inject)
