import { Stack } from '@mui/material'
import WebServiceModal from './core/components/WebServiceModal'
import { restImportConfigI } from './core/components/WebServiceModal'
import { Provider } from 'react-redux'
import appStore from './core/components/appStore/Store';
import { AxiosResponse } from 'axios';

export default function App() {
  const config: restImportConfigI = {
    proxy_conf: {
      base_path: "http://localhost:5000",
      proxy_path: "/restimport",
      list_provider: "/get-default-provider",
      getprovider: "/getprovider",
      addprovider: "/addprovider",
      authorizationUrl: "/authorizationUrl",
    },
    state_val : "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==",
    default_proxy_state: "ON", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
    oAuthConfig: {
      base_path: "https://www.wavemakeronline.com/studio/services",
      project_id: "",
      proxy_path: '', // /projects/{projectID}/restservices/invoke?optimizeResponse=true
      list_provider: "/oauth2/providers/default",
      getprovider: "", // /projects/{projectID}/oauth2/providers
      addprovider: "", // /projects/{projectID}/oauth2/providers
      authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl,
    },
    error: {
      errorFunction: (msg: string, response?: AxiosResponse) => {
        alert(msg)
      },
      errorMethod: "customFunction",
      errorMessageTimeout: 5000
    },
    handleResponse: (response?: AxiosResponse) => {
    },
    hideMonacoEditor: (value: boolean) => {
    }
  }

  return (
    <Provider store={appStore}>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={config} language='en' />
      </Stack>
    </Provider>
  )
}