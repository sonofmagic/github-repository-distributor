import { getAllRepos, groupByLang, write2Md } from './util'
import orderBy from 'lodash/orderBy'
import { toc } from 'mdast-util-toc'
import { toMarkdown } from 'mdast-util-to-markdown'
import type { Root, Content, Paragraph, ListItem, Link } from 'mdast'
import dayjs from 'dayjs'
import core from '@actions/core'
import github from '@actions/github'

// const pkg = require('../package.json')
// import pkg from '../package.json'
export async function main () {
  const { token, username } = getOptions()
  const repos = await getAllRepos(token, username)
  const dic = groupByLang(repos)

  const children: Content[] = []
  children.push({
    type: 'heading',
    depth: 1,
    children: [
      {
        type: 'text',
        value: github.context.repo.repo // pkg.name
      }
    ]
  })

  const keys = Object.keys(dic)
  const orderedKeys = orderBy(keys, (key) => dic[key].length, 'desc')

  for (let i = 0; i < orderedKeys.length; i++) {
    const lang = orderedKeys[i]
    const repos = dic[lang]
    const orderedRepos = orderBy(repos, (repo) => repo.updated_at, 'desc')

    const h2 = lang === 'null' ? 'unknown' : lang

    children.push({
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: `${h2} (${orderedRepos.length})`
        }
      ]
    })

    children.push({
      type: 'list',
      ordered: true,
      children: orderedRepos.map((repo, idx) => {
        const linkChildren: Link['children'] = [
          {
            type: 'text',
            value: repo.name
          }
        ]

        const paragraphChildren: Paragraph['children'] = [
          {
            type: 'link',
            url: repo.html_url,
            children: linkChildren
          }
        ]

        if (repo.fork) {
          paragraphChildren.push({
            type: 'text',
            value: ' (forked)'
          })
        }

        paragraphChildren.push({
          type: 'text',
          value: ` (${dayjs(repo.updated_at).format('YYYY-MM-DD HH:mm:ss')})`
        })

        const listItemChildren: ListItem['children'] = [
          {
            type: 'paragraph',
            children: paragraphChildren
          }
        ]
        if (repo.description) {
          listItemChildren.push({
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: repo.description
              }
            ]
          })
        }
        return {
          type: 'listItem',
          // spread: false,
          children: listItemChildren
        }
      })
    })
  }

  const tree: Root = {
    type: 'root',
    children
  }
  const tocResult = toc(tree, {
    tight: true
  })
  children.push({
    type: 'break'
  })
  children.push({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        value: 'Generate by '
      },
      {
        type: 'link',
        url: 'https://github.com/sonofmagic/github-repository-distributor',
        children: [
          {
            type: 'inlineCode',
            value: 'sonofmagic/github-repository-distributor'
          }
        ]
      },
      {
        type: 'text',
        value: ` at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
      }
    ]
  })
  if (tocResult.map) {
    tree.children.splice(1, 0, tocResult.map)
  }

  await write2Md(toMarkdown(tree))
}

export function getOptions () {
  const token = core.getInput('token')
  const username = core.getInput('username')
  return {
    token,
    username
  }
}

main()
