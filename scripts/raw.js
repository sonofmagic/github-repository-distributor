require('dotenv').config()
const { main } = require('..')
main({
  token: process.env.GITHUB_TOKEN,
  username: 'sonofmagic'
})
