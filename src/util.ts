import { groupBy, uniqBy } from './lodash'
import { github } from './action'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import path from 'path'

import type { Repository, UserDefinedOptions } from './type'
export { dayjs }
// export { default as dayjs } from 'dayjs'
declare var __isAction__: boolean

export async function getAllRepos (options: UserDefinedOptions) {
  const { token, username } = options
  let octokit
  if (__isAction__) {
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
    const res = await octokit.rest.repos.listForUser({
      username,
      per_page: perPage,
      page,
      sort: 'updated'
    })
    page++
    l = res.data.length
    allRepos = allRepos.concat(res.data)
  }
  return uniqBy(allRepos, (repo) => repo.id)
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
