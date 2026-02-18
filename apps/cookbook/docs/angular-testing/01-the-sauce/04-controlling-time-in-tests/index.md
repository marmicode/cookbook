---
title: Controlling Time in Tests
description: Understand when and how to use fake timers and dynamic timing configuration to test time-based behavior in Angular components.
slug: /angular/testing/controlling-time-in-tests
toc_max_heading_level: 4
---

import { DocLinkCard } from '@site/src/components/doc-link-card';
import { MegaQuote } from '@site/src/components/mega-quote';

Now that you know how to [replace dependencies with test doubles](/angular/testing/fake-it-till-you-mock-it), let's tackle another common testing challenge: **time**.

Components often have legitimate reasons to rely on time-based behavior:

- _Debouncing or throttling user input_
- _Delaying UI feedback: toast auto-dismiss, loading state minimum duration, etc._
- _Polling_
- _Countdowns_
- _Animations and visual effects_
- _etc._

But when it comes to testing, you'll typically face one of two scenarios:

[**The timing is the behavior under test**](#testing-the-time-based-behavior-itself) — you want to verify that a debounce waits the right amount of time or that a toast disappears after 5 seconds.

[**The timing is just in the way**](#testing-despite-the-time-based-behavior) — the feature you are testing happens to involve a timer, but the timing itself is not what you are verifying. You just need it to get out of the way.

## Testing the Time-based Behavior Itself

The two most common approaches for testing a time-based behavior are:

- [Fake Timers](#fake-timers-in-manual-mode)
- and [Dynamic Timing Configuration](#dynamic-timing-configuration-1)

### Fake Timers in "Manual" Mode

Most testing frameworks provide a way to [monkey patch](/angular/testing/glossary#monkey-patch) the global clock with fake timers.

Vitest is no exception and provides a [`vi.useFakeTimers()`](https://vitest.dev/guide/mocking/timers) method which installs a fake clock that intercepts calls to `setTimeout`, `setInterval`, `requestAnimationFrame`, `Date.now`, etc. _(It is internally powered by the `@sinonjs/fake-timers` library)_

:::info Default behavior of Vitest fake timers is "manual" mode
The default behavior of Vitest fake timers is to pause all timers unless you manually advance the time.
:::
:::warning Side effects of fake timers
A major side effect of using fake timers with "manual" mode is that it will pause all timers, including Angular's internal scheduling.

An example is the following test, which will time out because Angular never gets the chance to become stable:

<div className="bad">

```ts
it('waits for stability forever', async () => {
  vi.useFakeTimers();

  const fixture = TestBed.createComponent(Greetings);

  await fixture.whenStable(); // ❌ This will never resolve and the test will timeout.
});
```

</div>

:::

This means that if you set up fake timers before creating a component, you will have to advance time to make sure that the component is fully initialized and interactive:

```ts
it('flush all timers to make sure the form is interactive', async () => {
  vi.useFakeTimers();

  TestBed.createComponent(CookbookForm);

  // highlight-start
  // Advance all timers before interacting with the form
  // to ensure that the form is fully initialized.
  await vi.runAllTimersAsync();
  // highlight-end

  // ... fill the form ...
});
```

Assuming that we want to test that the form's submit button is disabled while waiting for a **300ms debounce** to finish, we can proceed like this:

```ts
it('disables submit button while waiting for debounce', async () => {
  await mountCookbookForm();

  // ... fill the form ...

  // highlight-start
  // Advance by 290ms (debounce duration - 10ms).
  // 🤔 why 10ms and not 1ms? See the next section.
  await vi.advanceTimersByTimeAsync(290);
  // highlight-end

  // The button is disabled because the debounce is still pending.
  await expect
    .element(page.getByRole('button', { name: 'Submit' }))
    .toBeDisabled();
});

it('enables submit button after debounce', async () => {
  await mountCookbookForm();

  // ... fill the form ...

  // highlight-start
  // Advance by 310ms (debounce duration + 10ms).
  await vi.advanceTimersByTimeAsync(310);
  // highlight-end

  // The button is enabled because the debounce is finished.
  await expect
    .element(page.getByRole('button', { name: 'Submit' }))
    .toBeEnabled();
});

async function mountCookbookForm() {
  vi.useFakeTimers();

  TestBed.createComponent(CookbookForm);

  await vi.runAllTimersAsync();
}
```

:::tip Always use fake timers methods suffixed with `Async`

You might notice synchronous versions of fake timers methods such as `vi.advanceTimersByTime` and `vi.runAllTimers`.

Unless you **really** know what you are doing, like testing Angular's internal scheduling, you should always use the async versions such as `vi.advanceTimersByTimeAsync` and `vi.runAllTimersAsync`.

The async versions produce a behavior that is more symmetric to production because they flush the microtasks queue while the synchronous versions can produce a behavior that is impossible with real timers.

:::

:::warning Do not install fake timers in the middle of the test

While it can be tempting, **do not install fake timers in the middle of the test**. Mixing real timers with fake timers is a recipe for disaster.

<div className="bad">

```ts
it('disables submit button while waiting for debounce', async () => {
  TestBed.createComponent(CookbookForm);

  vi.useFakeTimers(); // ❌ Timers triggered by the component creation will not be intercepted.

  ...
});
```

</div>

:::

#### Time is not a precise science

Even with real timers, timing isn't precise — many factors can affect it.

Fake timers could have been perfectly precise, but in practice, they aren't. For example, when a timer is scheduled within a timer callback, `@sinonjs/fake-timers` will add an additional millisecond. _(Cf. [docs](https://github.com/sinonjs/fake-timers#:~:text=If%20called%20during%20a%20tick%20the%20callback%20won%27t%20fire%20until%201%20millisecond%20has%20ticked%20by), [code](https://github.com/sinonjs/fake-timers/blob/341203310225bf5cd3d7396b2fcf276c5e218347/src/fake-timers-src.js#L645C58-L645C68))_

```ts
it('adds an additional millisecond when a timer is scheduled within a timer callback', async () => {
  vi.useFakeTimers();

  setTimeout(() => {
    console.log('first timeout called');
    setTimeout(() => {
      console.log('second timeout called');
    }, 0);
  }, 0);

  await vi.advanceTimersByTimeAsync(0); // logs "first timeout called"
  await vi.advanceTimersByTimeAsync(0); // does not log anything
  await vi.advanceTimersByTimeAsync(1); // logs "second timeout called"
});
```

Therefore, when using fake timers, you should approximate the time rather than using precise values. Otherwise, tests can be brittle and [structure-sensitive](/angular/testing/glossary#structure-insensitive).
In other words, nesting timers should not break your tests.

#### Restore real timers

To avoid affecting other tests, it is crucial to restore real timers when the test is finished.

Use Vitest's [`onTestFinished`](https://vitest.dev/api/#ontestfinished) hook to keep setup and teardown colocated.
This ensures that real timers are restored whether the test passes or fails, without harming readability with `beforeEach` and `afterEach`.

<div className="good">

```ts
import { onTestFinished } from 'vitest';

it('disables submit button while waiting for debounce', async () => {
  await mountCookbookForm();

  // ... fill the form ...

  // Advance by 290ms (debounce duration - 10ms).
  await vi.advanceTimersByTimeAsync(290);

  // The button is disabled because the debounce is still pending.
  await expect
    .element(page.getByRole('button', { name: 'Submit' }))
    .toBeDisabled();
});

async function mountCookbookForm() {
  vi.useFakeTimers();
  // highlight-next-line
  onTestFinished(() => {
    vi.useRealTimers();
  });

  TestBed.createComponent(CookbookForm);

  await vi.runAllTimersAsync();
}
```

</div>

### Dynamic Timing Configuration {#dynamic-timing-configuration-1}

Another approach is to use dynamic configuration through dependency injection to override the time durations from your tests instead of hardcoding them.

```ts
it('disables submit button while waiting for debounce', async () => {
  TestBed.configureTestingModule({
    // highlight-next-line
    providers: [provideTestingFormsTimingConfig('never-ending-debounce')],
  });

  // ... create component and fill the form ...

  await expect
    .element(page.getByRole('button', { name: 'Submit' }))
    .toBeDisabled();
});

it('enables submit button after debounce', async () => {
  TestBed.configureTestingModule({
    // highlight-next-line
    providers: [provideTestingFormsTimingConfig('instant-debounce')],
  });

  // ... create component and fill the form ...

  await expect
    .element(page.getByRole('button', { name: 'Submit' }))
    .toBeEnabled();
});
```

```ts title="form-timing.config.ts"
@Injectable({ providedIn: 'root' })
export class FormsTimingConfig {
  datepickerDebounce = 1_000;
  inputDebounce = 300;
}

export function provideFormsTimingConfig(
  config: FormsTimingConfig,
): Provider[] {
  return [{ provide: FormsTimingConfig, useValue: config }];
}

const MAX_TIMEOUT = Math.pow(2, 31) - 1;
export function provideTestingFormsTimingConfig(
  mode: 'instant-debounce' | 'never-ending-debounce',
) {
  const debounce = mode === 'instant-debounce' ? 0 : MAX_TIMEOUT;
  return provideFormsTimingConfig({
    datepickerDebounce: debounce,
    inputDebounce: debounce,
  });
}
```

## Testing Despite the Time-based Behavior

Once the time-based behavior is thoroughly tested, you will probably write tests that focus on other behaviors of the exercised code.
As these tests do not care about the time-based behavior itself, they should not be affected by it.

<MegaQuote>Tests should be [composable](/angular/testing/glossary#composable).</MegaQuote>

### Fake Timers in "Fast-Forward" Mode

The problem with using fake timers in "manual" mode is that it couples the test to the time-based behavior.

What if there was a fake timers mode that would advance time on its own, only as fast as needed?

Well, [Andrew Scott](https://github.com/atscott) from the Angular Team put effort into adding this feature to many testing tools out there:

- Jasmine [PR#2042](https://github.com/jasmine/jasmine/pull/2042)
- Sinon.JS [PR#509](https://github.com/sinonjs/fake-timers/pull/509)
- Vitest [PR#8726](https://github.com/vitest-dev/vitest/pull/8726)

_Thank you, Andrew! ❤️_

In Vitest, you can enable the "fast-forward" mode by calling [`vi.setTimerTickMode('nextTimerAsync')`](https://main.vitest.dev/api/vi.html#vi-settimertickmode).

:::info

`vi.setTimerTickMode('nextTimerAsync')` is available since Vitest 4.1.0.

:::

In this mode, the fake timer will automatically advance time by the necessary amount to trigger the next timer.

```ts
it('fast-forwards time', async () => {
  vi.useFakeTimers().setTimerTickMode('nextTimerAsync');

  const start = Date.now();
  // This test would timeout if we used real timers.
  await new Promise((resolve) => setTimeout(resolve, 3_600_000));
  expect(Date.now() - start).toBe(3_600_000);
});
```

:::warning Avoid strict assertions on the elapsed time

As explained [previously](#time-is-not-a-precise-science), the elapsed time can have extra milliseconds due to the way `@sinonjs/fake-timers` work.
:::

Thanks to "fast-forward" mode, you can:

- write tests that focus on other behaviors regardless of any timing-related details such as the debounce,
- make your tests faster than they would be with real timers.

<div className="good">

```ts
it('shows a success toast when the form is submitted', async () => {
  mountCookbookForm();

  await page.getByLabelText('Title').fill('Angular Testing Cookbook');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect
    .element(page.getByRole('status'))
    .toHaveTextContent('Recipe created');
});

function mountCookbookForm() {
  vi.useFakeTimers().setTimerTickMode('nextTimerAsync');
  onTestFinished(() => {
    vi.useRealTimers();
  });

  TestBed.createComponent(CookbookForm);
}
```

</div>

### Dynamic Timing Configuration {#dynamic-timing-configuration-2}

In most cases, allowing tests to [configure the timing](#dynamic-timing-configuration-1) is enough.

:::tip Real-life example
An example of this approach is Angular Material's [`MATERIAL_ANIMATIONS` injection token](https://github.com/angular/components/blob/b09504802e3fa27793ff2ef86d7e62fe22b67c7c/src/material/chips/chip-input.spec.ts#L33), which allows you to disable animations for testing purposes.
:::

## ⚖️ Trade-offs

|                                  | 👍 Pros                                                                                                                                                                       | 👎 Cons                                                                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fake Timers**                  | Full control.                                                                                                                                                                 | Side effects like breaking Angular internals if not used carefully.                                                                                                   |
| **Dynamic Timing Configuration** | No interference with other timers such as Angular's scheduling.<br />Testing-framework agnostic. _(All my thoughts go for those who've been bitten by Angular's `fakeAsync`)_ | Can cause things to run in different order than production.<br /><i>e.g. A form's auto-save and debounce durations order difference between tests and production.</i> |

## Zone.js vs. Zoneless

Since Angular 21, Zoneless mode is the default behavior. However, as I describe in my [Pragmatic Angular Testing course](https://courses.marmicode.io/), even if your app is still Zone-based, **I highly recommend writing Zoneless-ready tests**. That is why everything described in this chapter is Zoneless-ready.

If your tests are passing with Zoneless mode, you can be confident that they will pass with Zone-based mode as well. This helps you stay future-proof and easily switch to Zoneless when the time is right for you.

If for some reason, the exercised code relies on Zone.js, then you should turn on automatic synchronization and make the test behavior more symmetric to production:

```ts
TestBed.configureTestingModule({
  providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
});
```

:::info `ComponentFixtureAutoDetect` vs. `fixture.autoDetectChanges()`
`ComponentFixtureAutoDetect` is similar to calling `fixture.autoDetectChanges()`, but the dependency injection configuration provides a better developer experience as it is easier to factor out.

⚠️ You do **not** need either of these two if you are writing a Zoneless test.
:::

<MegaQuote>Vitest's fake timers are the Zone-agnostic way to control time in tests. This is also a transportable skill that you can reuse beyond Angular.</MegaQuote>

## Decision Tree

```mermaid
flowchart TD
   Q1{"Is it acceptable to affect all timers?"}
   Q2{"Is the<br/><b>time-based behavior</b><br/>the behavior under test?"}

   DTC["⚙️ <b>Dynamic Timing<br/>Configuration</b>"]
   FTFF["⏩ <b>Fake Timers</b><br/>Fast-Forward mode"]
   FTM["🕹️ <b>Fake Timers</b><br/>Manual mode"]

   %% Position DTC to the left.
   DTC ~~~ FTFF

   Q1 -- No --> DTC
   Q1 -- Yes --> Q2
   Q2 -- No --> FTFF
   Q2 -- Yes --> FTM
```

:::tip
While there are valid use cases of switching the tick mode from `manual` to `nextTimerAsync` ("fast-forward" mode) during a test, I would recommend sticking to one mode per test to reduce the cognitive load for both humans and agents.
:::

## Key Takeaways

- ⏱️ **Identify your goal first**: is the time-based behavior the thing you are testing, or is it just in the way?
- 🕹️ **Use fake timers in "manual" mode** when you need to assert precise timing behavior such as debounce or auto-dismiss.
- ⏩ **Use fake timers in "fast-forward" mode** when the timing is irrelevant and you just need it out of the way.
- ⚙️ **Use dynamic timing configuration** when you want to avoid fake timers' side effects on other timers.
- 🔁 **Always restore real timers** with `onTestFinished` to avoid leaking fake timers across tests.
- 🎯 **Approximate time, don't match it exactly** — nested timers add extra milliseconds. Brittle assertions on precise time make tests [structure-sensitive](/angular/testing/glossary#structure-insensitive).
- 🧩 **Stick to one approach per test** to keep the cognitive load low for both humans and agents.

## Additional Resources

- 📝 [**Handling Time and Mock Clocks in Tests** by Andrew Scott (2025)](https://blog.angular.dev/handling-time-and-mock-clocks-in-tests-5a393b32dd30)
- 📝 [**Future of fake timer testing in a zoneless world** GitHub issue by Younes Jaaidi (2024)](https://github.com/angular/angular/issues/55295)

## 🍳 Related Recipes

<DocLinkCard docId="angular-testing/recipes/skip-timer-delays" />
<DocLinkCard docId="angular-testing/recipes/test-debounce" />
