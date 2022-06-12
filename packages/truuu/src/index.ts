#!/usr/bin/env node

/* eslint-disable no-console */
import vm from 'node:vm'

import { table } from 'table'
import chalk from 'chalk'
import figlet from 'figlet'

const input = process.argv[2]

if (typeof input !== 'string') exit('Please enter a JavaScript condition')

// Extract unique identifiers from the input condition
const identifiers = Array.from(
  new Set([...input.matchAll(/\w+/g)].map(([identifier]) => identifier ?? '')),
)

if (!identifiers.length) exit('Error: No variables found in the condition')

// Build a true/false permutations table for each identifier
const permutations: (boolean | string)[][] = getBinaryPermutations(
  identifiers.length,
)

// Evaluate each permutation and update the permutations table
for (const permutation of permutations) {
  const condition = identifiers.reduce(
    // Replace each identifier in the input with the corresponding true/false permutation
    (prevInput, identifier, i) =>
      prevInput.replace(new RegExp(identifier, 'g'), String(permutation[i])),
    input,
  )

  const errorMessage = `Error: Invalid JavaScript condition ${chalk.red(
    `'${input}'`,
  )}`

  try {
    const result: unknown = vm.runInNewContext(condition)

    if (typeof result !== 'boolean') exit(errorMessage)

    permutation.push(result ? chalk.green(result) : chalk.red(result))
  } catch {
    exit(errorMessage)
  }
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
      // Ex: |                    Header                         |
      [header, ...Array.from({ length: numOfColumns - 1 })],
      // Ex: | identifier | identifier  | identifier | condition |
      [...identifiers, input],
      // Ex: |    true    |    false    |    true    |   false   |
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

function exit(message: string): never {
  console.log(message)
  process.exit(1)
}
