import type { RestEndpointMethodTypes } from '@octokit/rest'
export type { Root, Content, Paragraph, ListItem, Link } from 'mdast'
export type { Dictionary } from 'lodash'
export type Repository =
  RestEndpointMethodTypes['repos']['listForUser']['response']['data'][number]

export interface RawUserDefinedOptions {
  token: string
  username: string
  title?: string
  motto?: string | boolean
  filepath?: string
  includeFork?: string | boolean
}
export interface UserDefinedOptions {
  token: string
  username: string
  title: string
  motto: boolean
  filepath: string
  includeFork: boolean
}
