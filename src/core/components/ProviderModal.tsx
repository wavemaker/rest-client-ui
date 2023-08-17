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
import Apicall from './common/apicall';
import { proxyConfigI } from './WebServiceModal'
export interface ProviderI {
    providerId: string
    authorizationUrl: string
    accessTokenUrl: string
    sendAccessTokenAs: string
    accessTokenParamName: string
    scopes: ScopeI[],
    responseType?: string,
    oAuth2Pkce?: oAuth2I
    clientId?: string,
    clientSecret?: string
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

export default function ProviderModal({ handleOpen, handleClose, onSelectedProvider, proxyObj }: { handleOpen: boolean, handleClose: () => void, onSelectedProvider: any, proxyObj: proxyConfigI }) {
    const [openConfig, setopenConfig] = useState(false)
    const [providers, setProviders] = useState<ProviderI[]>([{ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] }])
    const [currentProvider, setcurrentProvider] = useState<ProviderI | null>({ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] })
    const [allProvider, setAllProvider] = useState<ProviderI[]>([{ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] }])
    const [defaultProviderIds, setDefaultProviderId] = useState([])

    const handleSelectedProvider = (data: any) => {
        onSelectedProvider(data)
    }

    const handleOpenConfig = (provider: ProviderI | null) => {
        setcurrentProvider(provider)
        setopenConfig(true)
    }

    useEffect(() => {
        if (currentProvider?.accessTokenParamName) {
            handleClose()
            onSelectedProvider(currentProvider)
        }
    }, [currentProvider])

    const handleCloseConfig = () => {
        setopenConfig(false)
    }
    const handleProviderList = async () => {
        const url = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.getprovider : proxyObj?.oAuthConfig?.base_path + proxyObj?.oAuthConfig?.getprovider;
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
            const sortedProviders = response.data.slice().sort();
            setProviders(sortedProviders);

        } else {
            console.error("Received an unexpected response:", response);
        }

    }

    const handleDefaultProviderList = async () => {
        const url = proxyObj?.default_proxy_state === 'ON' ? proxyObj?.proxy_conf?.base_path + proxyObj?.proxy_conf?.list_provider : proxyObj?.oAuthConfig?.base_path + proxyObj?.oAuthConfig?.list_provider;
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

            const filtered_provider = allProvidersArray.reduce((filtered: any, current) => {
                const existing = filtered.find((item: { providerId: string; }) => item.providerId === current.providerId);
                if (!existing || current.responseType === "token") {
                    return existing
                        ? filtered.map((item: { providerId: string; }) => {
                            return (item.providerId === current.providerId ? current : item)
                        })
                        : [...filtered, current];
                }
                return filtered;
            }, []);

            const sortedProviders = filtered_provider.slice().sort((a: { providerId: string; }, b: { providerId: any; }) => a.providerId.localeCompare(b.providerId));
            setAllProvider(sortedProviders)
        } else {
            console.error("Received an unexpected response:", response);
        }

    }

    useEffect(() => {
        handleProviderList()
    }, [])

    useEffect(() => {
        handleDefaultProviderList()
    }, [providers])

    const { t: translate } = useTranslation();
    return (
        <>
            <Dialog className='rest-import-ui' maxWidth={'md'} open={handleOpen} onClose={handleClose}>
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
                            <Card onClick={() => handleOpenConfig(null)} sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
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

                            <Grid item md={3} key={provider.providerId}>
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
                        customProvider={providers}
                        onSelectedProvider={handleSelectedProvider}
                        onLoadProvider={handleProviderList}
                        proxyObj={proxyObj}
                    />
                )
            }


        </>
    );
}