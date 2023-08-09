import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Checkbox, DialogActions, FormControl, FormControlLabel, Grid, IconButton, Link, MenuItem, Select, SelectChangeEvent, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

    const { t: translate} = useTranslation();

    return (
        <>
            <Dialog className='rest-import-ui' maxWidth={'md'} open={handleOpen} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: 'lightgray' }}>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>{translate("OAUTH") + " "+translate("PROVIDER")+ " "+ translate("CONFIGURATION")}</Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <Tooltip title={translate("DELETE")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Link sx={{ color: 'gray' }}>{translate("HELP")}</Link>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ mt: 4 }}>
                    <Grid spacing={2} mt={0.5} className='cmnflx' sx={{ width: '100%' }} container>
                        <Grid item md={3}>
                            <Typography>{translate('PROVIDER') + " " +translate('ID')}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} fullWidth placeholder={translate('PROVIDER') + " " +translate('ID')} label={translate('PROVIDER') + " " +translate('ID')} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate('CALLBACK') + " " +translate('URL')}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Stack direction={'row'}>
                                <TextField sx={{ width: "30em" }} helperText={translate("CALLBACK_iNFO")} fullWidth label={translate('CALLBACK') + " " +translate('URL')} placeholder={translate('CALLBACK') + " " +translate('URL')} />
                                <Tooltip sx={{ ":hover": { backgroundColor: 'transparent' } }} title={translate("CLIPBOARD_TEXT")}>
                                    <IconButton>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("FLOW")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={Flow}
                                    onChange={handleChangeFlow}
                                >
                                    <MenuItem value={'Authorization Code'}>{translate("AUTHORIZATION")+ " " + translate("CODE")} </MenuItem>
                                    <MenuItem value={'Implicit'}> {translate("IMPLICIT")} ({translate("NOT_RECOMMENDED")}) </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>
                               {translate("USE_PKCE")}?
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Checkbox
                                checked={PKCE}
                                onChange={handleChangePKCE}
                            />
                            <Tooltip title={translate("DELETE")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("AUTHORIZATION") + " "+translate("URL")}  </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={translate("AUTHORIZATION") + " "+translate("URL")} label={translate("AUTHORIZATION") + " "+translate("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("ACCESS_TOKEN") + " "+translate("URL")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={translate("ACCESS_TOKEN") + " "+translate("URL")} label={translate("ACCESS_TOKEN") + " "+translate("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("CLIENT") + " "+ translate("ID")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={translate("CLIENT") + " "+ translate("ID")} label={translate("CLIENT") + " "+ translate("ID")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("CLIENT") + " "+ translate("SECRET")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={translate("CLIENT") + " "+ translate("SECRET")} label={translate("CLIENT") + " "+ translate("SECRET")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{translate("SEND_ACCESSTOKEN")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={sendTokenAs}
                                    onChange={handleChangesendTokenAs}
                                >
                                    <MenuItem value={'Header'}>{translate("HEADER")}</MenuItem>
                                    <MenuItem value={'Query'}>{translate("QUERY")}</MenuItem>
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
                                        {scopes.map(scope => <FormControlLabel key={scope.key} control={<Checkbox checked={scope.checked} onChange={(e) => handleScopeChange(e, scope.key)} />} label={scope.value} />)}
                                    </Stack>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{translate("SCOPE")+ " "+ translate("KEY")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{translate("SCOPE")+ " "+ translate("VALUE")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                </Grid>
                                <Grid item md={12}>
                                    <hr />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeKey} onChange={(e) => setscopeKey(e.target.value)} placeholder={translate("SCOPE")+ " "+ translate("KEY")} label={translate("SCOPE")+ " "+ translate("KEY")} />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeValue} onChange={(e) => setscopeValue(e.target.value)} placeholder={translate("SCOPE")+ " "+ translate("VALUE")} label={translate("SCOPE")+ " "+ translate("VALUE")} />
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
                    <Button variant='contained' onClick={handleClose}>
                        {translate("SAVE")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}