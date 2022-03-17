import type { UserDefinedOptions } from './type'
import core from '@actions/core'
import github from '@actions/github'
// export { default as core } from '@actions/core'
// export { default as github } from '@actions/github'
export function getActionOptions (): UserDefinedOptions {
  const token = core.getInput('token')
  const username = core.getInput('username')
  return {
    token,
    username
  }
}

export { core, github }
