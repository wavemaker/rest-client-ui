import { Stack } from '@mui/material'
import RestImport from './core/components/RestImport'
import { restImportConfigI } from './core/components/RestImport'
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export default function App() {
  const config: restImportConfigI = {
    proxy_conf: {
      base_path: "http://localhost:4000/",
      proxy_path: "restimport",
      list_provider: "get-default-provider",
      settingsUpload: "generateSwagger",
      getprovider: "getprovider",
      addprovider: "addprovider",
      authorizationUrl: "authorizationUrl",
      updateSwagger: "updateSwagger",
    }, 
    useProxy: true,
    httpMethod: 'POST',
    url: "http://cloud.wavemakeronline.com/pkrq283c3ldw/JavaServicesForAutomation/services/FormsDB/Customformfields",
    projectId: "WMPRJ2c91808889a96400018a26070b7b2e68",
    loggenInUserId: "fe",
    contentType: 'multipart/form-data',
    appEnvVariables: [{
      name: "gwe",
      value: "vew",
      type: "APP_ENVIRONMENT"
    }],
    loggenInUserName: 'vew',
    queryParams: [{
      name: "jh",
      type: "gwe",
      value: "vew"
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
    monacoEditorURL: undefined as any,
    responseBlockHeight: 550,
    urlBasePath:""
  }

  return (
    <Stack className='rest-import-ui'>
      <RestImport restImportConfig={config} language='en' />
    </Stack>
  )
}