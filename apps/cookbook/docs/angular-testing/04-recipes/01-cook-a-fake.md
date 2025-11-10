---
title: How to Cook a Fake
slug: /angular/testing/how-to-cook-a-fake
---

import { Stackblitz } from '@site/src/components/stackblitz';

Let's assume you're working on a cookbook app. You want to test the search UI, which allows users to search for cookbooks by keywords and other filters. The app relies on a `CookbookRepository` service to fetch the cookbooks.

We can break down the process of creating a fake into five steps.

## 1. _[Optional]_ Define or Derive the Interface

First, define the interface shared between the fake and the real service:

```ts
interface CookbookRepository {
  searchCookbooks(keywords: string): Observable<Cookbook[]>;
}
```

:::info Hexagonal Port
This interface is the port in a hexagonal architecture.
:::

Alternatively, you can derive the interface from the service implementation:

```ts
/* Extracts the public properties and methods. */
type Public<T> = Pick<T, keyof T>;

class CookbookRepositoryFake implements Public<CookbookRepositoryImpl> {}
```

:::warning
While deriving the interface is convenient for simple cases, it has some drawbacks:

- It discourages designing the service's API upfront.
- It doesn't ensure the fake depends only on core types, avoiding infrastructure-specific types _(e.g., third-party libraries or remote services)_.
- It creates a direct dependency between the fake and the real service, which can lead to issues in environments where certain dependencies cause problems _(e.g., third-party libraries)_.
  :::

<details>
<summary>**⚖️ Abstraction & Tree-Shakability**: Organizing interfaces, implementations, and providers</summary>

You can use the interface as an injection token by turning it into an abstract class:

```ts
abstract class CookbookRepository {
  abstract searchCookbooks(keywords: string): Observable<Cookbook[]>;
}
```

This allows you to inject it as follows:

```ts
const repo = inject(CookbookRepository);
```

However, this approach requires configuring providers:

```ts
providers: [
  {
    provide: CookbookRepository,
    useClass: CookbookRepositoryImpl,
  },
],
```

In most cases, you will prefer providing the default implementation automatically in the root injector using `providedIn: 'root'` for tree-shakability.

While the following code works:

```ts
@Injectable({
  providedIn: 'root',
  useFactory: () => inject(CookbookRepositoryImpl),
})
abstract class CookbookRepository {
  abstract searchCookbooks(keywords: string): Observable<Cookbook[]>;
}
```

it introduces some caveats:

- It creates a circular dependency between `CookbookRepository` and `CookbookRepositoryImpl`.
- It makes `CookbookRepositoryImpl` a transitive dependency of `CookbookRepositoryFake`.

To avoid these issues, **separate the interface from the abstract class used as the injection token**:

```ts
interface CookbookRepositoryDef {
  searchCookbooks(keywords: string): Observable<Cookbook[]>;
}

@Injectable({
  providedIn: 'root',
  useFactory: () => inject(CookbookRepositoryImpl),
})
abstract class CookbookRepository implements CookbookRepositoryDef {}

@Injectable({ providedIn: 'root' })
class CookbookRepositoryImpl implements CookbookRepositoryDef {
  ...
}

@Injectable()
class CookbookRepositoryFake implements CookbookRepositoryDef {
  ...
}
```

For simpler cases where there is only one implementation and no need for the `CookbookRepository => CookbookRepositoryImpl` indirection:

```ts
interface CookbookRepositoryDef {
  searchCookbooks(keywords: string): Observable<Cookbook[]>;
}

@Injectable({ providedIn: 'root' })
class CookbookRepository implements CookbookRepositoryDef {
  ...
}

class CookbookRepositoryFake implements CookbookRepositoryDef {
  ...
}
```

</details>

## 2. Implement the Fake

