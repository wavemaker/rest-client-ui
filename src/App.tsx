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
    url: "https://ap16.salesforce.com/services/oauth2/token",
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
        name: 'username',
        value: "sowmya.vootukuri@wavemaker.com",
        type: 'string',
        contentType: "text",
      },
      {
        name: 'password',
        value: "salesforce1PZOViGiUsNE75YWZkzYd6xMRu",
        type: 'string',
        contentType: "text/plain",
      },
      {
        name: 'client_secret',
        value: "E829FBA5784C5591E1105A75ABCB2CD1624B60B443150FB98D3650D37E96AC44",
        type: 'string',
        contentType: "text",
      },
      {
        name: 'client_id',
        value: "3MVG9n_HvETGhr3D3gNFyPk0_DyOexJx0TYjZxuPpJrOql2YS3ReaYYtboe34HhKqkfm8hhoEqmNhqlwLF8s4",
        type: 'string',
        contentType: "text",
      },
      {
        name: 'grant_type',
        value: "password",
        type: 'string',
        contentType: "text",
      },
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