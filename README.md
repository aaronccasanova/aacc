# aacc

Casa for my packages, projects, and experiments.

## Getting started

- Install dependencies and symlink `apps/*`, `packages/*`, `hooks/*`, etc.

```sh
npm i
```

> Note: Re-run the above command if you add or remove internal dependencies to ensure all
> symlinks are up to date.

- Build all projects

```sh
npm run build
```

- Build a specific project

```sh
npm run build -- --filter=<package-json-name>
```

> See the Turborepo docs for more info on the [--filter syntax](https://turborepo.org/docs/core-concepts/filtering#filter-syntax)

## Local development

Run the `dev` script to start a project and all it's dependencies in watch mode.

```sh
npm run dev -- --filter=@aacc/test-app...
```
