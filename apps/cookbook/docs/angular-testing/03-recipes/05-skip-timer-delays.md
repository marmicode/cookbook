---
title: How to Skip Debounce and Timer Delays
description: Instantly skip debounce, throttle, and other timer delays in Angular tests using Vitest fake timers in "fast-forward" mode.
sidebar_label: How to Skip Timer Delays
sidebar_class_name: new-chapter
slug: /angular/testing/how-to-skip-timer-delays
---

import { CalloutBanner } from '@site/src/components/callout-banner';
import { DocLinkCard } from '@site/src/components/doc-link-card';
import { Stackblitz } from '@site/src/components/stackblitz';

If your components use timer-based delays _(debounce, polling, throttling, etc.)_, tests that do not care about the delay shouldn't have to wait for it. Tests must be [composable](/angular/testing/glossary#Composable) — changing the debounce should not break dozens of other tests.

This recipe shows you how to skip timer delays instantly using Vitest's fake timers.

We will take the example of a debounced search input — the search is triggered 300ms after the user stops typing.

### 🍽️ Before You Start

<DocLinkCard docId="angular-testing/the-sauce/controlling-time-in-tests/index" />

## The Goal

Let's assume that the initial test looks like this:

```ts
it(`filters recipes by author's name`, async () => {
  TestBed.createComponent(CookbookSearch);

  await page.getByRole('textbox', { name: 'Keywords' }).fill('Angular Testing');

  // highlight-start
  /* There should be a single cookbook in the search results. */
  await expect
    .element(page.getByRole('heading'))
    .toHaveTextContent('Angular Testing Cookbook'); // ⏳ Waiting at least 300ms
  // highlight-end
});
```

The problem with this test is that it will be as slow as the debounce delay. It could even become flaky if the debounce delay is too close to Vitest's timeout.

## 1. Enable Fake Timers

To control the time, you have to replace the real timers with Vitest's fake timers using `vi.useFakeTimers()`.

<div className="bad">

```ts
import { vi } from 'vitest';

it(`filters recipes by author's name`, async () => {
  // highlight-next-line
  vi.useFakeTimers();

  TestBed.createComponent(CookbookSearch);

  // highlight-next-line
  await page.getByRole('textbox', { name: 'Keywords' }).fill('Angular Testing'); // ❌ This will timeout.

  await expect
    .element(page.getByRole('heading'))
    .toHaveTextContent('Angular Testing Cookbook');
});
```

</div>

The test will fail with a timeout error such as `TimeoutError: locator.fill: Timeout 896ms exceeded.` because the default tick mode of fake timers is `manual`.
This means that unless you manually advance time, all timers will be paused — including Angular's internal scheduling.

More precisely, this prevents Angular from updating the DOM and setting the `Keywords` label for the input element. Therefore, the test can't find the input.

## 2. Turn On "Fast-Forward" Mode

Instead of manually advancing time and coupling the test to the debounce delay, you can switch to "fast-forward" mode by calling `vi.setTimerTickMode('nextTimerAsync')` _(available since Vitest 4.1.0)_.

What I call "fast-forward" mode is a tick mode for fake timers that automatically advances time on its own. Whenever you schedule a macrotask with `setTimeout`, for example, it will advance time by the amount of the timeout and flush the microtasks queue.

```ts
it(`filters recipes by author's name`, async () => {
  vi.useFakeTimers();
  // highlight-next-line
  vi.setTimerTickMode('nextTimerAsync');

  TestBed.createComponent(CookbookSearch);

  await page.getByRole('textbox', { name: 'Keywords' }).fill('Angular Testing');

  await expect
    .element(page.getByRole('heading'))
    .toHaveTextContent('Angular Testing Cookbook');
});
```

This test will run as fast as if there was no debounce delay.

## 3. Restore the Real Timers

To avoid affecting other tests, restore real timers after each test. Use Vitest's [`onTestFinished`](https://vitest.dev/api/#ontestfinished) hook to keep setup and teardown colocated.
This ensures that real timers are restored whether the test passes or fails, without harming readability with `beforeEach` and `afterEach`.

<div className="good">

```ts
import { onTestFinished } from 'vitest';

describe(CookbookSearch.name, () => {
  it(`filters recipes by author's name`, async () => {
    setUpFastForward();

    TestBed.createComponent(CookbookSearch);

    await page
      .getByRole('textbox', { name: 'Keywords' })
      .fill('Angular Testing');

    await expect
      .element(page.getByRole('heading'))
      .toHaveTextContent('Angular Testing Cookbook');
  });
});

function setUpFastForward() {
  vi.useFakeTimers().setTimerTickMode('nextTimerAsync');
  // highlight-start
  onTestFinished(() => {
    vi.useRealTimers();
  });
  // highlight-end
}
```

</div>

## Get the Full Picture

<CalloutBanner intro='Now you know how to skip timer delays in your tests.'/>

## Source Code

<Stackblitz
  title="Skipping Timer Delays"
  repo="marmicode/cookbook-angular-testing-demos"
  file="apps/demo/src/app/skip-timer-delays/cookbook-search.browser.spec.ts"
  initialPath="/__vitest_test__/"
/>
