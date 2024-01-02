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
      settingsUpload: "settingUpload",
      getprovider: "getprovider",
      addprovider: "addprovider",
      authorizationUrl: "authorizationUrl",
    },
    useProxy: true,
    url: "https://jsonplaceholder.typicode.com/posts/3",
    projectId: "WMPRJ2c91808889a96400018a26070b7b2e68",
    loggenInUserId: "fe",
    appEnvVariables: [{
      name:"gwe",
      value:"vew",
      type:"APP_ENVIRONMENT"
    }],
    loggenInUserName: 'vew',
    headerParams: [{
      name: "new",
      type: "DATE",
      value: "vew"
    }],
    queryParams: [{
      name: "jh",
      type: "TIME",
      value: "vew"
    }],
    setResponse: {
      testing: false,
    },
    multipartParams: [{
      name: 'few',
      type: 'file',
      value: ''
    }],
    error: {
      errorFunction: (msg: string, response?: AxiosResponse) => {
        alert(msg)
      },
      errorMethod: "default",
      // errorMessageTimeout: 5000
    },
    handleResponse: (request: AxiosRequestConfig, settingsUploadData: any, response?: AxiosResponse) => {
      console.log(request, response, settingsUploadData)
    },
    hideMonacoEditor: (value: boolean) => {
    },
    getServiceName(value: string) { },
    getUseProxy(value) {
      console.log(value)
    },
    setServiceName: '',
    viewMode: false,
    setResponseHeaders: { kingkong: "test" },
    monacoEditorURL: undefined as any,
    responseBlockHeight: 550, 
    
  }

  return (
    <Provider store={appStore}>
      <Stack className='rest-import-ui'>
        <RestImport restImportConfig={config} language='en' />
      </Stack>
    </Provider>
  )
}