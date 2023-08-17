import { Stack } from '@mui/material';
import WebServiceModal from './core/components/WebServiceModal';
export default function App() {
    const config = {
        proxy_conf: {
            "base_path": "http://localhost:5000",
            "proxy_path": "/restimport",
            "list_provider": "/get-default-provider",
            "getprovider": "/getprovider",
            "addprovider": "/addprovider"
        },
        default_proxy_state: "ON",
        oAuthConfig: {
            "base_path": "https://www.wavemakeronline.com/studio/services",
            "list_provider": "https://www.wavemakeronline.com/studio/services/oauth2/providers/default",
            "getprovider": "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
            "addprovider": "https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers"
        },
    };
    return (<>
      <Stack className='rest-import-ui'>
        <WebServiceModal language='en' proxyConfig={config}/>
      </Stack>
    </>);
}
