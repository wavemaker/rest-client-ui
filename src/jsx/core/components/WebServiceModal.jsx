import React, { useEffect, useState } from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, FormControl, FormLabel, Grid, IconButton, Link, MenuItem, Paper, Select, Stack, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography, Button, TextareaAutosize } from '@mui/material';
import ProviderModal from './ProviderModal';
import { HeaderAndQueryTable, MultipartTable, TableRowStyled } from './Table';
import { findDuplicateObjects, findDuplicatesAcrossArrays, getSubstring, httpStatusCodes, isValidUrl, removeDuplicatesByComparison, removeDuplicatesKeepFirst } from './common/common';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import Apicall from './common/apicall';
import { encode } from 'js-base64';
import toast, { Toaster } from 'react-hot-toast';
import FallbackSpinner from './common/loader';
import { useTranslation } from 'react-i18next';
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (<div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (<Box>
                    {children}
                </Box>)}
        </div>);
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
];
export default function WebServiceModal(props) {
    const { t, i18n } = useTranslation();
    const [apiURL, setapiURL] = useState('');
    const [httpMethod, sethttpMethod] = useState('GET');
    const [useProxy, setuseProxy] = useState(true);
    const [requestTabValue, setrequestTabValue] = useState(0);
    const [responseTabValue, setresponseTabValue] = useState(0);
    const [httpAuth, sethttpAuth] = useState('None');
    const [providerOpen, setproviderOpen] = useState(false);
    const [headerParams, setheaderParams] = useState([{ name: '', value: '', type: '' }]);
    const [queryParams, setqueryParams] = useState([{ name: '', value: '', type: '' }]);
    const [bodyParams, setbodyParams] = useState('');
    const [multipartParams, setmultipartParams] = useState([{ name: '', value: '', type: 'file', filename: '' }]);
    const [pathParams, setpathParams] = useState([]);
    const [contentType, setcontentType] = useState('application/json');
    const [addCustomType, setaddCustomType] = useState(false);
    const [contentTypes, setcontentTypes] = useState(defaultContentTypes);
    const [newContentType, setnewContentType] = useState('');
    const [responseEditorValue, setresponseEditorValue] = useState('');
    const [response, setresponse] = useState();
    const [userName, setuserName] = useState('');
    const [userPassword, setuserPassword] = useState('');
    const [loading, setloading] = useState(false);
    useEffect(() => {
        i18n.changeLanguage(props.language);
        // i18n.changeLanguage("zh");
        handleChangeResponseTabs(null, responseTabValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);
    const getPathParams = () => {
        if (getSubstring(apiURL.split("?")[0], "{", "}").length > 0) {
            const pathParamsClone = [...pathParams];
            let paths = getSubstring(apiURL.split("?")[0], "{", "}");
            const newPathParams = [];
            const checkPath = (name) => {
                let returnBool = false;
                pathParamsClone.forEach((obj, index) => {
                    if (obj.name === name) {
                        if (!newPathParams.some(e => e.name === name)) {
                            pathParamsClone.splice(index, 1);
                            returnBool = true;
                            newPathParams.push({ name: name, value: obj.value });
                        }
                    }
                });
                return returnBool;
            };
            paths = paths.filter((item, index) => paths.indexOf(item) === index);
            paths.forEach((path) => {
                if (!checkPath(path))
                    if (path !== '')
                        newPathParams.push({ name: path, value: "" });
            });
            const headerParamsClone = [...headerParams];
            const queryParamsClone = [...queryParams];
            const duplicates = findDuplicatesAcrossArrays([headerParamsClone.slice(0, headerParamsClone.length - 1), queryParamsClone.slice(0, queryParamsClone.length - 1), newPathParams], "name");
            if (duplicates.length > 0) {
                toast.error(`Parameter "${duplicates[0].name}" already exists`, {
                    position: 'top-right'
                });
                setpathParams(removeDuplicatesByComparison(newPathParams, duplicates, "name"));
            }
            else
                setpathParams(newPathParams);
        }
        else {
            setpathParams([]);
        }
    };
    const handlePathParamsChanges = (value, currentIndex) => {
        const pathParamsClone = [...pathParams];
        pathParamsClone.map((data, index) => {
            if (index === currentIndex)
                data.value = value;
            return data;
        });
        setpathParams(pathParamsClone);
    };
    const handleCloseProvider = () => {
        setproviderOpen(false);
    };
    const handleChangeapiURL = (value) => {
        setapiURL(value);
    };
    const handleChangeHeaderParams = (data) => {
        setheaderParams(data);
    };
    const handleChangeQueryParams = (data) => {
        setqueryParams(data);
    };
    const handlemultipartParams = (data) => {
        setmultipartParams(data);
    };
    const handleChangehttpAuth = (event) => {
        sethttpAuth(event.target.value);
    };
    const handleChangeHeaderTabs = (event, newValue) => {
        setrequestTabValue(newValue);
    };
    const handleChangeResponseTabs = (event, newValue) => {
        switch (newValue) {
            case 0:
                setresponseEditorValue(JSON.stringify(response?.data, undefined, 2));
                break;
            case 1:
                setresponseEditorValue(JSON.stringify(response?.headers, undefined, 2));
                break;
            case 2:
                setresponseEditorValue(JSON.stringify({ statusCode: response?.status }, undefined, 2));
                break;
        }
        setresponseTabValue(newValue);
    };
    const handleChangehttpMethod = (event) => {
        sethttpMethod(event.target.value);
    };
    const handleChangecontentType = (event) => {
        setcontentType(event.target.value);
    };
    const handleChangeProxy = (event) => {
        setuseProxy(event.target.checked);
    };
    const handleQueryChange = () => {
        if (apiURL !== '') {
            const query = apiURL?.split('?')[1];
            const queries = query?.split('&');
            if (query) {
                const queryNames = queries.map(query => {
                    const data = {
                        name: query.split('=')[0],
                        value: query.split('=')[1]
                    };
                    return data;
                });
                const newQueryParams = [];
                const queryParamsClone = [...queryParams];
                const checkQuery = (name, value) => {
                    let returnBool = false;
                    queryParamsClone.forEach((obj, index) => {
                        if (queryParams.length === 1)
                            return returnBool;
                        if (obj.name === name) {
                            if (!newQueryParams.some(e => e.name === name)) {
                                if (name !== '' && value !== '' && value !== undefined) {
                                    queryParamsClone.splice(index, 1);
                                    returnBool = true;
                                    newQueryParams.push({ name: name, value: value, type: obj.type });
                                }
                            }
                        }
                    });
                    return returnBool;
                };
                const nonDuplicate = removeDuplicatesKeepFirst(queryNames, "name");
                const duplicates = findDuplicateObjects(queryNames, "name");
                if (duplicates.length > 0) {
                    let apiURLCopy = apiURL;
                    toast.error("Queries cannot have duplicates, removed the dupicates", {
                        position: 'top-right'
                    });
                    duplicates.forEach((data) => {
                        apiURLCopy = apiURLCopy.replace(`&${data.name}=${data.value}`, '');
                    });
                    setapiURL(apiURLCopy);
                }
                nonDuplicate.forEach((data) => {
                    const key = data.name;
                    const value = data.value;
                    if (!checkQuery(key, value)) {
                        if (key !== '' && value !== '')
                            newQueryParams.push({ name: key, value: value, type: "string" });
                    }
                });
                newQueryParams.push({ name: '', value: '', type: '' });
                setqueryParams(newQueryParams);
            }
            else {
                setqueryParams([{ name: '', value: '', type: '' }]);
            }
        }
        else {
            setqueryParams([{ name: '', value: '', type: '' }]);
        }
    };
    const handleAddCustomContentType = () => {
        if (!contentTypes.find(e => e.value === newContentType)) {
            const contentTypesClone = [...contentTypes];
            contentTypesClone.push({
                label: newContentType,
                value: newContentType
            });
            setcontentTypes(contentTypesClone);
            setaddCustomType(false);
            setcontentType(newContentType);
            setnewContentType("");
        }
        else {
            setaddCustomType(false);
            setcontentType(newContentType);
            setnewContentType("");
        }
    };
    const handleResponseEditorChange = (newValue) => {
        setresponseEditorValue(newValue);
    };
    const handleTestClick = async () => {
        if (apiURL.length > 0 && isValidUrl(apiURL)) {
            if (httpAuth === "Basic") {
                if (userName.trim() === "")
                    return toast.error("Please enter a username for basic authentication");
                if (userPassword.trim() === "")
                    return toast.error("Please enter a password for basic authentication");
            }
            let header = {}, body;
            let requestAPI = apiURL;
            pathParams.forEach((params) => {
                requestAPI = requestAPI.replace(`{${params.name}}`, params.value);
            });
            headerParams.forEach((data, index) => {
                if (headerParams.length - 1 !== index)
                    header[data.name] = data.value;
                if (httpAuth === "Basic" && index === 0) {
                    header["Authorization"] = 'Basic ' + encode(userName + ':' + userPassword);
                }
            });
            if (contentType === 'multipart/form-data') {
                const formData = new FormData();
                multipartParams.forEach((data, index) => {
                    if (multipartParams.length - 1 !== index)
                        formData.append(data.name, data.value);
                });
                body = formData;
            }
            else
                body = JSON.stringify(bodyParams);
            const configWOProxy = {
                url: requestAPI,
                headers: header,
                method: httpMethod,
                data: body
            };
            const configWProxy = {
                url: "http://stage-studio.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f52524018968db801516c9/restservices/invoke?optimizeResponse=true",
                data: {
                    "endpointAddress": requestAPI,
                    "method": httpMethod,
                    "contentType": contentType,
                    "requestBody": body,
                    "headers": header,
                    "authDetails": null
                },
                method: "POST",
            };
            setloading(true);
            const config = useProxy ? configWProxy : configWOProxy;
            const response = await Apicall(config);
            console.log(response);
            const checkResponse = response.status >= 200 && response.status < 300 ? response : response.response !== undefined ? response.response : { data: response.message, status: httpStatusCodes.get(response?.response?.data.status), headers: response?.response?.data.headers };
            setloading(false);
            setresponse(checkResponse);
        }
        else
            toast.error(t("VALID_URL_ALERT"), {
                position: 'top-right'
            });
    };
    return (<>
            {loading ? <FallbackSpinner /> :
            <>
                    <Toaster position='top-right'/>
                    <Grid gap={5} p={2} className='cmnflx rest-import-ui' container>
                        <Grid sx={{ backgroundColor: 'lightgray' }} item md={12}>
                            <Stack p={2} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Typography variant='h6' fontWeight={600}>{t('WEB_SERVICE')}</Typography>
                                <Stack spacing={1} className='cmnflx' direction={'row'}>
                                    <Tooltip title={t("DELETE")}>
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Link sx={{ color: 'gray' }}>{t('HELP')}</Link>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item md={12}>
                            <Stack spacing={5} direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <FormControl sx={{ minWidth: 120 }} size='small'>
                                    <Select value={httpMethod} onChange={handleChangehttpMethod}>
                                        <MenuItem value={'GET'}>{'GET'}</MenuItem>
                                        <MenuItem value={'POST'}>{'POST'}</MenuItem>
                                        <MenuItem value={'PUT'}>{'PUT'}</MenuItem>
                                        <MenuItem value={'HEAD'}>{'HEAD'}</MenuItem>
                                        <MenuItem value={'PATCH'}>{'PATCH'}</MenuItem>
                                        <MenuItem value={'DELETE'}>{'DELETE'}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField onBlur={() => {
                    getPathParams();
                    handleQueryChange();
                }} value={apiURL} onChange={(e) => setapiURL(e.target.value)} size='small' fullWidth label={t('URL')} placeholder={t('URL')}/>
                                <Button onClick={handleTestClick} variant='contained'>{t('TEST')}</Button>
                            </Stack>
                        </Grid>
                        <Grid item md={12}>
                            <Grid container>
                                <Grid item md={6}>
                                    <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                        <Typography>{t('SERVICE_NAME')}</Typography>
                                        <TextField disabled size='small'/>
                                    </Stack>
                                </Grid>
                                <Grid item md={6}>
                                    <Stack spacing={2} display={'flex'} alignItems={'center'} direction={'row'}>
                                        <Typography>{t('USE_PROXY')}</Typography>
                                        <Switch checked={useProxy} onChange={handleChangeProxy}/>
                                        <Tooltip title={t("DELETE")}>
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
                                        <Tab label={t("AUTHORIZATION")}/>
                                        <Tab label={t("HEADER") + " " + t("PARAMS")}/>
                                        <Tab label={t("BODY") + " " + t("PARAMS")} disabled={httpMethod === "GET" ? true : false}/>
                                        <Tab label={t("QUERY") + " " + t("PARAMS")}/>
                                        <Tab label={t("PATH") + " " + t("PARAMS")}/>
                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={requestTabValue} index={0}>
                                    <Grid spacing={2} mt={2} className='cmnflx' container>
                                        <Grid item md={3}>
                                            <Typography>{t('HTTP') + " " + t("AUTHENTICATION")}</Typography>
                                        </Grid>
                                        <Grid item md={9}>
                                            <FormControl size='small'>
                                                <Select value={httpAuth} onChange={handleChangehttpAuth}>
                                                    <MenuItem value={'None'}>{t("NONE")}</MenuItem>
                                                    <MenuItem value={'Basic'}>{t("BASIC")}</MenuItem>
                                                    <MenuItem value={'OAuth 2.0'}>{t("OAUTH")} 2.0</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {httpAuth === "Basic" && <>
                                            <Grid item md={3}>
                                                <Typography>{t("USER_NAME")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack direction={'row'}>
                                                    <TextField value={userName} onChange={(e) => setuserName(e.target.value)} size='small' label={t("USER_NAME")} placeholder={t("USER_NAME")}/>
                                                    <Tooltip title={t("DELETE")}>
                                                        <IconButton>
                                                            <HelpOutlineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Grid>
                                            <Grid item md={3}>
                                                <Typography>{t("PASSWORD")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack direction={'row'}>
                                                    <TextField value={userPassword} onChange={(e) => setuserPassword(e.target.value)} size='small' label={t("PASSWORD")} placeholder={t("PASSWORD")}/>
                                                    <Tooltip title={t("DELETE")}>
                                                        <IconButton>
                                                            <HelpOutlineIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Grid>
                                        </>}
                                        {httpAuth === "OAuth 2.0" && <>
                                            <Grid item md={3}>
                                                <Typography>{t("OAuth") + " " + t("PROVIDER")}</Typography>
                                            </Grid>
                                            <Grid item md={9}>
                                                <Stack spacing={2} direction={'row'}>
                                                    <TextField disabled size='small' label={t("NO") + " " + t("PROVIDER") + " " + t("SELECTED_YET")}/>
                                                    <Button onClick={() => setproviderOpen(true)} variant='contained'>{t("SELECT") + "/" + t("ADD") + " " + t("PROVIDER")}</Button>
                                                </Stack>
                                            </Grid>
                                        </>}
                                    </Grid>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={1}>
                                    <HeaderAndQueryTable from='header' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={headerParams} setValue={handleChangeHeaderParams} apiURL={apiURL} changeapiURL={handleChangeapiURL}/>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={2}>
                                    <Stack spacing={1} mt={2} ml={1}>
                                        <Stack spacing={10} display={'flex'} alignItems={'center'} direction={'row'}>
                                            <Typography>{t("CONTENT") + " " + t("TYPE")}</Typography>
                                            <Stack spacing={3} display={'flex'} alignItems={'center'} direction={'row'}>
                                                <FormControl size='small' sx={{ width: "20em" }}>
                                                    <Select value={contentType} onChange={handleChangecontentType}>
                                                        {contentTypes.map((data) => <MenuItem key={data.value} value={data.value}>{t(data.label)}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                                <Tooltip title={t("DELETE")}>
                                                    <IconButton>
                                                        <HelpOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                {addCustomType ? <Stack direction={'row'}>
                                                    <TextField value={newContentType} onChange={(e) => setnewContentType(e.target.value)} size='small'/>
                                                    <Tooltip title={t("ADD")}>
                                                        <IconButton>
                                                            <DoneIcon onClick={() => handleAddCustomContentType()} sx={{ cursor: 'pointer', color: 'black' }}/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack> :
                    <Tooltip title={t("CUSTOM_CONTENT_TYPE")}>
                                                        <IconButton>
                                                            <AddIcon onClick={() => setaddCustomType(true)} sx={{ cursor: 'pointer', color: 'black' }}/>
                                                        </IconButton>
                                                    </Tooltip>}
                                            </Stack>
                                        </Stack>
                                        {contentType === 'multipart/form-data' ? <MultipartTable value={multipartParams} setValue={handlemultipartParams}/> :
                    <TextareaAutosize style={{ padding: 2 }} value={bodyParams} onChange={(e) => setbodyParams(e.target.value)} minRows={8} placeholder={t('REQUEST') + " " + t('BODY') + ":" + t('REQUEST_BODY_PLACEHOLDER')}/>}
                                    </Stack>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={3}>
                                    <HeaderAndQueryTable from='query' headerParams={headerParams} queryParams={queryParams} pathParams={pathParams} value={queryParams} setValue={handleChangeQueryParams} apiURL={apiURL} changeapiURL={handleChangeapiURL}/>
                                </CustomTabPanel>
                                <CustomTabPanel value={requestTabValue} index={4}>
                                    {pathParams.length > 0 ? <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                                                    <TableCell align='center'>{t("NAME")}</TableCell>
                                                    <TableCell align='center'>{t("TYPE")}</TableCell>
                                                    <TableCell align='center'>{t("VALUE")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pathParams.map((data, index) => <TableRowStyled key={index}>
                                                        <TableCell align='center'>
                                                            <FormLabel>{data.name}</FormLabel>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <FormLabel>{t("String")}</FormLabel>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <TextField value={data.value} onChange={(e) => handlePathParamsChanges(e.target.value, index)} size='small'/>
                                                        </TableCell>
                                                    </TableRowStyled>)}
                                            </TableBody>
                                        </Table>
                                    </TableContainer> :
                    <Stack p={2} spacing={1} direction={'row'} sx={{ backgroundColor: "#d9edf7" }}>
                                            <InfoIcon sx={{ height: 18, width: 18, color: '#31708f', mt: 0.5 }}/>
                                            <Stack>
                                                <Typography>
                                                    {t('NO_PATH_PARAMS')} 
                                                    {t('NO_PATH_PARAMS_DESC')}
                                                </Typography>
                                                <Typography>
                                                    {t(`e.g. For URL`)} {`"http:wavemaker.com/projects/{pid}/?mode=json", "pid"`} {t(`is the path param`)}.
                                                    (<a href='https://docs.wavemaker.com/learn/app-development/services/web-services/rest-services/'>{t("MORE_INFO")}</a>)
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
                                        <Tab label={t("RESPONSE") + " " + t("BODY")}/>
                                        <Tab label={t("RESPONSE") + " " + t("HEADER")}/>
                                        <Tab label={t("RESPONSE") + " " + t("STATUS")}/>
                                    </Tabs>
                                </Box>
                            </Box>
                            <AceEditor setOptions={{ useWorker: false, printMargin: false, wrap: true }} mode="json" theme="dracula" editorProps={{ $blockScrolling: true }} style={{ height: "20em", width: "100%" }} value={responseEditorValue} onChange={handleResponseEditorChange}/>
                        </Grid>
                    </Grid>
                    <ProviderModal handleOpen={providerOpen} handleClose={handleCloseProvider}/>
                </>}
        </>);
}
