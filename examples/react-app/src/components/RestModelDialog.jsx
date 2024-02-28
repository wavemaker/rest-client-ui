import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useEffect } from "react";

export default function RestModal({ handleOpen, handleClose, defaultData }) { 
  const restData = {
    proxy_conf: {
      base_path: "http://localhost:4000/",
      proxy_path: "restimport",
      list_provider: "get-default-provider",
      settingsUpload: "settingUpload",
      getprovider: "getprovider",
      addprovider: "addprovider",
      authorizationUrl: "authorizationUrl",
    },
    useProxy: true,
    url: "https://jsonplaceholder.typicode.com/posts/3",
    projectId: "WMPRJ2c91808889a96400018a26070b7b2e68",
    loggenInUserId: "fe",
    appEnvVariables: [
      {
        name: "gwe",
        value: "vew",
        type: "APP_ENVIRONMENT",
      },
    ],
    loggenInUserName: "vew",
    headerParams: [
      {
        name: "new",
        type: "DATE",
        value: "vew",
      },
    ],
    queryParams: [
      {
        name: "jh",
        type: "gwe",
        value: "vew",
      },
    ],
    setResponse: {
      testing: false,
    },
    multipartParams: [
      {
        name: "few",
        type: "file",
        value: "",
      },
    ],
    error: {
      errorFunction: (msg, response) => {
        alert(msg);
      },
      errorMethod: "default",
      // errorMessageTimeout: 5000
    },
    handleResponse: (request, settingsUploadData, response) => {
      console.log(request, response, settingsUploadData);
    },
    hideMonacoEditor: (value) => {},
    getServiceName(value) {},
    getUseProxy(value) {
      console.log(value);
    },
    setServiceName: "",
    viewMode: false,
    setResponseHeaders: { kingkong: "test" },
    monacoEditorURL: undefined,
    responseBlockHeight: 550,
  };
  useEffect(() => { 
    if (handleOpen && !defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#testing",
          language: "en",
          config: restData,
        });
      }, 100);
    } else if (handleOpen && defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
          language: "en",
          config: restData,
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleOpen]);

  return (
    <>
      <Dialog open={handleOpen} onClose={handleClose} maxWidth={"lg"}>
        <DialogContent>
          <div id="reactImport"></div>
        </DialogContent>
      </Dialog>
    </>
  );
}
