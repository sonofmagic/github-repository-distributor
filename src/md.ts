import type {
  Root,
  Content,
  Paragraph,
  ListItem,
  Link,
  UserDefinedOptions,
  Repository,
  Dictionary
} from './type'
import { toc } from 'mdast-util-toc'
import { toMarkdown } from 'mdast-util-to-markdown'
import { dayjs } from './util'
import { nameToEmoji } from 'gemoji'
import { orderBy } from './lodash'

const pkg = require('../package.json')
declare var __isAction__: boolean

export { toc, toMarkdown }

export async function makeTree (
  dic: Dictionary<Repository[]>,
  options: UserDefinedOptions
) {
  const children: Content[] = []
  let h1: string
  if (__isAction__) {
    const { github } = await import('./action')
    h1 = github.context.repo.repo
  } else {
    h1 = options.title ?? pkg.name
  }
  children.push({
    type: 'heading',
    depth: 1,
    children: [
      {
        type: 'text',
        value: h1 // pkg.name
      }
    ]
  })

  const keys = Object.keys(dic)
  const orderedKeys = orderBy(keys, (key) => dic[key].length, 'desc')

  const para: Paragraph = {
    type: 'paragraph',
    children: []
  }
  if (options.includeFork) {
    para.children.push({
      type: 'text',
      value: `${nameToEmoji.twisted_rightwards_arrows}:forked `
    })
  }
  if (options.includeArchived) {
    para.children.push({
      type: 'text',
      value: `${nameToEmoji.books}:archived `
    })
  }
  if (para.children.length) {
    children.push({
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: 'Legend'
        }
      ]
    })
    children.push(para)
  }

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
            value: ` ${nameToEmoji.twisted_rightwards_arrows}` // ' (forked)'
          })
        }
        if (repo.archived) {
          paragraphChildren.push({
            type: 'text',
            value: ` ${nameToEmoji.books}` // ' (archived)'
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
        // :busts_in_silhouette:
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
  if (options.motto) {
    children.push({
      type: 'thematicBreak'
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
  }

  const tocResult = toc(tree, {
    tight: true
  })
  if (tocResult.map) {
    tree.children.splice(1, 0, tocResult.map)
  }
  return tree
}
