import React, { useState } from 'react'
import { Dialog, DialogContent, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Editor as ModalEditor } from '@monaco-editor/react';

export default function RestModal({ handleOpen, handleClose, defaultData }) {
  const [monacoEditorValue, setmonacoEditorValue] = useState()
  const [hideMonacoEditor, sethideMonacoEditor] = useState(true)
  useEffect(() => {
    setmonacoEditorValue("")
    if (handleOpen && !defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#testing",
          language: "en",
          config: {
            url: "https://jsonplaceholder.typicode.com/posts/{id}?test=true",
            httpMethod: "POST",
            useProxy: true,
            httpAuth: "BASIC",
            bodyParams: "{userName:password}",
            userName: "userName",
            userPassword: "userPassword",
            contentType: "multipart/form-data",
            proxy_conf: {
              base_path: "http://localhost:4000",
              proxy_path: "/restimport",
              list_provider: "/get-default-provider",
              getprovider: "/getprovider",
              addprovider: "/addprovider",
              authorizationUrl: "/authorizationUrl",
            },
            state_val:
              "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==",
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
              errorFunction: (msg, response) => {
                alert(msg)
                console.log(response)
              },
              errorMethod: "default",
              errorMessageTimeout: 5000
            },
            handleResponse: (response) => {
              console.log(response?.data);
              setmonacoEditorValue(JSON.stringify(response?.data, null, 2));
            },
            hideMonacoEditor: (value) => {
              sethideMonacoEditor(value);
            },
          },
        });
      }, 100);
    } else if (handleOpen && defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
          language: "en",
          config: {
            proxy_conf: {
              base_path: "http://localhost:4000",
              proxy_path: "/restimport",
              list_provider: "/get-default-provider",
              getprovider: "/getprovider",
              addprovider: "/addprovider",
              authorizationUrl: "/authorizationUrl",
            },
            state_val:
              "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==",
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
              errorFunction: (msg, response) => {
                alert(msg)
                console.log(response)
              },
              errorMethod: "default",
              errorMessageTimeout: 5000
            },
            handleResponse: (response) => {
              console.log(response?.data);
              setmonacoEditorValue(JSON.stringify(response?.data, null, 2));
            },
            hideMonacoEditor: (value) => {
              sethideMonacoEditor(value);
            },
          },
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleOpen]);

  return (
    <>
      <Dialog open={handleOpen} onClose={handleClose} maxWidth={'lg'} >
        <DialogContent>
          <div id="reactImport"></div>
          <div style={{ paddingInline: '15px' }}>
            {!hideMonacoEditor && <ModalEditor
              height="150px"
              width={'100%'}
              language="json"
              loading={<CircularProgress color="inherit" />}
              path={`${defaultData ? "empty-" : "filled-"}modal.json`}
              theme="vs-dark"
              value={monacoEditorValue}
              defaultValue=""
              options={{
                domReadOnly: true,
                readOnly: true,
                minimap: {
                  enabled: false,
                },
              }} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
