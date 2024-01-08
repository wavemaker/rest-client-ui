import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Card, CardContent, CardMedia, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ConfigModel from './ConfigModel';
import { useTranslation } from 'react-i18next';
import Apicall, { getProviderList } from './common/apicall';
import { INotifyMessage, restImportConfigI } from './RestImport'
import { setProviderAuthorizationUrl, setSelectedProvider, setproviderList } from './appStore/Slice';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
export interface ProviderI {
    providerId: string
    authorizationUrl: string
    accessTokenUrl: string
    sendAccessTokenAs: string
    accessTokenParamName: string
    scopes: ScopeI[],
    responseType?: string,
    oAuth2Pkce: oAuth2I | null,
    clientId?: string,
    clientSecret?: string,
    oauth2Flow: string
}
interface oAuth2I {
    enabled: boolean,
    challengeMethod: string
}

export interface ScopeI {
    name: string;
    value: string;
    checked?: boolean;
}

export default function ProviderModal({ handleOpen, handleClose, proxyObj, isCustomErrorFunc, customFunction, handleSuccessCallback }:
    { handleOpen: boolean, handleClose: () => void, proxyObj: restImportConfigI, isCustomErrorFunc: boolean, customFunction: (msg: string, response?: AxiosResponse) => void, handleSuccessCallback: (msg: INotifyMessage, response?: AxiosResponse) => void }) {
    const { t: translate } = useTranslation();
    const dispatch = useDispatch();
    const [openConfig, setopenConfig] = useState(false)
    const [currentProvider, setcurrentProvider] = useState<ProviderI | null>({ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [], oAuth2Pkce: null, oauth2Flow:'AUTHORIZATION_CODE' })
    const [allProvider, setAllProvider] = useState<ProviderI[]>([{ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [], oAuth2Pkce: null, oauth2Flow: 'AUTHORIZATION_CODE' }])
    const [defaultProviderIds, setDefaultProviderId] = useState([])
    const providers = useSelector((store: any) => store.slice.providerList)

    useEffect(() => {
        if (proxyObj.httpAuth?.type === 'OAUTH2') {
            allProvider.forEach((provider: ProviderI) => {
                if (provider.providerId === proxyObj.httpAuth?.providerId)
                    setcurrentProvider(provider)
            })
        }
    }, [allProvider, proxyObj])


    const handleOpenConfig = (provider: ProviderI | null) => {
        setcurrentProvider(provider)
        setopenConfig(true)
    }
    useEffect(() => {
        if (currentProvider?.accessTokenParamName) {
            handleClose()
            dispatch(setSelectedProvider(currentProvider))
            handleAuthorizationUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProvider])

    const handleAuthorizationUrl = async () => {
        const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.authorizationUrl.replace(":providerID", currentProvider?.providerId as string)
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
            dispatch(setProviderAuthorizationUrl(authorization_url))
        } else {
            console.log("Received an unexpected response:", response);
        }
    }
    const handleCloseConfig = () => {
        setopenConfig(false)
    }
    const handleProviderList = async () => {
        const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.getprovider
        try {
            const response = await getProviderList(url);
            const sortedProviders = response.data;
            dispatch(setproviderList(sortedProviders))
        } catch (error) {
            console.error('Error fetching provider list:', error);
        }
    }
    const handleDefaultProviderList = async () => {
        const url = proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.list_provider
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
            const default_providers = response.data;
            const default_provider_id = default_providers.map((item: { providerId: string; }) => item.providerId).filter((providerId: string) => providerId);
            setDefaultProviderId(default_provider_id)
            const allProvidersArray = providers.concat(default_providers);
            const filtered_provider = allProvidersArray.reduce((filtered: any, current: any) => {
                const existing = filtered.find((item: { providerId: string; }) => item.providerId === current.providerId);
                if (!existing || current.responseType === "token") {
                    return existing
                        ? filtered.map((item: { providerId: string; }) => {
                            return (item.providerId === current.providerId ? current : item)
                        })
                        : [...filtered, current];
                }
                return filtered;
            }, [])
            const sortedProviders = filtered_provider.slice().sort((a: { providerId: string; }, b: { providerId: any; }) => a.providerId.localeCompare(b.providerId));
            setAllProvider(sortedProviders)
        } else {
            console.log("Received an unexpected response:", response);
        }
    }

    useEffect(() => {
        handleProviderList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        handleDefaultProviderList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [providers])

    return (
        <>
            <Dialog id='wm-rest-provider-model' className='rest-import-ui' maxWidth={'md'} data-testid='provider-modal' open={handleOpen} onClose={handleClose}>
                <DialogTitle>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>{translate("SELECT") + " " + translate("OR") + " " + translate("ADD") + " " + translate("PROVIDER")}</Typography>
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
                <DialogContent sx={{ backgroundColor: 'lightgray' }}>
                    <Grid spacing={5} sx={{ width: '100%', ml: 0, mt: 0, mb: 2 }} container>
                        <Grid item md={3}>
                            <Card onClick={() => handleOpenConfig(null)} data-testid="add-provider" sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                <CardMedia
                                    sx={{ height: "35px", width: "35px", mt: 2 }}
                                    title={translate("ADD") + " " + translate("CUSTOM") + " " + translate("PROVIDER")}
                                >   <AddCircleOutlineIcon
                                        fontSize="large"
                                        style={{ fontSize: "2.4rem" }}
                                    /></CardMedia>
                                <CardContent>
                                    <Typography>
                                        {translate("ADD") + " " + translate("PROVIDER")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {allProvider.map((provider) =>
                            <Grid item md={3} key={provider.providerId} data-testid="default-provider">
                                <Card title={provider.providerId} onClick={() => handleOpenConfig(provider)} sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                    <CardMedia
                                        sx={{ height: "35px", width: "35px", mt: 2 }}>
                                        <img
                                            src={
                                                (defaultProviderIds as string[]).includes(provider.providerId)
                                                    ? `https://dh2dw20653ig1.cloudfront.net/studio/11.3.6.111/editor/styles/images/oauth2providers/${provider.providerId}.svg`
                                                    : 'https://dh2dw20653ig1.cloudfront.net/studio/11.3.6.111/editor/generated/styles/images/logo.png'
                                            }
                                            alt={provider.providerId}
                                            style={{ height: "35px" }}
                                        />
                                    </CardMedia>
                                    <CardContent>
                                        <Typography
                                            sx={{
                                                textTransform: 'capitalize',
                                                width: '120px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {provider.providerId}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>)}
                    </Grid>
                </DialogContent>
            </Dialog>
            {
                !currentProvider?.responseType && (
                    <ConfigModel
                        handleOpen={openConfig}
                        handleClose={handleCloseConfig}
                        handleParentModalClose={handleClose}
                        providerConf={currentProvider}
                        proxyObj={proxyObj}
                        isCustomErrorFunc={isCustomErrorFunc}
                        customFunction={customFunction}
                        handleSuccessCallback={handleSuccessCallback}
                    />
                )
            }
        </>
    );
}
