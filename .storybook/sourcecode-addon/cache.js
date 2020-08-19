var cache = {}

module.exports = {
  register(path, source, compiled) {
    if (!cache[path]) {
      cache[path] = {}
    }
    cache[path][compiled ? 'compiled' : 'raw'] = source
  },
  getSources() {
    return cache
  },
  cleanCache() {
    cache = {}
  },
}
