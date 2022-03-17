require('dotenv').config()
const { main } = require('..')
main({
  token: process.env.GITHUB_TOKEN,
  username: 'sonofmagic',
  filepath: 'test/fixtures/README.md',
  motto: false,
  title: 'Hello world'
})