```ts
@Injectable()
class CookbookRepositoryFake implements CookbookRepository {
  private _cookbooks: Cookbook[] = [];

  searchCookbooks({ keywords }: { keywords: string }): Observable<Cookbook[]> {
    return defer(async () => {
      return this._cookbooks.filter((cookbook) =>
        cookbook.title.includes(keywords),
      );
    });
  }

  ...
}
```

:::tip
You don't need to implement the entire service — only the methods you actually use. Any others should throw an error if called.
:::

```ts
@Injectable()
class CookbookRepositoryFake implements CookbookRepository {
  private _cookbooks: Cookbook[] = [];

  searchCookbooks({
    keywords,
    difficulty,
  }: {
    keywords: string;
    difficulty?: Difficulty;
  }): Observable<Cookbook[]> {
    return defer(async () => {
      // highlight-start
      if (difficulty != null) {
        throw new Error(
          '🚧 CookbookRepositoryFake#searchCookbooks does not support difficulty filtering yet',
        );
      }
      // highlight-end

      return this._cookbooks.filter((cookbook) =>
        cookbook.title.includes(keywords),
      );
    });
  }

  // highlight-start
  updateCookbook(cookbookId: string, data: Partial<Cookbook>) {
    throw new Error(
      '🚧 CookbookRepositoryFake#updateCookbook is not implemented yet',
    );
  }
  // highlight-end

  ...
}
```

:::info
In contrast to stubs, if the fake is used in an unexpected way _(e.g., calling a not implemented method, passing invalid or unhandled arguments)_, **it will throw an error instead of silently returning `undefined`**.

:::

## 3. Extend the Fake with Testing Utilities

It might be tempting to hardcode some data in the fake, but this approach is inflexible and can result in brittle tests.

Instead, you should provide methods to configure the fake with the data required for your tests, such as `CookbookRepositoryFake#configure`.

If the service mutates its state, consider adding methods to inspect the state of the fake. For example, if the service includes a method like `updateCookbook`, you might want to implement a method such as `CookbookRepositoryFake#getCookbookSync` to verify the current state of the fake.

Only implement these methods when necessary. The goal is to keep the fake as simple and maintainable as possible.

```ts
@Injectable()
class CookbookRepositoryFake implements CookbookRepository {
  private _cookbooks: Cookbook[] = [];

  // highlight-start
  configure({cookbooks}: {cookbooks: Cookbook[]}) {
    this._cookbooks = cookbooks;
  }

  getCookbooksSync(): Cookbook[] {
    return this._cookbooks;
  }
  // highlight-end

  ...
}
```

## 4. Create a Provider Factory

To enhance the developer experience, you can create a provider factory that supplies the fake and replaces the real service.

```ts
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

export function provideCookbookRepositoryFake(): EnvironmentProviders {
  return makeEnvironmentProviders([
    CookbookRepositoryFake,
    {
      provide: CookbookRepository,
      useExisting: CookbookRepositoryFake,
    },
  ]);
}
```

:::tip
With `useExisting`, the same instance of the fake is provided as both `CookbookRepositoryFake` and `CookbookRepository`.

This approach allows you to inject the fake in your tests and use its specific methods without needing to downcast it.

```ts
// ✅
const fake = TestBed.inject(CookbookRepositoryFake);

// ❌
const fake = TestBed.inject(CookbookRepository) as CookbookRepositoryFake;
```

:::

:::tip
Note that the fake is not "provided in root" on purpose so that you do not forget to override the real service in your tests by using the provider factory.
:::

## 5. Use the fake in tests

You can now use the fake in your tests as follows:

```ts
TestBed.configureTestingModule({
  providers: [provideCookbookRepositoryFake()],
});
```

Additionally, fakes can be useful in your app for demos.

## Source Code

<Stackblitz
  title="Angular Testing using a Fake"
  repo="marmicode/cookbook-demos"
  branch="angular-testing"
  file="apps/demo/src/app/fake-it-till-you-mock-it/cookbook-search.spec.ts"
  initialPath="/__vitest__/"
/>
