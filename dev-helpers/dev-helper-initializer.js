/* eslint-disable no-undef */
window.onload = function () {
  window["RestImportBundle"] = window["rest-import-ui-bundle"];
  window["RestImportStandalonePreset"] =
    window["rest-import-ui-standalone-preset"];
  // Build a system
  const ui = RestImportBundle({
    dom_id: "#rest-import-ui",
    language: "en",
    proxy_config :{
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
          "https://www.wavemakeronline.com/studio/services/oauth2/providers/default",
        getprovider:
          "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
        addprovider:
          "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
      },
    },
    presets: [RestImportBundle.presets.apis, RestImportStandalonePreset],
    plugins: [RestImportBundle.plugins.DownloadUrl],
    layout: "BaseLayout",
  });

  window.ui = ui;
};
