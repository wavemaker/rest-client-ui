import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Checkbox, DialogActions, FormControl, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, SelectChangeEvent, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import clipboardCopy from 'clipboard-copy';
import { ProviderI, ScopeI } from './ProviderModal';
import Apicall, { getProviderList } from './common/apicall';
import { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast'
import { restImportConfigI } from './WebServiceModal'
import { setProviderAuthorizationUrl, setSelectedProvider, setproviderList } from './appStore/Slice';
import { useDispatch, useSelector } from 'react-redux';
import FallbackSpinner from './common/loader';

export default function ConfigModel({ handleOpen, handleClose, handleParentModalClose, providerConf, proxyObj, configModel }: { handleOpen: boolean, handleClose: () => void, handleParentModalClose?: () => void, providerConf?: ProviderI | null, proxyObj: restImportConfigI, configModel?: boolean }) {
    const dispatch = useDispatch();
    const { t: translate } = useTranslation();
    const [Flow, setFlow] = useState('AUTHORIZATION_CODE')
    const [sendTokenAs, setsendTokenAs] = useState('HEADER')
    const [PKCE, setPKCE] = useState(false)
    const [scopes, setscopes] = useState<ScopeI[]>([])
    const [scopeKey, setscopeKey] = useState('')
    const [scopeValue, setscopeValue] = useState('')
    const [codeMethod, setCodeMethod] = useState('S256')
    const [tooltipTitle, setTooltipTitle] = useState(translate("CLIPBOARD_TEXT"));
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [providerId, setProviderID] = useState('')
    const [authorizationUrl, setAuthorizationUrl] = useState('')
    const [accessTokenUrl, setAccessTokenUrl] = useState('')
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [alertMsg, setAlertMsg] = useState('')
    const [provider_auth_url, setProviderAuthURL] = useState('')
    const [loading, setloading] = useState(false)
    const [basePath, setBasePath] = useState('')
    const [callback_url, setCallbackUrl] = useState('')


    const customProviderList = useSelector((store: any) => store.slice.providerList)
    useEffect(() => {
        const base_path = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path: proxyObj?.oAuthConfig?.base_path
        setBasePath(base_path)
    }, [proxyObj])

    useEffect(() => {
        dispatch(setProviderAuthorizationUrl(provider_auth_url))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider_auth_url])

    useEffect(() => {
        setsendTokenAs(providerConf ? providerConf.sendAccessTokenAs : 'HEADER' as string)
        setProviderID(providerConf?.providerId as string)
        setAuthorizationUrl(providerConf?.authorizationUrl as string)
        setAccessTokenUrl(providerConf?.accessTokenUrl as string)
        setPKCE(providerConf?.oAuth2Pkce?.enabled || false);
        setCodeMethod(providerConf?.oAuth2Pkce?.challengeMethod || "S256")
        setClientId(providerConf?.clientId || "")
        setClientSecret(providerConf?.clientSecret || "")
    }, [providerConf])

    useEffect(() => {
        setscopes([])
        setAlertMsg('')
        setShowErrorAlert(false);
        const scope_value: ScopeI[] = []
        providerConf?.scopes.forEach((scope) => {
            return scope_value.push({
                checked: true,
                value: scope.value,
                name: scope.name
            });
        })
        setscopes(scope_value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleOpen])

    const handleChangePKCE = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPKCE(event.target.checked)
    }

    const handleChangeFlow = (event: SelectChangeEvent) => {
        setFlow(event.target.value as string)
    }

    const handleChangesendTokenAs = (event: SelectChangeEvent) => {
        setsendTokenAs(event.target.value as string)
    }

    const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const scopesCopy = [...scopes]
        scopesCopy.map((scope) => {
            if (scope.name === name) {
                scope.checked = event.target.checked
            }
            return scope
        })
        setscopes(scopesCopy)
    }

    function handleAddScope() {
        if (scopeKey.length > 0 && scopeValue.length > 0) {
            const scopesCopy = [...scopes]
            scopesCopy.push({
                checked: true,
                name: scopeKey,
                value: scopeValue
            })
            setscopes(scopesCopy)
            setscopeKey("")
            setscopeValue('')
        }
    }
    const handleCopyClick = (text: string) => {
        clipboardCopy(text)
            .then(() => {
                setTooltipTitle('Copied!');
            })
            .catch((error: any) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    const handleTooltipMouseLeave = () => {
        setTooltipTitle(translate("CLIPBOARD_TEXT"));
    };

    const handleChangecodeMethod = (event: SelectChangeEvent) => {
        setCodeMethod(event.target.value as string)
    }

    const handleProviderId = (event: ChangeEvent<HTMLInputElement>) => {
        setProviderID(event.target.value as string)
    }
    const handleAuthorizationURL = (event: ChangeEvent<HTMLInputElement>) => {
        setAuthorizationUrl(event.target.value as string)
    }
    const handleAccessTokenURL = (event: ChangeEvent<HTMLInputElement>) => {
        setAccessTokenUrl(event.target.value as string)
    }
    const handleClientId = (event: ChangeEvent<HTMLInputElement>) => {
        setClientId(event.target.value as string)
    }
    const handleClientSecret = (event: ChangeEvent<HTMLInputElement>) => {
        setClientSecret(event.target.value as string)
    }

    const handleValidation = async () => {
       
        const providerExists = customProviderList.some((provider: { providerId: string; }) => provider.providerId === providerId);

        setShowErrorAlert(true);
        if (!providerId) {
            setAlertMsg(translate("PROVIDERID_ALERT"))
        } else if (providerExists && !providerConf) {
            setAlertMsg( translate('PROVIDER')+ ` ("${providerId}") ` +translate('ALREADY_EXIST')+ `!`)
        }  else if (!authorizationUrl) {
            setAlertMsg(translate('AUTHORIZATIONURL_ALERT'))
        } else if (!accessTokenUrl) {
            setAlertMsg(translate('ACCESSTOKEN_ALERT'))
        } else if (!clientId) {
            setAlertMsg(translate('CLIENTID_ALERT'))
        } else if (!clientSecret && !PKCE) {
            setAlertMsg(translate('CLIENTSECRET_ALERT'))
        } else {
            
            setloading(true)
            setShowErrorAlert(false);
            const scopes_val: { name: string; value: string }[] = scopes.filter(item => item.checked).map(({ checked, ...rest }) => rest);
            const scope_map_obj: { [key: string]: boolean } = scopes.reduce((result, item) => {
                result[item.name] = item.checked || false;
                return result;
            }, {} as { [key: string]: boolean });

            const newProvider = {
                accessTokenParamName: "Bearer",
                accessTokenUrl: accessTokenUrl,
                authorizationUrl: authorizationUrl,
                clientId: clientId,
                clientSecret: clientSecret,
                oauth2Flow: Flow,
                providerId: providerId,
                responseType: "token",
                scopeMap: scope_map_obj,
                scopes: scopes_val,
                sendAccessTokenAs: sendTokenAs,
                ...(PKCE ? { oAuth2Pkce: { enabled: PKCE, challengeMethod: codeMethod } } : {})
            }
            const filteredProviders = customProviderList.filter((provider: { providerId: string; }) => provider.providerId !== providerId);
            console.log(filteredProviders)
            const newProviderList = [...filteredProviders, newProvider];
            const url = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.addprovider : proxyObj?.oAuthConfig?.base_path + proxyObj?.oAuthConfig?.addprovider;
            const configWProvider: AxiosRequestConfig = {
                url: url,
                data: newProviderList,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
            const response: any = await Apicall(configWProvider)
            if (response.status === 200) {
                setloading(false)
                toast.success(translate('SUCCESS_MSG'), {
                    position: 'top-right',
                    duration: 5000
                })
                if(!configModel){
                    handleProviderList()
                }
                handleAuthorizationUrl()
                dispatch(setSelectedProvider(newProvider))
                handleClose()
                handleParentModalClose?.()
            } else {
                setloading(false)
            }
        }
    }

    const handleProviderList = async () => {
        const url = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.getprovider : proxyObj?.oAuthConfig?.base_path + proxyObj?.oAuthConfig?.getprovider;
        try {
            const response = await getProviderList(url);
            const sortedProviders = response.data;
            dispatch(setproviderList(sortedProviders))
        } catch (error) {
            console.error('Error fetching provider list:', error);
        }
    }

    const handleAuthorizationUrl = async () => {
        const url = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.authorizationUrl : proxyObj?.oAuthConfig?.base_path + proxyObj?.oAuthConfig?.authorizationUrl;
        const configProvider = {
            url: url + '/' + providerId,
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        };
        const response: any = await Apicall(configProvider);
        if (response.status === 200) {
            const authorization_url = response.data
            setProviderAuthURL(authorization_url)
        }
    }

    useEffect(() =>{
        let callbackurl =  providerConf
        ? basePath + `/oauth2/${providerConf.providerId}/callback`
        : providerId
            ? basePath + `/oauth2/${providerId}/callback`
            : basePath + `/oauth2/{providerId}/callback`
        if(PKCE) {
            callbackurl = basePath + '/oAuthCallback.html'
        }
        setCallbackUrl(callbackurl)
    },[providerConf,providerId,PKCE])

    return (
        <>
            <Dialog className='rest-import-ui' maxWidth={'md'} open={handleOpen} onClose={handleClose} >
                {loading && <FallbackSpinner />}
                <DialogTitle sx={{ backgroundColor: 'lightgray' }}>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>{translate("OAUTH") + " " + translate("PROVIDER") + " " + translate("CONFIGURATION")} </Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <Tooltip title={translate("oAuth")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Link sx={{ color: 'gray' }}>{translate("HELP")}</Link>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {showErrorAlert && (
                        <Alert sx={{ py: 0 }} severity="error">{alertMsg} </Alert>
                    )}
                    <Grid spacing={2} mt={0.3} className='cmnflx' sx={{ width: '100%' }} container>
                        <Grid item md={3}>
                            <Typography>{translate('PROVIDER') + " " + translate('ID')} <span className='text-danger'>*</span>
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} size='small' onChange={handleProviderId}
                                defaultValue={providerConf?.providerId} InputProps={{
                                    readOnly: !!providerConf,
                                }}
                                fullWidth placeholder={translate('PROVIDER') + " " + translate('ID')} label={translate('PROVIDER') + " " + translate('ID')} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate('CALLBACK') + " " + translate('URL')} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Stack direction={'row'} alignItems={"flex-start"}>
                                <TextField size='small'
                                    sx={{ width: '30em' }}
                                    value={callback_url}
                                    InputProps={{
                                        readOnly: !!providerConf,
                                    }}
                                    helperText={translate('CALLBACK_iNFO')}
                                    fullWidth
                                    label={translate('CALLBACK') + ' ' + translate('URL')}
                                    placeholder={translate('CALLBACK') + ' ' + translate('URL')}
                                />
                                <Tooltip onMouseLeave={handleTooltipMouseLeave} onClick={() => handleCopyClick(callback_url)} sx={{ ":hover": { backgroundColor: 'transparent' } }} title={tooltipTitle}>
                                    <IconButton>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("FLOW")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }} size='small' disabled={!!providerConf}>
                                <Select
                                    value={Flow}
                                    onChange={handleChangeFlow}
                                >
                                    <MenuItem value={'AUTHORIZATION_CODE'}>{translate("AUTHORIZATION") + " " + translate("CODE")} </MenuItem>
                                    <MenuItem value={'IMPLICIT'}> {translate("IMPLICIT")} ({translate("NOT_RECOMMENDED")}) </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>
                                {translate("USE_PKCE")}?
                            </Typography>
                        </Grid>
                        <Grid item md={PKCE ? 2 : 9}>
                            <Checkbox
                                checked={PKCE}
                                onChange={handleChangePKCE}
                            />
                            <Tooltip title={translate("PKCE")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        {PKCE && (
                            <Grid item md={7} className='cmnflx' container>
                                <Grid item md={5}>
                                    <Typography>Code Challenge Method </Typography>
                                </Grid>
                                <Grid item md={7}>
                                    <FormControl size='small'>
                                        <Select
                                            value={codeMethod}
                                            onChange={handleChangecodeMethod}
                                        >
                                            <MenuItem value={'S256'}>S256</MenuItem>
                                            <MenuItem value={'plain'}>Basic</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>
                        )}

                        <Grid item md={3}>
                            <Typography>{translate("AUTHORIZATION") + " " + translate("URL")}  <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} size='small' onChange={handleAuthorizationURL} defaultValue={providerConf?.authorizationUrl} placeholder={translate("AUTHORIZATION") + " " + translate("URL")} label={translate("AUTHORIZATION") + " " + translate("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("ACCESS_TOKEN") + " " + translate("URL")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} size='small' onChange={handleAccessTokenURL} defaultValue={providerConf?.accessTokenUrl} placeholder={translate("ACCESS_TOKEN") + " " + translate("URL")} label={translate("ACCESS_TOKEN") + " " + translate("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("CLIENT") + " " + translate("ID")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} size='small' defaultValue={providerConf?.clientId} onChange={handleClientId} placeholder={translate("CLIENT") + " " + translate("ID")} label={translate("CLIENT") + " " + translate("ID")} />
                        </Grid>
                        {!PKCE && (
                            <Grid item md={12} container className='cmnflx' spacing={2}>
                                <Grid item md={3} >
                                    <Typography>{translate("CLIENT") + " " + translate("SECRET")} <span className='text-danger'>*</span></Typography>
                                </Grid>

                                <Grid item md={9}>
                                    <TextField sx={{ width: "30em" }} defaultValue={providerConf?.clientSecret} size='small' onChange={handleClientSecret} placeholder={translate("CLIENT") + " " + translate("SECRET")} label={translate("CLIENT") + " " + translate("SECRET")} />
                                </Grid>
                            </Grid>
                        )}
                        <Grid item md={3}>
                            <Typography>{translate("SEND_ACCESSTOKEN")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }} size='small'>
                                <Select
                                    value={sendTokenAs}
                                    onChange={handleChangesendTokenAs}
                                >
                                    <MenuItem value={'HEADER'}>{translate("HEADER")}</MenuItem>
                                    <MenuItem value={'QUERY'}>{translate("QUERY")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("SCOPE")}</Typography>
                        </Grid>
                        <Grid item md={9}>

                            <Grid className='cmnflx' spacing={1} container>
                                <Grid item md={12}>
                                    <Stack>
                                        {scopes.map(scope => <FormControlLabel key={scope.name} control={<Checkbox checked={scope.checked} onChange={(e) => handleScopeChange(e, scope.name)} />} label={scope.name} />)}
                                    </Stack>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{translate("SCOPE") + " " + translate("KEY")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{translate("SCOPE") + " " + translate("VALUE")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                </Grid>
                                <Grid item md={12}>
                                    <hr />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField size='small' value={scopeKey} onChange={(e) => setscopeKey(e.target.value)} placeholder={translate("SCOPE") + " " + translate("KEY")} label={translate("SCOPE") + " " + translate("KEY")} />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField size='small' value={scopeValue} onChange={(e) => setscopeValue(e.target.value)} placeholder={translate("SCOPE") + " " + translate("VALUE")} label={translate("SCOPE") + " " + translate("VALUE")} />
                                </Grid>
                                <Grid className='cmnflx' item md={4}>
                                    <Button onClick={handleAddScope} variant='contained'>{translate("ADD")}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <hr />
                <DialogActions sx={{ p: 2 }}>
                    <Button variant='contained' color='warning' onClick={handleClose}>
                        {translate("CLOSE")}
                    </Button>
                    <Button variant='contained' onClick={handleValidation}>
                        {translate("SAVE")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}