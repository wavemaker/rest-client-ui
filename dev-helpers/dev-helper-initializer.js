/* eslint-disable no-undef */
window.onload = function() {
  window["RestImportBundle"] = window["rest-import-ui-bundle"]
  window["RestImportStandalonePreset"] = window["rest-import-ui-standalone-preset"]
  // Build a system
  const ui = RestImportBundle({
    dom_id: "#rest-import-ui",
    value:"https://www.google.com/",
    language:'zh',
    presets: [
      RestImportBundle.presets.apis,
      RestImportStandalonePreset
    ],
    plugins: [
      RestImportBundle.plugins.DownloadUrl
    ],
    layout: "BaseLayout"
  })

  window.ui = ui

}
