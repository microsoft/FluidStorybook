/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

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
