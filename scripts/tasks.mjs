/**
 * Convenience utility for running npm scripts
 * for a given package with select Turbo filters.
 *
 * Usage: Run the script and follow the prompts.
 *
 * $ npm run tasks
 */

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

import { globby } from 'globby'
import chalk from 'chalk'
import execa from 'execa'
import prompts from 'prompts'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** Path to the root directory of the monorepo. */
const rootPkgDir = path.join(__dirname, '..')

/** Path to the command history cache. */
const commandHistoryPath = path.resolve(
  rootPkgDir,
  'node_modules/.cache/tasks/history.json',
)

const commandHistoryExists = fs.existsSync(commandHistoryPath)

if (!commandHistoryExists) {
  await fs.promises.mkdir(path.dirname(commandHistoryPath), { recursive: true })
}

const pkgJsonPaths = await globby('**/package.json', {
  cwd: rootPkgDir,
  ignore: ['**/node_modules/**'],
})

/**
 * Mapping of package names and their corresponding script names.
 *
 * @typedef {string[]} ScriptNames
 * @type {{[pkgName: string]: ScriptNames}}
 */
const pkgScripts = {}

await Promise.all(pkgJsonPaths.map(updatePkgScripts))

const selectedPkg = await prompts({
  type: 'select',
  name: 'name',
  message: 'What package would you like to run?',
  choices: [
    commandHistoryExists && { title: 'See command history', value: 'history' },
    ...Object.keys(pkgScripts)
      .sort((a, b) => b.localeCompare(a))
      .map((pkgName) => ({ title: pkgName, value: pkgName })),
  ].filter(Boolean),
})

/**
 * @typedef {{
 *   pkgName: string
 *   scriptName: string
 *   filterDescription: string
 *   command: string
 * }} CommandHistoryEntry
 */

/**
 * @typedef {CommandHistoryEntry[]} CommandHistory
 */

if (selectedPkg.name === 'history') {
  /** @type {CommandHistory} */
  const commandHistory = await getJson(commandHistoryPath)

  const selectedCommandHistory = await prompts({
    type: 'select',
    name: 'index',
    message: 'What command would you like to run?',
    choices: commandHistory.map(
      ({ pkgName, scriptName, filterDescription, command }) => ({
        title:
          chalk.green(`${pkgName} ${scriptName} - ${filterDescription}\n`) +
          chalk.white(`    $ ${command}\n`),
      }),
    ),
  })

  const commandHistoryEntry = commandHistory[selectedCommandHistory.index]

  await updateCommandHistory(commandHistoryEntry)
  await run(commandHistoryEntry.command)
} else {
  const styledPkgName = chalk.green(selectedPkg.name)

  const selectedScript = await prompts({
    type: 'select',
    name: 'name',
    message: `What ${styledPkgName} script would you like to run?`,
    choices: pkgScripts[selectedPkg.name].map((scriptName) => ({
      title: scriptName,
      value: scriptName,
    })),
  })

  const styledScriptName = chalk.blue(selectedScript.name)

  /**
   * A mapping of Turbo filters to apply to the selected script.
   *
   * @typedef {{ filter: string; description: string; }} FilterConfig
   *
   * @type {{ [filterId: string]: FilterConfig }}
   */
  const turboFilters = {
    'no-filter': {
      filter: `--filter=${selectedPkg.name}`,
      description: 'No additional filters',
    },
    'dependencies-include-pkg': {
      filter: `--filter=${selectedPkg.name}...`,
      description: `Include ${styledPkgName} dependencies`,
    },
    'dependencies-exclude-pkg': {
      filter: `--filter=${selectedPkg.name}...`,
      description: `Include ${styledPkgName} dependencies but exclude ${styledPkgName}`,
    },
    'dependents-include-pkg': {
      filter: `--filter=...${selectedPkg.name}`,
      description: `Include ${styledPkgName} dependents`,
    },
    'dependents-exclude-pkg': {
      filter: `--filter=...^${selectedPkg.name}`,
      description: `Include ${styledPkgName} dependents but exclude ${styledPkgName}`,
    },
  }

  const selectedTurboFilter = await prompts({
    type: 'select',
    name: 'id',
    message: `Would you like to add Turbo filters to the ${styledPkgName} ${styledScriptName} script?`,
    choices: Object.entries(turboFilters).map(([filterId, filterConfig]) => ({
      title: filterConfig.description,
      value: filterId,
    })),
  })

  const pkgScriptCommand = `npx turbo run ${selectedScript.name} ${
    turboFilters[selectedTurboFilter.id].filter
  }`

  await updateCommandHistory({
    pkgName: selectedPkg.name,
    scriptName: selectedScript.name,
    filterDescription: turboFilters[selectedTurboFilter.id].description,
    command: pkgScriptCommand,
  })

  await run(pkgScriptCommand)
}

/**
 * Runs and logs the provided command in a child process and
 * configures the process to inherit the parent's stdio.
 *
 * @param {string} command
 */
async function run(command) {
  const label = 'Executing: '
  const divider = '='.repeat(label.length + command.length)

  console.log('\n' + divider)
  console.log(`${label}${chalk.green(command)}`)
  console.log(divider + '\n')

  await execa.command(command, {
    cwd: rootPkgDir,
    stdio: 'inherit',
  })
}

/**
 * Reads a JSON file and returns the parsed contents.
 */
async function getJson(filePath) {
  return JSON.parse(await fs.promises.readFile(filePath, 'utf8'))
}

/**
 * Updates the `pkgScripts` mapping for a given package.
 * @param {string} pkgJsonPath
 */
async function updatePkgScripts(pkgJsonPath) {
  /**
   * @type {{
   *   name: string
   *   scripts?: {
   *     [scriptName: string]: string
   *   }
   * }}
   */
  const pkgJson = await getJson(path.join(rootPkgDir, pkgJsonPath))

  const pkgName = pkgJson.name
  const pkgScriptNames = Object.keys(pkgJson.scripts || {})

  if (pkgScriptNames.length) {
    pkgScripts[pkgName] = pkgScriptNames
  }
}

/**
 * @param {CommandHistoryEntry} entry
 */
async function updateCommandHistory(entry) {
  /** @type {CommandHistory} */
  let commandHistory

  if (!commandHistoryExists) commandHistory = [entry]
  else {
    commandHistory = await getJson(commandHistoryPath)

    if (commandHistory.length >= 10) commandHistory.pop()

    commandHistory = [
      entry,
      ...commandHistory.filter(
        (commandHistoryEntry) => commandHistoryEntry.command !== entry.command,
      ),
    ]
  }

  await fs.promises.writeFile(
    commandHistoryPath,
    JSON.stringify(commandHistory),
  )
}
