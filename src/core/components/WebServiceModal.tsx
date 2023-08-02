import React, { ReactNode, useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    Box, FormControl, FormLabel, Grid, IconButton, Link, MenuItem, Paper, Select, SelectChangeEvent, Stack, Switch, Tab, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography, Button,
    TextareaAutosize
} from '@mui/material'
import ProviderModal from './ProviderModal'
import { BodyParamsI, HeaderAndQueryTable, MultipartTable, TableI, TableRowStyled } from './Table'
import { getSubstring } from '../../common/common'
import InfoIcon from '@mui/icons-material/Info'
import AddIcon from '@mui/icons-material/Add'
import DoneIcon from '@mui/icons-material/Done'
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-json"
import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/ext-language_tools"
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import Apicall from '../../common/apicall'

interface TabPanelProps {
    children?: ReactNode
    index: number
    value: number
}
interface PathParamsI {
    name: string
    value: string
}
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
const defaultContentTypes = [
    {
        label: "application/json", value: "application/json"
    },
    {
        label: 'application/octet-stream', value: 'application/octet-stream'
    },
    {
        label: 'application/pdf', value: 'application/pdf'
    },
    {
        label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded'
    },
    {
        label: 'application/xml', value: "application/xml"
    },
    {
        label: 'multipart/form-data', value: 'multipart/form-data'
    },
    {
        label: 'text/html', value: 'text/html'
    },
    {
        label: 'text/plain', value: 'text/plain'
    },
]
export default function WebServiceModal() {
    const [apiURL, setapiURL] = useState('')
    const [httpMethod, sethttpMethod] = useState('GET')
    const [useProxy, setuseProxy] = useState(true)
    const [requestTabValue, setrequestTabValue] = useState(0)
    const [responseTabValue, setresponseTabValue] = useState(0)
    const [httpAuth, sethttpAuth] = useState('None')
    const [providerOpen, setproviderOpen] = useState(false)
    const [headerParams, setheaderParams] = useState<TableI[]>([{ name: '', value: '', type: '' }])
    const [queryParams, setqueryParams] = useState<TableI[]>([{ name: '', value: '', type: '' }])
    const [bodyParams, setbodyParams] = useState('')
    const [multipartParams, setmultipartParams] = useState<BodyParamsI[]>([{ name: '', value: '', type: 'file', filename: '' }])
    const [pathParams, setpathParams] = useState<PathParamsI[]>([])
    const [contentType, setcontentType] = useState('application/json')
    const [addCustomType, setaddCustomType] = useState(false)
    const [contentTypes, setcontentTypes] = useState(defaultContentTypes)
    const [newContentType, setnewContentType] = useState('')
    const [responseEditorValue, setresponseEditorValue] = useState('')
    const [response, setresponse] = useState<AxiosResponse>()

    useEffect(() => {
        handleChangeResponseTabs(null, responseTabValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])


    const getPathParams = () => {
        if (getSubstring(apiURL, "{", "}").length > 0) {
            const pathParamsClone = [...pathParams]
            const paths = getSubstring(apiURL, "{", "}")
            const newPathParams: PathParamsI[] = []
            const checkPath = (name: string): boolean => {
                let returnBool = false
                pathParamsClone.forEach((obj, index) => {
                    if (obj.name === name) {
                        if (!newPathParams.some(e => e.name === name)) {
                            pathParamsClone.splice(index, 1)
                            returnBool = true
                            newPathParams.push({ name: name, value: obj.value })
                        }
                    }
                })
                return returnBool
            }
            paths.forEach((path) => {
                if (!checkPath(path))
                    if (path !== '')
                        newPathParams.push({ name: path, value: "" })
            })
            setpathParams(newPathParams)
        }
        else {
            setpathParams([])
        }
    }
    const handlePathParamsChanges = (value: string, currentIndex: number) => {
        const pathParamsClone = [...pathParams]
        pathParamsClone.map((data, index) => {
            if (index === currentIndex)
                data.value = value
            return data
        })
        setpathParams(pathParamsClone)
    }
    const handleCloseProvider = () => {
        setproviderOpen(false)
    }
    const handleChangeapiURL = (value: string) => {
        setapiURL(value)
    }
    const handleChangeHeaderParams = (data: TableI[]) => {
        setheaderParams(data)
    }
    const handleChangeQueryParams = (data: TableI[]) => {
        setqueryParams(data)
    }
    const handlemultipartParams = (data: BodyParamsI[]) => {
        setmultipartParams(data)
    }
    const handleChangehttpAuth = (event: SelectChangeEvent) => {
        sethttpAuth(event.target.value as string)
    }
    const handleChangeHeaderTabs = (event: React.SyntheticEvent, newValue: number) => {
        setrequestTabValue(newValue);
    };
    const handleChangeResponseTabs = (event: any, newValue: number) => {
        switch (newValue) {
            case 0:
                setresponseEditorValue(JSON.stringify(response?.data, undefined, 2))
                break
            case 1:
                setresponseEditorValue(JSON.stringify(response?.headers, undefined, 2))
                break
            case 2:
                setresponseEditorValue(JSON.stringify({ statusCode: response?.status }, undefined, 2))
                break
        }
        setresponseTabValue(newValue);
    };
    const handleChangehttpMethod = (event: SelectChangeEvent) => {
        sethttpMethod(event.target.value as string)
    }
    const handleChangecontentType = (event: SelectChangeEvent) => {
        setcontentType(event.target.value as string)
    }
    const handleChangeProxy = (event: React.ChangeEvent<HTMLInputElement>) => {
        setuseProxy(event.target.checked);
    }
    const handleQueryChange = () => {
        if (apiURL !== '') {
            const query = apiURL?.split('?')[1]
            const queries = query?.split('&')
            if (query) {
                const newQueryParams: TableI[] = []
                const queryParamsClone = [...queryParams]
                const checkQuery = (name: string, value: string): boolean => {
                    let returnBool = false
                    queryParamsClone.forEach((obj, index) => {
                        if (queryParams.length === 1)
                            return returnBool
                        if (obj.name === name) {
                            if (!newQueryParams.some(e => e.name === name)) {
                                if (name !== '' && value !== '' && value !== undefined) {
                                    queryParamsClone.splice(index, 1)
                                    returnBool = true
                                    newQueryParams.push({ name: name, value: value, type: obj.type })
                                }
                            }
                        }
                    })
                    return returnBool
                }
                queries.forEach((data) => {
                    const key = data.split('=')[0]
                    const value = data.split('=')[1]
                    if (!checkQuery(key, value)) {
                        if (key !== '' && value !== '')
                            newQueryParams.push({ name: key, value: value, type: "string" })
                    }
                })
                newQueryParams.push({ name: '', value: '', type: '' })
                setqueryParams(newQueryParams)
            }
            else {
                setqueryParams([{ name: '', value: '', type: '' }])
            }
        }
    }
    const handleAddCustomContentType = () => {
        if (!contentTypes.find(e => e.value === newContentType)) {
            const contentTypesClone = [...contentTypes]
            contentTypesClone.push({
                label: newContentType,
                value: newContentType
            })
            setcontentTypes(contentTypesClone)
            setaddCustomType(false)
            setcontentType(newContentType)
            setnewContentType("")
        }
        else {
            setaddCustomType(false)
            setcontentType(newContentType)
            setnewContentType("")
        }
    }
    const handleResponseEditorChange = (newValue: string) => {
        setresponseEditorValue(newValue)
    }
    const handleTestClick = async () => {
        let header: any = {}, body;
        let requestAPI = apiURL
        pathParams.forEach((params) => {
            requestAPI = requestAPI.replace(`{${params.name}}`, params.value)
        })
        headerParams.forEach((data, index) => {
            if (headerParams.length - 1 !== index)
                header[data.name] = data.value
        })
        if (contentType === 'multipart/form-data') {
            const formData = new FormData()
            multipartParams.forEach((data, index) => {
                if (multipartParams.length - 1 !== index)
                    formData.append(data.name, data.value)
            })
            body = formData
        } else
            body = JSON.stringify(bodyParams)
        const configWOProxy: AxiosRequestConfig = {
            url: requestAPI,
            headers: header,
            method: httpMethod,
            data: body
        }
        const configWProxy: AxiosRequestConfig = {
            url: "https://stage-studio.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f52524018968db801516c9/restservices/invoke?optimizeResponse=true",
            data: {
                "endpointAddress": requestAPI,
                "method": httpMethod,
                "contentType": contentType,
                "requestBody": body,
                "headers": header,
                "authDetails": null
            },
            method: "POST",
        }
        const config = useProxy ? configWProxy : configWOProxy
        const response: AxiosResponse = await Apicall(config)
        console.log(response)
        //@ts-ignore
        const checkResponse = response.status >= 200 && response.status < 300 ? response : response.response
        setresponse(checkResponse)
    }

    return (
        <>
            <Grid gap={5} p={2} className='cmnflx' container>
                <Grid sx={{ backgroundColor: 'lightgray' }} item md={12}>
                    <Stack p={2} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>Web Service</Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <Tooltip title="Delete">
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Link sx={{ color: 'gray' }}>Help</Link>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item md={12}>
                    <Stack spacing={5} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <FormControl sx={{ minWidth: 120 }} size='small'>
                            <Select
                                value={httpMethod}
                                onChange={handleChangehttpMethod}
                            >
                                <MenuItem value={'GET'}>GET</MenuItem>
                                <MenuItem value={'POST'}>POST</MenuItem>
                                <MenuItem value={'PUT'}>PUT</MenuItem>
                                <MenuItem value={'HEAD'}>HEAD</MenuItem>
                                <MenuItem value={'PATCH'}>PATCH</MenuItem>
                                <MenuItem value={'DELETE'}>DELETE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField onBlur={() => {
                            getPathParams()
                            handleQueryChange()
                        }} value={apiURL} onChange={(e) => setapiURL(e.target.value)} size='small' fullWidth label="URL" placeholder='URL' />
                        <Button onClick={handleTestClick} variant='contained'>Test</Button>
                    </Stack>
                </Grid>
                <Grid item md={12}>
                    <Grid container>
                        <Grid item md={6}>
                            <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                <Typography>Service Name</Typography>
                                <TextField disabled size='small' />
                            </Stack>
                        </Grid>
                        <Grid item md={6}>
                            <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                <Typography>Use Proxy</Typography>
                                <Switch checked={useProxy} onChange={handleChangeProxy} />
                                <Tooltip title="Delete">
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f3f5f6' }}>
                            <Tabs value={requestTabValue} onChange={handleChangeHeaderTabs}>
                                <Tab label="Authorization" />
                                <Tab label="Header Params" />
                                <Tab label="Body Params" disabled={httpMethod === "GET" ? true : false} />
                                <Tab label="Query Params" />
                                <Tab label="Path Params" />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={requestTabValue} index={0}>
                            <Grid spacing={2} mt={2} className='cmnflx' container>
                                <Grid item md={3}>
                                    <Typography>HTTP Authentication</Typography>
                                </Grid>
                                <Grid item md={9}>
                                    <FormControl size='small' >
                                        <Select
                                            value={httpAuth}
                                            onChange={handleChangehttpAuth}
                                        >
                                            <MenuItem value={'None'}>None</MenuItem>
                                            <MenuItem value={'Basic'}>Basic</MenuItem>
                                            <MenuItem value={'OAuth 2.0'}>OAuth 2.0</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {httpAuth === "Basic" && <>
                                    <Grid item md={3}>
                                        <Typography>User Name</Typography>
                                    </Grid>
                                    <Grid item md={9}>
                                        <Stack direction={'row'}>
                                            <TextField size='small' label="User Name" placeholder='User Name' />
                                            <Tooltip title="Delete">
                                                <IconButton>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Grid>
                                    <Grid item md={3}>
                                        <Typography>Password</Typography>
                                    </Grid>
                                    <Grid item md={9}>
                                        <Stack direction={'row'}>
                                            <TextField size='small' label="Password" placeholder='Password' />
                                            <Tooltip title="Delete">
                                                <IconButton>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Grid>
                                </>}
                                {httpAuth === "OAuth 2.0" && <>
                                    <Grid item md={3}>
                                        <Typography>OAuth Provider</Typography>
                                    </Grid>
                                    <Grid item md={9}>
                                        <Stack spacing={2} direction={'row'}>
                                            <TextField size='small' label="No Provider Selected yet" />
                                            <Button onClick={() => setproviderOpen(true)} variant='contained'>Select/Add Provider</Button>
                                        </Stack>
                                    </Grid>
                                </>}
                            </Grid>
                        </CustomTabPanel>
                        <CustomTabPanel value={requestTabValue} index={1}>
                            <HeaderAndQueryTable from='header' value={headerParams} setValue={handleChangeHeaderParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
                        </CustomTabPanel>
                        <CustomTabPanel value={requestTabValue} index={2}>
                            <Stack spacing={1} mt={2} ml={1}>
                                <Stack spacing={10} display={'flex'} alignItems={'center'} direction={'row'}>
                                    <Typography>Content Type</Typography>
                                    <Stack spacing={3} display={'flex'} alignItems={'center'} direction={'row'}>
                                        <FormControl size='small' sx={{ width: "20em" }}>
                                            <Select
                                                value={contentType}
                                                onChange={handleChangecontentType}
                                            >
                                                {contentTypes.map((data) => <MenuItem key={data.value} value={data.value}>{data.label}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <Tooltip title="Delete">
                                            <IconButton>
                                                <HelpOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {addCustomType ? <Stack direction={'row'}>
                                            <TextField value={newContentType} onChange={(e) => setnewContentType(e.target.value)} size='small' />
                                            <Tooltip title="Add">
                                                <IconButton>
                                                    <DoneIcon onClick={() => handleAddCustomContentType()} sx={{ cursor: 'pointer', color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack> :
                                            <Tooltip title="Add a Custom Content Type">
                                                <IconButton>
                                                    <AddIcon onClick={() => setaddCustomType(true)} sx={{ cursor: 'pointer', color: 'black' }} />
                                                </IconButton>
                                            </Tooltip>}
                                    </Stack>
                                </Stack>
                                {contentType === 'multipart/form-data' ? <MultipartTable value={multipartParams} setValue={handlemultipartParams} /> :
                                    <TextareaAutosize value={bodyParams} onChange={(e) => setbodyParams(e.target.value)} minRows={8} placeholder='Request Body: Provide sample POST data here that the service would consume' />
                                }
                            </Stack>
                        </CustomTabPanel>
                        <CustomTabPanel value={requestTabValue} index={3}>
                            <HeaderAndQueryTable from='query' value={queryParams} setValue={handleChangeQueryParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
                        </CustomTabPanel>
                        <CustomTabPanel value={requestTabValue} index={4}>
                            {pathParams.length > 0 ? <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                                            <TableCell align='center'>Name</TableCell>
                                            <TableCell align='center'>Type</TableCell>
                                            <TableCell align='center'>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pathParams.map((data, index) =>
                                            <TableRowStyled key={index}>
                                                <TableCell align='center'>
                                                    <FormLabel>{data.name}</FormLabel>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <FormLabel>String</FormLabel>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <TextField value={data.value} onChange={(e) => handlePathParamsChanges(e.target.value, index)} size='small' />
                                                </TableCell>
                                            </TableRowStyled>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer> :
                                <Stack p={2} spacing={1} direction={'row'} sx={{ backgroundColor: "#d9edf7" }}>
                                    <InfoIcon sx={{ height: 18, width: 18, color: '#31708f', mt: 0.5 }} />
                                    <Stack>
                                        <Typography>
                                            {`No path param found. A path param is used against certain entity of the URL that is required to change dynamically.
                                            A path param can be set by enclosing an entity in the URL in a curly bracket "{}".`}
                                        </Typography>
                                        <Typography>
                                            {`e.g. For URL "http:wavemaker.com/projects/{pid}/?mode=json", "pid" is the path param. (More info)`}
                                        </Typography>
                                    </Stack>
                                </Stack>}
                        </CustomTabPanel>
                    </Box>
                </Grid>
                <Grid item md={12}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f3f5f6' }}>
                            <Tabs value={responseTabValue} onChange={handleChangeResponseTabs}>
                                <Tab label="Response Body" />
                                <Tab label="Response Header" />
                                <Tab label="Response Status" />
                            </Tabs>
                        </Box>
                    </Box>
                    <AceEditor
                        setOptions={{ useWorker: false, printMargin: false, wrap: true }}
                        mode="json"
                        theme="dracula"
                        editorProps={{ $blockScrolling: true }}
                        style={{ height: "20em", width: "100%" }}
                        value={responseEditorValue}
                        onChange={handleResponseEditorChange}
                    />
                </Grid>
            </Grid>
            <ProviderModal handleOpen={providerOpen} handleClose={handleCloseProvider} />
        </>
    );
}