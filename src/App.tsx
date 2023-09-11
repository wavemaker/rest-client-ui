import { Stack } from '@mui/material'
import WebServiceModal from './core/components/WebServiceModal'
import { restImportConfigI } from './core/components/WebServiceModal'
import { Provider } from 'react-redux'
import appStore from './core/components/appStore/Store';
import { AxiosResponse } from 'axios';
import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

export default function App() {
  const data = {
    test: true,
    newSda: "rwef "
  }
  const [monacoEditorValue, setmonacoEditorValue] = useState(JSON.stringify(data, null, 2))
  const [hideMonacoEditor, sethideMonacoEditor] = useState(false)
  const config: restImportConfigI = {
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
      proxy_path: '', // /projects/{projectID}/restservices/invoke?optimizeResponse=true
      list_provider: "/oauth2/providers/default",
      getprovider: "", // /projects/{projectID}/oauth2/providers
      addprovider: "", // /projects/{projectID}/oauth2/providers
      authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
    },
    error: {
      errorFunction: (msg: string, response?: AxiosResponse) => {
        alert(msg)
      },
      errorMethod: "customFunction",
      errorMessageTimeout: 5000
    },
    handleResponse: (response?: AxiosResponse) => { 
      setmonacoEditorValue(JSON.stringify(response?.data, null, 2))
    },
    hideMonacoEditor: (value: boolean) => {
      sethideMonacoEditor(value)
    }
  }

  return (
    <Provider store={appStore}>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={config} language='en' />
        {!hideMonacoEditor && <Editor
          height="200px"
          width={'100%'}
          language="json"
          path={'file.json'}
          theme="vs-dark"
          value={monacoEditorValue}
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            }
          }} />}
      </Stack>
    </Provider>
  )
}