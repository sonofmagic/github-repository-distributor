const del = require('del')

;(async () => {
  const dirs = process.argv.slice(2)
  if (dirs.length === 0) {
    dirs.push('dist')
  }
  const deletedDirectoryPaths = await del(dirs)
  console.log('Deleted directories:\n', deletedDirectoryPaths.join('\n'))
})()
