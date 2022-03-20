# github-repository-distributor

This action provides the following functionality for GitHub Actions users:

- get all your repos and group by lang.
- order your repos by last update time
- can be use by npm

## Usage

### Github Action

See [action.yml](action.yml) and [Demo](https://github.com/sonofmagic/projects)

**Basic:**
```yaml
steps:
- uses: actions/checkout@v2
- name: Use Node.js
  uses: actions/setup-node@v2
  with:
    node-version: 16
- name: Generate markdown files
  uses: sonofmagic/github-repository-distributor@main
  with:
    token: ${{ secrets.PERSONAL_TOKEN }} # your github personal token
    username: 'sonofmagic' # your github name
- name: Commit & Push changes
  uses: actions-js/push@master
  with:
    github_token: ${{ secrets.PERSONAL_TOKEN }} # your github personal token
```

### Nodejs

```bash
npm i github-repository-distributor
# or
yarn add github-repository-distributor
```

```js
const { main } = require('github-repository-distributor')

main({
  token: process.env.GITHUB_TOKEN,
  username: 'sonofmagic',
  filepath: 'test/fixtures/README.md',
  motto: false,
  title: 'Hello world!',
  includeFork: 'true'
})
```

### Options

| Name            | Type              | Description                                | Default Value |
| --------------- | ----------------- | ------------------------------------------ | ------------- |
| token           | string            | the repo PAT or GITHUB_TOKEN               |               |
| username        | string            | github username to generate markdown files |               |
| filepath        | string            | main markdown file path                    | README.md     |
| motto           | string \| boolean | whether add powered by footer              | 'false'        |
| title           | string            | main markdown h1 title                     | repo.name     |
| includeFork     | string \| boolean | include forked repos                       | 'false'        |
| includeArchived | string \| boolean | include archived repos                     | 'false'        |
| onlyPrivate     | string \| boolean | only include private repos                 | 'false'       |

