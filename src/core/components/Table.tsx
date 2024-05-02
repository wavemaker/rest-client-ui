import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Autocomplete, FormControl, IconButton, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, TextField, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
    constructCommaSeparatedUniqueQueryValuesString, constructUpdatedQueryString, findDuplicateObjectsWithinArray, findDuplicatesByComparison,
    getCurrentDateTime, retrieveQueryDetailsFromURL
} from './common/common';
import styled from "@emotion/styled";
import { FileUploadOutlined } from '@mui/icons-material';
import { INotifyMessage, PathParamsI, defaultContentTypes, restImportConfigI } from './RestImport';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

export interface HeaderAndQueryI {
    name: string
    type: string
    value: string
}

export interface BodyParamsI {
    name: string
    type: string
    value: string | File
    filename?: string
    contentType: string
}


export const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #fff;
  }
  &:nth-of-type(even) {
    background-color: #f3f3f3;
  } 
`;
export const tableHeaderStyle: CSSProperties = {
    fontWeight: 700,
    paddingTop: 5,
    paddingBottom: 5,
    border: "1px solid #ccc"
}
export const tableRowStyle: CSSProperties = {
    paddingTop: 8,
    paddingBottom: 8,
    border: "1px solid #ccc"
}

export function HeaderAndQueryTable(
    {
        value, setValue, from, apiURL, changeapiURL, headerParams, queryParams, pathParams, handleToastError, restImportConfig, setAlertMsg,
        multipartParams, handleHeaderParamsContentTypeChange
    }:
        {
            value: HeaderAndQueryI[], setValue: (data: HeaderAndQueryI[]) => void, from: string, setAlertMsg: (value: boolean) => void,
            apiURL: string, changeapiURL: (value: string) => void, headerParams: HeaderAndQueryI[], queryParams: HeaderAndQueryI[],
            pathParams: PathParamsI[], handleToastError: (error: INotifyMessage, response?: AxiosResponse) => void, restImportConfig: restImportConfigI,
            multipartParams: BodyParamsI[], handleHeaderParamsContentTypeChange: (value: string) => void
        }
) {
    const tableRef = useRef<HTMLTableElement | null>(null)
    useEffect(() => {
        const updateStickyRow = () => {
            const table = tableRef.current;
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    const rows = tbody.getElementsByTagName('tr');
                    const lastRow = rows[rows.length - 1];
                    const tableRect = table.getBoundingClientRect();
                    const lastRowRect = lastRow.getBoundingClientRect();
                    if (lastRowRect.bottom < tableRect.bottom) {
                        lastRow.style.position = 'sticky';
                        lastRow.style.bottom = '0';
                        lastRow.style.background = rows.length % 2 === 0 ? "#f3f3f3" : 'white'; // Adjust as needed 
                    } else {
                        lastRow.style.position = 'static';
                        lastRow.style.bottom = 'auto';
                        lastRow.style.background = rows.length % 2 === 0 ? 'white' : "#f3f3f3";;
                    }
                }
            }
        };
        // Initial update
        updateStickyRow();
        // Listen for scroll events on the table
        tableRef.current?.addEventListener('scroll', updateStickyRow);
        // Cleanup event listener on component unmount
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            tableRef.current?.removeEventListener('scroll', updateStickyRow);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    const { t: translate } = useTranslation();
    const selectTypes =
    {
        UITypes: [
            { value: 'boolean', label: translate('BOOLEAN') },
            { value: 'date', label: translate('DATE') },
            { value: 'date-time', label: translate('DATE') + translate('TIME') },
            { value: 'double', label: translate('DOUBLE') },
            { value: 'float', label: translate('FLOAT') },
            { value: 'int32', label: translate('INTEGER') },
            { value: 'int64', label: translate('LONG') },
            { value: 'string', label: translate('STRING') },
        ],
        ServerSideProperties: [
            { value: 'DATE', label: translate('CURRENT') + " " + translate('DATE') },
            { value: 'DATETIME', label: translate('CURRENT') + " " + translate('DATE') + translate('TIME') },
            { value: 'TIME', label: translate('CURRENT') + " " + translate('TIME') },
            { value: 'TIMESTAMP', label: translate('CURRENT') + " " + translate('TIMESTAMP') },
            { value: 'USER_ID', label: translate('LOGGEDIN') + " " + translate('USERID') },
            { value: 'USER_NAME', label: translate('LOGGEDIN') + " " + translate('USERNAME') },
        ],
    }
    const ServerSidePropertiesMap = new Map([
        ["DATE", getCurrentDateTime(false, false)],
        ["DATETIME", getCurrentDateTime(true, false)],
        ["TIME", getCurrentDateTime(false, true)],
        ["TIMESTAMP", Math.floor(Date.now() / 1000).toString()],
        ["USER_ID", restImportConfig.loggenInUserId || ""],
        ["USER_NAME", restImportConfig.loggenInUserName || ""]
    ])

    const selectNames = [
        { value: 'accept', label: 'Accept' },
        { value: 'accept-charset', label: 'Accept-Charset' },
        { value: 'accept-encoding', label: 'Accept-Encoding' },
        { value: 'accept-language', label: 'Accept-Language' },
        { value: 'authorization', label: 'Authorization' },
        { value: 'content-length', label: 'Content-Length' },
        { value: 'content-type', label: 'Content-Type' },
        { value: 'cookie', label: 'Cookie' },
        { value: 'origin', label: 'Origin' },
        { value: 'referer', label: 'Referer' },
        { value: 'user-agent', label: 'User-Agent' },
    ];

    const handleChangeName = (name: string, currentIndex: number) => {
        const valueClone = [...value]
        if (name !== null) {
            valueClone.forEach((data: HeaderAndQueryI, index) => {
                if (index === currentIndex) {
                    data.name = name
                }
            })
        }
        else {
            valueClone.forEach((data: HeaderAndQueryI, index) => {
                if (index === currentIndex) {
                    data.name = ''
                }
            })
        }
        setValue(valueClone)
    }

    const handleChangeType = (event: SelectChangeEvent, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.forEach((data, index) => {
            if (index === currentIndex) {
                if (selectTypes.ServerSideProperties.find(e => e.value === event.target.value)) {
                    if (from === 'query') {
                        let newQueryString = ''
                        const queriesArrayFromUrl: HeaderAndQueryI[] = retrieveQueryDetailsFromURL(apiURL)
                        const result = queriesArrayFromUrl && queriesArrayFromUrl[index]?.name === data.name && queriesArrayFromUrl[index]?.value === data.value
                        if (result) {  // Creating a URL with modified query parameter 
                            queriesArrayFromUrl[index].value = ServerSidePropertiesMap.get(event.target.value) as string
                            newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                        } else {  // Reconstructing the old URL
                            newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                        }
                        const originalURL = apiURL.split('?')[0]
                        changeapiURL(originalURL + newQueryString)
                    }
                    data.type = event.target.value
                    data.value = ServerSidePropertiesMap.get(event.target.value) as string
                } else {
                    data.type = event.target.value
                }
            }
        })
        setValue(valueClone)
    }


    const handleChangeTestValue = (newValue: string, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.forEach((data, index) => {
            if (index === currentIndex) {
                data.value = newValue
            }
        })
        setValue(valueClone)
    }

    function handleAddRow() {
        setAlertMsg(false)
        const lastRow = value[value.length - 1]
        const valueClone = [...value]
        const duplicates = findDuplicateObjectsWithinArray(valueClone, "name")
        const allDuplicates = (): HeaderAndQueryI[] => {
            let returnDuplicates: HeaderAndQueryI[] = []
            if (from === 'header') {
                returnDuplicates = findDuplicatesByComparison([lastRow], [...queryParams, ...multipartParams, ...pathParams], "name")
            }
            else {
                returnDuplicates = findDuplicatesByComparison([lastRow], [...headerParams, ...multipartParams, ...pathParams], "name")
            }
            return returnDuplicates
        }
        if (lastRow.name !== '' && lastRow.type !== '' && lastRow.value !== '') {
            if (from === 'header' && duplicates.length > 0)
                return handleToastError({ message: `parameter "${duplicates[0].name}" already exists`, type: 'error' })
            if (allDuplicates().length > 0)
                return handleToastError({ message: `parameter "${allDuplicates()[0].name}" already exists`, type: 'error' })
            if (from === 'query' && allDuplicates().length === 0) {
                const lastRowValuesArray = lastRow.value.split(',')
                const lastRowValues = lastRowValuesArray.filter((value, index) => value && lastRowValuesArray.indexOf(value) === index)
                if (apiURL) {
                    const queriesArrayFromUrl: HeaderAndQueryI[] = retrieveQueryDetailsFromURL(apiURL)
                    if (queriesArrayFromUrl.some(query => query.name === lastRow.name)) {
                        const queryIndex = queriesArrayFromUrl.findIndex(data => data.name === lastRow.name)
                        const valueCollection = [...queriesArrayFromUrl[queryIndex].value.split(','), ...lastRowValues]
                        const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueCollection)
                        queriesArrayFromUrl[queryIndex].value = valueToSet
                        valueClone[valueClone.findIndex(data => data.name === lastRow.name)].value = valueToSet
                        valueClone.pop()
                    } else {
                        queriesArrayFromUrl.push({ name: lastRow.name, value: lastRowValues.join(','), type: 'string' })
                        valueClone[valueClone.findIndex(data => data.name === lastRow.name)].value = lastRowValues.join(',')
                    }
                    const newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                    const originalURL = apiURL.split('?')[0]
                    changeapiURL(originalURL + newQueryString)
                } else {
                    const firstIndex = valueClone.findIndex(item => item.name === lastRow.name)
                    if (firstIndex !== valueClone.length - 1) {
                        const valueCollection = [...valueClone[firstIndex].value.split(','), ...lastRowValues]
                        const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueCollection)
                        valueClone[firstIndex].value = valueToSet
                        valueClone.pop()
                    } else {
                        valueClone[valueClone.findIndex(data => data.name === lastRow.name)].value = lastRowValues.join(',')
                    }
                }
            }
            if (allDuplicates().length === 0)
                valueClone.push({
                    name: '', value: "", type: 'string'
                })
            setValue(valueClone)
        }
        else {
            handleToastError({ message: translate("MANDATORY_ALERT"), type: 'error' })
        }
    }

    function handleDeleteRow(currentIndex: number) {
        const valueClone = [...value]
        if (from === 'query') {
            if (apiURL) {
                let newQueryString = ''
                let queriesArrayFromUrl: HeaderAndQueryI[] = retrieveQueryDetailsFromURL(apiURL)
                const result = queriesArrayFromUrl && queriesArrayFromUrl.some(data => data.name === valueClone[currentIndex].name)
                if (result) {
                    queriesArrayFromUrl = queriesArrayFromUrl.filter(data => data.name !== valueClone[currentIndex].name)
                    newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                    const originalURL = apiURL.split('?')[0]
                    changeapiURL(originalURL + newQueryString)
                }
            }
        }
        valueClone.splice(currentIndex, 1)
        setValue(valueClone)
    }

    const handleOnBlurTestValue = (currentIndex: number) => {
        const valueClone = [...value]
        if (from === 'query') {
            let newQueryString = ''
            if (apiURL) {
                let queriesArrayFromUrl: HeaderAndQueryI[] = retrieveQueryDetailsFromURL(apiURL)
                const result = queriesArrayFromUrl && currentIndex !== valueClone.length - 1
                if (result) {
                    const valueArray = valueClone[currentIndex].value.split(',')
                    const valueToSet = constructCommaSeparatedUniqueQueryValuesString(valueArray)
                    queriesArrayFromUrl[queriesArrayFromUrl.findIndex(query => query.name === valueClone[currentIndex].name)].value = valueToSet
                    valueClone[currentIndex].value = valueToSet
                    newQueryString = constructUpdatedQueryString(queriesArrayFromUrl)
                    const originalURL = apiURL.split('?')[0]
                    changeapiURL(originalURL + newQueryString)
                    setValue(valueClone)
                }
            }
        } else {
            valueClone.forEach(value => {
                if (value.name === 'Content-Type' && value.value.trim() !== "") {
                    handleHeaderParamsContentTypeChange(value.value)
                }
            })
        }
    }

    function getAppEnvProperties(): ReactNode {
        const nodes: JSX.Element[] = [];
        if (restImportConfig.appEnvVariables.length > 0)
            restImportConfig.appEnvVariables?.forEach((data) => {
                nodes.push(<MenuItem title={data.name} key={data.name} value={data.name}>{data.name}</MenuItem>);
            });
        else
            nodes.push(<MenuItem key={translate('NO_PROPERTIES_FOUND')} disabled={true}>{translate('NO_PROPERTIES_FOUND')}</MenuItem>);
        return nodes;
    }

    return (
        <TableContainer sx={{ maxHeight: '35vh' }} component={Paper}>
            <Table ref={tableRef as React.RefObject<HTMLTableElement>}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }} data-testid="subheaders">
                        <TableCell style={tableHeaderStyle} align='left'>{translate("NAME")}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate("TYPE")}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate("TEST") + " " + translate("VALUE")}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate("ACTIONS")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ maxHeight: '35vh', overflowY: 'auto' }}>
                    {value.map((data, index) =>
                        <TableRowStyled key={index}>
                            <TableCell style={tableRowStyle} width={"32.5%"} align='left'>
                                {index !== value.length - 1 ? <Typography>{data.name}</Typography> : <Autocomplete
                                    fullWidth={true}
                                    size='small'
                                    disabled={index !== value.length - 1}
                                    inputValue={data.name}
                                    onInputChange={(event, newValue: string) => {
                                        handleChangeName(newValue, index);
                                    }}
                                    freeSolo
                                    options={from === 'query' ? [] : selectNames.map((option) => option.label)}
                                    renderInput={(params) => <TextField
                                        name="wm-webservice-param-name"
                                        {...params}
                                        InputLabelProps={{ children: '' }} />}
                                />}
                            </TableCell>
                            <TableCell style={tableRowStyle} width={"30%"} align='left'>
                                <FormControl size='small' fullWidth={true}>
                                    <Select
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    height: '300px', // Set the maximum height of the dropdown menu
                                                },
                                            },
                                        }} name="wm-webservice-param-type" onChange={(e) => handleChangeType(e, index)} value={data.type} data-testid="param-type">
                                        <ListSubheader sx={{ fontWeight: 700, color: 'black' }}>{translate("UI_TYPES")}</ListSubheader>
                                        {selectTypes.UITypes.map((type) => <MenuItem title={type.label} key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        <ListSubheader sx={{ fontWeight: 700, color: 'black' }}>{translate("SERVER") + " " + translate("SIDE") + ' ' + translate('PROPERTIES')}</ListSubheader>
                                        {selectTypes.ServerSideProperties.map((type) => <MenuItem title={type.label} key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        <ListSubheader sx={{ fontWeight: 700, color: 'black' }}>{translate("APPENVIRONMENT") + translate('PROPERTIES')} </ListSubheader>
                                        {getAppEnvProperties()}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell style={tableRowStyle} width={"32.5%"} align='left'>
                                {data.name !== 'Content-Type' ? <TextField
                                    name="wm-webservice-param-value"
                                    fullWidth={true} data-testid="param-value" size='small'
                                    onBlur={() => handleOnBlurTestValue(index)}
                                    onChange={(e) => handleChangeTestValue(e.target.value, index)}
                                    value={data.value} />
                                    : <Autocomplete
                                        fullWidth={true}
                                        size='small'
                                        inputValue={data.value}
                                        onBlur={() => handleOnBlurTestValue(index)}
                                        onInputChange={(event, newValue: string) => {
                                            handleChangeTestValue(newValue, index)
                                        }}
                                        freeSolo
                                        options={from === 'query' ? [] : defaultContentTypes.map((option) => option.label)}
                                        renderInput={(params) => <TextField
                                            name="wm-webservice-param-value"
                                            {...params}
                                            InputLabelProps={{ children: '' }} />}
                                    />}
                            </TableCell>
                            <TableCell style={tableRowStyle} width={"5%"} align='center'>
                                {index === value.length - 1 ? <AddIcon name="wm-webservice-add-param" onClick={handleAddRow} sx={{ cursor: 'pointer' }} />
                                    : <i className="wms wms-delete" aria-label="wm-webservice-remove-param" onClick={() => handleDeleteRow(index)} style={{ cursor: 'pointer' }}></i>}
                            </TableCell>
                        </TableRowStyled>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export function MultipartTable(
    { value, setValue, handleToastError, headerParams, queryParams, pathParams, setAlertMsg }:
        {
            value: BodyParamsI[], setValue: (data: BodyParamsI[]) => void, handleToastError: (error: INotifyMessage, response?: AxiosResponse) => void,
            headerParams: HeaderAndQueryI[], queryParams: HeaderAndQueryI[], pathParams: PathParamsI[], setAlertMsg: (value: boolean) => void
        }) {
    const tableRef = useRef<HTMLTableElement | null>(null);

    useEffect(() => {
        const updateStickyRow = () => {
            const table = tableRef.current;
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    const rows = tbody.getElementsByTagName('tr');
                    const lastRow = rows[rows.length - 1];
                    const tableRect = table.getBoundingClientRect();
                    const lastRowRect = lastRow.getBoundingClientRect();
                    if (lastRowRect.bottom < tableRect.bottom) {
                        lastRow.style.position = 'sticky';
                        lastRow.style.bottom = '0';
                        lastRow.style.background = rows.length % 2 === 0 ? "#f3f3f3" : 'white'; // Adjust as needed 
                    } else {
                        lastRow.style.position = 'static';
                        lastRow.style.bottom = 'auto';
                        lastRow.style.background = rows.length % 2 === 0 ? 'white' : "#f3f3f3";;
                    }
                }
            }
        };
        // Initial update
        updateStickyRow();
        // Listen for scroll events on the table
        tableRef.current?.addEventListener('scroll', updateStickyRow);
        // Cleanup event listener on component unmount
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            tableRef.current?.removeEventListener('scroll', updateStickyRow);
        };
    }, [value]);
    const { t: translate } = useTranslation();
    const handleChangeName = (name: string, currentIndex: number) => {
        const valueClone = [...value]
        if (name !== null) {
            valueClone.forEach((data: BodyParamsI, index) => {
                if (index === currentIndex) {
                    data.name = name as string
                }
            })
        }
        else {
            valueClone.forEach((data: BodyParamsI, index) => {
                if (index === currentIndex) {
                    data.name = ''
                }
            })
        }
        setValue(valueClone)
    }

    const handleChangeType = (event: SelectChangeEvent, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.forEach((data, index) => {
            if (index === currentIndex) {
                data.type = event.target.value === 'file' ? 'file' : 'string'
                data.value = ''
                data.filename = ''
                data.contentType = event.target.value
            }
        })
        setValue(valueClone)
    }
    const handleChangeTestValue = (currentValue: string, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.forEach((data, index) => {
            if (index === currentIndex) {
                data.value = currentValue
                data.filename = ''
            }
        })
        setValue(valueClone)
    }

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>, currentIndex: number) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const valueClone = [...value];
            valueClone.forEach((data, dataIndex) => {
                if (dataIndex === currentIndex) {
                    data.filename = files[0].name;
                    data.value = files[0];
                    data.contentType = 'file'
                }
            });
            setValue(valueClone);
        }
    }

    function handleAddRow() {
        setAlertMsg(false)
        const lastRow = value[value.length - 1]
        const valueClone = [...value]
        const duplicates = findDuplicateObjectsWithinArray(valueClone, "name")
        const allDuplicates = (): HeaderAndQueryI[] => {
            let returnDuplicates: HeaderAndQueryI[] = []
            returnDuplicates = findDuplicatesByComparison([lastRow], [...headerParams, ...queryParams, ...pathParams], "name")
            return returnDuplicates
        }
        if (lastRow.name !== '' && lastRow.type !== '' && lastRow.value !== '') {
            if (duplicates.length > 0)
                return handleToastError({ message: `parameter "${duplicates[0].name}" already exists`, type: 'error' })
            if (allDuplicates().length > 0)
                return handleToastError({ message: `parameter "${allDuplicates()[0].name}" already exists`, type: 'error' })
            valueClone.push({
                name: '', value: "", type: 'file', filename: '', contentType: 'file'
            })
            setValue(valueClone)
        } else {
            handleToastError({ message: translate("MANDATORY_ALERT"), type: 'error' })
        }
    }

    function handleDeleteRow(currentIndex: number) {
        const valueClone = [...value]
        valueClone.splice(currentIndex, 1)
        setValue(valueClone)
    }

    function openFileSelectionWindow(index: number) {
        document.getElementById('file-selector-' + index)?.click()
    }

    return (
        <TableContainer sx={{ maxHeight: '35vh' }} component={Paper}>
            <Table ref={tableRef as React.RefObject<HTMLTableElement>} data-testid="multipart-table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                        <TableCell style={tableHeaderStyle} align='left'>{translate('NAME')}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate('TYPE')}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate('TEST') + " " + translate('VALUE')}</TableCell>
                        <TableCell style={tableHeaderStyle} align='left'>{translate('ACTIONS')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ maxHeight: '35vh', overflowY: 'auto' }}>
                    {value.map((data, index) =>
                        <TableRowStyled key={index}>
                            <TableCell width={'32.5%'} style={tableRowStyle} align='left'>
                                {index !== value.length - 1 ? <Typography>{data.name}</Typography> : <TextField name="wm-webservice-param-name" fullWidth disabled={index !== value.length - 1} size='small' value={data.name} onChange={(e) => handleChangeName(e.target.value, index)} data-testid="multipart-name" />}
                            </TableCell>
                            <TableCell width={'30%'} style={tableRowStyle}>
                                <FormControl size='small' fullWidth={true}>
                                    <InputLabel>{translate('SELECT') + " " + translate('TYPE')}</InputLabel>
                                    <Select name="wm-webservice-param-type" sx={{ '& .MuiSelect-select ': { textAlign: 'left' } }}
                                        onChange={(e) => handleChangeType(e, index)} value={data.contentType}
                                        label={translate('SELECT') + " " + translate('TYPE')} data-testid="multipart-type">
                                        <MenuItem title={translate("FILE")} value={'file'}>{translate("FILE")}</MenuItem>
                                        <MenuItem title={translate("TEXT")} value={'text'}>{translate("TEXT")}</MenuItem>
                                        <MenuItem title={translate("PLAINTEXT")} value={"text/plain"}>{translate("PLAINTEXT")}</MenuItem>
                                        <MenuItem title={translate("JSON") + " (" + translate("APPLICATION/JSON") + ")"} value={'application/json'}>{translate("JSON") + "  (" + translate("APPLICATION/JSON") + ")"}</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell width={'32.5%'} style={tableRowStyle} align='left'>
                                {data.type === 'file' ? <><TextField
                                    variant="outlined"
                                    size='small'
                                    fullWidth={true}
                                    sx={{
                                        '& .MuiInputBase-input:hover': {
                                            cursor: 'pointer !important',
                                        },
                                    }}
                                    value={data.filename ?? ''}
                                    data-testid="test-value"
                                    onClick={() => openFileSelectionWindow(index)}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <IconButton component="label">
                                                <FileUploadOutlined />
                                            </IconButton>
                                        ),
                                    }}
                                /> <input id={'file-selector-' + index} type="file" style={{ display: "none" }} onChange={(e) => { handleChangeFile(e, index) }} /></> :
                                    <TextField name={"wm-webservice-param-value"} fullWidth size='small' onChange={(e) => handleChangeTestValue(e.target.value, index)} value={data.value} />}
                            </TableCell>
                            <TableCell width={'5%'} style={tableRowStyle} align='center'>
                                {index === value.length - 1 ? <AddIcon name="wm-webservice-add-param" onClick={handleAddRow} sx={{ cursor: 'pointer' }} /> : <i className="wms wms-delete" aria-label="wm-webservice-remove-param" onClick={() => handleDeleteRow(index)} style={{ cursor: 'pointer' }}></i>}
                            </TableCell>
                        </TableRowStyled>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}