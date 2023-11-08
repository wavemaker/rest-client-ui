import { Stack } from '@mui/material'
import RestImport from './core/components/RestImport'
import { restImportConfigI } from './core/components/RestImport'
import { Provider } from 'react-redux'
import appStore from './core/components/appStore/Store';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export default function App() {
  const config: restImportConfigI = {
    proxy_conf: {
      base_path: "http://localhost:4000/",
      proxy_path: "restimport",
      list_provider: "get-default-provider",
      getprovider: "getprovider",
      addprovider: "addprovider",
      authorizationUrl: "authorizationUrl",
    },
    useProxy: true,
    url: "https://jsonplaceholder.typicode.com/posts",
    projectId: "WMPRJ2c91808889a96400018a26070b7b2e68", 
    loggenInUserId: "fe",
    appEnvVariables: [{ key: 'we', value: 'ew' }],
    loggenInUserName: 'vew',
    headerParams: [{
      name: "new",
      type: "string",
      value: "vew"
    }],
    queryParams: [{
      name: "jh",
      type: "TIME",
      value: "vew"
    }],
    state_val: "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==",
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
    setResponse: {
      testing: false,
    },
    error: {
      errorFunction: (msg: string, response?: AxiosResponse) => {
        alert(msg)
      },
      errorMethod: "toast",
      errorMessageTimeout: 5000
    },
    handleResponse: (request: AxiosRequestConfig, response?: AxiosResponse) => {
      console.log(request, response)
    },
    hideMonacoEditor: (value: boolean) => { },
    getServiceName(value: string) { },
    setServiceName: '',
    viewMode: false,
    setResponseHeaders: { kingkong: "test" },
  }

  return (
    <Provider store={appStore}>
      <Stack className='rest-import-ui'>
        <RestImport restImportConfig={config} language='en' />
      </Stack>
    </Provider>
  )
}