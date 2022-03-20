import type { UserDefinedOptions } from './type'
import core from '@actions/core'
import github from '@actions/github'
import { parseBoolean } from './util'
// export { default as core } from '@actions/core'
// export { default as github } from '@actions/github'
export function getActionOptions (): UserDefinedOptions {
  const token = core.getInput('token')
  const username = core.getInput('username')
  const motto = parseBoolean(core.getInput('motto'))
  const filepath = core.getInput('filepath')
  const title = core.getInput('title')
  const includeFork = parseBoolean(core.getInput('includeFork'))
  const includeArchived = parseBoolean(core.getInput('includeArchived'))
  const onlyPrivate = parseBoolean(core.getInput('onlyPrivate'))
  return {
    token,
    username,
    motto,
    filepath,
    title,
    includeFork,
    includeArchived,
    onlyPrivate
  }
}

export { core, github }
