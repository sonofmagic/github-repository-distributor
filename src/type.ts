import type { RestEndpointMethodTypes } from '@octokit/rest'

export type Repository =
  RestEndpointMethodTypes['repos']['listForUser']['response']['data'][number]

export interface UserDefinedOptions {
  token: string
  username: string
  title?: string
}
