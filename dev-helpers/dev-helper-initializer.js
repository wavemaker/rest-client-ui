/* eslint-disable no-undef */
window.onload = function () {
  window["RestImportBundle"] = window["rest-import-ui-bundle"];
  window["RestImportStandalonePreset"] =
    window["rest-import-ui-standalone-preset"];
  // Build a system
  const ui = RestImportBundle({
    dom_id: "#rest-import-ui",
    language: "en",
    providerConf: {
      accessTokenParamName: "Bearer",
      accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
      authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
      clientId:
        "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
      clientSecret: "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",
      oAuth2Pkce: null,
      oauth2Flow: "AUTHORIZATION_CODE",
      providerId: "google",
      responseType: "token",
      scopes: [
        {
          name: "Calendar",
          value:
            "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly",
        },
        {
          name: "Google Drive",
          value:
            "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.photos.readonly",
        },
      ],
      sendAccessTokenAs: "HEADER",
    },
    config: {
      url: "https://jsonplaceholder.typicode.com/posts/{id}?test=false",
      httpMethod: "POST",
      useProxy: true,
      httpAuth: "BASIC",
      bodyParams: "{userName:password}",
      userName: "userName",
      userPassword: "userPassword",
      headerParams: [
        {
          name: "New",
          type: "string",
          value: "application",
        },
      ],
      multipartParams: [
        {
          name: "post",
          type: "file",
          value: "fe",
        },
      ],
      contentType: "multipart/form-data",
      proxy_conf: {
        base_path: "http://localhost:5000",
        proxy_path: "/restimport",
        list_provider: "/get-default-provider",
        getprovider: "/getprovider",
        addprovider: "/addprovider",
        authorizationUrl: "/authorizationUrl",
      },
      default_proxy_state: "ON", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
      oAuthConfig: {
        base_path: "https://www.wavemakeronline.com/studio/services",
        project_id: "",
        list_provider: "/oauth2/providers/default",
        getprovider: "", // /projects/{projectID}/oauth2/providers
        addprovider: "", // /projects/{projectID}/oauth2/providers
        authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
      },
     
    },
    presets: [RestImportBundle.presets.apis, RestImportStandalonePreset],
    plugins: [RestImportBundle.plugins.DownloadUrl],
    layout: "BaseLayout",
  });

  window.ui = ui;
};
