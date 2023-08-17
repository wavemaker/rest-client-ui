import { Stack } from '@mui/material';
import WebServiceModal from './core/components/WebServiceModal';
export default function App() {
    const config = {
        url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
        httpMethod: 'POST',
        useProxy: true,
        httpAuth: "BASIC",
        bodyParams: "{userName:password}",
        userName: "userName",
        userPassword: "userPassword",
        headerParams: [
            {
                name: 'New',
                type: 'string',
                value: 'application'
            }
        ],
        multipartParams: [
            {
                name: "post",
                type: "file",
                value: "fe"
            }
        ],
        contentType: 'multipart/form-data'
    };
    return (<>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={config} language='en'/>
      </Stack>
    </>);
}
