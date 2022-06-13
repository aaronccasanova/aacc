# @AACC

Casa for my packages, projects, and experiments.

## Getting started

- Install dependencies and symlink `packages/*`

```sh
npm i
```

> Note: Re-run the above command if you add or remove `packages/*` to ensure all
> symlinks are up to date.

- Build all `packages/*`

```sh
npm run build
```

## Local development

Run the `dev` script with Turborepo's `--filter=<package-name>...` option to
start a project and all it's dependencies in watch mode.

```sh
npm run dev -- --filter=@aacc/test-app...
```

#### Command history:

```sh
# Add tsconfigs dep to tsc-ts package
npx lerna add @aacc/tsconfigs --scope @aacc/tsc-ts

# Add dev dep to rollup-js package
npx lerna add -D rollup --scope @aacc/rollup-js

# Inspect inferred dependencies from the Turborepo "build" pipeline
npm run build -- --dry-run

# Graph the inferred dependencies from the Turborepo "build" pipeline
npm run build -- --graph

# Check formatting of all packages
prettier --check '**/*.{js,ts,cjs,mjs,jsx,tsx,md}'
```

#### TODO:

- [ ] Add `vite-{ts,js}` package
- [ ] Move TypeScript build and type-check up to the root of the monorepo. AC:
  - [ ] Single `typescript` dependency
  - [ ] Use TypeScript project references
- [ ] Add storybook
- [x] Add `babel-{ts,js}` package
- [x] Add `rollup-{ts,js}` package
- [x] Add `webpack-{ts,js}` package
- [x] Add `esbuild-{ts,js}` package
- [x] Add eslint-config package
- [x] Integrate eslint-config in all packages
- [x] Add prettier-config package
- [x] Integrate prettier-config in all packages
- [x] Add CI workflow
- [x] Move non-npm packages to a `recipes` directory
