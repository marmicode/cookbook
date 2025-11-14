---
title: How to Migrate from Jest to Vitest
slug: /angular/testing/migrating-to-vitest
sidebar_label: How to Migrate Jest to Vitest
toc_max_heading_level: 4
---

# Migrating From Jest to Vitest

## 1.a. 💾 Use Both Jest & Vitest

In the rare occurrence where some tests are too coupled to Jest and hard to automatically migrate to Vitest, you can keep the Jest's configuration files and run some specific tests with Jest and others with Vitest. This will help you migrate progressively. Otherwise, you can simply [remove the Jest setup](#remove-jest).

### Backup Jest's `test-setup.ts` file

```sh
git mv {MY_PROJECT}/src/test-setup.ts {MY_PROJECT}/src/test-setup.jest.ts
```

### Update `jest.config.ts` file

Update the `jest.config.ts` configuration to use the `test-setup.jest.ts` file and match test files ending with `.jest.spec.ts`.

```diff title="jest.config.ts"
- setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
+ setupFilesAfterEnv: ['<rootDir>/src/test-setup.jest.ts'],
+ testRegex: '(/__tests__/.*|(\\.|/)jest\.(test|spec))\\.[jt]sx?$',
```

### Rename `test` Target

Rename the `test` target to `jest` in `project.json` _(if you are using [Nx](https://nx.dev))_ or `angular.json` _(if you are using Angular CLI)_.

```diff title="project.json | angular.json"
  "architect|targets": {
-   "test": {
+   "jest": {
      "builder": "...",
      ...
    }
    ...
  }
```

:::note
You will be able to run the Jest tests with the following command:

```sh
nx jest {MY_PROJECT}

# or

ng run {MY_PROJECT}:jest
```

:::

## 1.b. 🗑️ Remove Jest {#remove-jest}

Remove Jest configuration files:

```sh
rm -f {MY_PROJECT}/jest.config.ts {MY_PROJECT}/src/test-setup.ts
```

Remove the `test` target from `project.json` _(if you are using Nx)_ or `angular.json` _(if you are using Angular CLI)_.

```diff title="project.json | angular.json"
  "architect|targets": {
-   "test": {...}
    ...
  }
```

## 2. 📦 Set Up Vitest

### For Nx Users

If you are using **Nx (>= 20.3.0)**, you can run the following commands to set up Vitest in your Angular project:

```sh
nx add @nx/vite

nx g vitest --project {MY_PROJECT}
```

### For Angular CLI Users

If you are using the **Angular CLI (>= 21.0.0)**, you can use the new `unit-test` builder to set up Vitest in your Angular project.
Otherwise, if you are using an older Angular CLI version or if you want more control over the setup or more Vitest features, you can use [Angular Vitest Generator/Schematic by Analog](https://analogjs.org/docs/features/testing/vitest) to set up Vitest in your Angular project.

#### Using the Angular CLI's `unit-test` builder

Update your `angular.json` file to use the `unit-test` builder:

```diff title="angular.json"
{
  ...
  "targets": {
+   "test": {
+      "builder": "@angular/build:unit-test",
+   }
  }
}
```

:::info
Vitest is the default test runner when using the `unit-test` builder.
:::

#### Using the Angular Vitest Generator/Schematic by Analog

```sh
ng g @analogjs/platform:setup-vitest --project {MY_PROJECT}
```

:::info This is unrelated to Analog
Note that this does not set up anything specific to Analog. It is just a convenient way to set up Vitest in your Angular project.

The Analog team did an outstanding job of making it easy to use Vitest with Angular projects.
:::

### Update `src/test-setup.ts`

You may need to update the `src/test-setup.ts` file to apply whatever previous setup you had in Jest to Vitest.

## 3. 🧳 Migrate Tests

Vitest shares a large API surface with Jest, so most of the tests should work without any changes.
However, if your tests are using Jest-specific APIs _(e.g. `jest.fn()`)_, you may need to update them.

:::tip
In general, I'd recommend staying as decoupled as possible from the testing framework.
For instance, it is better to use fakes than mocks or spies.
Cf. [📺 Fake it till you Mock it](https://youtu.be/YLHXguodICg).
:::

### 🤖 Automatic Migration

There is a [Jest to Vitest codemod](https://github.com/codemod/commons/tree/main/codemods/jest/vitest) that will automatically transform most Jest-specific API usages to their Vitest equivalent.

You can run it with the following command:

```sh
npx codemod jest/vitest -t path/to/the/test/files/you/want/to/migrate
```

The codemod will make transforms such as:

```diff title="my-test.spec.ts"
- test(...);
+ import { test } from 'vitest';
+ test(...);

- jest.mock(...);
+ import { vi } from 'vitest';
+ vi.mock(...);

- jest.fn();
+ import { vi } from 'vitest';
+ vi.fn();
```

It is not exhaustive but should cover most of the common cases and help you migrate faster.

### 👷 Manual Migrations

#### Replace `done` callback with a `Promise`

Vitest does not support the `done` callback. A quick way to migrate this is to wrap the test body in a `Promise` like this.

```diff title="my-test.spec.ts"
- it('should do something', (done) => {
-   // ...
-   done();
- });

+ it('should do something', () => new Promise((done) => {
+   // ...
+   done();
+ }));
```

:::tip
Ideally, the `done` callback pattern should be avoided.

Prefer converting any async code to promises:

```ts
import { lastValueFrom } from 'rxjs';

test('...', async () => {
  const source$: Observable<...> = ...;
  const result = await lastValueFrom(source$);
  expext(result).toEqual(...);
})
```

I'll elaborate on other techniques in a future chapter.
:::

## 4. 🚀 Run Tests

You can run the tests with the following command:

```sh
nx test {MY_PROJECT}

# or

ng test {MY_PROJECT}
```

## 🙋 F.A.Q.

### Nx creates a project with Jest by default. How can I change it to use Vitest?

This happens when the default `unitTestRunner` option is set to `jest` in the `nx.json` file. You can change it to `vitest`:

```diff title="nx.json"
  "generators": {
    "@nx/angular:application": {
      ...
-     "unitTestRunner": "jest"
+     "unitTestRunner": "vitest"
    }
  }
```

### I can't see `vitest` in the list of suggested test runners

The `vitest` option for Angular projects is available in **Nx 20.1.0 or later**.

## 🙀 Common Errors & Issues

### `Error: Expected to be running in 'ProxyZone', but it was not found`

This often happens with tests relying on Angular's `fakeAsync`.

For `fakeAsync` to work, Angular has to monkey patch the `test` function to use zones. Analog's Vitest plugin already does this for you.
This is actually what is happening under the hood in the `@analogjs/vitest-angular/setup-zone` module imported in the `test-setup.ts` file.

This behavior is broken when we import `beforeEach`, `test`, `it`, and others from `vitest` instead of using the global ones that are monkey patched.

To fix this, you will have to remove the import and make sure to use the global functions.

```diff title="my-test.spec.ts"
- import { describe, it } from 'vitest';

describe('...', () => {
  it('...', () => {
    // ...
  });
});
```

:::tip
It is better to avoid using `fakeAsync` and prefer using [Vitest's fake timers](https://vitest.dev/guide/mocking#timers) instead.
:::

### `Error: Cannot set base providers because it has already been called`

Replace:

```ts
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
```

with:

```ts
beforeEach(() => {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
  );
});

afterEach(() => {
  getTestBed().resetTestEnvironment();
});
```
