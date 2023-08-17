import { Stack } from '@mui/material';
import WebServiceModal from './core/components/WebServiceModal';
export default function App() {
    return (<>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={{}} language='en'/>
      </Stack>
    </>);
}
