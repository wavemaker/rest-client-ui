/*
  ATTENTION! This file (but not the functions within) is deprecated.

  You should probably add a new file to `./helpers/` instead of adding a new
  function here.

  One-function-per-file is a better pattern than what we have here.

  If you're refactoring something in here, feel free to break it out to a file
  in `./helpers` if you have the time.
*/
import Im, { fromJS, Set } from "immutable"
import { sanitizeUrl as braintreeSanitizeUrl } from "@braintree/sanitize-url"
import camelCase from "lodash/camelCase"
import upperFirst from "lodash/upperFirst"
import _memoize from "lodash/memoize"
import some from "lodash/some"
import eq from "lodash/eq"
import isFunction from "lodash/isFunction"
import win from "./window"
import cssEscape from "css.escape"
import randomBytes from "randombytes"
import shaJs from "sha.js"

const DEFAULT_RESPONSE_KEY = "default"

export const isImmutable = (maybe) => Im.Iterable.isIterable(maybe)


export function fromJSOrdered(js) {
  if (isImmutable(js)) {
    return js // Can't do much here
  }
  if (js instanceof win.File) {
    return js
  }
  if (!isObject(js)) {
    return js
  }
  if (Array.isArray(js)) {
    return Im.Seq(js).map(fromJSOrdered).toList()
  }
  if (isFunction(js.entries)) {
    // handle multipart/form-data
    const objWithHashedKeys = createObjWithHashedKeys(js)
    return Im.OrderedMap(objWithHashedKeys).map(fromJSOrdered)
  }
  return Im.OrderedMap(js).map(fromJSOrdered)
}

/**
 * Convert a FormData object into plain object
 * Append a hashIdx and counter to the key name, if multiple exists
 * if single, key name = <original>
 * if multiple, key name = <original><hashIdx><count>
 * @example <caption>single entry for vegetable</caption>
 * fdObj.entries.vegtables: "carrot"
 * // returns newObj.vegetables : "carrot"
 * @example <caption>multiple entries for fruits[]</caption>
 * fdObj.entries.fruits[]: "apple"
 * // returns newObj.fruits[]_**[]1 : "apple"
 * fdObj.entries.fruits[]: "banana"
 * // returns newObj.fruits[]_**[]2 : "banana"
 * fdObj.entries.fruits[]: "grape"
 * // returns newObj.fruits[]_**[]3 : "grape"
 * @param {FormData} fdObj - a FormData object
 * @return {Object} - a plain object
 */
export function createObjWithHashedKeys (fdObj) {
  if (!isFunction(fdObj.entries)) {
    return fdObj // not a FormData object with iterable
  }
  const newObj = {}
  const hashIdx = "_**[]" // our internal identifier
  const trackKeys = {}
  for (let pair of fdObj.entries()) {
    if (!newObj[pair[0]] && !(trackKeys[pair[0]] && trackKeys[pair[0]].containsMultiple)) {
      newObj[pair[0]] = pair[1] // first key name: no hash required
    } else {
      if (!trackKeys[pair[0]]) {
        // initiate tracking key for multiple
        trackKeys[pair[0]] = {
          containsMultiple: true,
          length: 1
        }
        // "reassign" first pair to matching hashed format for multiple
        let hashedKeyFirst = `${pair[0]}${hashIdx}${trackKeys[pair[0]].length}`
        newObj[hashedKeyFirst] = newObj[pair[0]]
        // remove non-hashed key of multiple
        delete newObj[pair[0]] // first
      }
      trackKeys[pair[0]].length += 1
      let hashedKeyCurrent = `${pair[0]}${hashIdx}${trackKeys[pair[0]].length}`
      newObj[hashedKeyCurrent] = pair[1]
    }
  }
  return newObj
}


export function normalizeArray(arr) {
  if(Array.isArray(arr))
    return arr
  return [arr]
}

export function isFn(fn) {
  return typeof fn === "function"
}

export function isObject(obj) {
  return !!obj && typeof obj === "object"
}

