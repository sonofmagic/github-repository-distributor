import type { RestEndpointMethodTypes } from '@octokit/rest'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'
import fs from 'fs/promises'
import path from 'path'
import github from '@actions/github'
// github.getOctokit()
// const octokit = new Octokit({
//   auth: process.env.GITHUB_TOKEN
// })

export type Repository =
  RestEndpointMethodTypes['repos']['listForUser']['response']['data'][number]

export async function getAllRepos (token: string, username: string) {
  const octokit = github.getOctokit(token)
  // const octokit = new Octokit({
  //   auth: process.env.GITHUB_TOKEN
  // })
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
