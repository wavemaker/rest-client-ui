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

    const { t } = useTranslation();

    return (
        <>
            <Dialog maxWidth={'md'} open={handleOpen} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: 'lightgray' }}>
                    <Stack direction={'row'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography variant='h6' fontWeight={600}>{t("OAUTH") + " "+t("PROVIDER")+ " "+ t("CONFIGURATION")}</Typography>
                        <Stack spacing={1} className='cmnflx' direction={'row'}>
                            <Tooltip title={t("DELETE")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Link sx={{ color: 'gray' }}>{t("HELP")}</Link>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ mt: 4 }}>
                    <Grid spacing={2} mt={0.5} className='cmnflx' sx={{ width: '100%' }} container>
                        <Grid item md={3}>
                            <Typography>{t('PROVIDER') + " " +t('ID')}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} fullWidth placeholder={t('PROVIDER') + " " +t('ID')} label={t('PROVIDER') + " " +t('ID')} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t('CALLBACK') + " " +t('URL')}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Stack direction={'row'}>
                                <TextField sx={{ width: "30em" }} helperText={t("CALLBACK_iNFO")} fullWidth label={t('CALLBACK') + " " +t('URL')} placeholder={t('CALLBACK') + " " +t('URL')} />
                                <Tooltip sx={{ ":hover": { backgroundColor: 'transparent' } }} title={t("CLIPBOARD_TEXT")}>
                                    <IconButton>
                                        <ContentCopyIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("FLOW")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={Flow}
                                    onChange={handleChangeFlow}
                                >
                                    <MenuItem value={'Authorization Code'}>{t("AUTHORIZATION")+ " " + t("CODE")} </MenuItem>
                                    <MenuItem value={'Implicit'}> {t("IMPLICIT")} ({t("NOT_RECOMMENDED")}) </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>
                               {t("USE_PKCE")}?
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Checkbox
                                checked={PKCE}
                                onChange={handleChangePKCE}
                            />
                            <Tooltip title={t("DELETE")}>
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("AUTHORIZATION") + " "+t("URL")}  </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={t("AUTHORIZATION") + " "+t("URL")} label={t("AUTHORIZATION") + " "+t("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("ACCESS_TOKEN") + " "+t("URL")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={t("ACCESS_TOKEN") + " "+t("URL")} label={t("ACCESS_TOKEN") + " "+t("URL")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("CLIENT") + " "+ t("ID")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={t("CLIENT") + " "+ t("ID")} label={t("CLIENT") + " "+ t("ID")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("CLIENT") + " "+ t("SECRET")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TextField sx={{ width: "30em" }} placeholder={t("CLIENT") + " "+ t("SECRET")} label={t("CLIENT") + " "+ t("SECRET")} />
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("SEND_ACCESSTOKEN")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <FormControl sx={{ width: "30em" }}>
                                <Select
                                    value={sendTokenAs}
                                    onChange={handleChangesendTokenAs}
                                >
                                    <MenuItem value={'Header'}>{t("HEADER")}</MenuItem>
                                    <MenuItem value={'Query'}>{t("QUERY")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <Typography>{t("SCOPE")}</Typography>
                        </Grid>
                        <Grid item md={9}>
                            <Grid className='cmnflx' spacing={1} container>
                                <Grid item md={12}>
                                    <Stack>
                                        {scopes.map(scope => <FormControlLabel key={scope.key} control={<Checkbox checked={scope.checked} onChange={(e) => handleScopeChange(e, scope.key)} />} label={scope.value} />)}
                                    </Stack>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{t("SCOPE")+ " "+ t("KEY")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                    <Typography>{t("SCOPE")+ " "+ t("VALUE")}</Typography>
                                </Grid>
                                <Grid item md={4}>
                                </Grid>
                                <Grid item md={12}>
                                    <hr />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeKey} onChange={(e) => setscopeKey(e.target.value)} placeholder={t("SCOPE")+ " "+ t("KEY")} label={t("SCOPE")+ " "+ t("KEY")} />
                                </Grid>
                                <Grid item md={4}>
                                    <TextField value={scopeValue} onChange={(e) => setscopeValue(e.target.value)} placeholder={t("SCOPE")+ " "+ t("VALUE")} label={t("SCOPE")+ " "+ t("VALUE")} />
                                </Grid>
                                <Grid className='cmnflx' item md={4}>
                                    <Button onClick={handleAddScope} variant='contained'>{t("ADD")}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <hr />
                <DialogActions sx={{ p: 2 }}>
                    <Button variant='contained' color='warning' onClick={handleClose}>
                        {t("CLOSE")}
                    </Button>
                    <Button variant='contained' onClick={handleClose}>
                        {t("SAVE")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}