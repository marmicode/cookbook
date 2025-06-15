---
title: Interpolation
slug: /angular/interpolation
---

Angular template interpolation _(`{{ ... }}`)_ is the way of telling Angular to use data from the component class in the view.

Angular will keep track of the **expression** inside the curly braces and update the view whenever it considers it necessary.

Back to our previous example:

```ts
@Component({
  selector: 'mc-greetings',
  template: `<h1>Hello, {{ name }}!</h1>`,
})
class Greetings {
  protected readonly name = '👨‍🍳 Younes';
}
```

Here, `{{ name }}` is an interpolation. If the value of `name` changes, Angular will automatically update the displayed text.

This is what we call one-way data binding. It's a binding from the component's state to the view.

:::info Expressions use a limited subset of ECMAScript features
You cannot use more complex ones such as multiple statements or assignments or try/catch blocks etc.
:::

:::tip Keep expressions simple
While expressions are powerful enough to express complex logic — such as `name && (friendlynessFactor ?? 0) > 0.5 ? name : 'Guest'`, I highly recommend to keep them simple and move complex logic out of templates.
:::

## What about security?

The results or expressions are HTML-escaped, therefore they are safe by design.

The following example:

```ts
@Component({
  selector: 'mc-greetings',
  template: `<h1>Hello, {{ name }}!</h1>`,
})
class Greetings {
  protected readonly name = '<b>👨‍🍳 Younes</b>';
}
```

will produce the following output:

```html
<h1>Hello &lt;b&gt;👨‍🍳 Younes&lt;/b&gt;!</h1>
```

:::warning 🔒 HTML-Escaping won't always save you
Interpolation does HTML-escaping, but depending on the context, you might need a different escaping.

Given the following **unsafe example**:

```ts
@Component({
  selector: 'mc-user-profile-link',
  template: `<a href="https://my-app.marmicode.io/users/{{ userId }}"
    >Go to profile</a
  >`,
})
class UserProfileLink {
  /* 👹 Assuming `userId` is somehow controlled by the attacker.. */
  protected readonly userId =
    '../redirect?url=https://evil.marmicode.io/gotcha';
}
```

The result will be:

```html
<a
  href="https://my-app.marmicode.io/users/../redirect?url=https://evil.marmicode.io/gotcha"
  >Go to profile</a
>
```

Clicking on the link will redirect the victim to `https://evil.marmicode.io/gotcha`.
:::

:::tip Escape depending on the context and prefer property binding

It is up to you to escape uncontrolled data when used in non-HTML contexts.

```ts
@Component({
  selector: 'mc-user-profile-link',
  template: `<a href="https://my-app.marmicode.io/users/{{ userId }}"
    >Go to profile</a
  >`,
})
class UserProfileLink {
  /* 👹 Assuming `userId` is somehow controlled by the attacker.. */
  protected readonly userId = encodeURIComponent(
    '../redirect?url=https://evil.marmicode.io/gotcha',
  );
}
```

Also, prefer [property binding](../04-property-binding/index.md) over interpolation when applicable.

```ts
@Component({
  selector: 'mc-user-profile-link',
  template: `<a [href]="getProfileUrl()">Go to profile</a>`,
})
class UserProfileLink {
  /* 👹 Assuming `userId` is somehow controlled by the attacker.. */
  protected readonly userId = encodeURIComponent(
    '../redirect?url=https://evil.marmicode.io/gotcha',
  );

  getProfileUrl() {
    return `https://my-app.marmicode.io/users/${encodeURIComponent(this.userId)}`;
  }
}
```

This avoids simplifies the template, and guarantees proper escaping.
:::
