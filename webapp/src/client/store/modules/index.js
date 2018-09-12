/*
 * import all js files in ./modules
 *
 * */

const files = require.context('.', false, /\.js$/)
let modules = {}

files.keys().forEach(filename => {
  console.log('import modules: ', filename)
  if (filename === './index.js') return
  modules[filename.replace(/\.\/|\.js/g, '')] = files(filename).default
})

export default modules
