import { getAllRepos, groupByLang, write2Md } from './util'
import { toMarkdown, makeTree } from './md'
import { getOptions } from './options'
import type {
  UserDefinedOptions,
  RawUserDefinedOptions,
  Repository
} from './type'

// import pkg from '../package.json'
declare var __isAction__: boolean

export async function getRepos (options: UserDefinedOptions) {
  let repos: Repository[]
  if (__isAction__) {
    repos = await getAllRepos(options)
  } else {
    if (!options) {
      throw new TypeError('token and username must be defined')
    }
    repos = await getAllRepos(options)
  }
  return repos
}

export async function main (options?: RawUserDefinedOptions) {
  const opt = await getOptions(options)
  const repos = await getRepos(opt)
  const dic = groupByLang(repos)
  const tree = await makeTree(dic, opt)
  await write2Md(toMarkdown(tree), opt.filepath)
}

if (__isAction__) {
  main()
}
