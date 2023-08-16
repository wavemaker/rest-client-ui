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
export default function ProviderModal({ handleOpen, handleClose, onSelectedProvider }) {
    const [openConfig, setopenConfig] = useState(false);
    const [providers, setProviders] = useState([{ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] }]);
    const [currentProvider, setcurrentProvider] = useState({ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] });
    const [allProvider, setAllProvider] = useState([{ providerId: '', authorizationUrl: '', accessTokenUrl: '', sendAccessTokenAs: '', accessTokenParamName: '', scopes: [] }]);
    const handleSelectedProvider = (data) => {
        onSelectedProvider(data);
    };
    const handleOpenConfig = (provider) => {
        setcurrentProvider(provider);
        setopenConfig(true);
    };
    useEffect(() => {
        if (currentProvider?.accessTokenParamName) {
            handleClose();
            onSelectedProvider(currentProvider);
        }
    }, [currentProvider]);
    const handleCloseConfig = () => {
        setopenConfig(false);
    };
    const handleProviderList = async () => {
        const configProvider = {
            url: "http://localhost:5000/getprovider",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        };
        const response = await Apicall(configProvider);
        if (response.status === 200) {
            const sortedProviders = response.data.slice().sort();
            setProviders(sortedProviders);
        }
        else {
            console.error("Received an unexpected response:", response);
        }
    };
    const handleDefaultProviderList = async () => {
        const configProvider = {
            url: "http://localhost:5000/get-default-provider",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        };
        const response = await Apicall(configProvider);
        if (response.status === 200) {
            const default_providers = response.data;
            const allProvidersArray = providers.concat(default_providers);
            const filtered_provider = allProvidersArray.reduce((filtered, current) => {
                const existing = filtered.find((item) => item.providerId === current.providerId);
                if (!existing || current.responseType === "token") {
                    return existing
                        ? filtered.map((item) => {
                            return (item.providerId === current.providerId ? current : item);
                        })
                        : [...filtered, current];
                }
                return filtered;
            }, []);
            const sortedProviders = filtered_provider.slice().sort((a, b) => a.providerId.localeCompare(b.providerId));
            setAllProvider(sortedProviders);
        }
        else {
            console.error("Received an unexpected response:", response);
        }
    };
    useEffect(() => {
        handleProviderList();
    }, []);
    useEffect(() => {
        handleDefaultProviderList();
    }, [providers]);
    const { t: translate } = useTranslation();
    return (<>
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
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose}/>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: 'lightgray' }}>
                    <Grid spacing={5} sx={{ width: '100%', ml: 0, mt: 0, mb: 2 }} container>
                        <Grid item md={3}>
                            <Card onClick={() => handleOpenConfig(null)} sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                <CardMedia sx={{ height: "35px", width: "35px", mt: 2 }} title={translate("ADD") + " " + translate("CUSTOM") + " " + translate("PROVIDER")}>   <AddCircleOutlineIcon fontSize="large" style={{ fontSize: "2.4rem" }}/></CardMedia>
                                <CardContent>
                                    <Typography>
                                        {translate("ADD") + " " + translate("PROVIDER")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {allProvider.map((provider) => <Grid item md={3} key={provider.providerId}>
                                <Card title={provider.providerId} onClick={() => handleOpenConfig(provider)} sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                    <CardMedia sx={{ height: "35px", width: "35px", mt: 2 }}>
                                        <img src={`https://dh2dw20653ig1.cloudfront.net/studio/11.3.6.111/editor/styles/images/oauth2providers/${provider.providerId}.svg`} alt={provider.providerId} style={{ height: "35px" }} onError={(e) => {
                const imgElement = e.target;
                imgElement.onerror = null;
                imgElement.src = 'https://dh2dw20653ig1.cloudfront.net/studio/11.3.6.111/editor/generated/styles/images/logo.png';
            }}/>

                                    </CardMedia>
                                    <CardContent>
                                        <Typography sx={{
                textTransform: 'capitalize',
                width: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}>
                                            {provider.providerId}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>)}
                    </Grid>
                </DialogContent>
            </Dialog>

            {!currentProvider?.responseType && (<ConfigModel handleOpen={openConfig} handleClose={handleCloseConfig} handleParentModalClose={handleClose} providerConf={currentProvider} customProvider={providers} onSelectedProvider={handleSelectedProvider} onLoadProvider={handleProviderList}/>)}


        </>);
}
