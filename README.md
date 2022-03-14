# @AACC

Casa for my packages, projects, and experiments.

## Initial setup (One time)

1. Initialize the repository by installing external dependencies and symlinking internal packages.

```sh
npm run initialize
```

2. Build every package in the monorepo.

```sh
npm run build
```

> Note: Run the following command if you add/remove any internal packages to ensure all symlinks are up to date.

```sh
npm run refresh
```

## Local development

Simply `cd` into the desired package and `npm run dev`

```sh
cd packages/tsc-ts
npm run dev
```

Or use the `lerna run` command at the root of the monorepo.

```sh
npx lerna run dev --scope @aacc/tsc-ts
```

> Note: All `dev` script run the package in watch mode.

---

## Notes

Monorepo architecture was influenced by the following article and repo...

- https://letsdebug.it/post/12-monorepo-with-vue-vite-lerna/?ref=morioh.com
- https://bitbucket.org/letsdebugit/vite-monorepo-example/src/master/package.json

#### Command history:

```sh
# Add tsconfigs dep to tsc-ts package
npx lerna add @aacc/tsconfigs --scope @aacc/tsc-ts
```

#### TODO:

- Add `babel-{ts,js}` package
- Add `rollup-{ts,js}` package
- Add `webpack-{ts,js}` package
