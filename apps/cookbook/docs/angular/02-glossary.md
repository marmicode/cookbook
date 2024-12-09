---
title: Glossary
slug: /angular/glossary
---

## 3X

Explore, Expand, and Extract are the three phases of software development that Kent Beck extracted from his time working at Facebook. _Cf. [The Product Development Triathlon](https://medium.com/@kentbeck_7670/the-product-development-triathlon-6464e2763c46) and [3X Explore, Expand, Extract • Kent Beck • YOW! 2019](https://www.youtube.com/watch?v=lOcXdXRxFgA)_

## Affected Tests

Affected tests are tests that are impacted by a change in the codebase. By running only the affected tests, developers can get faster feedback on the changes they have made. This can be achieved using features like [Nx Affected Graph](https://nx.dev/ci/features/affected#run-only-tasks-affected-by-a-pr) and/or [Vitest's `changed` option](https://vitest.dev/guide/cli.html#changed).

## Canary Release

Canary release is a technique used to reduce the risk of introducing a new feature or change to a large audience. By releasing the change to a small subset of users first, the team can monitor the impact and gather feedback before rolling out the change to the entire user base.

## Cognitive Load

Cognitive load refers to the amount of mental effort required to complete a task. In the context of testing, tests with high cognitive load can be difficult to understand and maintain, leading to decreased productivity and increased risk of errors.

## Design Doc

A design document outlines the design of a feature or system. It typically includes information about the problem being solved, the non-goals, the proposed solution, the alternative solutions, the trade-offs involved, and any other relevant details. Design docs can help teams align before diving into the implementation.

## Dogfooding

Dogfooding is the practice of using your own product or service internally before releasing it to the public. _([Rumor](https://www.nytimes.com/2022/11/14/business/dogfooding.html) has it that an executive of Whiskas would eat their dog food during shareholder meetings to prove its quality.)_

## eXtreme Programming _(XP)_

eXtreme Programming is a lightweight software development methodology that hasn't sold its soul to the devil of certification-driven business models.

## False Negative

A false negative is a test that did not detect a bug or issue that it should have detected.

## False Positive

A false positive is a test that reported a bug or issue that does not exist.

## Humans

Creative creatures that are bad at repetitive tasks like regression testing.

## Isolation Modes

Isolation modes refer to the different ways in which test files can be isolated from each other during execution. Vitest offers multiple isolation modes, including VM, threads, forks, and no isolate, allowing developers to choose the best trade-off between isolation and performance.

## Narrow Tests

Narrow tests are tests that are fast, easy to isolate and parallelize, and have a low cognitive load. They provide quick feedback and are designed to be run frequently during development.

Cf. [Narrow Tests Definition](./01-testing/01-beyond-unit-vs-integration/index.mdx#narrow-tests)

## Over-Specification

Over-specification occurs when tests are too tightly coupled to the implementation details of the System Under Test. This can make tests brittle and hard to maintain, as any changes to the implementation will require corresponding changes to the tests.

## Precise Tests

Precise tests are tests that are specific and focused on a single aspect of the System Under Test. They should be easy to understand and provide clear feedback when they fail.

_Cf. [Test Desiderata's Specific](#specific)_

## Symmetric to Production

Symmetric to production refers to the similarity between the test environment and the production environment. By making the test environment as close to production as possible, developers can increase the likelihood that the tests will catch issues before they reach users.

## System Under Test _(SUT)_

The System Under Test is the code or system that is being tested. It is the part of the codebase that is the focus of the test.

## Test Desiderata

Originally defined by Kent Beck, [Test Desiderata](https://testdesiderata.com/) is a set of properties we wish for our tests to have. The challenge is that some of these properties are incompatible with each other by nature, which means that we have to make trade-offs when designing our tests.

#### Isolated

Tests should return the same results regardless of the order in which they are run.

#### Composable

I should be able to test different dimensions of variability separately and combine the results.

#### Deterministic

If nothing changes, the test result shouldn’t change.

#### Fast

Tests should run quickly.

#### Writeable

Tests should be cheap to write relative to the cost of the code being tested.

#### Readable

Tests should be comprehensible for the reader, invoking the motivation for writing this particular test.

#### Behavioral

Tests should be sensitive to changes in the behavior of the code under test. If the behavior changes, the test result should change.

#### Structure-Insensitive

Tests should not change their result if the structure of the code changes.

#### Automated

Tests should run without human intervention.

#### Specific

If a test fails, the cause of the failure should be obvious.

#### Predictive

If the tests all pass, then the code under test should be suitable for production.

#### Inspiring

Passing the tests should inspire confidence.

## Test-Driven Development _(TDD)_

Test-Driven Development _(TDD)_ is a software development process that relies on the repetition of a very short 3-phase development cycle: first, the developer writes an _(initially failing)_ test that defines a desired behavior, then produces the minimum amount of code that makes that test pass, and finally tidies up the new code to acceptable standards.

## Test Doubles

Test doubles are implementations used in place of real dependencies in tests. They can be used to simulate the behavior of real implementations and isolate the System Under Test from its dependencies. There are several types of test doubles, including dummies, stubs, spies, mocks, and fakes.

## Vitest

Vitest is a modern testing framework for JavaScript that is designed to be fast and flexible. It supports ECMAScript modules (ESM) out of the box and offers multiple isolation modes. Vitest provides a rich API for writing tests and is gaining traction in the Angular community as an alternative to Jest & Karma.

## Wide Tests

Wide tests are tests that are slower, harder to isolate, or have a higher cognitive load compared to Narrow tests. While sacrificing some of the properties of Narrow tests, Wide tests can provide a higher level of confidence by being more production-symmetric. They are useful for catching issues that narrow tests might miss.

Cf. [Wide Tests Definition](./01-testing/01-beyond-unit-vs-integration/index.mdx#wide-tests)