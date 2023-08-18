/* eslint-disable no-undef */
window.onload = function () {
  window["RestImportBundle"] = window["rest-import-ui-bundle"];
  window["RestImportStandalonePreset"] =
    window["rest-import-ui-standalone-preset"];
  // Build a system
  const ui = RestImportBundle({
    dom_id: "#rest-import-ui",
    language: "en",
    config: {
      url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=false',
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
      contentType: 'multipart/form-data',
      proxy_conf: {
        base_path: "http://localhost:5000",
        proxy_path: "/restimport",
        list_provider: "/get-default-provider",
        getprovider: "/getprovider",
        addprovider: "/addprovider",
      },
      default_proxy_state: "ON",
      oAuthConfig: {
        base_path: "https://www.wavemakeronline.com/studio/services",
        list_provider:
          "/oauth2/providers/default",
        getprovider:
          "/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
        addprovider:
          "/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
      }
    },
    presets: [RestImportBundle.presets.apis, RestImportStandalonePreset],
    plugins: [RestImportBundle.plugins.DownloadUrl],
    layout: "BaseLayout",
  });

  window.ui = ui;
};
