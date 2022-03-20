import { groupBy, uniqBy } from './lodash'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import path from 'path'

import type { Repository, UserDefinedOptions } from './type'
export { dayjs }
// export { default as dayjs } from 'dayjs'
declare var __isAction__: boolean

export async function getAllRepos (options: UserDefinedOptions) {
  const { token, username, includeFork, includeArchived, onlyPrivate } = options
  let octokit
  if (__isAction__) {
    const { github } = await import('./action')
    octokit = github.getOctokit(token)
  } else {
    const { Octokit } = await import('@octokit/rest') // require()
    octokit = new Octokit({
      auth: token
    })
  }

  const perPage = 100
  let page = 0
  let l = perPage
  let allRepos: Repository[] = []

  while (l === perPage) {
    let res
    if (!onlyPrivate) {
      res = await octokit.rest.repos.listForUser({
        username,
        per_page: perPage,
        page,
        sort: 'updated'
      })
    } else {
      res = await octokit.rest.repos.listForAuthenticatedUser({
        // username,
        per_page: perPage,
        page,
        sort: 'updated',
        visibility: 'private'
      })
    }
    page++
    l = res.data.length
    allRepos = allRepos.concat(res.data)
  }
  let result = uniqBy(allRepos, (repo) => repo.id)
  if (!includeArchived) {
    result = result.filter((x) => !x.archived)
  }
  if (!includeFork) {
    return result.filter((x) => !x.fork)
  }
  return result
}

export function groupByLang (repos: Repository[]) {
  return groupBy(repos, (repo) => {
    return repo.language
  })
}

export async function write2Md (data: string, filepath = 'README.md') {
  if (path.isAbsolute(filepath)) {
    await fs.writeFile(filepath, data, {
      encoding: 'utf-8'
    })
  } else {
    const cwd = process.cwd()
    await fs.writeFile(path.resolve(cwd, filepath), data, {
      encoding: 'utf-8'
    })
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
