import { Stack } from '@mui/material'
import WebServiceModal from './core/components/WebServiceModal'
import { BodyParamsI, HeaderAndQueryI } from './core/components/Table'

export interface restImportConfigI {
  url?: string
  httpMethod?: "GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT"
  useProxy?: boolean
  httpAuth?: "NONE" | "BASIC" | "OAUTH2.0"
  headerParams?: HeaderAndQueryI[]
  bodyParams?: string
  userName?: string
  userPassword?: string
  multipartParams?: BodyParamsI[]
  contentType?: string
}

export default function App() {


  return (
    <>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={{}} language='en' />
      </Stack>
    </>
  )
}