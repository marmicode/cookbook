---
slug: /angular/flushing-flusheffects
sidebar_label: Flushing "flushEffects"
---

# V20 Flushes `flushEffects` Down the Sink

:::warning
In Angular 20, [`TestBed.flushEffects()`](https://v19.angular.dev/api/core/testing/TestBedStatic#flushEffects) didn't survive developer preview and has been removed in favor of [`TestBed.tick()`](https://next.angular.dev/api/core/testing/TestBedStatic#tick).
:::

`TestBed.tick()` is **not** a drop-in replacement for `TestBed.flushEffects()` — it does more than just flushing effects. It triggers Angular [synchronization](../../02-glossary.md#angular-synchronization) _(change detection, effects, etc...)_, making tests more symmetric to production, and therefore more reliable.

In most cases, that's an improvement, but some tests with questionable design might break.

:::tip TL;DR

1. [Monkey-patch](#incremental-migration) `TestBed.flushEffects()` **temporarily** and fix broken tests before migrating to v20 and `TestBed.tick()`.
2. Prefer using a utility such as [`runInAngular()`](#run-in-angular) when narrowing down your tests to reactive logic that lives beneath components and services.
3. Think twice before narrowing down your tests to such granularity.
   :::

## `TestBed.tick()` Might Not Be What You Need

Angular's synchronization should be treated as an implementation detail. Tests should generally avoid interfering with it.

Let's start with a typical test using `TestBed.tick()`:

<div className="meh">

```ts
test('Favs auto-saves the favorite recipe in the storage', async () => {
  const storage = TestBed.inject(StorageFake);
  const favs = TestBed.inject(Favs);

  favs.recipe.set('burger');

  TestBed.tick();

  expect(storage.getSync('favorite-recipe')).toBe('"burger"'); // ✅
});

@Injectable({ providedIn: 'root' })
class Favs {
  readonly recipe = signal('babaganoush');
  readonly saving = autoSave('favorite-recipe', this.recipe);
}

function autoSave<T>(key: string, data: Signal<T>) {
  const storage = inject(Storage);
  /* WARNING: as of 20.0.0-rc.0, `resource` is still **experimental**. */
  const syncResource = resource({
    params: data,
    loader: async ({ params: value }) => {
      await Promise.resolve();
      storage.set(key, JSON.stringify(value));
    },
  });
  return syncResource.isLoading;
}
```

</div>

After refactoring our code to wait for some async operation to complete, the test fails because the assertion is made before the microtask is flushed:

<div className="bad">

```ts
test('Favs auto-saves the favorite recipe in the storage', async () => {
  const storage = TestBed.inject(StorageFake);
  const favs = TestBed.inject(Favs);

  favs.recipe.set('burger');

  TestBed.tick();

  // highlight-next-line
  expect(storage.getSync('favorite-recipe')).toBe('"burger"'); // ❌ the microtask was not flushed yet
});

@Injectable({ providedIn: 'root' })
class Favs {
  readonly recipe = signal('babaganoush');
  readonly saving = autoSave('favorite-recipe', this.recipe);
}

function autoSave<T>(key: string, data: Signal<T>) {
  const storage = inject(Storage);
  /* WARNING: as of 20.0.0-rc.0, `resource` is still **experimental**. */
  const syncResource = resource({
    params: data,
    loader: async ({ params: value }) => {
      // highlight-next-line
      await Promise.resolve();
      storage.set(key, JSON.stringify(value));
    },
  });
  return syncResource.isLoading;
}
```

</div>

## Alternatives

### 1. Wait for Stability

Use [`applicationRef.whenStable()`](https://angular.dev/api/core/ApplicationRef#whenStable) to ensure all pending tasks are completed:

<div className="good">

```ts
test('Favs auto-saves the favorite recipe in the storage', async () => {
  const storage = TestBed.inject(StorageFake);
  const favs = TestBed.inject(Favs);

  favs.recipe.set('burger');

  // highlight-next-line
  await TestBed.inject(ApplicationRef).whenStable();

  expect(storage.getSync('favorite-recipe')).toBe('"burger"'); // ✅
});
```

</div>

:::info
Under the hood, [`resource`](https://angular.dev/api/core/resource) tells Angular that it is loading by leveraging the [`PendingTasks`](https://angular.dev/api/core/PendingTasks) service.

If you want the same behavior in your own utilities, you should use `pendingTasks.run()`.
:::

### 2. Polling

Use [Vitest's `expect.poll()`](https://vitest.dev/api/expect.html#poll) — or [Angular Testing Library's `waitFor` utility](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor) for other testing frameworks:

<div className="good">

```ts
test('Favs auto-saves the favorite recipe in the storage', async () => {
  const storage = TestBed.inject(StorageFake);
  const favs = TestBed.inject(Favs);

  favs.recipe.set('burger');

  // highlight-next-line
  await expect.poll(() => storage.getSync('favorite-recipe')).toBe('"burger"'); // ✅
});
```

</div>

:::warning Potential for False Negatives
Polling may seem robust, but it can yield [false negatives](../../02-glossary.md#false-negative): the result might appear valid during a brief window, only to become invalid once the application stabilizes.
:::

## Testing Signal Factories

You will often want to test your signal factories such as `autoSave` without leveraging a component or service.
Given that under the hood, it is using dependency injection, you will have to run it in an injection context.

<div className="meh">

```ts
test('autoSave auto-saves when signal changes', async () => {
  const storage = TestBed.inject(StorageFake);

  const recipe = signal('babaganoush');

  // highlight-next-line
  TestBed.runInInjectionContext(() => autoSave('favorite-recipe', recipe));

  recipe.set('burger');

  await TestBed.inject(ApplicationRef).whenStable();

  expect(storage.getSync('favorite-recipe')).toBe('"burger"'); // ✅
});
```

</div>

To improve readability, you can implement a `runInAngular` utility function:

<div className="good">

```ts
test('autoSave auto-saves when signal changes', async () => {
  const storage = TestBed.inject(StorageFake);

  const recipe = signal('babaganoush');

  // highlight-start
  await runInAngular(() => {
    autoSave('favorite-recipe', recipe);
    recipe.set('burger');
  });
  // highlight-end

  expect(storage.getSync('favorite-recipe')).toBe('"burger"'); // ✅
});

// highlight-start
async function runInAngular<RETURN>(
  fn: () => RETURN | Promise<RETURN>,
): Promise<RETURN> {
  return TestBed.runInInjectionContext(async () => {
    const appRef = inject(ApplicationRef);
    const result = await fn();
    await appRef.whenStable();
    return result;
  });
}
// highlight-end
```

</div>

## Incremental Migration

Before migrating to Angular 20, you can already check whether `TestBed.tick()` breaks anything by monkey-patching `TestBed.flushEffects()`:

```ts title="src/test-setup.ts"
/* DO NOT KEEP THIS. IT'S ONLY FOR MIGRATION PREPARATION. */
import { TestBed } from '@angular/core/testing';

TestBed.flushEffects = () => TestBed.inject(ApplicationRef).tick();
```

In the rare occurrence where switch to `tick()` causes trouble:

1. I'd love to see your tests 😊.
2. You can implement a transitional utility function to avoid the big-bang switch:

```ts
export function triggerTick() {
  TestBed.inject(ApplicationRef).tick();
}
```

You can then incrementally replace calls to `TestBed.flushEffects()` with `triggerTick()` and fix your broken tests before migrating to Angular 20.

Happy migration!

## Today’s Dash: `runInAngular` {#run-in-angular}

_Ready to be Copied, Stirred, and Served._

```ts
async function runInAngular<RETURN>(
  fn: () => RETURN | Promise<RETURN>,
): Promise<RETURN> {
  return TestBed.runInInjectionContext(async () => {
    const appRef = inject(ApplicationRef);
    const result = await fn();
    await appRef.whenStable();
    return result;
  });
}
```

## Related Angular PRs

For more detailed understanding, you can dive into the related PRs.

- [PR #60993 - feat(core): introduce TestBed.tick()](https://github.com/angular/angular/pull/60993)
