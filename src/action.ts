import type { RawUserDefinedOptions } from './type'
import core from '@actions/core'
import github from '@actions/github'
// export { default as core } from '@actions/core'
// export { default as github } from '@actions/github'
export function getActionOptions (): RawUserDefinedOptions {
  const token = core.getInput('token')
  const username = core.getInput('username')
  const motto = core.getInput('motto')
  const filepath = core.getInput('filepath')
  const title = core.getInput('title')

  return {
    token,
    username,
    motto,
    filepath,
    title
  }
}

export { core, github }
