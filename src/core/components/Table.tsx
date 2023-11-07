import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Autocomplete, FormControl, IconButton, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ChangeEvent } from 'react';
import { constructCommaSeparatedUniqueQueryValuesString, constructUpdatedQueryString, findDuplicateObjectsWithinArray, findDuplicatesByComparison, getCurrentDateTime, retrieveQueryDetailsFromURL } from './common/common';
import styled from "@emotion/styled";
import { FileUploadOutlined } from '@mui/icons-material';
import { PathParamsI } from './RestImport';
import { useTranslation } from 'react-i18next';

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
}

export const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #fff;
  }
  &:nth-of-type(even) {
    background-color: #f3f3f3;
  } 
`;

export function HeaderAndQueryTable({ value, setValue, from, apiURL, changeapiURL, headerParams, queryParams, pathParams, handleToastError }:
    {
        value: HeaderAndQueryI[], setValue: (data: HeaderAndQueryI[]) => void, from: string,
        apiURL: string, changeapiURL: (value: string) => void, headerParams: HeaderAndQueryI[], queryParams: HeaderAndQueryI[],
        pathParams: PathParamsI[], handleToastError: (msg: string) => void
    }) {
    const { t: translate } = useTranslation();
    const selectTypes =
    {
        UITypes: [
            { value: 'boolean', label: translate('BOOLEAN') },
            { value: 'date', label: translate('DATE') },
            { value: 'date-time', label: translate('DATE') + " " + translate('TIME') },
            { value: 'double', label: translate('DOUBLE') },
            { value: 'float', label: translate('FLOAT') },
            { value: 'int32', label: translate('INTEGER') },
            { value: 'int64', label: translate('LONG') },
            { value: 'string', label: translate('STRING') },
        ],
        ServerSideProperties: [
            { value: 'DATE', label: translate('CURRENT') + " " + translate('DATE') },
            { value: 'DATETIME', label: translate('CURRENT') + " " + translate('DATE') + " " + translate('TIME') },
            { value: 'TIME', label: translate('CURRENT') + " " + translate('TIME') },
            { value: 'TIMESTAMP', label: translate('CURRENT') + " " + translate('TIMESTAMP') },
            { value: 'USER_ID', label: translate('LOGGEDIN') + " " + translate('USERID') },
            { value: 'USER_NAME', label: translate('LOGGEDIN') + " " + translate('USERNAME') },
        ],
        AppEnvironmentProperties: [
            { value: 'option1', label: translate('OPTION') + " " + 1 },
        ],
    }

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

    const ServerSidePropertiesMap = new Map([
        ["currentdate", getCurrentDateTime(false, false)],
        ["currentdatetime", getCurrentDateTime(true, false)],
        ["currenttime", getCurrentDateTime(false, true)],
        ["currenttimestamp", Math.floor(Date.now() / 1000).toString()],
        ["loggedinuserid", ""],
        ["loggedinusername", ""]
    ])

    const handleChangeName = (name: string, currentIndex: number) => {
        const valueClone = [...value]
        if (name !== null) {
            valueClone.map((data: HeaderAndQueryI, index) => {
                if (index === currentIndex) {
                    data.name = name
                }
                return data
            })
        }
        else {
            valueClone.map((data: HeaderAndQueryI, index) => {
                if (index === currentIndex) {
                    data.name = ''
                }
                return data
            })
        }
        setValue(valueClone)
    }

    const handleChangeType = (event: SelectChangeEvent, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.map((data, index) => {
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
            return data
        })
        setValue(valueClone)
    }


    const handleChangeTestValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.map((data, index) => {
            if (index === currentIndex) {
                data.value = event.target.value
            }
            return data
        })
        setValue(valueClone)
    }

    function handleAddRow() {
        const lastRow = value[value.length - 1]
        const valueClone = [...value]
        const duplicates = findDuplicateObjectsWithinArray(valueClone, "name")

        const allDuplicates = (): any[] => {
            let returnDuplicates: any[] = []
            if (from === 'header') {
                returnDuplicates = findDuplicatesByComparison([lastRow], [...queryParams, ...pathParams], "name")
            }
            else {
                returnDuplicates = findDuplicatesByComparison([lastRow], [...headerParams, ...pathParams], "name")
            }
            return returnDuplicates
        }
        if (lastRow.name !== '' && lastRow.type !== '' && lastRow.value !== '') {
            if (from === 'header' && duplicates.length > 0)
                return handleToastError(`parameter "${duplicates[0].name}" already exists`)
            if (allDuplicates().length > 0)
                return handleToastError(`parameter "${allDuplicates()[0].name}" already exists`)
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
            handleToastError(translate("MANDATORY_ALERT"))
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
        }
    }
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }} data-testid="subheaders">
                        <TableCell align='center'>{translate("NAME")}</TableCell>
                        <TableCell align='center'>{translate("TYPE")}</TableCell>
                        <TableCell align='center'>{translate("TEST") + " " + translate("VALUE")}</TableCell>
                        <TableCell align='center'>{translate("ACTIONS")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {value.map((data, index) =>
                        <TableRowStyled key={index}>
                            <TableCell align='center'>
                                <Stack className='cmnflx'>
                                    {from === 'query' ?
                                        <Autocomplete
                                            sx={{ width: 200 }}
                                            size='small'
                                            disabled={index !== value.length - 1}
                                            inputValue={data.name}
                                            onInputChange={(event, newValue: string) => {
                                                handleChangeName(newValue, index);
                                            }}
                                            freeSolo
                                            options={[]}
                                            renderInput={(params) => <TextField  {...params} InputLabelProps={{ children: '' }} />}
                                        /> :
                                        <Autocomplete
                                            sx={{ width: 200 }}
                                            size='small'
                                            disabled={index !== value.length - 1}
                                            inputValue={data.name}
                                            onInputChange={(event, newValue: string) => {
                                                handleChangeName(newValue, index);
                                            }}
                                            freeSolo
                                            options={selectNames.map((option) => option.label)}
                                            renderInput={(params) => <TextField  {...params} InputLabelProps={{ children: '' }} />}
                                        />}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack className='cmnflx'>
                                    <FormControl size='small' sx={{ minWidth: 200 }}>
                                        <InputLabel>{translate("SELECT") + " " + translate("TYPE")}</InputLabel>
                                        <Select onChange={(e) => handleChangeType(e, index)} value={data.type} label={translate("Select Type")} data-testid="param-type">
                                            <ListSubheader>{translate("UI_TYPES")}</ListSubheader>
                                            {selectTypes.UITypes.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                            <ListSubheader>{translate("SERVER_SIDE") + " " + translate("PROPERTIES")}</ListSubheader>
                                            {selectTypes.ServerSideProperties.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                            <ListSubheader>{translate("APPENVIRONMENT") + " " + translate("PROPERTIES")}</ListSubheader>
                                            {selectTypes.AppEnvironmentProperties.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </TableCell>
                            <TableCell align='center'>
                                <TextField data-testid="param-value" size='small' onBlur={() => handleOnBlurTestValue(index)} onChange={(e) => handleChangeTestValue(e, index)} value={data.value} />
                            </TableCell>
                            <TableCell align='center'>
                                {index === value.length - 1 ? <AddIcon onClick={handleAddRow} sx={{ cursor: 'pointer' }} /> : <DeleteIcon onClick={() => handleDeleteRow(index)} sx={{ cursor: 'pointer' }} />}
                            </TableCell>
                        </TableRowStyled>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export function MultipartTable({ value, setValue }: { value: BodyParamsI[], setValue: (data: BodyParamsI[]) => void, }) {

    const handleChangeName = (name: string, currentIndex: number) => {
        const valueClone = [...value]
        if (name !== null) {
            valueClone.map((data: BodyParamsI, index) => {
                if (index === currentIndex) {
                    data.name = name as string
                }
                return data
            })
        }
        else {
            valueClone.map((data: BodyParamsI, index) => {
                if (index === currentIndex) {
                    data.name = ''
                }
                return data
            })
        }
        setValue(valueClone)
    }

    const handleChangeType = (event: SelectChangeEvent, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.map((data, index) => {
            if (index === currentIndex) {
                data.type = event.target.value
                data.value = ''
                data.filename = ''
            }
            return data
        })
        setValue(valueClone)
    }
    const handleChangeTestValue = (currentValue: string, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.map((data, index) => {
            if (index === currentIndex) {
                data.value = currentValue
                data.filename = ''
            }
            return data
        })
        setValue(valueClone)
    }

    const handleChangeFile = (e: File, currentIndex: number) => {
        const valueClone = [...value]
        valueClone.forEach((data, index) => {
            if (index === currentIndex) {
                data.filename = e.name
                data.value = e
            }
        })
        setValue(valueClone)
    }

    function handleAddRow() {
        const lastRow = value[value.length - 1]
        const valueClone = [...value]
        if (lastRow.name !== '' && lastRow.type !== '' && lastRow.value !== '') {
            valueClone.push({
                name: '', value: "", type: 'file', filename: ''
            })
            setValue(valueClone)
        }
    }

    function handleDeleteRow(currentIndex: number) {
        const valueClone = [...value]
        valueClone.splice(currentIndex, 1)
        setValue(valueClone)
    }
    const { t: translate } = useTranslation();

    return (
        <TableContainer component={Paper}>
            <Table data-testid="multipart-table">
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                        <TableCell align='center'>{translate('NAME')}</TableCell>
                        <TableCell align='center'>{translate('TYPE')}</TableCell>
                        <TableCell align='center'>{translate('TEST') + " " + translate('VALUE')}</TableCell>
                        <TableCell align='center'>{translate('ACTIONS')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {value.map((data, index) =>
                        <TableRowStyled key={index}>
                            <TableCell align='center'>
                                <TextField disabled={index !== value.length - 1} size='small' value={data.name} onChange={(e) => handleChangeName(e.target.value, index)} data-testid="multipart-name" />
                            </TableCell>
                            <TableCell>
                                <FormControl size='small' sx={{ minWidth: 200 }}>
                                    <InputLabel>{translate('SELECT') + " " + translate('TYPE')}</InputLabel>
                                    <Select sx={{ '& .MuiSelect-select ': { textAlign: 'left' } }} onChange={(e) => handleChangeType(e, index)} value={data.type} label={translate('SELECT') + " " + translate('TYPE')} data-testid="multipart-type">
                                        <MenuItem value={'file'}>{translate("FILE")}</MenuItem>
                                        <MenuItem value={'text'}>{translate("TEXT")}</MenuItem>
                                        <MenuItem value={'plaintext'}>{translate("Text(Text/Plain)")}</MenuItem>
                                        <MenuItem value={'application/json'}>{translate("application/json")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align='center'>
                                {data.type === 'file' ? <TextField
                                    variant="standard"
                                    type="text"
                                    disabled
                                    value={data.filename}
                                    data-testid="test-value"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton component="label">
                                                <FileUploadOutlined />
                                                <input
                                                    style={{ display: "none" }}
                                                    type="file"
                                                    hidden
                                                    onChange={(e) => {
                                                        //@ts-ignore
                                                        handleChangeFile(e.target.files[0], index)
                                                    }}
                                                    data-testid="file-upload"
                                                />
                                            </IconButton>
                                        ),
                                    }}
                                /> :
                                    <TextField size='small' onChange={(e) => handleChangeTestValue(e.target.value, index)} value={data.value} />}
                            </TableCell>
                            <TableCell align='center'>
                                {index === value.length - 1 ? <AddIcon onClick={handleAddRow} sx={{ cursor: 'pointer' }} /> : <DeleteIcon onClick={() => handleDeleteRow(index)} sx={{ cursor: 'pointer' }} />}
                            </TableCell>
                        </TableRowStyled>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}