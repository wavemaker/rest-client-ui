import React, { ReactNode, useEffect, useRef, useState } from 'react'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    Box, FormControl, FormLabel, Grid, IconButton, MenuItem, Paper, Select, SelectChangeEvent, Stack, Switch, Tab, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography, Button,
    TextareaAutosize, Alert, createTheme, ThemeProvider
} from '@mui/material'
import ProviderModal from './ProviderModal'
import { BodyParamsI, HeaderAndQueryTable, MultipartTable, HeaderAndQueryI, TableRowStyled } from './Table'
import {
    retrievePathParamNamesFromURL, httpStatusCodes, isValidUrl, removeDuplicatesByComparison, constructUpdatedQueryString, findDuplicatesByComparison, retrieveQueryDetailsFromURL, constructCommaSeparatedUniqueQueryValuesString
} from './common/common'
import InfoIcon from '@mui/icons-material/Info'
import AddIcon from '@mui/icons-material/Add'
import DoneIcon from '@mui/icons-material/Done'
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
import MonacoEditor from './MonacoEditor'

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
    projectId: string
    httpMethod?: "GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT"
    useProxy?: boolean
    httpAuth?: {
        type: "NONE" | "BASIC" | "OAUTH2",
        providerId?: string,
    },
    headerParams?: HeaderAndQueryI[]
    queryParams?: HeaderAndQueryI[]
    bodyParams?: string
    userName?: string
    userPassword?: string
    multipartParams?: BodyParamsI[]
    contentType?: string,
    proxy_conf: APII,
    default_proxy_state: string,
    state_val: string,
    oAuthConfig: APII,
    error: {
        errorMethod: "default" | "toast" | "customFunction",
        errorFunction: (msg: string, response?: AxiosResponse) => void,
        errorMessageTimeout: number
    },
    viewMode: boolean,
    setServiceName: string,
    setResponseHeaders?: any,
    setResponse?: any,
    loggenInUserId?: string,
    loggenInUserName?: string,
    appEnvVariables?: ITypes[],
    handleResponse: (request: AxiosRequestConfig, response?: AxiosResponse, settingsUploadResponse?: any) => void,
    hideMonacoEditor: (value: boolean) => void,
    getServiceName: (value: string) => void,
    monacoEditorURL: string,
    monacoEditorHeight?: number,
}
interface ITypes {
    key: string
    value: string
}
export interface ICustomAxiosConfig extends AxiosRequestConfig {
    useProxy?: boolean,
    authDetails?: null | {
        type: string,
        providerId?: string,
    },
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
declare global {
    interface Window {
        google: any;
    }
}


export default function RestImport({ language, restImportConfig }: { language: string, restImportConfig: restImportConfigI }) {
    const theme = createTheme({
        typography: {
            fontSize: 16, // Adjust the font size as needed
        },
    });
    const defaultValueforHandQParams = { name: '', value: '', type: 'string' }
    const { t: translate, i18n } = useTranslation();
    const [apiURL, setapiURL] = useState<string>(restImportConfig?.url || '')
    const [httpMethod, sethttpMethod] = useState<"GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT">(restImportConfig?.httpMethod || 'GET')
    const [useProxy, setuseProxy] = useState<boolean>(restImportConfig?.useProxy === true ? true : false)
    const [requestTabValue, setrequestTabValue] = useState(0)
    const [responseTabValue, setresponseTabValue] = useState(0)
    const [httpAuth, sethttpAuth] = useState<"NONE" | "BASIC" | "OAUTH2">(restImportConfig?.httpAuth?.type || 'NONE')
    const [providerOpen, setproviderOpen] = useState(false)
    const [headerParams, setheaderParams] = useState<HeaderAndQueryI[]>(restImportConfig?.headerParams?.concat(defaultValueforHandQParams) || [defaultValueforHandQParams])
    const [queryParams, setqueryParams] = useState<HeaderAndQueryI[]>(restImportConfig?.queryParams?.concat(defaultValueforHandQParams) || [defaultValueforHandQParams])
    const [bodyParams, setbodyParams] = useState<string>(restImportConfig?.bodyParams || '')
    const [multipartParams, setmultipartParams] = useState<BodyParamsI[]>(restImportConfig?.multipartParams?.concat({ name: '', value: '', type: 'file', filename: '' }) || [{ name: '', value: '', type: 'file', filename: '' }])
    const [pathParams, setpathParams] = useState<PathParamsI[]>([])
    const [contentType, setcontentType] = useState(restImportConfig?.contentType || 'application/json')
    const [addCustomType, setaddCustomType] = useState(false)
    const [contentTypes, setcontentTypes] = useState(defaultContentTypes)
    const [newContentType, setnewContentType] = useState('')
    const [response, setresponse] = useState<AxiosResponse>({ headers: restImportConfig.setResponseHeaders, data: restImportConfig.setResponse } as any)
    const [userName, setuserName] = useState(restImportConfig?.userName || '')
    const [userPassword, setuserPassword] = useState(restImportConfig?.userPassword || '')
    const [loading, setloading] = useState(false)
    const [providerId, setProviderId] = useState(restImportConfig.httpAuth?.providerId)
    const [configOpen, setConfigOpen] = useState(false)
    const [btnDisable, setBtnDisable] = useState(false)
    const [alertMsg, setAlertMsg] = useState<string | boolean>(false)
    const selectedProvider = useSelector((store: any) => store.slice.selectedProvider)
    const [serviceName, setserviceName] = useState(restImportConfig.setServiceName || "")
    const [serviceNameEnabled, setserviceNameEnabled] = useState(true)
    const providerAuthURL = useSelector((store: any) => store.slice.providerAuthURL)
    const editorRef: any = useRef(null)

    useEffect(() => {
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            document.head.appendChild(script);
        }
    }, [])

