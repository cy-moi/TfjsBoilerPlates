
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const entriesMap = require('./entriesMap')

let entries = Object.keys(entriesMap);

console.log(process.env.entries)
const { entries: entriesEnv } = process.env;
if (entriesEnv) {
  entries = entriesEnv.trim().split(' ');
}

const getEntries = () => {
  const entriesUnsupport = entries.filter(it => !entriesMap[it])

  if (entriesUnsupport.length !== 0) {
    throw new Error('unsupported entries', entriesUnsupport)
  }

  const entriesData = entries.reduce((pre, cur) => ({
    ...pre,
    [cur]: entriesMap[cur],
  }), {})

  console.log('build entries:', entriesData)
  return entriesData
}


const getHtmlWebpackPlugins = ({ isDev }) => (
  entries.map((e) => new HtmlWebpackPlugin({
    filename: `${e}.html`,
    template: path.resolve(__dirname, `${entriesMap[e]}.html`),
    excludeChunks: entries.filter(it => (it !== e)),
  }))
)
const getApiFallbackRewrites = () => {
  let map = [
    ...entries.map((e) => (
      {
        from: `^/${e}(/|).*$`,
        to: `/${e}.html`,
      }
    ))
  ]
  return map;
}


module.exports = {
  getEntries,
  getHtmlWebpackPlugins,
  getApiFallbackRewrites
}