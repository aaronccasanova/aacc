import execa, { ExecaReturnValue, ExecaSyncReturnValue } from 'execa'

import { $ } from './src/index'

const a: ExecaReturnValue<string> = await $`ls`
const b: ExecaReturnValue<string> = await execa.command('ls')

const c: ExecaReturnValue<string> = await $({})`ls`
const d: ExecaReturnValue<string> = await execa.command('ls', {})

const e: ExecaReturnValue<string> = await $({ encoding: 'utf8' })`ls`
const f: ExecaReturnValue<string> = await execa.command('ls', {
  encoding: 'utf8',
})

const g: ExecaReturnValue<Buffer> = await $({ encoding: null })`ls`
const h: ExecaReturnValue<Buffer> = await execa.command('ls', {
  encoding: null,
})

const i: ExecaSyncReturnValue<string> = $.sync`ls`
const j: ExecaSyncReturnValue<string> = execa.commandSync('ls')

const k: ExecaSyncReturnValue<string> = $.sync({})`ls`
const l: ExecaSyncReturnValue<string> = execa.commandSync('ls', {})

const m: ExecaSyncReturnValue<string> = $.sync({ encoding: 'utf8' })`ls`
const n: ExecaSyncReturnValue<string> = execa.commandSync('ls', {
  encoding: 'utf8',
})

const o: ExecaSyncReturnValue<Buffer> = $.sync({ encoding: null })`ls`
const p: ExecaSyncReturnValue<Buffer> = execa.commandSync('ls', {
  encoding: null,
})