    useEffect(() => {
        setProviderId(selectedProvider.providerId)
        setBtnDisable(false)
    }, [selectedProvider])

    useEffect(() => {
        i18n.changeLanguage(language);
        handleChangeResponseTabs(null, responseTabValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response])


    function handleToastError(message: string, response?: AxiosResponse) {
        if (restImportConfig.error.errorMethod === 'default') {
            setAlertMsg(message)
            return setTimeout(() => {
                setAlertMsg(false)
            }, restImportConfig.error.errorMessageTimeout);
        }
        if (restImportConfig.error.errorMethod === 'toast')
            return toast.error(message)
        if (restImportConfig.error.errorMethod === 'customFunction')
            return restImportConfig.error.errorFunction(message, response)
    }

    const getPathParams = () => {
        try {
            let paths = retrievePathParamNamesFromURL(apiURL.split("?")[0], "{", "}")
            if (paths.length > 0) {
                const updatedPathParams: PathParamsI[] = []
                const isThisANewPath = (name: string): boolean => {
                    let newPath = true
                    for (const pathParam of pathParams) {
                        if (pathParam.name === name) {
                            if (!updatedPathParams.some(e => e.name === name)) {
                                updatedPathParams.push({ name, value: pathParam.value })
                                newPath = false
                                break
                            }
                        }
                    }
                    return newPath
                }
                paths.forEach((path) => {
                    if (path) {
                        if (isThisANewPath(path)) {
                            if (!updatedPathParams.some(pathParam => pathParam.name === path))
                                updatedPathParams.push({ name: path, value: "" })
                            else {
                                throw new Error('Path parameters cannot have duplicates')
                            }
                        }
                    }
                    else {
                        throw new Error('Please enter a valid path parameter')
                    }
                })
                const queryParamsFromUrl = retrieveQueryDetailsFromURL(apiURL)
                const duplicates = findDuplicatesByComparison(updatedPathParams, [...headerParams, ...queryParamsFromUrl], "name")
                if (duplicates.length > 0) {
                    let updatedURL = apiURL
                    let duplicatePathNames = ''
                    setpathParams(removeDuplicatesByComparison(updatedPathParams, duplicates, "name"))
                    duplicates.forEach((duplicate, index) => {
                        const duplicatePath = duplicate.name
                        duplicatePathNames += index !== duplicates.length - 1 ? `${duplicatePath},` : duplicatePath
                        updatedURL = updatedURL.replace(`/{${duplicatePath}}`, '')
                    })
                    setapiURL(updatedURL)
                    handleToastError(`Parameters cannot have duplicates, removed the duplicates[${duplicatePathNames}]`)
                } else {
                    setpathParams(updatedPathParams)
                }
            }
            else
                setpathParams([])
        } catch (error: any) {
            handleToastError(error.message)
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
        if (event.target.value === 'OAUTH2' && !selectedProvider.providerId) {
            setBtnDisable(true)
        } else {
            setBtnDisable(false)
        }
        sethttpAuth(event.target.value as any)
    }
    const handleChangeHeaderTabs = (event: React.SyntheticEvent, newValue: number) => {
        setrequestTabValue(newValue);
    };
    const handleChangeResponseTabs = (event: any, newValue: number) => {
        newValue === 0 ? restImportConfig.hideMonacoEditor(false) : restImportConfig.hideMonacoEditor(true)
        setresponseTabValue(newValue)
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
        try {
            if (apiURL !== '') {
                const query = apiURL?.split('?')[1]
                const queries = query?.split('&')
                if (queries?.length > 0) {
                    const queryNames = queries.map(query => ({ name: query.split('=')[0], value: query.split('=')[1] }))
                    let updatedQueryParams: HeaderAndQueryI[] = []
                    const isThisNewQuery = (name: string, value: string): boolean => {
                        let newQuery = true
                        for (const query of queryParams) {
                            if (query.name === name) {
                                if (!updatedQueryParams.some(data => data.name === name)) {
                                    const valueArray = value.split(',')
                                    const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueArray)
                                    updatedQueryParams.push({ name, value: valueToSet, type: query.type })
                                    newQuery = false
                                    break
                                } else {
                                    const queryIndex = updatedQueryParams.findIndex(data => data.name === name)
                                    const valueCollection = [...updatedQueryParams[queryIndex].value.split(','), ...value.split(',')]
                                    const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueCollection)
                                    updatedQueryParams[queryIndex].value = valueToSet
                                    newQuery = false
                                    break
                                }
                            }
                        }
                        return newQuery
                    }
                    queryNames.forEach(query => {
                        const key = query.name
                        const value = query.value
                        if (key && value) {
                            if (isThisNewQuery(key, value)) {
                                if (updatedQueryParams.some(data => data.name === key)) {
                                    const queryIndex = updatedQueryParams.findIndex(data => data.name === key)
                                    const valueCollection = [...updatedQueryParams[queryIndex].value.split(','), ...value.split(',')]
                                    const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueCollection)
                                    updatedQueryParams[queryIndex].value = valueToSet
                                } else {
                                    const valueArray = value.split(',')
                                    const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueArray)
                                    updatedQueryParams.push({ name: key, value: valueToSet, type: 'string' })
                                }
                            }
                        } else
                            throw new Error('Please enter a valid query parameter')
                    })
                    const paths = retrievePathParamNamesFromURL(apiURL.split("?")[0], "{", "}")
                    const pathParamsClone = paths.map(path => {
                        return { "name": path }
                    })
                    const duplicates = findDuplicatesByComparison(updatedQueryParams, [...headerParams, ...pathParamsClone], "name")
                    if (duplicates.length > 0) {
                        let duplicateQueryNames = ''
                        const queryArrayWithoutDuplicates = removeDuplicatesByComparison(updatedQueryParams, duplicates, "name")
                        queryArrayWithoutDuplicates.push({ name: '', value: '', type: 'string' })
                        setqueryParams(queryArrayWithoutDuplicates)
                        duplicates.forEach((duplicate, index) => {
                            const duplicateQuery = duplicate.name
                            duplicateQueryNames += index !== duplicates.length - 1 ? `${duplicateQuery},` : duplicateQuery
                        })
                        const newQueryPart = constructUpdatedQueryString(queryArrayWithoutDuplicates)
                        const originalURL = apiURL.split('?')[0]
                        setapiURL(originalURL + newQueryPart)
                        handleToastError(`Queries cannot have duplicates, removed the duplicates[${duplicateQueryNames}]`)
                    } else {
                        updatedQueryParams.push({ name: '', value: '', type: 'string' })
                        setqueryParams(updatedQueryParams)
                        const newQueryPart = constructUpdatedQueryString(updatedQueryParams)
                        const originalURL = apiURL.split('?')[0]
                        setapiURL(originalURL + newQueryPart)
                    }
                } else {
                    setqueryParams([{ name: '', value: '', type: 'string' }])
                }
            }
        } catch (error: any) {
            handleToastError(error.message)
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
    const handleTestClick = async () => {
        try {
            if (apiURL.length > 0) {
                let header: any = {}, body;
                let requestAPI = apiURL
                pathParams.forEach((params) => {
                    if (params.value.trim() !== "")
                        requestAPI = requestAPI.replace(`{${params.name}}`, params.value)
                    else
                        throw new Error(translate("PATHPARAMSALERT"))
                })
                const validateAndAddQueryAtLastRow = () => {
                    if (queryParams && queryParams[queryParams.length - 1].name && queryParams[queryParams.length - 1].value) {
                        const queryName = queryParams[queryParams.length - 1].name
                        const queryValue = queryParams[queryParams.length - 1].value
                        const queryParamsClone = [...queryParams]
                        const lastRowValuesArray = queryValue.split(',')
                        const lastRowValues = lastRowValuesArray.filter((value, index) => value && lastRowValuesArray.indexOf(value) === index)
                        const duplicates = findDuplicatesByComparison([{ name: queryName, value: queryValue, type: 'string' }], [...headerParams, ...pathParams], "name")
                        if (duplicates.length === 0) {
                            const queriesArrayFromUrl: HeaderAndQueryI[] = retrieveQueryDetailsFromURL(requestAPI)
                            if (queriesArrayFromUrl.some(query => query.name === queryName)) {
                                const queryIndex = queriesArrayFromUrl.findIndex(data => data.name === queryName)
                                const valueCollection = [...queriesArrayFromUrl[queryIndex].value.split(','), ...lastRowValues]
                                const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueCollection)
                                queriesArrayFromUrl[queryIndex].value = valueToSet
                                queryParamsClone[queryParamsClone.findIndex(data => data.name === queryName)].value = valueToSet
                                queryParamsClone[queryParamsClone.length - 1] = { name: '', type: 'string', value: '' }
                            } else {
                                queriesArrayFromUrl.push({ name: queryName, value: lastRowValues.join(','), type: 'string' })
                                queryParamsClone.push({ name: '', type: 'string', value: '' })
                            }
                            const newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                            const urlWithoutQuery = requestAPI.split('?')[0]
                            requestAPI = urlWithoutQuery + newQueryString
                            setapiURL(requestAPI)
                            setqueryParams(queryParamsClone)
                        } else {
                            throw new Error(`parameter "${queryName}" already exists`)
                        }
                    }
                }
                validateAndAddQueryAtLastRow()
                if (isValidUrl(requestAPI)) {
                    if (httpAuth === "BASIC") {
                        if (userName.trim() === "")
                            throw new Error("Please enter a username for basic authentication")
                        if (userPassword.trim() === "")
                            throw new Error("Please enter a password for basic authentication")
                        header["Authorization"] = 'Basic ' + encode(userName + ':' + userPassword)
                    }
                    headerParams.forEach((data, index) => {
                        if (data.name && data.value) {
                            if (data.name === 'Authorization' && header['Authorization'])
                                throw new Error(`Parameter "Authorization" already exists`)
                            header[data.name] = data.value
                            index === headerParams.length - 1 && setheaderParams([...headerParams, { name: '', value: '', type: 'string' }])
                        }
                    })
                    header['Content-Type'] = contentType
                    if (contentType === 'multipart/form-data') {
                        const formData = new FormData()
                        multipartParams.forEach(data => {
                            if (data.name && data.value)
                                formData.append(data.name, data.value)
                        })
                        body = formData
                    } else
                        body = bodyParams
                    if (httpAuth === "OAUTH2") {
                        let codeVerifier: string;
                        const clientId = selectedProvider.clientId;
                        let redirectUri = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path + `oauth2/${selectedProvider.providerId}/callback` : restImportConfig?.oAuthConfig?.base_path + `oauth2/${selectedProvider.providerId}/callback`;
                        const responseType = "code";
                        const state = restImportConfig.state_val
                        const scope = selectedProvider.scopes.length > 0 ? selectedProvider.scopes.map((scope: { value: any }) => scope.value).join(' ') : '';
                        let childWindow: any;
                        let authUrl: string
                        const expires_time = window.sessionStorage.getItem(selectedProvider.providerId + "expires_in");
                        let expiresIn = expires_time ? parseInt(expires_time, 10) : 0;
                        let currentTimestamp = Math.floor(Date.now() / 1000);
                        if (currentTimestamp > expiresIn) {
                            sessionStorage.removeItem(selectedProvider.providerId + "expires_in");
                            sessionStorage.removeItem(selectedProvider.providerId + "access_token");
                        }
                        const isToken = window.sessionStorage.getItem(selectedProvider.providerId + "access_token");
                        if (isToken) {
                            if (currentTimestamp < expiresIn) {
                                header['Authorization'] = `Bearer ` + isToken
                            }
                        } else {
                            if (selectedProvider.oAuth2Pkce && selectedProvider.oAuth2Pkce.enabled) {
                                if (selectedProvider.providerId === "google") {
                                    if (window && window?.google) {
                                        const client = window?.google?.accounts.oauth2.initTokenClient({
                                            client_id: clientId,
                                            scope: scope,
                                            callback: (tokenResponse: any) => {
                                                if (tokenResponse && tokenResponse.access_token) {
                                                    header['Authorization'] = `Bearer ` + tokenResponse.access_token
                                                    handleRestAPI(header);
                                                    setloading(false)
                                                }
                                            },
                                            error_callback: (error: any) => {
                                                if (error.type === "popup_closed") {
                                                    header['Authorization'] = `Bearer ` + null
                                                    handleRestAPI(header)
                                                    setloading(false)
                                                }
                                            },
                                        }) as any;
                                        client.requestAccessToken();
                                    }
                                } else {
                                    redirectUri = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path + 'oAuthCallback.html' : restImportConfig?.oAuthConfig?.base_path + 'oAuthCallback.html'
                                    const challengeMethod = selectedProvider.oAuth2Pkce.challengeMethod
                                    codeVerifier = generateRandomCodeVerifier();
                                    const data = Uint8Array.from(codeVerifier.split("").map(x => x.charCodeAt(0)))
                                    window.crypto.subtle.digest("SHA-256", data)
                                        .then((hashBuffer: ArrayBuffer) => {
                                            const codeChallenge = challengeMethod === "S256" ? base64URLEncode(hashBuffer) : codeVerifier;
                                            authUrl = selectedProvider.authorizationUrl + `?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&&code_challenge=${codeChallenge}&code_challenge_method=${challengeMethod}`;
                                            childWindow = window.open(authUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=400,height=600");
                                        })
                                        .catch((error: any) => {
                                            console.error("Error calculating code challenge:", error);
                                        });
                                }
                            } else {
                                authUrl = selectedProvider.authorizationUrl + `?client_id=${clientId}&redirect_uri=${(redirectUri)}&response_type=${responseType}&state=${state}&scope=${(scope)}`;
                                childWindow = window.open(providerAuthURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=400,height=600");
                            }
                            // providerAuthURL
                            setloading(true)
                            if ((selectedProvider.providerId === 'google' && !selectedProvider.oAuth2Pkce) || selectedProvider.providerId !== 'google') {
                                const interval = setInterval(() => {
                                    if (childWindow?.closed) {
                                        clearInterval(interval);
                                        header['Authorization'] = `Bearer ` + null
                                        handleRestAPI(header)
                                    }
                                }, 1000);
                                const messageHandler = async (event: { origin: string; data: { tokenData: any; code: string; error: any } }) => {
                                    if (event.data.tokenData) {
                                        clearInterval(interval);
                                        const tokenData = JSON.parse(event.data.tokenData)
                                        window.sessionStorage.setItem(selectedProvider.providerId + "access_token", tokenData.access_token);
                                        const currentTimestamp = Math.floor(Date.now() / 1000);
                                        const expiresIn = tokenData.expires_in
                                        const expirationTimestamp = currentTimestamp + expiresIn;
                                        window.sessionStorage.setItem(selectedProvider.providerId + "expires_in", expirationTimestamp);
                                        header['Authorization'] = `Bearer ` + tokenData.access_token
                                        handleRestAPI(header);
                                        window.removeEventListener('message', messageHandler);
                                    } else if (event.data.code) {
                                        clearInterval(interval);
                                        getAccessToken(event.data.code, codeVerifier)
                                        setloading(false)
                                        window.removeEventListener('message', messageHandler);
                                    } else {
                                        setloading(false)
                                    }
                                }
                                window.addEventListener('message', messageHandler);
                            }
                            return
                        }
                    }
                    const configWOProxy: ICustomAxiosConfig = {
                        url: requestAPI,
                        headers: header,
                        method: httpMethod,
                        data: body,
                        authDetails: httpAuth === "NONE" ? null : httpAuth === "BASIC" ? { type: "BASIC" } : { type: "OAUTH2", providerId: providerId },
                        useProxy: useProxy
                    }
                    const url = restImportConfig?.default_proxy_state === 'ON' ? restImportConfig?.proxy_conf?.base_path + restImportConfig?.proxy_conf?.proxy_path : restImportConfig?.oAuthConfig?.base_path + restImportConfig?.oAuthConfig?.proxy_path;
                    const configWProxy: ICustomAxiosConfig = {
                        url: url,
                        data: {
                            "endpointAddress": requestAPI,
                            "method": httpMethod,
                            "contentType": contentType,
                            "requestBody": body,
                            "headers": header,
                            "authDetails": httpAuth === "NONE" ? null : httpAuth === "BASIC" ? { type: "BASIC" } : { type: "OAUTH2", providerId: providerId },
                        },
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                        useProxy: useProxy,
                    }
                    setloading(true)
                    const config = useProxy ? configWProxy : configWOProxy
                    const response: any = await Apicall(config as AxiosRequestConfig)
                    if (response.status >= 200 && response.status < 300) {
                        // handleResponse(response, config)
                        const settingsUploadData = await settingsUpload(config, response)
                        if (settingsUploadData) {
                            setserviceNameEnabled(false)
                            if (!restImportConfig.viewMode) {
                                restImportConfig.getServiceName(settingsUploadData?.serviceId)
                                setserviceName(settingsUploadData?.serviceId)
                            }
                            handleResponse(response, config, settingsUploadData)
                        }
                    } else {
                        setserviceNameEnabled(true)
                        handleResponse(response, config)
                    }
                    setloading(false)
                } else
                    throw new Error(translate("VALID_URL_ALERT"))
            }
            else
                throw new Error(translate("VALID_URL_ALERT"))
        } catch (error: any) {
            console.log(error)
            handleToastError(error.message)
        }
    }
    function handleResponse(response: any, request?: any, settingsUploadData?: any): void {
        let responseValue;
        setserviceNameEnabled(false)
        if (useProxy) {
            if (response.status >= 200 && response.status < 300)
                if (response.data.statusCode >= 200 && response.data.statusCode < 300)
                    responseValue = { data: response.data.responseBody !== "" ? JSON.parse(response.data.responseBody) : response.data.responseBody, status: response?.data.statusCode, headers: response?.data.headers }
                else {
                    responseValue = { data: response?.data.statusCode + " " + httpStatusCodes.get(response?.data.statusCode), status: response?.data.statusCode, headers: response?.data.headers }
                    handleToastError(httpStatusCodes.get(response?.data.statusCode) as string, response)
                }
            else
                responseValue = { data: response?.response?.data.status + " " + httpStatusCodes.get(response?.response?.data.status), status: response?.response?.data.status, headers: response?.response?.headers }
        } else {
            if (response.status >= 200 && response.status < 300)
                responseValue = { data: response?.data, status: response?.status, headers: response?.headers }
            else if (response.response !== undefined) {
                responseValue = { data: response?.response.status + " " + httpStatusCodes.get(response.response?.status), status: response?.response.status, headers: response.response?.headers }
                handleToastError(httpStatusCodes.get(response.response?.status) as string, response)
            }
            else
                responseValue = { data: response?.response?.data.status + " " + httpStatusCodes.get(response?.response?.data.status), status: response?.response?.data.status, headers: response?.response?.headers }
        }
        if (responseValue.data === undefined || responseValue.headers === undefined) {
            responseValue = { data: response.message, status: response.code, headers: {} }
        }
        editorRef.current.setValue(JSON.stringify(responseValue.data, undefined, 2))
        setresponse(responseValue as AxiosResponse)
        request.url = apiURL
        restImportConfig.handleResponse(request, responseValue as AxiosResponse, settingsUploadData)
    }
    async function settingsUpload(request: any, response: any) {
        const headers = response.headers;
        const constructHeaders: any = {};
        if (headerParams.length > 1) {
            headerParams?.forEach((obj) => {
                if (obj.name !== '' && obj.value !== '')
                    constructHeaders[obj.name] = obj.value;
            });
        }
        const data = {
            authDetails:
                useProxy
                    ? request?.data.authDetails
                    : request?.authDetails,
            contentType: 'application/json',
            method: request?.method,
            endpointAddress: apiURL,
            headers: constructHeaders,
            sampleHttpResponseDetails: {
                headers: useProxy ? headers : request?.headers,
                responseBody: useProxy ? response.data.responseBody : JSON.stringify(response?.data), // when useproxy is true return response.responseBody 
                convertedResponse: null,
                statusCode: response?.status,
            },
            requestBody: request.body || ""
        };
        const dataConfig: AxiosRequestConfig = {
            url: restImportConfig.proxy_conf.base_path + `services/projects/${restImportConfig.projectId}/restservice/settings`,
            data,
            method: 'POST'
        }
        const settingsUploadResponse: any = await Apicall(dataConfig)
        if (response.status >= 200 && response.status < 300) {
            let settingsUploadResponseData = settingsUploadResponse.data
            const params: any[] = getParamsWithTypes(settingsUploadResponseData).paramaters
            const firstKey = getParamsWithTypes(settingsUploadResponseData).firstKey
            const secondKey = getParamsWithTypes(settingsUploadResponseData).secondKey
            const headers = constructHeaders
            const query = queryParams
            if (params && params.length > 0) {
                params?.forEach((param) => {
                    if (param.in === 'header') {
                        for (const key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                if (param.name === key) {
                                    const type = headerParams.find(param => param.name === key)?.type
                                    param['format'] = type
                                    param.items.type = type
                                }
                            }
                        }
                    }
                    else if (param.in === 'query') {
                        for (const key in query) {
                            if (query.hasOwnProperty(key)) {
                                if (param.name === key) {
                                    const type = queryParams.find(param => param.name === key)?.type
                                    param['format'] = type
                                    param.items.type = type
                                }
                            }
                        }
                    }
                })
                settingsUploadResponseData.swagger.paths[firstKey][secondKey].parameters = params
            }
            settingsUploadResponseData['proxySettings'] = {
                mobile: useProxy ? 'PROXY' : 'DIRECT',
                web: useProxy ? 'PROXY' : 'DIRECT',
                withCredentials: false,
            };
            settingsUploadResponseData['serviceId'] = serviceName.trim() !== '' ? serviceName : settingsUploadResponseData['serviceId']
            return settingsUploadResponseData
        }
        else
            handleToastError("Failed to get settings upload response", settingsUploadResponse)
    }
    function getParamsWithTypes(response: any): { paramaters: any[], firstKey: string, secondKey: string } {
        const swaggerPaths = response.swagger.paths;
        const [firstKey] = Object.keys(swaggerPaths);
        const firstObject = swaggerPaths[firstKey];
        const [secondKey] = Object.keys(firstObject);
        const secondObject = firstObject[secondKey];
        const paramaters = secondObject.parameters;
        return { paramaters, firstKey, secondKey };
    }
    const handleCloseConfig = () => {
        setConfigOpen(false)
    }

    const handleRestAPI = async (header: object) => {
        const configWOProxy: ICustomAxiosConfig = {
            url: apiURL,
            headers: header,
            method: httpMethod,
            data: bodyParams,
            authDetails: httpAuth === "NONE" ? null : httpAuth === "BASIC" ? { type: "BASIC" } : { type: "OAUTH2", providerId: providerId }
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
                "authDetails": httpAuth === "NONE" ? null : httpAuth === "BASIC" ? { type: "BASIC" } : { type: "OAUTH2", providerId: providerId },
            },
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }
        const config = useProxy ? configWProxy : configWOProxy
        const response: any = await Apicall(config as AxiosRequestConfig)
        handleResponse(response, config)
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
            code_verifier: codeVerifier,
            redirect_uri: restImportConfig?.proxy_conf?.base_path + 'oAuthCallback.html',
        }
        const configToken: AxiosRequestConfig = {
            url: selectedProvider.accessTokenUrl,
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: "POST",
            data: reqParams
        }
        let header: any = {};
        headerParams?.forEach((data) => {
            if (data.name && data.value)
                header[data.name] = data.value
        })
        const response: any = await Apicall(configToken)
        if (response.status === 200) {
            header['Authorization'] = `Bearer ` + response.data.access_token
            window.sessionStorage.setItem(selectedProvider.providerId + "access_token", response.data.access_token);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const expiresIn = response.data.expires_in
            const expirationTimestamp = currentTimestamp + expiresIn;
            window.sessionStorage.setItem(selectedProvider.providerId + "expires_in", expirationTimestamp);
            handleRestAPI(header)
        } else {
            header['Authorization'] = `Bearer ` + null
            handleRestAPI(header)
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Stack className='rest-import-ui'>
                {loading && <FallbackSpinner />}
                <Toaster position='top-right' />
                <Grid gap={2} className='cmnflx' container>
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
                                    disabled={restImportConfig.viewMode}
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
                            }} autoFocus={true} value={apiURL} onChange={(e) => setapiURL(e.target.value.trim())} size='small' fullWidth label={translate('URL')} placeholder={translate('URL')} />
                            <Button onClick={handleTestClick} disabled={btnDisable} variant='contained'>{translate('TEST')}</Button>
                        </Stack>
                    </Grid>
                    <Grid item md={12}>
                        <Grid container>
                            <Grid item md={6}>
                                <Stack sx={{ cursor: "pointer" }} spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                    <Typography>{translate('SERVICE_NAME')}</Typography>
                                    <TextField value={serviceName} onChange={(e) => {
                                        setserviceName(e.target.value)
                                        restImportConfig.getServiceName(e.target.value)
                                    }} disabled={serviceNameEnabled || restImportConfig.viewMode} size='small' />
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
                            <Box sx={{ borderColor: 'divider', backgroundColor: '#f3f5f6' }}>
                                <Tabs sx={{ minHeight: "30px", height: "45px" }} value={requestTabValue} onChange={handleChangeHeaderTabs}>
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
                                                <MenuItem value={'OAUTH2'}>{translate("OAUTH")} 2.0</MenuItem>
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
                                    {httpAuth === "OAUTH2" && <>
                                        <Grid item md={3}>
                                            <Typography>{translate("OAuth") + " " + translate("PROVIDER")}</Typography>
                                        </Grid>
                                        <Grid item md={9}>
                                            <Stack spacing={2} direction={'row'}>
                                                <TextField disabled size='small' data-testid="provider-name" value={providerId} label={!providerId ? translate("NO") + " " + translate("PROVIDER") + " " + translate("SELECTED_YET") : ''} />
                                                {
                                                    providerId && (
                                                        <Tooltip title={translate("Edit Provider")}>
                                                            <IconButton onClick={() => setConfigOpen(true)} data-testid='edit-provider'>
                                                                <EditOutlinedIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )
                                                }
                                                <Button onClick={() => setproviderOpen(true)} variant='contained' data-testid='select-provider'>{translate("SELECT") + "/" + translate("ADD") + " " + translate("PROVIDER")}</Button>
                                            </Stack>
                                        </Grid>
                                    </>}
                                </Grid>
                            </CustomTabPanel>
                            <CustomTabPanel value={requestTabValue} index={1}>
                                <HeaderAndQueryTable restImportConfig={restImportConfig} handleToastError={handleToastError} from='header' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={headerParams} setValue={handleChangeHeaderParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
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
                                <HeaderAndQueryTable restImportConfig={restImportConfig} handleToastError={handleToastError} from='query' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={queryParams} setValue={handleChangeQueryParams} apiURL={apiURL} changeapiURL={handleChangeapiURL} />
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
                                </Tabs>
                            </Box>
                        </Box>
                        {responseTabValue === 1 ? <Stack overflow={'hidden'} sx={{ wordBreak: 'break-word', backgroundColor: "rgb(40, 42, 54)", color: 'white' }} whiteSpace={'normal'} p={2} width={'100%'} direction={'row'}>
                            {response === undefined ? "" : <TableContainer>
                                <Table>
                                    <TableBody>
                                        {Object.keys(response?.headers as any).map(key => {
                                            return <TableRow
                                                key={key}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align='left' sx={{ color: 'white' }}>{key} :</TableCell>
                                                <TableCell align='left' sx={{ color: 'white' }}>{(response?.headers as any)[key]}</TableCell>
                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>}
                        </Stack> : ''}
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
                <MonacoEditor monacoEditorHeight={restImportConfig?.monacoEditorHeight as number} url={restImportConfig.monacoEditorURL} editorRef={editorRef} initialValue={JSON.stringify(response.data, undefined, 2)} />
                <div style={{ position: 'relative', height: '0px' }}>
                    <TextField sx={{ position: 'absolute', left: -10000, top: -10000 }} data-testid="mock-response" value={responseTabValue === 0 ? JSON.stringify(response.data) : JSON.stringify(response.headers)} disabled={true}></TextField>
                </div>
            </Stack>
        </ThemeProvider>
    );
}