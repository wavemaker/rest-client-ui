import React, { ReactNode, useEffect, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    Box, FormControl, FormLabel, Grid, IconButton, Link, MenuItem, Paper, Select, SelectChangeEvent, Stack, Switch, Tab, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography, Button,
    TextareaAutosize,
    Alert
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
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ConfigModel from './ConfigModel'
import { useSelector } from 'react-redux'
import '../../i18n';
interface TabPanelProps {
    children?: ReactNode
    index: number
    value: number
}
export interface PathParamsI {
    name: string
    value: string
}
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
    contentType?: string,
    proxy_conf: APII,
    default_proxy_state: string,
    oAuthConfig: APII,
    error: {
        errorMethod: "default" | "toast" | "customFunction",
        errorFunction: (msg: string) => void,
        errorMessageTimeout: number
    }
}

interface APII {
    base_path: string,
    proxy_path: string,
    list_provider: string,
    getprovider: string,
    addprovider: string,
    authorizationUrl: string,
    project_id?: string,
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

export default function WebServiceModal({ language, restImportConfig }: { language: string, restImportConfig: restImportConfigI }) {
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
    const [providerId, setProviderId] = useState('')
    const [configOpen, setConfigOpen] = useState(false)
    const [btnDisable, setBtnDisable] = useState(false)

    const [alertMsg, setAlertMsg] = useState<string | boolean>(false)
    const selectedProvider = useSelector((store: any) => store.slice.selectedProvider)
    const providerAuthURL = useSelector((store: any) => store.slice.providerAuthURL)


    useEffect(() => {
        setProviderId(selectedProvider.providerId)
        setBtnDisable(false)
    }, [selectedProvider])

    useEffect(() => {
        i18n.changeLanguage(language);
        handleChangeResponseTabs(null, responseTabValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])

    function handleToastError(message: string) {
        if (restImportConfig.error.errorMethod === 'default') {
            setAlertMsg(message)
            return setTimeout(() => {
                setAlertMsg(false)
            }, restImportConfig.error.errorMessageTimeout);
        }
        if (restImportConfig.error.errorMethod === 'toast')
            return toast.error(message)
        if (restImportConfig.error.errorMethod === 'customFunction')
            return restImportConfig.error.errorFunction(message)
    }

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
        if (event.target.value === 'OAUTH2.0' && !selectedProvider.providerId) {
            setBtnDisable(true)
        }
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
        if (newContentType && !contentTypes.find(e => e.value === newContentType)) {
            const contentTypesClone = [...contentTypes]
            contentTypesClone.push({
                label: newContentType,
                value: newContentType
            })
            setcontentTypes(contentTypesClone)
            setaddCustomType(false)
            setcontentType(newContentType)
            setnewContentType("")
        } else if (newContentType && contentTypes.find(e => e.value === newContentType)) {
            setaddCustomType(false)
            setcontentType(newContentType)
            setnewContentType("")
        }
        else {
            setaddCustomType(false)
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
            let isValidPathValue = true;
            pathParams.forEach((params) => {
                if (params.value.trim() !== "")
                    requestAPI = requestAPI.replace(`{${params.name}}`, params.value)
                else {
                    isValidPathValue = false;
                    return handleToastError(translate("PATHPARAMSALERT"))
                }
            })
            if (!isValidPathValue) return
            if (isValidUrl(requestAPI)) {
                if (httpAuth === "BASIC") {
                    if (userName.trim() === "")
                        return handleToastError("Please enter a username for basic authentication")
                    if (userPassword.trim() === "")
                        return handleToastError("Please enter a password for basic authentication")
                }
                if (httpAuth === "BASIC") {
                    header["Authorization"] = 'Basic ' + encode(userName + ':' + userPassword)
                }
                headerParams.forEach((data) => {
                    if (data.name && data.value)
                        header[data.name] = data.value
                })

                // header['content-type'] = contentType
                if (contentType === 'multipart/form-data') {
                    const formData = new FormData()
                    multipartParams.forEach((data, index) => {
                        if (multipartParams.length - 1 !== index)
                            formData.append(data.name, data.value)
                    })
                    body = formData
                } else
                    body = bodyParams

                if (httpAuth === "OAUTH2.0") {
                    let codeVerifier: string;
                    const clientId = selectedProvider.clientId;
                    let redirectUri = restImportConfig?.proxy_conf?.base_path + `/oauth2/${selectedProvider.providerId}/callback`;
                    const responseType = "code";
                    const state = "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==";
                    const scope = selectedProvider.scopes.length > 0 ? selectedProvider.scopes.map((scope: { value: any }) => scope.value).join(' ') : '';
                    let childWindow: any;
                    let authUrl: string
                    if (selectedProvider.oAuth2Pkce && selectedProvider.oAuth2Pkce.enabled) {
                        redirectUri = restImportConfig?.proxy_conf?.base_path + '/oAuthCallback.html'
                        const challengeMethod = selectedProvider.oAuth2Pkce.challengeMethod
                        codeVerifier = generateRandomCodeVerifier();
                        const encoder = new TextEncoder();
                        const data = encoder.encode(codeVerifier);

                        window.crypto.subtle.digest("SHA-256", data)
                            .then(hashBuffer => {
                                const codeChallenge = challengeMethod === "S256" ? base64URLEncode(hashBuffer) : codeVerifier;
                                authUrl = selectedProvider.authorizationUrl + `?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&&code_challenge=${codeChallenge}&code_challenge_method=${challengeMethod}`;
                                childWindow = window.open(authUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=400,height=600");
                            })
                            .catch(error => {
                                console.error("Error calculating code challenge:", error);
                            });
                    } else {
                        authUrl = selectedProvider.authorizationUrl + `?client_id=${clientId}&redirect_uri=${(redirectUri)}&response_type=${responseType}&state=${state}&scope=${(scope)}`;
                        childWindow = window.open(authUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=400,height=600");

                    }
                    // providerAuthURL
                    setloading(true)

                    const interval = setInterval(() => {
                        if (childWindow.closed) {
                            clearInterval(interval);
                            header['Authorization'] = `Bearer ` + null
                            handleRestAPI(header)
                        }
                    }, 1000);

                    const messageHandler = async (event: { origin: string; data: { accessToken: any; code: string; error: any } }) => {
                        const basePath = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path : restImportConfig?.oAuthConfig?.base_path
                        if (event.origin === basePath && event.data.accessToken) {
                            clearInterval(interval);
                            const token = event.data.accessToken
                            setTimeout(() => {
                                header['Authorization'] = `Bearer ` + token
                                handleRestAPI(header);
                            }, 100);
                            window.removeEventListener('message', messageHandler);

                        } else if (event.origin === basePath && event.data.code) {
                            clearInterval(interval);
                            getAccessToken(event.data.code, codeVerifier)
                            setloading(false)
                            window.removeEventListener('message', messageHandler);

                        } else {
                            setloading(false)
                        }
                    }
                    window.addEventListener('message', messageHandler);


                    return
                }
                const configWOProxy: AxiosRequestConfig = {
                    url: requestAPI,
                    headers: header,
                    method: httpMethod,
                    data: body
                }
                const url = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path + restImportConfig?.proxy_conf?.proxy_path : restImportConfig?.oAuthConfig?.base_path + restImportConfig?.oAuthConfig?.proxy_path;
                const configWProxy: AxiosRequestConfig = {
                    url: url,
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
                const response: any = await Apicall(config)
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
    const handleCloseConfig = () => {
        setConfigOpen(false)
    }

    const handleRestAPI = async (header: object) => {
        const configWOProxy: AxiosRequestConfig = {
            url: apiURL,
            headers: header,
            method: httpMethod,
            data: bodyParams
        }
        const url = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path + restImportConfig?.proxy_conf?.proxy_path : restImportConfig?.oAuthConfig?.base_path + restImportConfig?.oAuthConfig?.proxy_path;
        const configWProxy: AxiosRequestConfig = {
            url: url,
            data: {
                "endpointAddress": apiURL,
                "method": httpMethod,
                "contentType": contentType,
                "requestBody": bodyParams,
                "headers": header,
                "authDetails": null
            },
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }
        const config = useProxy ? configWProxy : configWOProxy
        const response: any = await Apicall(config)
        handleResponse(response)
        setloading(false)
    }

    function generateRandomCodeVerifier() {
        const array = new Uint32Array(56 / 2);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }
    const base64URLEncode = (arrayBuffer: ArrayBuffer): string => {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    };
    const getAccessToken = async (code: string, codeVerifier: any) => {
        const reqParams = {
            grant_type: 'authorization_code',
            code: code,
            client_id: selectedProvider.clientId,
            // client_secret: selectedProvider.clientSecret,
            code_verifier: codeVerifier,
            redirect_uri: restImportConfig?.proxy_conf?.base_path + '/oAuthCallback.html',
        }
        const configToken: AxiosRequestConfig = {
            url: selectedProvider.accessTokenUrl,
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: "POST",
            data: reqParams
        }
        const response: any = await Apicall(configToken)
        if (response.status === 200) {
            const header = {
                "Authorization": `Bearer ` + response.data.access_token
            }
            handleRestAPI(header)
        } else {
            const header = {
                "Authorization": `Bearer ` + null
            }
            handleRestAPI(header)
        }

    }


    return (
        <>
            <Stack className='rest-import-ui'>
                {loading && <FallbackSpinner />}
                <Toaster position='top-right' />
                <Grid gap={5} p={2} className='cmnflx' container>
                    <Grid sx={{ backgroundColor: 'lightgray' }} item md={12}>
                        <Stack p={2} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h6' fontWeight={600}>{translate('WEB_SERVICE')}</Typography>
                            <Stack spacing={1} className='cmnflx' direction={'row'}>
                                <Tooltip title={translate("WEB_SERVICE")}>
                                    <IconButton>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                                <Link sx={{ color: 'gray' }}>{translate('HELP')}</Link>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item md={12}>
                        {alertMsg && (
                            <Alert sx={{ py: 0 }} severity="error" data-testid="default-error">{alertMsg}</Alert>
                        )}
                    </Grid>
                    <Grid item md={12}>
                        <Stack spacing={5} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                            <FormControl sx={{ minWidth: 120 }} size='small'>
                                <Select
                                    data-testid="http-method"
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
                            <Button onClick={handleTestClick} disabled={btnDisable} variant='contained'>{translate('TEST')}</Button>
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
                                    <Switch data-testid="proxy-switch" checked={useProxy} onChange={handleChangeProxy} />
                                    <Tooltip title={translate("USE_PROXY")}>
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={12} data-testid="request-config-block">
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
                                                data-testid="http-auth"
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
                                                <Tooltip title={translate("USER_NAME")}>
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
                                                <Tooltip title={translate("PASSWORD")}>
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
                                                <TextField disabled size='small' value={providerId} label={!providerId ? translate("NO") + " " + translate("PROVIDER") + " " + translate("SELECTED_YET") : ''} />
                                                {
                                                    providerId && (
                                                        <Tooltip title={translate("Edit Provider")}>
                                                            <IconButton onClick={() => setConfigOpen(true)}>
                                                                <EditOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )
                                                }
                                                <Button onClick={() => setproviderOpen(true)} variant='contained'>{translate("SELECT") + "/" + translate("ADD") + " " + translate("PROVIDER")}</Button>
                                            </Stack>
                                        </Grid>
                                    </>}
                                </Grid>
                            </CustomTabPanel>
                            <CustomTabPanel value={requestTabValue} index={1}>
                                <HeaderAndQueryTable handleToastError={handleToastError} from='header' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={headerParams} setValue={handleChangeHeaderParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
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
                                                    data-testid="select-content-type"
                                                >
                                                    {contentTypes.map((data) => <MenuItem key={data.value} value={data.value}>{translate(data.label)}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                            <Tooltip title={translate("Choose appropriate content type")}>
                                                <IconButton>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {addCustomType ? <Stack direction={'row'}>
                                                <TextField value={newContentType} onChange={(e) => setnewContentType(e.target.value)} size='small' data-testid='custom-type-field' />
                                                <Tooltip title={translate("ADD")}>
                                                    <IconButton onClick={() => handleAddCustomContentType()}>
                                                        <DoneIcon sx={{ cursor: 'pointer', color: 'black' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack> :
                                                <Tooltip title={translate("CUSTOM_CONTENT_TYPE")}>
                                                    <IconButton onClick={() => setaddCustomType(true)}>
                                                        <AddIcon sx={{ cursor: 'pointer', color: 'black' }} />
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
                                <HeaderAndQueryTable handleToastError={handleToastError} from='query' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={queryParams} setValue={handleChangeQueryParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
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
                                                        <FormLabel data-testid="path-param-label">{data.name}</FormLabel>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <FormLabel>{translate("String")}</FormLabel>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <TextField data-testid="path-param-value" value={data.value} onChange={(e) => handlePathParamsChanges(e.target.value, index)} size='small' />
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
                    <Grid item md={12} data-testid="response-block">
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

                <ProviderModal handleOpen={providerOpen} handleClose={handleCloseProvider} proxyObj={restImportConfig} />

                <ConfigModel
                    handleOpen={configOpen}
                    handleClose={handleCloseConfig}
                    handleParentModalClose={handleCloseProvider}
                    providerConf={selectedProvider}
                    proxyObj={restImportConfig}
                />
                <div style={{ position: 'relative', height: '0px' }}>
                    <TextField data-testid="mock-response" value={responseEditorValue} disabled={true} sx={{ position: 'absolute', left: -10000, top: -10000 }}></TextField>
                </div>
            </Stack>
        </>
    );
}