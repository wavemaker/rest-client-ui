import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Card, CardContent, CardMedia, Grid, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import ConfigModel from './ConfigModel';

export default function ProviderModal({ handleOpen, handleClose }: { handleOpen: boolean, handleClose: () => void }) {
    const [openConfig, setopenConfig] = useState(false)

    const providers = [
        {
            title: 'Amazon',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/amazon.svg',
        },
        {
            title: 'Box',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/box.svg',
        },
        {
            title: 'Dropbox',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/dropbox.svg',
        },
        {
            title: 'Facebook',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/facebook.svg',
        },
        {
            title: 'Github',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/github.svg',
        },
        {
            title: 'Google',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/google.svg',
        },
        {
            title: 'Instagram',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/instagram.svg',
        },
        {
            title: 'LinkedIn',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/linkedin.svg',
        },
        {
            title: 'Salesforce',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/salesforce.svg',
        },
        {
            title: 'Outlook',
            iconURL:
                'https://dh2dw20653ig1.cloudfront.net/studio/11.3.5.110/editor/styles/images/oauth2providers/outlook.svg',
        },
    ]

    const handleOpenConfig = () => {
        setopenConfig(true)
    }

    const handleCloseConfig = () => {
        setopenConfig(false)
    }

    return (
        <>
            <Dialog maxWidth={'md'} open={handleOpen} onClose={handleClose}>
                <DialogTitle>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>Select Or Add Provider</Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <Tooltip title="Delete">
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Link sx={{ color: 'gray' }}>Help</Link>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: 'lightgray' }}>
                    <Grid spacing={5} sx={{ width: '100%', ml: 0, mt: 0, mb: 2 }} container>
                        <Grid item md={3}>
                            <Card sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                <CardMedia
                                    sx={{ height: "35px", width: "35px", mt: 2 }}
                                    image={'data:image/png;base64,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'}
                                    title="Add Custom Provider"
                                />
                                <CardContent>
                                    <Typography>
                                        Add Provider
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {providers.map((provider) => <Grid item md={3} key={provider.title}>
                            <Card onClick={handleOpenConfig} sx={{ flexDirection: 'column', width: 130, height: 130, cursor: 'pointer' }} className='cmnflx cardcontainer'>
                                <CardMedia
                                    sx={{ height: "35px", width: "35px", mt: 2 }}
                                    image={provider.iconURL}
                                    title={provider.title}
                                />
                                <CardContent>
                                    <Typography>
                                        {provider.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>)}
                    </Grid>
                </DialogContent>
            </Dialog>
            <ConfigModel handleOpen={openConfig} handleClose={handleCloseConfig} />
        </>
    );
}