/* eslint-disable no-console */
import { table } from 'table'
import chalk from 'chalk'
import figlet from 'figlet'

const input = process.argv[2]

if (typeof input !== 'string') {
  console.log(chalk.red('Please enter a string'))
  process.exit(1)
}

// Extract unique words from input condition
const words = dedupe(
  Array.from(input.matchAll(/\w+/g)).map(([word]) => word ?? ''),
)

if (!words.length) {
  console.log(chalk.red('No words found'))
  process.exit(1)
}

// Build true/false permutations table for each word
const permutations: (boolean | string)[][] = getBinaryPermutations(words.length)

// Evaluate each permutation and update the permutations table
for (const permutation of permutations) {
  const condition = words.reduce<string>(
    // Replace each word with the corresponding true/false permutation
    (newInput, word, i) =>
      newInput.replace(new RegExp(word, 'g'), String(permutation[i])),
    input,
  )

  // eslint-disable-next-line no-eval
  const result: unknown = eval(condition)

  if (typeof result !== 'boolean') {
    console.log(chalk.red('Invalid condition'))
    process.exit(1)
  }

  permutation.push(color(result))
}

const header = figlet.textSync('TRUUU')

// Extract max line length of the header force a minimum table width
const maxHeaderLineLength = header
  .split('\n')
  .reduce((max, line) => Math.max(line.length, max), 0)

const numOfColumns = permutations[0]?.length ?? 1

console.log(
  table(
    [
      // Ex: |           Header                |
      [header, ...Array.from({ length: numOfColumns - 1 })],
      // Ex: | word | word  | word | condition |
      [...words, input],
      // Ex: | true | false | true |   false   |
      ...permutations,
    ],
    {
      // Center all columns by default
      columnDefault: { alignment: 'center' },
      // Span header row across all columns
      spanningCells: [{ col: 0, row: 0, colSpan: numOfColumns }],
      columns: [
        {
          // Set header row width to the max header line length with some padding
          width: Math.floor(maxHeaderLineLength / numOfColumns + 10),
          paddingLeft: 0,
          paddingRight: 0,
        },
      ],
    },
  ),
)

/**
 * Generates all possible permutations of true/false values for a given number of elements.
 */
function getBinaryPermutations(n: number) {
  const binaryPermutations: boolean[][] = []

  for (let i = 0; i < 2 ** n; i += 1) {
    const binary = i.toString(2).padStart(n, '0')
    const permutation = binary.split('').map((bit) => bit === '1')

    binaryPermutations.push(permutation)
  }

  return binaryPermutations
}

function dedupe(arr: string[]) {
  return Array.from(new Set(arr))
}

function color(bool: boolean) {
  return bool ? chalk.green(bool) : chalk.red(bool)
}
