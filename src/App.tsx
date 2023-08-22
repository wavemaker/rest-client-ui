import { Stack } from '@mui/material'
import WebServiceModal from './core/components/WebServiceModal'
import { restImportConfigI } from './core/components/WebServiceModal'
import { Provider } from 'react-redux'
import appStore from './core/components/appStore/Store';

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
    default_proxy_state: "ON",
    oAuthConfig: {
      base_path: "https://www.wavemakeronline.com/studio/services",
      project_id: "",
      list_provider:
        "/oauth2/providers/default",
      getprovider: "",
      addprovider: "",
      authorizationUrl: "/authorizationUrl",
    },
  }

  return (
    <Provider store={appStore}>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={config} language='en' />
      </Stack>
    </Provider>
  )
}