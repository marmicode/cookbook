---
slug: /nx/glossary
---

# Glossary

## Boundaries

Boundaries define conceptual limits of a certain responsibility or concern within a software application. They help to establish clear separation between different parts of the system and promote modularity and maintainability.

## Caching

Nx caching is a feature that speeds up task execution by storing results and when possible _(i.e. inputs haven't changed)_.

## External Dependencies

External dependencies refer to dependencies that are managed by a package manager and are not part of the workspace's source code.

## Generators

Generators are commands that can scaffold new code, or update existing code.

Cf. 📝 [**Generate Code** by Nx](https://nx.dev/features/generate-code)

## Library

A library is either a:

- **non-buildable library**: a folder with code that can be imported by other projects in the workspace through one or multiple entrypoints.
- **buildable library**: a library that can be built separately from the apps that use it. _(this is useful for incremental build)_
- **publishable library**: a library that can be published to a registry _(e.g. NPM)_.

Cf. [**Split Apps into Libs > Non-Buildable vs. Buildable vs. Publishable Libs**](./03-scaling/01-split-apps-into-libs.md#non-buildable-vs-buildable-vs-publishable-libs)

## Migration

Migration generators are special generators that allow Nx plugin authors to provide a way to update existing code and configuration to a new version of the plugin.

Cf. 📝 [**Migration Generators** by Nx](https://nx.dev/extending-nx/recipes/migration-generators)

## Monorepo

A monorepo is a single repository that contains multiple projects or applications.
Unintuitively, monorepos are often easier to manage than polyrepos _(e.g. atomic changes and cross-project changes)_.
While them come with their own set of challenges _(e.g. build times)_, Nx swallows that complexity for you.

Cf. 📺 [**Why Google Stores Billions of Lines of Code in a Single Repository** by Rachel Potvin](https://youtu.be/W71BTkUbdqE)

## Plugin

An Nx Plugin is a package that extends the capabilities of Nx with:

- generators
- executors
- migrations
- inferred tasks
- additional language support for the dependency graph

## Polyrepo

A polyrepo approach is where each project or application is stored in its own separate repository. It is the opposite of a monorepo and offers more flexibility in terms of project organization and independence but it can quickly lead to challenges in terms of code sharing and consistency.

## Project

An Nx Project is either an application or a library _(or an Nx Plugin which is actually a library)_.

## Project Crystal

Project Crystal is a codename for Nx 18 features that leverage task inferrence to provide a more seamless developer experience.

Cf. [Implicit Libraries > Project Crystal](./03-scaling/04-implicit-libs.mdx#project-crystal)

## Single Version Policy

Single Version Policy is a principle where all projects in a workspace use the same version of a dependency.

Cf. [**Single Version Policy** by Nx](https://nx.dev/concepts/decisions/dependency-management#single-version-policy)

Cf. 📺 [**The Diamond Problem** by Rachel Potvin](https://youtu.be/W71BTkUbdqE?t=1155)

## Task

A task is an action that can be performed on a project in an Nx workspace _(e.g. `build`, `lint`, `test`, `codegen`)_. Each project can use a different implementation and configuration for a given task.

## Workspace

An Nx Workspace is nothing more than an Nx repository.
