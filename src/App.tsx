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

  const config: restImportConfigI = {
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
  }

  return (
    <>
      <Stack className='rest-import-ui'>
        <WebServiceModal restImportConfig={config} language='en' />
      </Stack>
    </>
  )
}