import type { UserDefinedOptions } from './type'
import core from '@actions/core'
import github from '@actions/github'

// export { default as core } from '@actions/core'
// export { default as github } from '@actions/github'
export function getActionOptions (): UserDefinedOptions {
  const token = core.getInput('token')
  const username = core.getInput('username')
  const motto = core.getBooleanInput('motto')
  const filepath = core.getInput('filepath')
  const title = core.getInput('title')
  const includeFork = core.getBooleanInput('includeFork')
  const includeArchived = core.getBooleanInput('includeArchived')
  const onlyPrivate = core.getBooleanInput('onlyPrivate')
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
