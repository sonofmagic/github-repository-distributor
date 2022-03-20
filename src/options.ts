import type { UserDefinedOptions, RawUserDefinedOptions } from './type'
import defu from 'defu'
import { parseBoolean } from './util'
// import pkg from '../package.json'

// 'rootDir' is expected to contain all source files.
const pkg = require('../package.json')

declare var __isAction__: boolean

export function getDefaults (): UserDefinedOptions {
  return {
    token: process.env.GITHUB_TOKEN ?? '',
    username: 'sonofmagic',
    filepath: 'README.md',
    motto: true,
    title: pkg.name,
    includeFork: true,
    includeArchived: true,
    onlyPrivate: false
  }
}

export function transfer (options?: RawUserDefinedOptions) {
  let opt: Partial<UserDefinedOptions>
  if (options) {
    opt = {
      ...options,
      motto: parseBoolean(options.motto),
      includeFork: parseBoolean(options.includeFork),
      includeArchived: parseBoolean(options.includeArchived),
      onlyPrivate: parseBoolean(options.onlyPrivate)
    }
  } else {
    opt = {}
  }
  return opt
}

export async function getOptions (
  options?: RawUserDefinedOptions
): Promise<UserDefinedOptions> {
  let opt: Partial<UserDefinedOptions>

  if (__isAction__) {
    const { getActionOptions } = await import('./action')
    opt = getActionOptions()
  } else {
    opt = transfer(options)
  }
  return defu<Partial<UserDefinedOptions>, UserDefinedOptions>(
    opt,
    getDefaults()
  ) as UserDefinedOptions
}
