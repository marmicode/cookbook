---
title: Forms
slug: /angular/forms
---

import DocCardList from '@theme/DocCardList';

No matter the kind of application you are building, you will need to handle user input, and mostly through forms.

Angular provides two different ways to handle forms _(and maybe soon a third one to rule them all 😊)_:

- [**Reactive Forms**](./01-reactive-forms/index.md)
- [**Template-Driven Forms**](./02-template-driven-forms/index.md) _(You can live a happy life without ever learning about them)_
- _**🚧 Signal Forms:** the third option that the team is currently working on._

## How to choose between the two?

This is a hot topic of discussion in the Angular community, that can trigger passionate debates.

My take which is aligned with the Angular team's vision is that:

- For most **simple use cases**, **Template-Driven Forms** are the easiest way to get started.
- However, for **more control and flexibility** and not necessarily more complexity, **Reactive Forms** are the way to go for the following reasons:
  - Complex forms with Template-Driven Forms require a deep knowledge of Angular forms internals that are barely documented.
  - Reactive Forms are easy to isolate and test without the need to use the DOM.

<DocCardList/>
