import React, { ReactNode, useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    Box, FormControl, FormLabel, Grid, IconButton, Link, MenuItem, Paper, Select, SelectChangeEvent, Stack, Switch, Tab, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography, Button,
    TextareaAutosize
} from '@mui/material'
import ProviderModal from './ProviderModal'
import { BodyParamsI, HeaderAndQueryTable, MultipartTable, HeaderAndQueryI, TableRowStyled } from './Table'
import {
    findDuplicateObjects, findDuplicatesAcrossArrays, getSubstring, httpStatusCodes, isValidUrl, removeDuplicatesByComparison,
    removeDuplicatesKeepFirst
} from './common/common'
import InfoIcon from '@mui/icons-material/Info'
import AddIcon from '@mui/icons-material/Add'
import DoneIcon from '@mui/icons-material/Done'
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-json"
import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/ext-language_tools"
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import Apicall from './common/apicall'
import { encode } from 'js-base64';
import toast, { Toaster } from 'react-hot-toast'
import FallbackSpinner from './common/loader'
import { useTranslation } from 'react-i18next';
import { restImportConfigI } from '../../App'
interface TabPanelProps {
    children?: ReactNode
    index: number
    value: number
}
export interface PathParamsI {
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

export function handleToastError(message: string) {
    toast.error(message)
}

export default function WebServiceModal({ language, restImportConfig }: { language: string, restImportConfig?: restImportConfigI }) {
    const defaultValueforHandQParams = { name: '', value: '', type: '' }
    const { t: translate, i18n } = useTranslation();
    const [apiURL, setapiURL] = useState<string>(restImportConfig?.url || '')
    const [httpMethod, sethttpMethod] = useState<"GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT">(restImportConfig?.httpMethod || 'GET')
    const [useProxy, setuseProxy] = useState<boolean>(restImportConfig?.useProxy === true ? true : false)
    const [requestTabValue, setrequestTabValue] = useState(0)
    const [responseTabValue, setresponseTabValue] = useState(0)
    const [httpAuth, sethttpAuth] = useState<"NONE" | "BASIC" | "OAUTH2.0">(restImportConfig?.httpAuth || 'NONE')
    const [providerOpen, setproviderOpen] = useState(false)
    const [headerParams, setheaderParams] = useState<HeaderAndQueryI[]>(restImportConfig?.headerParams?.concat(defaultValueforHandQParams) || [defaultValueforHandQParams])
    const [queryParams, setqueryParams] = useState<HeaderAndQueryI[]>([defaultValueforHandQParams])
    const [bodyParams, setbodyParams] = useState<string>(restImportConfig?.bodyParams || '')
    const [multipartParams, setmultipartParams] = useState<BodyParamsI[]>(restImportConfig?.multipartParams?.concat({ name: '', value: '', type: 'file', filename: '' }) || [{ name: '', value: '', type: 'file', filename: '' }])
    const [pathParams, setpathParams] = useState<PathParamsI[]>([])
    const [contentType, setcontentType] = useState(restImportConfig?.contentType || 'application/json')
    const [addCustomType, setaddCustomType] = useState(false)
    const [contentTypes, setcontentTypes] = useState(defaultContentTypes)
    const [newContentType, setnewContentType] = useState('')
    const [responseEditorValue, setresponseEditorValue] = useState('')
    const [response, setresponse] = useState<AxiosResponse>()
    const [userName, setuserName] = useState(restImportConfig?.userName || '')
    const [userPassword, setuserPassword] = useState(restImportConfig?.userPassword || '')
    const [loading, setloading] = useState(false)

    useEffect(() => {
        i18n.changeLanguage(language);
        handleChangeResponseTabs(null, responseTabValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])


    const getPathParams = () => {
        let paths = getSubstring(apiURL.split("?")[0], "{", "}")
        if (paths.length > 0) {
            const pathParamsClone = [...pathParams]
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
            paths = paths.filter((item, index) => paths.indexOf(item) === index)
            paths.forEach((path) => {
                if (!checkPath(path))
                    if (path !== '')
                        newPathParams.push({ name: path, value: "" })
            })
            const headerParamsClone = [...headerParams]
            const queryParamsClone = [...queryParams]
            const duplicates = findDuplicatesAcrossArrays([headerParamsClone.slice(0, headerParamsClone.length - 1), queryParamsClone.slice(0, queryParamsClone.length - 1), newPathParams], "name")
            if (duplicates.length > 0) {
                handleToastError(`Parameter "${duplicates[0].name}" already exists`)
                setpathParams(removeDuplicatesByComparison(newPathParams, duplicates, "name"))
            } else
                setpathParams(newPathParams)
        }
        else
            setpathParams([])
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
    const handleChangeHeaderParams = (data: HeaderAndQueryI[]) => {
        setheaderParams(data)
    }
    const handleChangeQueryParams = (data: HeaderAndQueryI[]) => {
        setqueryParams(data)
    }
    const handlemultipartParams = (data: BodyParamsI[]) => {
        setmultipartParams(data)
    }
    const handleChangehttpAuth = (event: SelectChangeEvent) => {
        sethttpAuth(event.target.value as any)
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
        sethttpMethod(event.target.value as any)
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
                const queryNames = queries.map(query => {
                    const data = {
                        name: query.split('=')[0],
                        value: query.split('=')[1]
                    }
                    return data
                })
                const newQueryParams: HeaderAndQueryI[] = []
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
                const nonDuplicate = removeDuplicatesKeepFirst(queryNames, "name")
                const duplicates = findDuplicateObjects(queryNames, "name")
                const headerParamsClone = [...headerParams]
                const paths = getSubstring(apiURL.split("?")[0], "{", "}")
                const pathParamsClone = paths.map(path => {
                    return { "name": path }
                })
                const allDuplicates = findDuplicatesAcrossArrays([nonDuplicate, headerParamsClone.slice(0, headerParamsClone.length - 1), pathParamsClone], "name")
                if (duplicates.length > 0) {
                    let apiURLCopy = apiURL
                    handleToastError("Queries cannot have duplicates, removed the dupicates")
                    duplicates.forEach((data) => {
                        apiURLCopy = apiURLCopy.replace(`&${data.name}=${data.value}`, '')
                    })
                    setapiURL(apiURLCopy)
                }
                if (allDuplicates.length > 0) {
                    return handleToastError(`parameter "${allDuplicates[0].name}" already exists`)
                } else {
                    nonDuplicate.forEach((data) => {
                        const key = data.name
                        const value = data.value
                        if (!checkQuery(key, value)) {
                            if (key !== '' && value !== '')
                                newQueryParams.push({ name: key, value: value, type: "string" })
                        }
                    })
                }
                newQueryParams.push({ name: '', value: '', type: '' })
                setqueryParams(newQueryParams)
            }
            else {
                setqueryParams([{ name: '', value: '', type: '' }])
            }
        }
        else {
            setqueryParams([{ name: '', value: '', type: '' }])
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
        if (apiURL.length > 0) {
            let header: any = {}, body;
            let requestAPI = apiURL
            pathParams.forEach((params) => {
                if (params.value.trim() !== "")
                    requestAPI = requestAPI.replace(`{${params.name}}`, params.value)
                else
                    return handleToastError(translate("PATHPARAMSALERT"))
            })
            if (isValidUrl(requestAPI)) {
                if (httpAuth === "BASIC") {
                    if (userName.trim() === "")
                        return handleToastError("Please enter a username for basic authentication")
                    if (userPassword.trim() === "")
                        return handleToastError("Please enter a password for basic authentication")
                }
                headerParams.forEach((data, index) => {
                    if (httpAuth === "BASIC" && index === 0)
                        header["Authorization"] = 'Basic ' + encode(userName + ':' + userPassword)
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
                    body = bodyParams
                const configWOProxy: AxiosRequestConfig = {
                    url: requestAPI,
                    headers: header,
                    method: httpMethod,
                    data: body
                }
                const configWProxy: AxiosRequestConfig = {
                    url: "http://localhost:5000/restimport",
                    data: {
                        "endpointAddress": requestAPI,
                        "method": httpMethod,
                        "contentType": contentType,
                        "requestBody": body,
                        "headers": header,
                        "authDetails": null
                    },
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
                setloading(true)
                const config = useProxy ? configWProxy : configWOProxy
                console.log(config)
                const response: any = await Apicall(config)
                console.log(response)
                handleResponse(response)
                setloading(false)
            } else
                handleToastError(translate("VALID_URL_ALERT"))
        }
        else
            handleToastError(translate("VALID_URL_ALERT"))
    }
    function handleResponse(response: any): void {
        let responseValue;
        if (useProxy) {
            if (response.status >= 200 && response.status < 300)
                if (response.data.statusCode >= 200 && response.data.statusCode < 300)
                    responseValue = { data: response.data.responseBody !== "" ? JSON.parse(response.data.responseBody) : response.data.responseBody, status: response?.data.statusCode + " " + httpStatusCodes.get(response?.data.statusCode), headers: response?.data.headers }
                else
                    responseValue = { data: response?.data.responseBody, status: response?.data.statusCode + " " + httpStatusCodes.get(response?.data.statusCode), headers: response?.data.headers }
            else
                responseValue = { data: httpStatusCodes.get(response?.response?.status), status: response?.response?.data.status + " " + httpStatusCodes.get(response?.response?.data.status), headers: response?.response?.headers }
        } else {
            if (response.status >= 200 && response.status < 300)
                responseValue = { data: response?.data, status: response?.status + " " + httpStatusCodes.get(response?.status), headers: response?.headers }
            else if (response.response !== undefined)
                responseValue = { data: response.response?.data, status: response?.response.status + " " + httpStatusCodes.get(response.response?.status), headers: response.response?.headers }
            else
                responseValue = { data: response.message, status: response?.response?.data.status + " " + httpStatusCodes.get(response?.response?.data.status), headers: response?.response?.headers }
        }
        if (responseValue.data === undefined || responseValue.headers === undefined) {
            responseValue = { data: response.message, status: response.code, headers: {} }
        }
        setresponse(responseValue as any)
    }

    return (
        <>
            {loading ? <FallbackSpinner /> :
                <Stack className='rest-import-ui'>
                    <Toaster position='top-right' />
                    <Grid gap={5} p={2} className='cmnflx' container>
                        <Grid sx={{ backgroundColor: 'lightgray' }} item md={12}>
                            <Stack p={2} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='h6' fontWeight={600}>{translate('WEB_SERVICE')}</Typography>
                                <Stack spacing={1} className='cmnflx' direction={'row'}>
                                    <Tooltip title={translate("DELETE")}>
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Link sx={{ color: 'gray' }}>{translate('HELP')}</Link>
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
                                        <MenuItem value={'GET'}>{'GET'}</MenuItem>
                                        <MenuItem value={'POST'}>{'POST'}</MenuItem>
                                        <MenuItem value={'PUT'}>{'PUT'}</MenuItem>
                                        <MenuItem value={'HEAD'}>{'HEAD'}</MenuItem>
                                        <MenuItem value={'PATCH'}>{'PATCH'}</MenuItem>
                                        <MenuItem value={'DELETE'}>{'DELETE'}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField onBlur={() => {
                                    getPathParams()
                                    handleQueryChange()
                                }} autoFocus={true} value={apiURL} onChange={(e) => setapiURL(e.target.value)} size='small' fullWidth label={translate('URL')} placeholder={translate('URL')} />
                                <Button onClick={handleTestClick} variant='contained'>{translate('TEST')}</Button>
                            </Stack>
                        </Grid>
                        <Grid item md={12}>
                            <Grid container>
                                <Grid item md={6}>
                                    <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                        <Typography>{translate('SERVICE_NAME')}</Typography>
                                        <TextField disabled size='small' />
                                    </Stack>
                                </Grid>
                                <Grid item md={6}>
                                    <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                        <Typography>{translate('USE_PROXY')}</Typography>
                                        <Switch checked={useProxy} onChange={handleChangeProxy} />
                                        <Tooltip title={translate("DELETE")}>
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
                                        <Tab label={translate("AUTHORIZATION")} />
                                        <Tab label={translate("HEADER") + " " + translate("PARAMS")} />
                                        <Tab label={translate("BODY") + " " + translate("PARAMS")} disabled={httpMethod === "GET" ? true : false} />
                                        <Tab label={translate("QUERY") + " " + translate("PARAMS")} />
                                        <Tab label={translate("PATH") + " " + translate("PARAMS")} />
                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={requestTabValue} index={0}>
                                    <Grid spacing={2} mt={2} className='cmnflx' container>
                                        <Grid item md={3}>
                                            <Typography>{translate('HTTP') + " " + translate("AUTHENTICATION")}</Typography>
                                        </Grid>
                                        <Grid item md={9}>
                                            <FormControl size='small' >
                                                <Select
                                                    value={httpAuth}
                                                    onChange={handleChangehttpAuth}
                                                >
                                                    <MenuItem value={'NONE'}>{translate("NONE")}</MenuItem>
                                                    <MenuItem value={'BASIC'}>{translate("BASIC")}</MenuItem>
                                                    <MenuItem value={'OAUTH2.0'}>{translate("OAUTH")} 2.0</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {httpAuth === "BASIC" && <>
                                            <Grid item md={3}>
                                                <Typography>{translate("USER_NAME")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack direction={'row'}>
                                                    <TextField value={userName} onChange={(e) => setuserName(e.target.value)} size='small' label={translate("USER_NAME")} placeholder={translate("USER_NAME")} />
                                                    <Tooltip title={translate("DELETE")}>
                                                        <IconButton>
                                                            <HelpOutlineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Grid>
                                            <Grid item md={3}>
                                                <Typography>{translate("PASSWORD")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack direction={'row'}>
                                                    <TextField value={userPassword} onChange={(e) => setuserPassword(e.target.value)} size='small' label={translate("PASSWORD")} placeholder={translate("PASSWORD")} />
                                                    <Tooltip title={translate("DELETE")}>
                                                        <IconButton>
                                                            <HelpOutlineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Grid>
                                        </>}
                                        {httpAuth === "OAUTH2.0" && <>
                                            <Grid item md={3}>
                                                <Typography>{translate("OAuth") + " " + translate("PROVIDER")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack spacing={2} direction={'row'}>
                                                    <TextField disabled size='small' label={translate("NO") + " " + translate("PROVIDER") + " " + translate("SELECTED_YET")} />
                                                    <Button onClick={() => setproviderOpen(true)} variant='contained'>{translate("SELECT") + "/" + translate("ADD") + " " + translate("PROVIDER")}</Button>
                                                </Stack>
                                            </Grid>
                                        </>}
                                    </Grid>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={1}>
                                    <HeaderAndQueryTable from='header' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={headerParams} setValue={handleChangeHeaderParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={2}>
                                    <Stack spacing={1} mt={2} ml={1}>
                                        <Stack spacing={10} display={'flex'} alignItems={'center'} direction={'row'}>
                                            <Typography>{translate("CONTENT") + " " + translate("TYPE")}</Typography>
                                            <Stack spacing={3} display={'flex'} alignItems={'center'} direction={'row'}>
                                                <FormControl size='small' sx={{ width: "20em" }}>
                                                    <Select
                                                        value={contentType}
                                                        onChange={handleChangecontentType}
                                                    >
                                                        {contentTypes.map((data) => <MenuItem key={data.value} value={data.value}>{translate(data.label)}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                                <Tooltip title={translate("DELETE")}>
                                                    <IconButton>
                                                        <HelpOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {addCustomType ? <Stack direction={'row'}>
                                                    <TextField value={newContentType} onChange={(e) => setnewContentType(e.target.value)} size='small' />
                                                    <Tooltip title={translate("ADD")}>
                                                        <IconButton>
                                                            <DoneIcon onClick={() => handleAddCustomContentType()} sx={{ cursor: 'pointer', color: 'black' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack> :
                                                    <Tooltip title={translate("CUSTOM_CONTENT_TYPE")}>
                                                        <IconButton>
                                                            <AddIcon onClick={() => setaddCustomType(true)} sx={{ cursor: 'pointer', color: 'black' }} />
                                                        </IconButton>
                                                    </Tooltip>}
                                            </Stack>
                                        </Stack>
                                        {contentType === 'multipart/form-data' ? <MultipartTable value={multipartParams} setValue={handlemultipartParams} /> :
                                            <TextareaAutosize style={{ padding: 2 }} value={bodyParams} onChange={(e) => setbodyParams(e.target.value)} minRows={8} placeholder={translate('REQUEST') + " " + translate('BODY') + ":" + translate('REQUEST_BODY_PLACEHOLDER')} />
                                        }
                                    </Stack>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={3}>
                                    <HeaderAndQueryTable from='query' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={queryParams} setValue={handleChangeQueryParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={4}>
                                    {pathParams.length > 0 ? <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                                                    <TableCell align='center'>{translate("NAME")}</TableCell>
                                                    <TableCell align='center'>{translate("TYPE")}</TableCell>
                                                    <TableCell align='center'>{translate("VALUE")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pathParams.map((data, index) =>
                                                    <TableRowStyled key={index}>
                                                        <TableCell align='center'>
                                                            <FormLabel>{data.name}</FormLabel>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <FormLabel>{translate("String")}</FormLabel>
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
                                                    {translate('NO_PATH_PARAMS')}
                                                    {translate('NO_PATH_PARAMS_DESC')}
                                                </Typography>
                                                <Typography>
                                                    {`e.g. For URL "http:wavemaker.com/projects/{pid}/?mode=json", "pid" is the path param.`}
                                                    (<a href='https://docs.wavemaker.com/learn/app-development/services/web-services/rest-services/'>{translate("MORE_INFO")}</a>)
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
                                        <Tab label={translate("RESPONSE") + " " + translate("BODY")} />
                                        <Tab label={translate("RESPONSE") + " " + translate("HEADER")} />
                                        <Tab label={translate("RESPONSE") + " " + translate("STATUS")} />
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
                </Stack>}
        </>
    );
}