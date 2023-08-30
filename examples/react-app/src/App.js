import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RestModel from "./components/RestModelDialog";

function App() {
  const [open, setOpen] = useState(false);
  const [fullScreenView, setFullScreenView] = useState(false);
  const [defaultData, setDefaultData] = useState(true);

  useEffect(() => {
    if (fullScreenView) {
      window.RestImport({
        dom_id: "#full-screen",
        language: 'en',
        config: {
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
            proxy_path: "",
            project_id: "",
            list_provider: "/oauth2/providers/default",
            getprovider: "", // /projects/{projectID}/oauth2/providers
            addprovider: "", // /projects/{projectID}/oauth2/providers
            authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
          },
          error: {
            errorFunction: (msg) => {
              alert(msg)
            },
            errorMethod: "default",
            errorMessageTimeout: 5000
          }
        },
      });
    }
  }, [fullScreenView]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDefaultViewClick = () => {
    setOpen(true);
    setDefaultData(true);
  };

  const handlePreloadedViewClick = () => {
    setOpen(true);
    setDefaultData(false);
  };
  const handleConfigDialog = () => {
    window.configImport({
      dom_id: "#configModalUI",
      language: "en",
      providerConf: {
        accessTokenParamName: 'Bearer',
        accessTokenUrl: 'https://www.googleapis.com/oauth2/v3/token',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        clientId:
          '238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com  ',
        clientSecret: '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',
        oauth2Flow: 'AUTHORIZATION_CODE',
        providerId: '',
        scopes: [],
        sendAccessTokenAs: 'HEADER',
      },
      config: {
        proxy_conf: {
          base_path: "http://localhost:5000",
          proxy_path: "/restimport",
          list_provider: "/get-default-provider",
          getprovider: "/getprovider",
          addprovider: "/addprovider",
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
        error: {
          errorFunction: (msg) => {
            alert(msg)
          },
          errorMethod: "default",
          errorMessageTimeout: 5000
        }
      },
    });
  };

  return (
    <>
      <Stack
        direction={"row"}
        gap={10}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ marginTop: 10, marginInline: 10 }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setFullScreenView(!fullScreenView);
          }}
        >
          Full Screen
        </Button>
        <Button variant="contained" onClick={handleDefaultViewClick}>
          Dialog
        </Button>
        <Button variant="contained" onClick={handlePreloadedViewClick}>
          Dialog with Data
        </Button>
        <Button variant="contained" onClick={handleConfigDialog}>
          Config Dialog
        </Button>
      </Stack>
      <RestModel
        handleOpen={open}
        handleClose={handleClose}
        defaultData={defaultData}
      />
      <div id="configModalUI"></div>
      {fullScreenView && <div id="full-screen"></div>}
    </>
  );
}

export default App;
