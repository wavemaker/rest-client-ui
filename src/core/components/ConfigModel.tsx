import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import {
    Alert, Checkbox, DialogActions, FormControl, FormControlLabel, Grid, Link, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import clipboardCopy from 'clipboard-copy';
import { ProviderI, ScopeI } from './ProviderModal';
import Apicall, { getProviderList } from './common/apicall';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { INotifyMessage, IProviderConfig, restImportConfigI } from './RestImport'
import FallbackSpinner from './common/loader';
import '../../i18n';

export default function ConfigModel(
    { handleOpen, handleClose, handleParentModalClose, providerConfig, proxyObj, configModel, isCustomErrorFunc, currentProviderConfig,
        customFunction, handleSuccessCallback, updateProviderConfig, restImportConfig }:
        {
            handleOpen: boolean, handleClose: () => void, handleParentModalClose?: () => void, providerConfig: IProviderConfig, proxyObj: restImportConfigI,
            configModel?: boolean, isCustomErrorFunc: boolean, customFunction: (msg: string, response?: AxiosResponse) => void,
            handleSuccessCallback: (msg: INotifyMessage, response?: AxiosResponse) => void, currentProviderConfig: ProviderI | null,
            updateProviderConfig: (key: string, value: any) => void, restImportConfig: restImportConfigI
        }) {
    const { t: translate } = useTranslation();
    const [flow, setFlow] = useState('AUTHORIZATION_CODE')
    const [sendTokenAs, setsendTokenAs] = useState('HEADER')
    const [PKCE, setPKCE] = useState(false)
    const [scopes, setscopes] = useState<ScopeI[]>([])
    const [scopeKey, setscopeKey] = useState('')
    const [scopeValue, setscopeValue] = useState('')
    const [codeMethod, setCodeMethod] = useState('S256')
    const [tooltipTitle, setTooltipTitle] = useState(translate("CLIPBOARD_TEXT"));
    const [providerId, setProviderID] = useState('')
    const [authorizationUrl, setAuthorizationUrl] = useState('')
    const [accessTokenUrl, setAccessTokenUrl] = useState('')
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [provider_auth_url, setProviderAuthURL] = useState('')
    const [loading, setloading] = useState(false)
    const [basePath, setBasePath] = useState('')
    const [callback_url, setCallbackUrl] = useState('')
    const [responseType, setresponseType] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState<INotifyMessage>({ message: '', type: 'error' })
    const customProviderList = providerConfig.providerList

    useEffect(() => {
        setBasePath(proxyObj?.proxy_conf?.base_path)
    }, [proxyObj])

    useEffect(() => {
        let callbackurl = currentProviderConfig?.providerId
            ? basePath + `studio/services/oauth2/${currentProviderConfig?.providerId}/callback`
            : providerId
                ? basePath + `studio/services/oauth2/${providerId}/callback`
                : basePath + `studio/services/oauth2/{providerId}/callback`
        if (PKCE || flow === 'IMPLICIT') callbackurl = basePath + 'studio/oAuthCallback.html'
        setCallbackUrl(callbackurl)
    }, [currentProviderConfig, providerId, PKCE, flow, basePath, providerConfig.selectedProvider.providerId])

    useEffect(() => {
        // dispatch(setProviderAuthorizationUrl(provider_auth_url))
        updateProviderConfig("providerAuthURL", provider_auth_url)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider_auth_url])

    useEffect(() => {
        setsendTokenAs(currentProviderConfig ? currentProviderConfig.sendAccessTokenAs : 'HEADER' as string)
        setProviderID(currentProviderConfig?.providerId as string)
        setAuthorizationUrl(currentProviderConfig?.authorizationUrl as string)
        setAccessTokenUrl(currentProviderConfig?.accessTokenUrl || "")
        setPKCE(currentProviderConfig?.oAuth2Pkce?.enabled || false);
        setCodeMethod(currentProviderConfig?.oAuth2Pkce?.challengeMethod || "S256")
        setClientId(currentProviderConfig?.clientId || "")
        setClientSecret(currentProviderConfig?.clientSecret || "")
        setresponseType(currentProviderConfig?.responseType || "token")
    }, [currentProviderConfig])

    useEffect(() => {
        setscopes([])
        setShowAlert(false)
        setAlertMsg({ message: '', type: 'error' })
        const scope_value: ScopeI[] = []
        currentProviderConfig?.scopes.forEach((scope) => {
            return scope_value.push({
                checked: true,
                value: scope.value,
                name: scope.name
            });
        })
        setscopes(scope_value)
        setFlow(currentProviderConfig?.oauth2Flow || "AUTHORIZATION_CODE")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleOpen])

    function handleErrorMsg(error: INotifyMessage, response?: AxiosResponse) {
        if (isCustomErrorFunc && error.type === 'error')
            return customFunction(error.message, response)
        else if (error.type === 'error') {
            setShowAlert(true)
            setAlertMsg(error)
        }
    }

    const handleChangePKCE = (event: ChangeEvent<HTMLInputElement>) => setPKCE(event.target.checked)
    const handleChangesendTokenAs = (event: SelectChangeEvent) => setsendTokenAs(event.target.value)
    const handleChangeresponseType = (event: SelectChangeEvent) => setresponseType(event.target.value)
    const handleTooltipMouseLeave = () => setTooltipTitle(translate("CLIPBOARD_TEXT"));
    const handleChangecodeMethod = (event: SelectChangeEvent) => setCodeMethod(event.target.value)
    const handleProviderId = (event: ChangeEvent<HTMLInputElement>) => setProviderID(event.target.value)
    const handleAuthorizationURL = (event: ChangeEvent<HTMLInputElement>) => setAuthorizationUrl(event.target.value)
    const handleAccessTokenURL = (event: ChangeEvent<HTMLInputElement>) => setAccessTokenUrl(event.target.value)
    const handleClientId = (event: ChangeEvent<HTMLInputElement>) => setClientId(event.target.value)
    const handleClientSecret = (event: ChangeEvent<HTMLInputElement>) => setClientSecret(event.target.value)
    const handleChangeFlow = (event: SelectChangeEvent) => setFlow(event.target.value)

    const handleScopeChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
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

    const handleValidation = async () => {
        const providerExists = customProviderList.some((provider: { providerId: string; }) => provider.providerId === providerId);
        if (!providerId) {
            handleErrorMsg({ message: translate("PROVIDERID_ALERT"), type: 'error' })
        } else if (providerExists && !currentProviderConfig) {
            handleErrorMsg({ message: translate('PROVIDER') + ` ("${providerId}") ` + translate('ALREADY_EXIST') + `!`, type: 'error' })
        } else if (!authorizationUrl) {
            handleErrorMsg({ message: translate("AUTHORIZATIONURL_ALERT"), type: 'error' })
        } else if (flow === 'AUTHORIZATION_CODE' && !accessTokenUrl) {
            handleErrorMsg({ message: translate("ACCESSTOKEN_ALERT"), type: 'error' })
        } else if (!clientId) {
            handleErrorMsg({ message: translate("CLIENTID_ALERT"), type: 'error' })
        } else if (flow === 'AUTHORIZATION_CODE' && !clientSecret && !PKCE) {
            handleErrorMsg({ message: translate("CLIENTSECRET_ALERT"), type: 'error' })
        } else {
            setShowAlert(false)
            setloading(true)
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
                oauth2Flow: flow,
                providerId: providerId,
                responseType: responseType,
                scopeMap: scope_map_obj,
                scopes: scopes_val,
                sendAccessTokenAs: sendTokenAs,
                ...(PKCE ? { oAuth2Pkce: { enabled: PKCE, challengeMethod: codeMethod } } : { oAuth2Pkce: null })
            }
            const filteredProviders = customProviderList.filter((provider: { providerId: string; }) => provider.providerId !== providerId);
            const newProviderList = [...filteredProviders, newProvider];
            const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.addprovider
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
                if (!configModel) {
                    handleProviderList()
                }
                handleAuthorizationUrl()
                // dispatch(setSelectedProvider(newProvider))
                updateProviderConfig("selectedProvider", newProvider)
                handleClose()
                handleParentModalClose?.()
                handleSuccessCallback({ message: translate('SUCCESS_MSG'), type: 'success' })
            } else {
                handleErrorMsg({ message: translate("FAILED_TO_SAVE"), type: 'error' }, response)
                setloading(false)
            }
        }
    }

    const handleProviderList = async () => {
        const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.getprovider
        try {
            const response = await getProviderList(url);
            const sortedProviders = response.data;
            updateProviderConfig("providerList", sortedProviders)
            // dispatch(setproviderList(sortedProviders))
        } catch (error) {
            console.error('Error fetching provider list:', error);
        }
    }

    const handleAuthorizationUrl = async () => {
        const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.authorizationUrl.replace(":providerID", providerId)
        const configProvider = {
            url: url,
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

    function handleCloseWConfigProvider() {
        setFlow("AUTHORIZATION_CODE")
        setProviderID('')
        handleClose()
    }

    return (
        <>
            <Dialog id='wm-rest-config-model' className='rest-import-ui config_model_dialog' maxWidth={'md'} open={handleOpen} onClose={handleClose} >
                {loading && <FallbackSpinner />}
                <DialogTitle sx={{ backgroundColor: 'lightgray' }} className='provider_dialog_title'>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>{translate("OAUTH") + " " + translate("PROVIDER") + " " + translate("CONFIGURATION")} </Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <i title={translate("oAuth")} className="wms wms-help"></i>
                            <Link sx={{ color: 'gray', cursor: 'pointer' }}>{translate("HELP")}</Link>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }} className='config_dialog_title'>
                    {showAlert && (
                        <Alert sx={{ py: 0 }} data-testid="config-alert" severity={alertMsg.type} onClose={() => setShowAlert(false)}>{alertMsg.message} </Alert>
                    )}
                    <Grid spacing={2} mt={0.3} className='cmnflx' sx={{ width: '100%' }} container>
                        <Grid item md={3}>
                            <Typography>{translate('PROVIDER') + " " + translate('ID')} <span className='text-danger'>*</span>
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField name="wm-webservice-provider-id-value" sx={{ width: "30em" }} size='small' onChange={handleProviderId}
                                defaultValue={currentProviderConfig?.providerId} InputProps={{
                                    readOnly: !!currentProviderConfig,
                                }}
                                fullWidth />
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
                                        readOnly: !!currentProviderConfig,
                                    }}
                                    name="wm-webservice-callback-url-value"
                                    helperText={translate('CALLBACK_iNFO')}
                                    fullWidth
                                />
                                <i onMouseLeave={handleTooltipMouseLeave} data-testid="callback-copy" onClick={() => handleCopyClick(callback_url)} title={tooltipTitle} className='wm-icon fa fa-copy'></i>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("FLOW")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{
                                width: "30em",
                            }} size='small' disabled={!!currentProviderConfig}>
                                <Select
                                    name="wm-webservice-flow-value"
                                    data-testid="flow"
                                    value={flow}
                                    sx={{
                                        backgroundColor: restImportConfig.viewMode ? '#eeeced' : 'none',
                                        "& .MuiInputBase-input.Mui-disabled": {
                                            WebkitTextFillColor: restImportConfig.viewMode ? "#000" : 'none',
                                        },
                                    }}
                                    onChange={handleChangeFlow}
                                >
                                    <MenuItem title={translate("AUTHORIZATION") + " " + translate("CODE")} value={'AUTHORIZATION_CODE'}>{translate("AUTHORIZATION") + " " + translate("CODE")} </MenuItem>
                                    <MenuItem title={translate("NOT_RECOMMENDED")} value={'IMPLICIT'}> {translate("IMPLICIT")} ({translate("NOT_RECOMMENDED")}) </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {flow === 'AUTHORIZATION_CODE' &&
                            <>
                                <Grid item md={3}>
                                    <Typography>
                                        {translate("USE_PKCE")}?
                                    </Typography>
                                </Grid>
                                <Grid item md={PKCE ? 1 : 9}>
                                    <Checkbox
                                        data-testid='pkce-checkbox'
                                        checked={PKCE}
                                        name="wm-webservice-pkce-value"
                                        onChange={handleChangePKCE}
                                        sx={{ paddingRight: 3 }}
                                    />
                                    <i title={translate("PKCE_USE")} className="wms wms-help"></i>
                                </Grid>
                                {PKCE &&
                                    <Grid item md={8}>
                                        <Stack spacing={3} display={'flex'} alignItems={'center'} sx={{ width: "60%" }} direction={'row'}>
                                            <Typography>Code Challenge Method<span className='text-danger'>*</span></Typography>
                                            <FormControl size='small'>
                                                <Select
                                                    name="wm-webservice-code-challenge-method-value"
                                                    data-testid="challenge-method"
                                                    value={codeMethod}
                                                    onChange={handleChangecodeMethod}
                                                >
                                                    <MenuItem value={'S256'}>S256</MenuItem>
                                                    <MenuItem value={'plain'}>Basic</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <i title={translate("PKCE")} className="wms wms-help"></i>
                                        </Stack>
                                    </Grid>
                                }
                            </>
                        }
                        <Grid item md={3}>
                            <Typography>{translate("AUTHORIZATION") + " " + translate("URL")}  <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField
                                name="wm-webservice-authorization-url-value"
                                sx={{ width: "30em" }} size='small' onChange={handleAuthorizationURL}
                                defaultValue={currentProviderConfig?.authorizationUrl} />
                        </Grid>
                        {flow === 'AUTHORIZATION_CODE' &&
                            <>
                                <Grid item md={3}>
                                    <Typography>{translate("ACCESS_TOKEN") + " " + translate("URL")} <span className='text-danger'>*</span></Typography>
                                </Grid>
                                <Grid item md={9}>
                                    <TextField
                                        name="wm-webservice-access-token-value"
                                        sx={{ width: "30em" }} size='small' onChange={handleAccessTokenURL}
                                        defaultValue={currentProviderConfig?.accessTokenUrl} />
                                </Grid>
                            </>
                        }
                        <Grid item md={3}>
                            <Typography>{translate("CLIENT") + " " + translate("ID")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField
                                name="wm-webservice-client-id-value"
                                sx={{ width: "30em" }} size='small' defaultValue={currentProviderConfig?.clientId}
                                onChange={handleClientId} />
                        </Grid>
                        {!PKCE && flow === 'AUTHORIZATION_CODE' && (
                            <Grid item md={12} container className='cmnflx' spacing={2}>
                                <Grid item md={3} >
                                    <Typography>{translate("CLIENT") + " " + translate("SECRET")} <span className='text-danger'>*</span></Typography>
                                </Grid>
                                <Grid item md={9}>
                                    <TextField
                                        name="wm-webservice-client-secret-value"
                                        sx={{ width: "30em" }} defaultValue={currentProviderConfig?.clientSecret} size='small'
                                        onChange={handleClientSecret} />
                                </Grid>
                            </Grid>
                        )}
                        <Grid item md={3}>
                            <Typography>{translate("SEND_ACCESSTOKEN")} <span className='text-danger'>*</span></Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }} size='small'>
                                <Select
                                    name="wm-webservice-send-accesstoken-value"
                                    data-testid="send-accesstoken"
                                    value={sendTokenAs}
                                    onChange={handleChangesendTokenAs}
                                >
                                    <MenuItem title='header' value={'HEADER'}>{translate("HEADER")}</MenuItem>
                                    <MenuItem title='query' value={'QUERY'}>{translate("QUERY")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {flow === 'IMPLICIT' &&
                            <>
                                <Grid item md={3}>
                                    <Typography>{translate("RESPONSE_TYPE")} <span className='text-danger'>*</span></Typography>
                                </Grid>
                                <Grid item md={9}>
                                    <FormControl sx={{ width: "30em" }} size='small'>
                                        <Select
                                            name="wm-webservice-response-type-value"
                                            defaultValue='token'
                                            value={responseType}
                                            onChange={handleChangeresponseType}
                                        >
                                            <MenuItem title='token' value={'token'}>{translate("TOKEN")}</MenuItem>
                                            <MenuItem title='id token' value={'id_token'}>{translate("ID_TOKEN")}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        }
                        <Grid item md={3}>
                            <Typography>{translate("SCOPE")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Grid className='cmnflx' spacing={1} container>
                                <Grid item md={12}>
                                    <Stack>
                                        {scopes.map(scope => <FormControlLabel key={scope.name} control={<Checkbox title={scope.name} data-testid={scope.name} checked={scope.checked} onChange={(e) => handleScopeChange(e, scope.name)} />} label={scope.name} />)}
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
                                    <TextField
                                        name="wm-webservice-scope-key-value"
                                        size='small' value={scopeKey} onChange={(e) => setscopeKey(e.target.value)} />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField size='small'
                                        name="wm-webservice-scope-value-value"
                                        value={scopeValue} onChange={(e) => setscopeValue(e.target.value)} />
                                </Grid>
                                <Grid className='cmnflx' item md={4}>
                                    <Button
                                        name="wm-webservice-add-new-scope"
                                        onClick={handleAddScope} variant='contained'>{translate("ADD")}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <hr />
                <DialogActions sx={{ p: 2 }}>
                    <Button className="button_close" variant='contained' color='warning' onClick={handleCloseWConfigProvider}>
                        {translate("CLOSE")}
                    </Button>
                    <Button className="button_save" variant='contained' onClick={handleValidation}>
                        {translate("SAVE")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}