/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

import React from 'react'
import SelectInput from 'ink-select-input'
import Table from 'ink-table'
import prompts from 'prompts'
import execa from 'execa'
import chalk from 'chalk'

export interface Entry {
  description: string
  command: string
}

export type Entries = Entry[]

type Cheatsheets = { [key: string]: Entries }

export interface AppProps {
  cheatsheet?: undefined | keyof Cheatsheets
  exec?: boolean
}

const configPath = path.resolve(os.homedir(), '.chtsht')

if (!fs.existsSync(configPath)) {
  throw new Error('Could not find config file at ~/.chtsht')
}

const cheatsheets = JSON.parse(
  fs.readFileSync(configPath, 'utf-8'),
) as Cheatsheets

export function App(props: AppProps) {
  const { cheatsheet = '', exec = false } = props

  const [cheatsheetEntry, setCheatsheetEntry] = React.useState(
    cheatsheet in cheatsheets ? cheatsheet : '',
  )

  return cheatsheetEntry ? (
    <Cheatsheet
      entries={cheatsheets[cheatsheetEntry]!}
      exec={exec}
    />
  ) : (
    <SelectInput
      items={Object.keys(cheatsheets).map((name) => ({
        label: name,
        value: name,
      }))}
      onSelect={(item) => {
        setCheatsheetEntry(item.value)
      }}
    />
  )
}

export interface CheatsheetProps {
  exec?: boolean
  entries: Entries
}

export function Cheatsheet(props: CheatsheetProps) {
  const { exec = false, entries } = props

  const [state, setState] = React.useState<{
    entry: null | Entry
    params: null | string[]
  }>({
    entry: null,
    params: null,
  })

  React.useEffect(() => {
    async function run() {
      if (!state.entry) {
        return
      }

      let { command } = state.entry

      if (state.params) {
        const answers = await prompts(
          state.params.map((parameter) => ({
            type: 'text',
            name: parameter,
            message: parameter,
          })),
        )

        for (const answer of Object.entries(answers)) {
          const [parameter, value] = answer as [string, string]
          command = command.replace(parameter, value)
        }
      }

      console.log('\n======\n')
      console.log('COMMAND:', chalk.green(command), '\n')

      const execProcess = execa.command(command)

      execProcess.stdout?.pipe(process.stdout)
      execProcess.stderr?.pipe(process.stderr)

      await execProcess

      console.log('\n======\n')

      setState({
        entry: null,
        params: null,
      })
    }

    run().catch((err) => {
      if (err instanceof Error) throw err
    })
  }, [state])

  // If NOT exec mode, print cheatsheet
  if (!exec) {
    return (
      <Table
        data={entries.map((entry) => ({
          Description: entry.description,
          Command: entry.command,
        }))}
      />
    )
  }

  // If exec mode and entry selected, hide select input
  if (exec && Boolean(state.entry)) return null

  // If exec mode and no entry selected, show select input
  return (
    <SelectInput
      items={Object.values(entries).map((entry) => ({
        label: `${entry.description}: ${entry.command}`,
        value: entry.command,
      }))}
      onSelect={(item) => {
        const entry = entries.find((i) => i.command === item.value)!
        const params = entry.command.match(/<[^>]+>/g)

        if (params) {
          console.log(
            `Enter dynamic parameters for: ${chalk.yellow(entry?.command)}`,
          )
        }

        setState({ entry, params })
      }}
    />
  )
}
