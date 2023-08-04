import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Checkbox, DialogActions, FormControl, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, SelectChangeEvent, Stack, TextField, Tooltip, Typography } from '@mui/material';

interface ScopeI {
    checked: boolean;
    value: string;
    key: string;
}

export default function ConfigModel({ handleOpen, handleClose }: { handleOpen: boolean, handleClose: () => void }) {
    const [Flow, setFlow] = useState('Authorization Code')
    const [sendTokenAs, setsendTokenAs] = useState('Header')
    const [PKCE, setPKCE] = useState(true)
    const [scopes, setscopes] = useState<ScopeI[]>([])
    const [scopeKey, setscopeKey] = useState('')
    const [scopeValue, setscopeValue] = useState('')

    const handleChangePKCE = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPKCE(event.target.checked)
    }

    const handleChangeFlow = (event: SelectChangeEvent) => {
        setFlow(event.target.value as string)
    }

    const handleChangesendTokenAs = (event: SelectChangeEvent) => {
        setsendTokenAs(event.target.value as string)
    }

    const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const scopesCopy = [...scopes]
        scopesCopy.map((scope) => {
            if (scope.key === key) {
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
                key: scopeKey,
                value: scopeValue
            })
            setscopes(scopesCopy)
            setscopeKey("")
            setscopeValue('')
        }
    }

    return (
        <>
            <Dialog maxWidth={'md'} open={handleOpen} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: 'lightgray' }}>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>OAuth Provider Configuration</Typography>
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
                <DialogContent sx={{ mt: 4 }}>
                    <Grid spacing={2} mt={0.5} className='cmnflx' sx={{ width: '100%' }} container>
                        <Grid item md={3}>
                            <Typography>Provider ID</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} fullWidth placeholder='Provider ID' label='Provider ID' />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Callback URL</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Stack direction={'row'}>
                                <TextField sx={{ width: "30em" }} helperText="Set this as the callback URL in OAuth Provider app settings page" fullWidth label='Callback URL' placeholder='Callback URL' />
                                <Tooltip sx={{ ":hover": { backgroundColor: 'transparent' } }} title="Copy to Clipboard">
                                    <IconButton>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Flow</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={Flow}
                                    onChange={handleChangeFlow}
                                >
                                    <MenuItem value={'Authorization Code'}>Authorization Code</MenuItem>
                                    <MenuItem value={'Implicit'}>Implicit(Not Remcommended)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>
                                Use PKCE?
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Checkbox
                                checked={PKCE}
                                onChange={handleChangePKCE}
                            />
                            <Tooltip title="Delete">
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Authorization URL</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder='Authorization URL' label='Authorization URL' />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Access Token URL</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder='Access Token URL' label='Access Token URL' />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Client ID</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder='Client ID' label='Client ID' />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Client Secret</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder='Client Secret' label='Client Secret' />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Send AccessToken As</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={sendTokenAs}
                                    onChange={handleChangesendTokenAs}
                                >
                                    <MenuItem value={'Header'}>Header</MenuItem>
                                    <MenuItem value={'Query'}>Query</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>Scope</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Grid className='cmnflx' spacing={1} container>
                                <Grid item md={12}>
                                    <Stack>
                                        {scopes.map(scope => <FormControlLabel key={scope.key} control={<Checkbox checked={scope.checked} onChange={(e) => handleScopeChange(e, scope.key)} />} label={scope.value} />)}
                                    </Stack>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>Scope Key</Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>Scope Value</Typography>
                                </Grid>
                                <Grid item md={4}>
                                </Grid>
                                <Grid item md={12}>
                                    <hr />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeKey} onChange={(e) => setscopeKey(e.target.value)} placeholder='Scope Key' label='Scope Key' />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeValue} onChange={(e) => setscopeValue(e.target.value)} placeholder='Scope Value' label='Scope Value' />
                                </Grid>
                                <Grid className='cmnflx' item md={4}>
                                    <Button onClick={handleAddScope} variant='contained'>Add</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <hr />
                <DialogActions sx={{ p: 2 }}>
                    <Button variant='contained' color='warning' onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='contained' onClick={handleClose}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}