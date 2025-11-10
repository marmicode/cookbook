---
title: How to Progressively Migrate to Vitest Browser Mode
sidebar_label: How to Migrate to Browser Mode
slug: /angular/testing/how-to-migrate-to-vitest-browser-mode
---

When using Vitest with the Angular CLI, the default behavior is to use an emulated environment. Either `jsdom` or `happy-dom` depending on the first dependency that is available.

In this mode, you can only interact with the DOM through DOM APIs such as: `document.querySelector('button').dispatchEvent(new Event('click'))`
... or through wrappers such as `@testing-library/user-event` that provide a much more convenient API which also produces more realistic behavior such as:

- mousedown
- mouseup
- click
  etc...

TODO: example

## 1. Migrate to "Partial" Browser Mode

To enable browser mode in Angular CLI, one has to add the following configuration:
`{}`

After enabling this, the tests will run in the browser.
Angular CLI will automatically either use playwright or webdriverio as the Vitest browser provider depending on which package is installed in your workspace.

At this stage, you can already start using the `expect.element` API to assert on the DOM.
Note that the true power of the `expect.element` API is revealed when combined with the `page` and `Locator` APIs. Cf. [Migrate to "Full" Browser Mode with `page` API](#3-migrate-to-full-browser-mode-with-page-api)

## 2. Migrate to "Full" Browser Mode with `userEvent` adapter

Vitest provides a `userEvent` adapter that has the same API as `@testing-library/user-event` but is actually using the browser provider under the hood.

This means that if your tests are already using `@testing-library/user-event`, you just have to replace the import of `@testing-library/user-event` with `vitest/browser` and your tests will start interacting with the DOM through the browser provider. You get actionability checks for free.

TODO: example

## 3. Migrate to "Full" Browser Mode with `page` API

For a better testing experience, Vitest provides a `page` API that aligns with the Playwright API.

This make tests more readable and easier to write:

TODO: Example (show diff between userEvent and page API)

Note that the `page` API methods return a `Locator` object that provides a fluent API to interact with the DOM.
TODO: Example

You can see the `Locator` as the "recipe" of how to find that element in the DOM. Is is the action (e.g. `click`) that will try to find the element in the DOM.

When using the `Locator` with the `expect.element` API, Vitest will also keep retrying to find the element and asserting until it passes or the timeout is reached.

This means that if you are a testing library user, you will not have to hesitate between `getBy` vs. `queryBy` vs. `findBy` etc... anymore.
