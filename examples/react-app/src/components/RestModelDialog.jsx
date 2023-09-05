import React from 'react'
import { Dialog, DialogContent } from "@mui/material";
import { useEffect } from "react";

export default function RestModal({ handleOpen, handleClose, defaultData }) {
  useEffect(() => {
    if (handleOpen && !defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
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
            error: {
              errorFunction: (msg) => {
                alert(msg)
              },
              errorMethod: "default",
              errorMessageTimeout: 5000
            }
          },
        });
      }, 500);
    } else if (handleOpen && defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
          language: "en",
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
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleOpen]);

  useEffect(() => {
    if (handleOpen & !defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
          language: 'en',
          config: {
            url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
            httpMethod: 'POST',
            useProxy: true,
            httpAuth: "BASIC",
            bodyParams: "{userName:password}",
            userName: "userName",
            userPassword: "userPassword",
            contentType: 'multipart/form-data',
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
      }, 500);
    } else if (handleOpen & defaultData) {
      setTimeout(() => {
        window.RestImport({
          dom_id: "#reactImport",
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
      }, 500);
    }
  }, [handleOpen])

  return (
    <>
      <Dialog open={handleOpen} onClose={handleClose} maxWidth={'lg'} >
        <DialogContent id="reactImport">

        </DialogContent>
      </Dialog>
    </>
  )
}