export function isFunc(thing) {
  return typeof(thing) === "function"
}

export function isArray(thing) {
  return Array.isArray(thing)
}

// I've changed memoize libs more than once, so I'm using this a way to make that simpler
export const memoize = _memoize

export function objMap(obj, fn) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = fn(obj[key], key)
    return newObj
  }, {})
}

export function objReduce(obj, fn) {
  return Object.keys(obj).reduce((newObj, key) => {
    let res = fn(obj[key], key)
    if(res && typeof res === "object")
      Object.assign(newObj, res)
    return newObj
  }, {})
}

// Redux middleware that exposes the system to async actions (like redux-thunk, but with out system instead of (dispatch, getState)
export function systemThunkMiddleware(getSystem) {
  return ({ dispatch, getState }) => { // eslint-disable-line no-unused-vars
    return next => action => {
      if (typeof action === "function") {
        return action(getSystem())
      }

      return next(action)
    }
  }
}

// PascalCase, aka UpperCamelCase
export function pascalCase(str) {
  return upperFirst(camelCase(str))
}

// Remove the ext of a filename, and pascalCase it
export function pascalCaseFilename(filename) {
  return pascalCase(filename.replace(/\.[^./]*$/, ""))
}

export const parseSearch = () => {
  let map = {}
  let search = win.location.search

  if(!search)
    return {}

  if ( search != "" ) {
    let params = search.substr(1).split("&")

    for (let i in params) {
      if (!Object.prototype.hasOwnProperty.call(params, i)) {
        continue
      }
      i = params[i].split("=")
      map[decodeURIComponent(i[0])] = (i[1] && decodeURIComponent(i[1])) || ""
    }
  }

  return map
}


export const sorters = {
  operationsSorter: {
    alpha: (a, b) => a.get("path").localeCompare(b.get("path")),
    method: (a, b) => a.get("method").localeCompare(b.get("method"))
  },
  tagsSorter: {
    alpha: (a, b) => a.localeCompare(b)
  }
}


export function sanitizeUrl(url) {
  if(typeof url !== "string" || url === "") {
    return ""
  }

  return braintreeSanitizeUrl(url)
}


export function stringify(thing) {
  if (typeof thing === "string") {
    return thing
  }

  if (thing && thing.toJS) {
    thing = thing.toJS()
  }

  if (typeof thing === "object" && thing !== null) {
    try {
      return JSON.stringify(thing, null, 2)
    }
    catch (e) {
      return String(thing)
    }
  }

  if(thing === null || thing === undefined) {
    return ""
  }

  return thing.toString()
}

export function paramToIdentifier(param, { returnAll = false, allowHashes = true } = {}) {
  if(!Im.Map.isMap(param)) {
    throw new Error("paramToIdentifier: received a non-Im.Map parameter as input")
  }
  const paramName = param.get("name")
  const paramIn = param.get("in")

  let generatedIdentifiers = []

  // Generate identifiers in order of most to least specificity

  if (param && param.hashCode && paramIn && paramName && allowHashes) {
    generatedIdentifiers.push(`${paramIn}.${paramName}.hash-${param.hashCode()}`)
  }

  if(paramIn && paramName) {
    generatedIdentifiers.push(`${paramIn}.${paramName}`)
  }

  generatedIdentifiers.push(paramName)

  // Return the most preferred identifier, or all if requested

  return returnAll ? generatedIdentifiers : (generatedIdentifiers[0] || "")
}

export function paramToValue(param, paramValues) {
  const allIdentifiers = paramToIdentifier(param, { returnAll: true })

  // Map identifiers to values in the provided value hash, filter undefined values,
  // and return the first value found
  const values = allIdentifiers
    .map(id => {
      return paramValues[id]
    })
    .filter(value => value !== undefined)

  return values[0]
}

export const isEmptyValue = (value) => {
  if (!value) {
    return true
  }

  if (isImmutable(value) && value.isEmpty()) {
    return true
  }

  return false
}
