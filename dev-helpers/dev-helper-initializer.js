/* eslint-disable no-undef */
window.onload = function () {
  window["RestImportBundle"] = window["rest-import-ui-bundle"]
  window["RestImportStandalonePreset"] = window["rest-import-ui-standalone-preset"]
  // Build a system
  const ui = RestImportBundle({
    dom_id: "#rest-import-ui",
    language: 'zh',
    config: {
      url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
      httpMethod: 'POST',
      useProxy: true,
      httpAuth: "BASIC",
      bodyParams: "{userName:password}",
      userName: "userName",
      userPassword: "userPassword",
      headerParams: [
        {
          name: 'New',
          type: 'string',
          value: 'application'
        }
      ],
      multipartParams: [
        {
          name: "post",
          type: "file",
          value: "fe"
        }
      ],
      contentType: 'multipart/form-data'
    },

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
