---
title: How to Progressively Migrate to Vitest Browser Mode
description: A step-by-step recipe for progressively migrating to Vitest Browser Mode in Angular tests.
sidebar_label: How to Migrate to Browser Mode
slug: /angular/testing/how-to-migrate-to-vitest-browser-mode
---

import { DocLinkCard } from '@site/src/components/doc-link-card';
import { MegaQuote } from '@site/src/components/mega-quote';

### 🍽️ Before You Start

<DocLinkCard docId="angular-testing/ingredients/vitest/browser-mode" />

## 1. Migrate to "Partial" Browser Mode

When using Vitest with the Angular CLI, **the default behavior is to use an [emulated environment](/angular/testing/glossary#emulated-environment)**. Either [JSDOM](https://github.com/jsdom/jsdom) or [Happy DOM](https://github.com/capricorn86/happy-dom) depending on the first dependency that is available.

To **enable browser mode in Angular CLI**, you have to update the `browsers` option to use the browser you want to use:

```ts title="angular.json | project.json"
{
  "test": {
    "builder": "@angular/build:unit-test",
    "options": {
      "runner": "vitest",
      // highlight-next-line
      "browsers": ["Chromium"]
    }
  }
}
```

After enabling this, the tests will run in the browser.
**Angular CLI will automatically either use [Playwright](https://playwright.dev/) or [WebdriverIO](https://webdriver.io/)** as the Vitest browser provider depending on which package is installed in your workspace.

At this stage, the tests are running in the browser but you are not leveraging the full power of the browser provider yet.\
Cf. ["Partial" Browser Mode](/angular/testing/vitest-browser-mode#vitest-partial-browser-mode).

## 2. _[Optional]_ Migrate to "Full" Browser Mode with `userEvent` adapter

If you are already using the [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/) library, you can easily enable the "Full" Browser Mode and features such as actionability checks.

<MegaQuote>
Vitest provides a [`userEvent` adapter](/angular/testing/vitest) that has the same API as `@testing-library/user-event` but is actually using the browser provider under the hood.
</MegaQuote>

This adapter is meant to simplify the migration to "Full" Browser Mode.
To enable it, you just have to replace the import of `@testing-library/user-event` with `vitest/browser` and your tests will start interacting with the DOM through the browser provider:

```diff
import { expect, test } from 'vitest';
- import userEvent from '@testing-library/user-event';
+ import { userEvent } from 'vitest/browser';

test('turn on the stove', async () => {
  TestBed.createComponent(Stove);
  await userEvent.click(await screen.findByRole('button', { name: 'TURN ON' }));
  await expect.poll(() => screen.getByRole('paragraph')).toHaveText('🔥');
});
```

## 3. Migrate to "Full" Browser Mode with `page` API

For a better testing experience, Vitest provides a [`page` API that aligns with the Playwright API](/angular/testing/vitest-browser-mode#vitest-full-browser-mode).\

You can switch to the `page` API by replacing DOM queries with the `page` API, and assertions with the [`expect.element` API](/angular/testing/vitest-browser-mode#expectelement).

```diff
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

test('turn on the stove', async () => {
  TestBed.createComponent(Stove);

- await userEvent.click(await screen.findByRole('button', { name: 'TURN ON' }));
+ await page.getByRole('button', { name: 'TURN ON' }).click();

- await expect.poll(() => screen.getByRole('paragraph')).toHaveText('🔥');
+ await expect.element(page.getByRole('paragraph')).toHaveText('🔥');
});
```

The [`page` API methods return a `Locator` object](/angular/testing/vitest-browser-mode#vitest-full-browser-mode) that does not need to be awaited.

<MegaQuote>
The locator is not querying the DOM, **it is the "recipe" of how to find that element** in the DOM.
</MegaQuote>

:::info

The DOM queries are only performed when:

- an action such as `click` is performed on the locator
- an assertion is performed using `expect.element` on the locator

:::

Thanks to this auto-waiting behavior, you will not rarely have to worry about Angular testing APIs such as `ComponentFixture#whenStable`, nor the differences between Testing Library's `getBy` vs. `queryBy` vs. `findBy` etc... anymore.

:::warning

Once you opt-in to Browser Mode by importing `vitest/browsers`, you will not be able to run these tests in an emulated environment.

Otherwise, you will get an error like this:

```text
Error: vitest/browser can be imported only inside the Browser Mode.
```

:::

## 4. Extending the `Locator` API with provider-specific features

TODO

## Additional Resources

- 📝 [Locator API Docs](https://vitest.dev/api/browser/locators.html)
- 📝 [Assertion API Docs](https://vitest.dev/api/browser/assertions.html)
