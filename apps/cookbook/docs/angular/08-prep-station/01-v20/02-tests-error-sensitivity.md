---
slug: /angular/tests-error-sensitivity
sidebar_label: Tests Error Sensitivity
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { MegaQuote } from '@site/src/components/mega-quote';

# V20 Cranks the Heat on Half-Baked Tests

:::warning
In Angular 20, the [`TestBed`](https://angular.dev/api/core/testing/TestBed) is becoming more error-sensitive.

More specifically, errors thrown in event or output listeners might break your tests.
:::

:::tip TL;DR

1. Add a `ThrowingErrorHandler` to your tests to see if any of your tests will break in v20.
2. If you can't solve the problem, swallow the specific errors with a custom `ErrorHandler`.
   This will help you keep a list of errors to fix later without creating new problems.
3. Avoid disabling `rethrowApplicationErrors` option as this will open the door for even more [false negatives](../../02-glossary.md#false-negative).
   :::

## Previously, in Angular...

### Pre `18.2.0-next.3` Era

Before version 18.2.0-next.3, most errors were ignored by the tests. For instance, the test below would pass, and the error would simply be logged and ignored.

<Tabs>
  <TabItem value="simple" label="Simple Example" default>

<div className="meh">

```ts
@Component({
  template: `
    <p>Welcome {{ name() }}</p>
    <p>You've got {{ notificationCount() }} notifications</p>
  `,
})
class Greetings {
  name = signal('Younes');
  notificationCount() {
    // 🤔 wondering why this would happen in real life?
    // Cf. "Realistic Example" tab ⬆️.
    throw new Error('🔥');
  }
}

const fixture = TestBed.createComponent(Greetings);
await fixture.whenStable();
expect(fixture.nativeElement.textContent).toContain('Welcome');
```

</div>

  </TabItem>
  <TabItem value="realistic" label="Realistic Example">

<div className="bad">

```ts
// Yeah! Our Spying Stub (or "Mock" if you prefer) is properly typed.
// But, oups! We forgot to pre-program  a valid return value for `getNotifications`,
// so it's returning `undefined` instead of an `Observable<Notification[]>`.
const notificationsRepository: Mocked<NotificationsRepository> = {
  getNotifications: vi.fn(),
};

@Component({
  template: `
    <p>Welcome {{ name() }}</p>
    <p>You've got {{ notificationCount() }} notifications</p>
  `,
})
class Greetings {
  name = signal('Younes');

  notificationCount = toSignal(
    inject(NotificationsRepository)
      .getNotifications()
      .pipe(map((notifications) => notifications.length)),
    // ^ TypeError: Cannot read properties of undefined (reading 'pipe')
  );
}

const fixture = TestBed.createComponent(Greetings);
await fixture.whenStable();
expect(fixture.nativeElement.textContent).toContain('Welcome');
```

:::tip
Prefer Fakes to Spying Stubs or "Mocks".
Cf. ["Fake it till you make it" Chapter](../../01-testing/04-fake-it-till-you-mock-it/index.mdx).
:::

</div>

  </TabItem>
</Tabs>

### Post `18.2.0-next.3` Era — The Hidden Flag Episode

A crucial thing in testing is **avoiding false negatives**: tests that pass while they shouldn't.

In Angular 18.2.0-next.3, the Angular Team, and especially [Andrew Scott](https://bsky.app/profile/andrewtscott.bsky.social) started working on **making the TestBed more error-sensitive**.
It started with a [hidden flag](https://github.com/atscott/angular/blob/b422ac4c873095ed3ec32e43b464a365b2ba55f8/packages/core/testing/src/test_bed_common.ts#L78) to increase the error sensitivity on Google's internal codebase.

Interestingly, this broke ~200 tests internally at Google. This clearly highlights that such false negatives are not uncommon. Of course, it is hard to tell whether the components were really broken or not _(e.g. unrealistic data, or unrealistic mocking)_.

### Post `19.0.0-next.0` Era

19.0.0-next.0 introduced the new `rethrowApplicationErrors` option to the `TestBed.configureTestingModule()`. It is set to `true` by default.

This causes the `TestBed` to rethrow the errors that are caught by Angular instead of swallowing them.

:::info
If the error happens while you are waiting for stability with `fixture.whenStable()`, the promise will reject with the error.
:::

### Post `20.0.0-next.5` Era

20.0.0-next.5 went a step further by rethrowing errors coming from event or output listeners.

The following test would now throw an error:

```ts
import { fireEvent, screen } from '@testing-library/dom';

@Component({
  template: `<button (click)="cook()">Cook</button>`,
})
class CookButton {
  private readonly _cooked = signal(false);

  cook() {
    if (this._cooked()) {
      throw new Error('🔥');
    }

    this._cooked.set(true);
  }
}

TestBed.createComponent(CookButton);

const buttonEl = await screen.findByRole('button');

await fireEvent.click(buttonEl);

/* Second click overcooks and throws an error. */
await fireEvent.click(buttonEl);
```

_**Another example**: triggering side-effect events such as `mouseenter` when clicking with [`@testing-library/user-event`](https://testing-library.com/docs/user-event/intro/), and the `mouseenter` listener throws because **some test double is not realistic** (Cf. ["Fake it till you make it" Chapter](../../01-testing/04-fake-it-till-you-mock-it/index.mdx))._

## How to prepare for this change?

### 1. Rethrow errors

To reproduce v20's behavior in v19 — or earlier — and make sure that your tests are not affected, you can implement a custom `ErrorHandler` that rethrows errors instead of swallowing them.

```ts title="src/throwing-error-handler.ts"
@Injectable()
class ThrowingErrorHandler implements ErrorHandler {
  handleError(error: unknown) {
    throw error;
  }
}

function provideThrowingErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ErrorHandler,
      useClass: ThrowingErrorHandler,
    },
  ]);
}
```

```ts title="src/test-setup.ts"
TestBed.configureTestingModule({
  providers: [provideThrowingErrorHandler()],
});
```

### 2. Swallow specific errors if you need more time to fix them

If breaks some tests, and you need more time to fix them, you could make the error handler temporarily ignore the test's specific errors.

```ts title="src/throwing-error-handler.ts"
@Injectable()
class ThrowingErrorHandler implements ErrorHandler {
  private _swallowingPredicates: ((error: unknown) => boolean)[] = [];

  handleError(error: unknown) {
    // highlight-start
    if (this._swallowingPredicates.some((predicate) => predicate(error))) {
      console.warn('ThrowingErrorHandler swallowed error:', error);
      return;
    }
    // highlight-end
    throw error;
  }

  // highlight-start
  swallowError(predicate: (error: any) => boolean) {
    this._swallowingPredicates.push(predicate);
  }
  // highlight-end
}

function provideThrowingErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // highlight-start
    ThrowingErrorHandler,
    {
      provide: ErrorHandler,
      useExisting: ThrowingErrorHandler,
    },
    // highlight-end
  ]);
}
```

```ts title="src/cook-button.spec.ts"
// highlight-start
TestBed.inject(ThrowingErrorHandler).swallowError((error) =>
  error?.message?.includes('🔥'),
);
// highlight-end

TestBed.createComponent(CookButton);

const buttonEl = await screen.findByRole('button');

await fireEvent.click(buttonEl);

await fireEvent.click(buttonEl);
```

### 3. Disable `rethrowApplicationErrors` but keep the `ThrowingErrorHandler`

If you really can't fix the errors by the time you migrate to v20, you can disable `rethrowApplicationErrors` **but keep `ThrowingErrorHandler` to avoid introducing new errors**.

<MegaQuote>
✅ Want more tips on how to write future-proof tests?  
Join my [Pragmatic Angular Testing Course](https://courses.marmicode.io/courses/pragmatic-angular-testing?utm_source=cookbook&utm_medium=in-article&utm_campaign=prep-station-v20&utm_content=flushing-flusheffects).
</MegaQuote>

## Special Thanks

Special thanks to [@AndrewScott](https://bsky.app/profile/andrewtscott.bsky.social) for raising my awareness about this issue while discussing [Flushing `flushEffects`](./01-flushing-flusheffects.md).

## Additional Resources

### Today's Dash: `ThrowingErrorHandler`

_Ready to be Copied, Stirred, and Served._

<div className="good">

```ts
@Injectable()
class ThrowingErrorHandler implements ErrorHandler {
  private _swallowingPredicates: ((error: unknown) => boolean)[] = [];

  handleError(error: unknown) {
    if (this._swallowingPredicates.some((predicate) => predicate(error))) {
      console.warn('ThrowingErrorHandler swallowed error:', error);
      return;
    }
    throw error;
  }

  swallowError(predicate: (error: any) => boolean) {
    this._swallowingPredicates.push(predicate);
  }
}

function provideThrowingErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([
    ThrowingErrorHandler,
    {
      provide: ErrorHandler,
      useExisting: ThrowingErrorHandler,
    },
  ]);
}
```

</div>

### Related Angular PRs

For more detailed understanding, you can dive into the related PRs.

- [PR #60251 - fix(core): Ensure errors in listeners report to the application error](https://github.com/angular/angular/pull/60251)
- [PR #57200 - feat(core): rethrow errors during ApplicationRef.tick in TestBed](https://github.com/angular/angular/pull/57200)
- [PR #57153 - refactor(core): Private option to rethrow ApplicationRef.tick errors in tests](https://github.com/angular/angular/pull/57153)
