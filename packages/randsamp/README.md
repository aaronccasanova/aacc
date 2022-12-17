# randsamp

Randomizes samples from a target directory and hard links them to another

## Usage

```sh
npx randsamp \
	--target ./path/to/target-directory \
	--output ./path/to/output-directory
```

## Options

| Option         | Description                                                | Default  |
| -------------- | ---------------------------------------------------------- | -------- |
| `-t, --target` | The target directory to collect and randomize samples      | Required |
| `-o, --output` | The output directory to hard link the randomized samples   | Required |
| `--ext`        | Comma separated list of extension types to filter          | `.wav`   |
| `--count`      | The number of samples to hard link in the output directory | `128`    |
