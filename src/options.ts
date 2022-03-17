import type { UserDefinedOptions, RawUserDefinedOptions } from './type'
import defu from 'defu'
// import pkg from '../package.json'
import { getActionOptions } from './action'
// 'rootDir' is expected to contain all source files.
const pkg = require('../package.json')

declare var __isAction__: boolean
export function getDefaults (): UserDefinedOptions {
  return {
    token: process.env.GITHUB_TOKEN ?? '',
    username: 'sonofmagic',
    filepath: 'README.md',
    motto: true,
    title: pkg.name
  }
}

export function parseBoolean (bool?: string | boolean) {
  if (typeof bool === 'boolean') {
    return bool
  }
  if (typeof bool === 'undefined') {
    return false
  }
  if (typeof bool === 'string') {
    return bool === 'true'
  }
  return false
}

export function transfer (options?: RawUserDefinedOptions) {
  let opt: Partial<UserDefinedOptions>
  if (options) {
    opt = {
      ...options,
      motto: parseBoolean(options.motto)
    }
  } else {
    opt = {}
  }
  return opt
}

export function getOptions (
  options?: RawUserDefinedOptions
): UserDefinedOptions {
  let opt: Partial<UserDefinedOptions>

  if (__isAction__) {
    opt = transfer(getActionOptions())
  } else {
    opt = transfer(options)
  }
  return defu<Partial<UserDefinedOptions>, UserDefinedOptions>(
    opt,
    getDefaults()
  ) as UserDefinedOptions
}
