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
      settingsUpload: "settingUpload",
      getprovider: "getprovider",
      addprovider: "addprovider",
      authorizationUrl: "authorizationUrl",
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
    headerParams: [{
      name: "new",
      type: "DATE",
      value: "vew"
    }, {
      name: "ewf",
      type: "DATE",
      value: "vew"
    }, {
      name: "nefewwew",
      type: "DATE",
      value: "vew"
    }, {
      name: "newfwewe",
      type: "DATE",
      value: "vew"
    }, {
      name: "nfweew",
      type: "DATE",
      value: "vew"
    }, {
      name: "nfewew",
      type: "DATE",
      value: "vew"
    }, {
      name: "nfewww",
      type: "DATE",
      value: "vew"
    }, {
      name: "nefeww",
      type: "DATE",
      value: "vew"
    },],
    multipartParams: [
      {
        name: 'wm_data_json',
        value: `{
          "booleancol": true,
          "datecol": "2019-01-01",
          "floatcol": 121.121,
          "intcol": 123,
          "stringcol": "automation",
          "timecol": "12:12:12",
          "timestampcol": 1573018000,
          "datetimecol": "2019-01-01T12:12:12"
        }`,
        type: 'string',
        contentType: "application/json",
      },
      {
        name: 'blobcol',
        value: '',
        contentType: "file",
        type: 'file',
      },
      {
        name: 'filecol',
        value: '',
        contentType: "file",
        type: 'file',
      }
    ],
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
  }

  return (
    <Stack className='rest-import-ui'>
      <RestImport restImportConfig={config} language='en' />
    </Stack>
  )
}