# Contributing
 
Thank you for considering contributing to the Symfony's Stimulus Bridge! 

The Symfony's Stimulus Bridge is an open source, community-driven project, and we are happy to receive contributions from the community!

> [!TIP]
> It's a good idea to read the [Symfony's Contribution Guide](https://symfony.com/doc/current/contributing/index.html) first, even if not all of it applies here and should be adapted to this project (e.g.: there is a single base branch, `main`).

## Reporting an issue

If you either find a bug, have a feature request, or need help/have a question, please [open an issue](https://github.com/symfony/stimulus-bridge/issues/new/choose).

Please provide as much information as possible,
and remember to follow our [Code of Conduct](https://symfony.com/doc/current/contributing/code_of_conduct/index.html)
as well, to ensure a friendly environment for all contributors.

## Contributing to the code and documentation

Thanks for your interest in contributing to Symfony UX! Here are some guidelines to help you get started.

### Forking the repository

To contribute to Symfony's Stimulus Bridge, you need to [fork the **symfony/stimulus-bridge** repository](https://github.com/symfony/stimulus-bridge/fork) on GitHub.
This will give you a copy of the code under your GitHub user account, read [the documentation "How to fork a repository"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

After forking the repository, you can clone it to your local machine:

```shell
$ git clone git@github.com:<USERNAME>/symfony-ux.git symfony-ux
$ cd symfony-ux
# Add the upstream repository, to keep your fork up-to-date
$ git remote add upstream git@github.com:symfony/stimulus-bridge.git
```

### Setting up the development environment

To set up the development environment, you need the following tools:

- [Node.js](https://nodejs.org/en/download/package-manager) 18 or higher

With these tools installed, you can install the project dependencies:

```shell
$ corepack enable
$ pnpm install
```

### Linking into a Symfony project

To test your changes in a Symfony project, you can link the package into a Symfony project by running the following commands:

```shell
# Execute in the Symfony's Stimulus Bridge repository
npm link

# Execute in the Symfony project
npm link @symfony/stimulus-bridge
```

## Useful Git commands

1. To keep your fork up-to-date with the upstream repository and `main` branch, you can run the following commands:
```shell
$ git checkout main && \
  git fetch upstream && \
  git rebase upstream/main && \
  git push origin main
```

2. To rebase your branch on top of the `main` branch, you can run the following commands:
```shell
$ git checkout my-feature-branch && \
  git rebase upstream/main && \
  git push -u origin my-feature-branch
```