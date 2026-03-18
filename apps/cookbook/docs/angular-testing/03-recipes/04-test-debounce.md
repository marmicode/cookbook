---
title: How to Test Debounce Timing
description: Test debounce timing behavior in Angular tests using Vitest fake timers in manual mode to assert that actions fire at the right time.
sidebar_label: How to Test Debounce
sidebar_class_name: new-chapter
slug: /angular/testing/how-to-test-debounce
---

import { CalloutBanner } from '@site/src/components/callout-banner';
import { DocLinkCard } from '@site/src/components/doc-link-card';
import { Stackblitz } from '@site/src/components/stackblitz';

When testing a debounced input, you sometimes need to verify that the debounce **actually waits** before triggering. This recipe shows you how to test the debounce behavior itself using Vitest's fake timers in "manual" mode.

### 🍽️ Before You Start

<DocLinkCard docId="angular-testing/the-sauce/controlling-time-in-tests/index" />

## The Goal

We will take the example of a `CookbookFilterForm` component with a debounced text input — the `filterChange` output is emitted 300ms after the user stops typing.

Let's assume you want to verify that `filterChange` is **not emitted** while the debounce is still pending, and that **it is only emitted after the debounce delay** has passed.

With real timers, there is no reliable way to assert that something has **not** happened yet. You would need to wait "long enough" and hope the debounce hasn't fired — a brittle and slow approach. The alternative is to use **fake timers**.

## 1. Listen to the Component's Output

First, let's create a mount function that we will reuse across the different tests in this file. It mounts the component and listens to the `filterChange` output with a [Vitest spy](https://vitest.dev/api/vi.html#vi-fn).

We use Angular's `outputBinding` to listen to component outputs. _(See [Angular docs](https://angular.dev/guide/components/programmatic-rendering#binding-inputs-outputs-and-setting-host-directives-at-creation))_.

```ts
import { outputBinding } from '@angular/core';

function mountFilterForm() {
  const filterChangeSpy = vi.fn<(filter: Filter) => void>();

  TestBed.createComponent(CookbookFilterForm, {
    bindings: [outputBinding<Filter>('filterChange', filterChangeSpy)],
  });

  return { filterChangeSpy };
}
```

## 2. Enable Fake Timers

To take control of time, replace the real timers with Vitest's fake timers using `vi.useFakeTimers()`. Since the default mode is `manual`, all timers will be paused until you explicitly advance time.

Since fake timers pause **all** timers — including Angular's internal scheduling — you need to call `vi.runAllTimersAsync()` after creating the component to make sure Angular is fully initialized.

:::warning Install fake timers before creating the component
Fake timers must be installed **before** creating the component. Otherwise, you might mix real timers with fake timers and get unexpected behavior.
:::

```ts
async function mountFilterForm() {
  const filterChangeSpy = vi.fn<(filter: Filter) => void>();

  // highlight-next-line
  vi.useFakeTimers();

  TestBed.createComponent(CookbookFilterForm, {
    bindings: [outputBinding<Filter>('filterChange', filterChangeSpy)],
  });

  // highlight-next-line
  await vi.runAllTimersAsync();

  return { filterChangeSpy };
}
```

## 3. Advance Time Manually

Now you can use `vi.advanceTimersByTimeAsync()` to advance time and assert the debounce behavior:

```ts
describe(CookbookFilterForm.name, () => {
  it('does not emit filterChange while debounce is pending', async () => {
    const { filterChangeSpy } = await mountFilterForm();

    await page.getByLabelText('Keywords').fill('Angular Testing');

    // highlight-start
    // Advance by 290ms (debounce duration - 10ms).
    await vi.advanceTimersByTimeAsync(290);
    // highlight-end

    // filterChange has NOT been emitted yet.
    expect(filterChangeSpy).not.toHaveBeenCalled();
  });

  it('emits filterChange after debounce', async () => {
    const { filterChangeSpy } = await mountFilterForm();

    await page.getByLabelText('Keywords').fill('Angular Testing');

    // highlight-start
    // Advance by 310ms (debounce duration + 10ms).
    await vi.advanceTimersByTimeAsync(310);
    // highlight-end

    expect(filterChangeSpy).toHaveBeenCalledExactlyOnceWith({
      keywords: 'Angular Testing',
    });
  });
});
```

:::tip Approximate time, don't match it exactly
You might wonder why we use `290ms` and `310ms` instead of `299ms` and `300ms`. This is because [time is not a precise science](/angular/testing/controlling-time-in-tests#time-is-not-a-precise-science) — nested timers can add extra milliseconds. Using a small margin makes your tests more resilient and a bit more [structure-insensitive](/angular/testing/glossary#structure-insensitive).
:::

:::tip Always use the `Async` suffix
Unless you **really** know what you are doing, always use the async versions like `vi.advanceTimersByTimeAsync` and `vi.runAllTimersAsync`. They flush the microtasks queue and produce a behavior that is more symmetric to production.
:::

## 4. Restore the Real Timers

To avoid affecting other tests, restore real timers after each test. Use Vitest's [`onTestFinished`](https://vitest.dev/api/#ontestfinished) hook to keep setup and teardown colocated.

<div className="good">

```ts
import { onTestFinished } from 'vitest';

describe(CookbookFilterForm.name, () => {
  it('does not emit filterChange while debounce is pending', async () => {
    const { filterChangeSpy } = await mountFilterForm();

    await page.getByLabelText('Keywords').fill('Angular Testing');

    await vi.advanceTimersByTimeAsync(290);

    expect(filterChangeSpy).not.toHaveBeenCalled();
  });

  it('emits filterChange after debounce', async () => {
    const { filterChangeSpy } = await mountFilterForm();

    await page.getByLabelText('Keywords').fill('Angular Testing');

    await vi.advanceTimersByTimeAsync(310);

    expect(filterChangeSpy).toHaveBeenCalledExactlyOnceWith({
      keywords: 'Angular Testing',
    });
  });
});

async function mountFilterForm() {
  const filterChangeSpy = vi.fn<(filter: Filter) => void>();

  vi.useFakeTimers();
  // highlight-start
  onTestFinished(() => {
    vi.useRealTimers();
  });
  // highlight-end

  TestBed.createComponent(CookbookFilterForm, {
    bindings: [outputBinding<Filter>('filterChange', filterChangeSpy)],
  });

  await vi.runAllTimersAsync();

  return { filterChangeSpy };
}
```

</div>

## Get the Full Picture

<CalloutBanner intro='Now you know how to test debounce timing with fake timers.'/>

## Source Code

<Stackblitz
  title="Testing Debounce Timing"
  repo="marmicode/cookbook-angular-testing-demos"
  file="apps/demo/src/app/debounce/cookbook-filter-form.browser.spec.ts"
  initialPath="/__vitest_test__/"
/>
