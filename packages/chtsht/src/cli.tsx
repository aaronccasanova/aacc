#!/usr/bin/env node

import React from 'react'
import { render } from 'ink'
import meow from 'meow'

import { App } from './ui'

const cli = meow(
  `
  $ chtsht --help

  Usage
    $ chtsht <name>

  Options
    --exec, -e  Execute the command

  Examples
    # Show select list of all cheat sheets
    $ chtsht

    # Show the docker cheat sheet
    $ chtsht docker

    # Execute the command
    $ chtsht -e docker
`,
  {
    flags: {
      exec: {
        alias: 'e',
        type: 'boolean',
        default: false,
      },
    },
  },
)

render(
  <App
    cheatsheet={cli.input[0]}
    exec={cli.flags.exec}
  />,
)
