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
import React, { ChangeEvent } from 'react';
import { findDuplicateObjects, findDuplicatesAcrossArrays, getCurrentDateTime } from './common/common';
import styled from "@emotion/styled";
import { FileUploadOutlined } from '@mui/icons-material';
import toast from 'react-hot-toast'
import { PathParamsI } from './WebServiceModal';

export interface TableI {
    name: string
    type: string
    value: string
}

export interface BodyParamsI {
    name: string
    type: string
    value: string | File
    filename: string
}

export const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #fff;
  }
  &:nth-of-type(even) {
    background-color: #f3f3f3;
  } 
`;

export function HeaderAndQueryTable({ value, setValue, from, apiURL, changeapiURL, headerParams, queryParams, pathParams }:
    { value: TableI[], setValue: (data: TableI[]) => void, from: string, apiURL: string, changeapiURL: (value: string) => void, headerParams: TableI[], queryParams: TableI[], pathParams: PathParamsI[] }) {
    const selectTypes =
    {
        UITypes: [
            { value: 'boolean', label: 'Boolean' },
            { value: 'date', label: 'Date' },
            { value: 'datetime', label: 'Date Time' },
            { value: 'double', label: 'Double' },
            { value: 'float', label: 'Float' },
            { value: 'interger', label: 'Integer' },
            { value: 'long', label: 'Long' },
            { value: 'string', label: 'String' },
        ],
        ServerSideProperties: [
            { value: 'currentdate', label: 'Current Date' },
            { value: 'currentdatetime', label: 'Current Date Time' },
            { value: 'currenttime', label: 'Current Time' },
            { value: 'currenttimestamp', label: 'Current Timestamp' },
            { value: 'loggedinuserid', label: 'LoggedIn UserID' },
            { value: 'loggedinusername', label: 'LoggedIn Username' },
        ],
        AppEnvironmentProperties: [
            { value: 'option1', label: 'Option 1' },
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
            valueClone.map((data: TableI, index) => {
                if (index === currentIndex) {
                    data.name = name
                }
                return data
            })
        }
        else {
            valueClone.map((data: TableI, index) => {
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
        const query = apiURL?.split('?')[1]
        const queries = query?.split('&')
        let originalURL = apiURL
        if (selectTypes.ServerSideProperties.find(e => e.value === event.target.value)) {
            valueClone.map((data, index) => {
                if (index === currentIndex) {
                    if (queries !== undefined) {
                        const value = queries[index]?.split('=')[1]
                        if (data.value === value)
                            originalURL = originalURL.replace("=" + data.value, "=" + ServerSidePropertiesMap.get(event.target.value) as string)
                    }
                    data.type = event.target.value
                    data.value = ServerSidePropertiesMap.get(event.target.value) as string
                }
                return data
            })
            setValue(valueClone)
            changeapiURL(originalURL)
        }
        else {
            valueClone.map((data, index) => {
                if (index === currentIndex) {
                    data.type = event.target.value
                }
                return data
            })
            setValue(valueClone)
        }
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
        let orginalURL = apiURL
        const lastRow = value[value.length - 1]
        const valueClone = [...value]
        const duplicates = findDuplicateObjects(valueClone, "name")
        const headerParamsClone = [...headerParams]
        const queryParamsClone = [...queryParams]
        const pathParamsClone = [...pathParams]
        const allDuplicates = (): any[] => {
            let returnDuplicates: any[] = []
            if (from === 'header') {
                returnDuplicates = findDuplicatesAcrossArrays([valueClone, queryParamsClone.slice(0, queryParamsClone.length - 1), pathParamsClone], "name")
            }
            else {
                returnDuplicates = findDuplicatesAcrossArrays([headerParamsClone.slice(0, headerParamsClone.length - 1), valueClone, pathParamsClone], "name")
            }
            return returnDuplicates
        }
        if (lastRow.name !== '' && lastRow.type !== '' && lastRow.value !== '') {
            if (duplicates.length > 0)
                return toast.error(`parameter "${duplicates[0].name}" already exists`, {
                    position: 'top-right'
                })
            if (allDuplicates().length > 0)
                return toast.error(`parameter "${allDuplicates()[0].name}" already exists`, {
                    position: 'top-right'
                })
            if (from === 'query' && duplicates.length === 0 && allDuplicates().length === 0) {
                valueClone.forEach((data, index) => {
                    let addData = data.name + "=" + data.value
                    if (index === 0) {
                        if (!orginalURL.includes("?" + addData) && !orginalURL.includes("&" + addData))
                            orginalURL += "?" + data.name + "=" + data.value
                    }
                    else {
                        if (!orginalURL.includes(addData))
                            orginalURL += "&" + data.name + "=" + data.value
                    }
                })
                changeapiURL(orginalURL)
            }
            if (duplicates.length === 0 && allDuplicates().length === 0)
                valueClone.push({
                    name: '', value: "", type: ''
                })
            setValue(valueClone)
        }
        else {
            toast.error(`Please fill the mandatory fields`, {
                position: 'top-right'
            })
        }
    }

    function handleDeleteRow(currentIndex: number) {
        const valueClone = [...value]
        if (from === 'query') {
            const originalURL = apiURL
            let changedURL = ''
            const removedValue = valueClone[currentIndex]
            if (currentIndex === 0) {
                if (valueClone.length - 1 > 1)
                    changedURL = originalURL.replace(`${removedValue.name}=${removedValue.value}&`, '')
                else
                    changedURL = originalURL.replace(`?${removedValue.name}=${removedValue.value}`, '')
            }
            else
                changedURL = originalURL.replace(`&${removedValue.name}=${removedValue.value}`, '')
            changeapiURL(changedURL)
        }
        valueClone.splice(currentIndex, 1)
        setValue(valueClone)
    }

    const handleOnBlurTestValue = () => {
        if (from === 'query') {
            let createQueryString = ''
            const valueClone = [...value]
            valueClone.forEach((data, index) => {
                if (index === 0)
                    createQueryString = `?${data.name}=${data.value}`
                else if (index !== valueClone.length - 1)
                    createQueryString += `&${data.name}=${data.value}`
            })
            const originalURL = apiURL.split('?')[0]
            changeapiURL(originalURL + createQueryString)
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                        <TableCell align='center'>Name</TableCell>
                        <TableCell align='center'>Type</TableCell>
                        <TableCell align='center'>Test Value</TableCell>
                        <TableCell align='center'>Actions</TableCell>
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
                                            renderInput={(params) => <TextField  {...params} />}
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
                                            renderInput={(params) => <TextField  {...params} />}
                                        />}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack className='cmnflx'>
                                    <FormControl size='small' sx={{ minWidth: 200 }}>
                                        <InputLabel>Select Type</InputLabel>
                                        <Select onChange={(e) => handleChangeType(e, index)} value={data.type} label="Select Type">
                                            <ListSubheader>UI Types</ListSubheader>
                                            {selectTypes.UITypes.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                            <ListSubheader>Server Side Properties</ListSubheader>
                                            {selectTypes.ServerSideProperties.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                            <ListSubheader>AppEnvironment Properties</ListSubheader>
                                            {selectTypes.AppEnvironmentProperties.map((type) => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </TableCell>
                            <TableCell align='center'>
                                <TextField size='small' onBlur={() => handleOnBlurTestValue()} onChange={(e) => handleChangeTestValue(e, index)} value={data.value} />
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

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#d4e6f1' }}>
                        <TableCell align='center'>Name</TableCell>
                        <TableCell align='center'>Type</TableCell>
                        <TableCell align='center'>Test Value</TableCell>
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {value.map((data, index) =>
                        <TableRowStyled key={index}>
                            <TableCell align='center'>
                                <TextField disabled={index !== value.length - 1} size='small' value={data.name} onChange={(e) => handleChangeName(e.target.value, index)} />
                            </TableCell>
                            <TableCell align='center'>
                                <FormControl size='small' sx={{ minWidth: 200 }}>
                                    <InputLabel>Select Type</InputLabel>
                                    <Select onChange={(e) => handleChangeType(e, index)} value={data.type} label="Select Type">
                                        <MenuItem value={'file'}>File</MenuItem>
                                        <MenuItem value={'text'}>Text</MenuItem>
                                        <MenuItem value={'plaintext'}>Text(Text/Plain)</MenuItem>
                                        <MenuItem value={'application/json'}>application/json</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align='center'>
                                {data.type === 'file' ? <TextField
                                    variant="standard"
                                    type="text"
                                    disabled
                                    value={data.filename}
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