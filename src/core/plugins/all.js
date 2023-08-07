import { pascalCaseFilename } from "core/utils"

const request = require.context(".", true, /\.(jsx|tsx|ts)$/)

const allPlugins = {}

export default allPlugins

request.keys().forEach( function( key ){
  if( key === "./index.js" ) {
    return
  }

  let mod = request(key)
  allPlugins[pascalCaseFilename(key)] = mod.default ? mod.default : mod
})

