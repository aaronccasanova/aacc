### Initialize project

```sh
npm init
```

### Install typescript

```sh
npm i -D typescript
```

### Install typescript configs

```sh
npm i -D @aacc/tsconfigs
```

### Setup TypeScript configs

Reference local configs:

- `tsconfig.json` serves as the base for both module outputs
- `tsconfig-mjs.json` extends base and is used build to the ESM output
- `tsconfig-cjs.json` extends base and is used to build to CJS output

### Configure package.json

Reference local package.json, specify:

- `main`, `module`, and `types` keys
- conditional `exports` key
- `build`, `add-build-pkgs`, and `type-check` scripts

### References:

- https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
- https://antfu.me/posts/publish-esm-and-cjs

### TODO:

- Read up on pre/post NPM scripts: https://docs.npmjs.com/cli/v8/using-npm/scripts
