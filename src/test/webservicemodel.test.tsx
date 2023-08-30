import { render, screen, within, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event'
import WebServiceModal from '../core/components/WebServiceModal'
import '@testing-library/jest-dom';
import { server } from './mocks/server'
import testData, { mockEmptyProps, endPoints, HTTP_METHODS, REQUEST_TABS, RESPONSE_TABS, TOAST_MESSAGES, GENERAL_PARAM_STRUCTURE, PathParamI, QueryI, AUTH_OPTIONS, HEADER_NAME_OPTIONS, HEADER_TYPE_OPTIONS, CONTENT_TYPE, SUBHEADER_UNDER_TABS, wavemakerMoreInfoLink } from './testdata'
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';
import { ResponseI } from './mocks/handlers';
import { AxiosRequestConfig } from 'axios';

interface ParamStructureInResponseI {
    [key: string]: any
}

type httpMethods = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE"
type authMethods = "None" | "Basic" | "OAuth 2.0"
type tabs = "AUTHORIZATION" | "HEADER PARAMS" | "BODY PARAMS" | "QUERY PARAMS" | "PATH PARAMS"

beforeAll(() => server.listen())

afterEach(() => server.restoreHandlers())

afterAll(() => server.close())


Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe("Web Service Modal", () => {
    it("Renders correctly", () => {
        renderComponent()
        const modalTitle = screen.getByRole('heading', { name: /Web Service/i });
        expect(modalTitle).toBeInTheDocument();
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        expect(httpMethodDropdown).toHaveTextContent('GET')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        expect(urlTextField).toBeInTheDocument()
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        const requestTabs = within(screen.getByTestId('request-config-block')).getAllByRole('tab')
        requestTabs.forEach((tab, index) => {
            expect(tab).toHaveTextContent(new RegExp(REQUEST_TABS[index], 'i'))
        })
        const httpAuthenticationLabel = screen.getByText('HTTP Authentication')
        expect(httpAuthenticationLabel).toBeInTheDocument()
        const responseTabs = within(screen.getByTestId('response-block')).getAllByRole('tab')
        responseTabs.forEach((tab, index) => {
            expect(tab).toHaveTextContent(new RegExp(RESPONSE_TABS[index], 'i'))
        })
    }, 80000);

    it("Able to type in URL field", async () => {
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        expect(urlTextField).toHaveValue(endPoints.getUsers)
    }, 80000)

    it("Authorization tab selected by default", () => {
        renderComponent()
        const authTab = screen.getByRole('tab', { name: /authorization/i })
        expect(authTab).toHaveClass("Mui-selected")
    }, 80000)

    it("Body Params disabled for GET method by default", () => {
        renderComponent()
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeDisabled()
    }, 80000)

    it("Body Params enabled for POST method", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
    }, 80000)

    it("GET request returns the list of users", async () => {
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.data).toEqual(testData.userList)
    }, 80000)

    it("POST request with basic authentication", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postLogin)
        await selectAuthenticationMethodFromDropdown('Basic')
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, testData.user.userName)
        const password = await screen.findByRole('textbox', { name: /password/i })
        await user.type(password, testData.user.password)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response?.requestHeaders?.authorization).toMatch(/basic/i)
    }, 80000)

    it("POST request with Body params", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postCreateAccount)
        await switchTab('BODY PARAMS')
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        const jsonStr = JSON.stringify(testData.user)
        fireEvent.change(bodyTextArea, { target: { value: `${jsonStr}` } })
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.data).toEqual(testData.user)

    }, 80000)

    it("Sending Header Parameters in the Request", async () => {
        const headersArray = testData.headerParams;
        user.setup()
        renderComponent()
        const modalTitle = screen.getByRole('heading', { name: /Web Service/i });
        expect(modalTitle).toBeInTheDocument();
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getVerifyHeader)
        await switchTab('HEADER PARAMS')
        for (let [index, header] of headersArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(header, index)
        }
        await clickTestBtn()
        const matchResponse = constructObjToMatchWithResponseStructure(headersArray, true)
        const response: ResponseI = await getResponse()
        expect(response.requestHeaders).toEqual(matchResponse)
    }, 80000)

    it("Sending Query Parameters in the Request URL", async () => {
        const queryValueTextFields: HTMLElement[] = [];
        const queriesArray = testData.queries;
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray))
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('QUERY PARAMS')
        const queryNames = screen.getAllByRole('combobox');
        const queryValueContainer = screen.getAllByTestId("param-value")
        queryValueContainer.forEach((container) => {
            queryValueTextFields.push(within(container).getByRole("textbox"))
        })
        queriesArray.forEach((query, index) => {
            expect(queryNames[index]).toHaveDisplayValue(query.name)
            expect(queryValueTextFields[index]).toHaveDisplayValue(query.value)
        })
        await clickTestBtn()
        const matchResponse = constructObjToMatchWithResponseStructure(queriesArray, false)
        const response: ResponseI = await getResponse()
        expect(response.queries).toEqual(matchResponse)
    }, 80000)

    it("PUT request with Path params", async () => {
        user.setup()
        const pathParam = "userId"
        renderComponent()
        await selectHttpMethodFromDropdown('PUT')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.putResource}/{${pathParam}}` } })
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('PATH PARAMS')
        const pathParamLabelField = await screen.findByTestId('path-param-label')
        expect(pathParamLabelField).toHaveTextContent(pathParam)
        const pathParamValueField = await within(screen.getByTestId('path-param-value')).findByRole('textbox')
        await user.type(pathParamValueField, testData.user.id.toString())
        await switchTab('BODY PARAMS')
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        fireEvent.change(bodyTextArea, { target: { value: `${JSON.stringify(testData.user)}` } })
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.pathParams.userId).toMatch(testData.user.id.toString())
    }, 80000)

    it("Deleting a resource with Path params", async () => {
        user.setup()
        const pathParam = "userId"
        renderComponent()
        await selectHttpMethodFromDropdown('DELETE')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.deleteResource}/{${pathParam}}` } })
        urlTextField.focus()
        await switchTab('PATH PARAMS')
        const pathParamLabelField = await screen.findByTestId('path-param-label')
        expect(pathParamLabelField).toHaveTextContent(pathParam)
        const pathParamValueField = await within(screen.getByTestId('path-param-value')).findByRole('textbox')
        await user.type(pathParamValueField, testData.user.id.toString())
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.pathParams.userId).toMatch(testData.user.id.toString())
    }, 80000)

    it("Check for Error Msg when clicking 'TEST' without entering URL", async () => {
        user.setup()
        renderComponent()
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(TOAST_MESSAGES.EMPTY_URL)
        expect(errorDisplayed).toBeTruthy()
    }, 80000)

    it("Check for Error Msg when click 'TEST' with an invalid URL", async () => {
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        // fireEvent.change(urlTextField, { target: { value: `${endPoints.deleteResource}/{${pathParam}}` } })
        await user.type(urlTextField, endPoints.invalidURL)
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(TOAST_MESSAGES.EMPTY_URL)
        expect(errorDisplayed).toBeTruthy()
    })

    it("Check for all HTTP methods in the dropdown", async () => {
        user.setup()
        renderComponent()
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const dropdownOptions = await screen.findAllByRole('option')
        expect(dropdownOptions.length).toBe(HTTP_METHODS.length)
        dropdownOptions.forEach((option, index) => {
            expect(option).toHaveTextContent(HTTP_METHODS[index])
        })
    }, 80000)

    it("Check for Basic Auth Username/Password", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postLogin)
        await selectAuthenticationMethodFromDropdown('Basic')
        await clickTestBtn()
        const userNameErrorDisplayed = await isErrorMsgDisplayed(TOAST_MESSAGES.EMPTY_BASIC_AUTH_USERNAME)
        expect(userNameErrorDisplayed).toBeTruthy()
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, testData.user.userName)
        await clickTestBtn()
        const passwordErrorDisplayed = await isErrorMsgDisplayed(TOAST_MESSAGES.EMPTY_BASIC_AUTH_PASSWORD)
        expect(passwordErrorDisplayed).toBeTruthy()
    }, 80000)

    it("Check for delete headers", async () => {
        const headersArray = testData.headerParams;
        const deleteHeaderAtIndex = headersArray.length - 1  //Removes a header from the last index by default
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getVerifyHeader)
        await switchTab('HEADER PARAMS')
        for (let [index, header] of headersArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(header, index)
        }
        await clickTestBtn()
        const headerObj = constructObjToMatchWithResponseStructure(headersArray, true)
        const response: ResponseI = await getResponse()
        expect(response.requestHeaders).toEqual(headerObj)

        const deleteIcons = screen.getAllByTestId('DeleteIcon')
        await user.click(deleteIcons[deleteHeaderAtIndex])
        await clickTestBtn()
        const modifiedHeaderObj = constructObjToMatchWithResponseStructure(headersArray, true, deleteHeaderAtIndex)
        const updatedResponse: ResponseI = await getResponse()
        expect(updatedResponse.requestHeaders).toEqual(modifiedHeaderObj)
    }, 80000)

    it("Adding/Deleting Query Parameters using fields", async () => {
        const queriesArray = testData.queries;
        const deleteQueryAtIndex = queriesArray.length - 1  //Removes a query from the last index by default
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getQueryParams)
        await switchTab('QUERY PARAMS')
        for (let [index, query] of queriesArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(query, index)
        }
        const constructedUrl = constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray)
        expect(urlTextField.getAttribute('value')).toEqual(constructedUrl)
        await clickTestBtn()
        const queriesObj = constructObjToMatchWithResponseStructure(queriesArray, false)
        const response: ResponseI = await getResponse()
        expect(response.queries).toEqual(queriesObj)

        const deleteIcons = screen.getAllByTestId('DeleteIcon')
        await user.click(deleteIcons[deleteQueryAtIndex])
        const reconstructedUrl = constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray, deleteQueryAtIndex)
        const urlFieldAfterQueryDeletion = screen.getByRole('textbox', { name: /url/i })
        expect(urlFieldAfterQueryDeletion.getAttribute('value')).toEqual(reconstructedUrl)
        await clickTestBtn()
        const modifiedQueryObj = constructObjToMatchWithResponseStructure(queriesArray, false, deleteQueryAtIndex)
        const updatedResponse: ResponseI = await getResponse()
        expect(updatedResponse.queries).toEqual(modifiedQueryObj)
    }, 80000)

    it("Check for info message if there aren't any path params", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('PUT')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.putResource}` } })
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('PATH PARAMS')
        expect(screen.queryByTestId('path-param-label')).not.toBeInTheDocument()
        const infoMsg = screen.getByText(/No path param found/i)
        expect(infoMsg).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'More info' })).toHaveAttribute("href", wavemakerMoreInfoLink)
    }, 80000)


    it("Adding and deleting Path params in PUT request", async () => {
        user.setup()
        const pathParamsArray = testData.pathParams;
        const deletePathParamAtIndex = pathParamsArray.length - 1  //Removes a path from the last index by default
        renderComponent()
        await selectHttpMethodFromDropdown('PUT')
        await switchTab('PATH PARAMS')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        const constructedUrl = constructUrlWithPathParams(endPoints.putResource, pathParamsArray)
        fireEvent.change(urlTextField, { target: { value: constructedUrl } })
        urlTextField.focus()
        urlTextField.blur()
        await verifyPathLabelsAndEnterValues([...pathParamsArray])
        await switchTab('BODY PARAMS')
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        fireEvent.change(bodyTextArea, { target: { value: `${JSON.stringify(testData.user)}` } })
        await clickTestBtn()
        const pathParamsObj = constructObjToMatchWithResponseStructure(pathParamsArray, false)
        const response: ResponseI = await getResponse()
        expect(response.pathParams).toEqual(pathParamsObj)

        const reconstructedUrl = constructUrlWithPathParams(endPoints.putResource, pathParamsArray, deletePathParamAtIndex)
        fireEvent.change(urlTextField, { target: { value: reconstructedUrl } })
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('PATH PARAMS')
        await verifyPathLabelsAndEnterValues(pathParamsArray.filter((_, index) => index !== deletePathParamAtIndex))
        await clickTestBtn()
        const modifiedPathParamObj = constructObjToMatchWithResponseStructure(pathParamsArray, false, deletePathParamAtIndex)
        const updatedResponse: ResponseI = await getResponse()
        expect(updatedResponse.pathParams).toEqual(modifiedPathParamObj)
    }, 80000)

    it("Checking the proxy server", async () => {
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        const useProxySwitch = screen.getByTestId('proxy-switch')
        await user.click(within(useProxySwitch).getByRole('checkbox'))
        expect(useProxySwitch).toHaveClass("Mui-checked")
        await clickTestBtn()
        const requestConfig = constructObjToMatchWithProxyConfig(endPoints.getUsers)
        const configFromResponse: AxiosRequestConfig = await getResponse()
        expect(configFromResponse).toEqual(requestConfig.data)
    })


    it("Check for all HTTP authentication dropdown options in the Authorization Tab", async () => {
        user.setup()
        renderComponent()
        const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
        await user.click(httpAuthDropdown);
        const dropdownOptions = await screen.findAllByRole('option')
        expect(dropdownOptions.length).toBe(AUTH_OPTIONS.length)
        dropdownOptions.forEach((option, index) => {
            expect(option).toHaveTextContent(AUTH_OPTIONS[index])
        })
    }, 80000)

    it("Check Header name and type dropdown options in Header Params Tab", async () => {
        user.setup()
        renderComponent()
        await switchTab('HEADER PARAMS')
        const combobox = await screen.findByRole('combobox')
        await user.click(combobox)
        await verifyDropdownOptionsArePresent(HEADER_NAME_OPTIONS)
        const headerTypeField = within(screen.getByTestId('param-type')).getByRole('button')
        await user.click(headerTypeField)
        await verifyDropdownOptionsArePresent(HEADER_TYPE_OPTIONS)
    }, 80000);

    it("Check content type dropdown options in Body Params Tab", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        await switchTab('BODY PARAMS')
        const contentTypeDropdown = within(await screen.findByTestId('select-content-type')).getByRole("button")
        await user.click(contentTypeDropdown)
        await verifyDropdownOptionsArePresent(CONTENT_TYPE)
    }, 80000)

    it("Check query type dropdown options in Query Params Tab", async () => {
        user.setup()
        renderComponent()
        await switchTab('QUERY PARAMS')
        const queryTypeField = within(screen.getByTestId('param-type')).getByRole('button')
        await user.click(queryTypeField)
        await verifyDropdownOptionsArePresent(HEADER_TYPE_OPTIONS)
    })

    it("Checking for required fields under Auth/Header/Body/Query/Path Tabs", async () => {
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        const httpAuthenticationLabel = screen.getByText('HTTP Authentication')
        expect(httpAuthenticationLabel).toBeInTheDocument()
        const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
        expect(httpAuthDropdown).toHaveTextContent('None')
        await switchTab('HEADER PARAMS')
        await verifySubheadersAndTheirFields()
        await switchTab('BODY PARAMS')
        expect(await screen.findByText("Content Type")).toBeInTheDocument()
        expect(within(screen.getByTestId('select-content-type')).getByRole('button')).toBeInTheDocument()
        expect(within(screen.getByRole("tabpanel")).getByTestId('HelpOutlineIcon')).toBeInTheDocument()
        expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Request Body:Provide sample POST data here that the service would consume")).toBeInTheDocument()
        await switchTab('QUERY PARAMS')
        await verifySubheadersAndTheirFields()
    }, 80000)

    it("Adding custom Content type", async () => {
        const customValue = "audio/*,video/*,image/*"
        user.setup()
        renderComponent()
        await selectHttpMethodFromDropdown('POST')
        await switchTab('BODY PARAMS')
        await user.click(await screen.findByTestId('AddIcon'))
        const customTypeField = within(await screen.findByTestId('custom-type-field')).getByRole('textbox')
        await user.type(customTypeField, customValue)
        await user.click(screen.getByTestId('DoneIcon'))
        expect(within(screen.getByTestId('select-content-type')).getByRole('button')).toHaveTextContent(customValue)
    })
})



function renderComponent() {
    render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
}

async function selectHttpMethodFromDropdown(httpMethod: httpMethods) {
    const regexPattern = new RegExp(httpMethod, 'i')
    const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
    await user.click(httpMethodDropdown);
    const option = await screen.findByRole('option', { name: regexPattern })
    expect(option).toBeInTheDocument()
    await user.click(option)
    expect(httpMethodDropdown).toHaveTextContent(httpMethod)
}

async function selectAuthenticationMethodFromDropdown(authMethod: authMethods) {
    const regexPattern = new RegExp(authMethod, 'i')
    const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
    await user.click(httpAuthDropdown);
    const option = await screen.findByRole('option', { name: regexPattern })
    expect(option).toBeInTheDocument()
    await user.click(option)
    expect(httpAuthDropdown).toHaveTextContent(authMethod)
}

async function switchTab(tabName: tabs) {
    const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') })
    expect(tab).toBeEnabled()
    await user.click(tab)
}

async function verifySubheadersAndTheirFields() {
    for (let label of SUBHEADER_UNDER_TABS) {
        const subheader = within(await screen.findByTestId('subheaders')).getByText(new RegExp(label, 'i'))
        expect(subheader).toBeInTheDocument()
    }
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(within(screen.getByTestId('param-type')).getByRole('button')).toBeInTheDocument()
    expect(within(screen.getByTestId('param-value')).getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId("AddIcon")).toBeInTheDocument()
}

async function verifyDropdownOptionsArePresent(arrayToCheck: string[]) {
    const optionElements = within(await screen.findByRole('presentation')).getAllByRole('option')
    const textsFromDropdown = optionElements.map(optionElement => optionElement.textContent?.trim().toLowerCase())
    arrayToCheck.forEach(option => {
        expect(textsFromDropdown).toContainEqual(option.toLowerCase())
    })
}

async function clickTestBtn() {
    const testBtn = screen.getByRole('button', { name: /test/i })
    expect(testBtn).toBeInTheDocument()
    await user.click(testBtn)
}

async function getResponse() {
    const view = await screen.findByTestId('mock-response');
    const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
    return JSON.parse(responseTextField.getAttribute('value')!)
}

function constructObjToMatchWithResponseStructure(testArray: GENERAL_PARAM_STRUCTURE[], toLowerCase: boolean, removeIndex?: number) {
    const matchResponse: ParamStructureInResponseI = {}
    testArray.forEach((param, index) => {
        if (removeIndex !== index)
            toLowerCase ? matchResponse[param.name.toLowerCase()] = param.value : matchResponse[param.name] = param.value
    })
    return matchResponse
}

function constructUrlWithQueryParams(url: string, queryParams: QueryI[], removeIndex?: number) {
    url += '?'
    queryParams.forEach((query, index) => {
        if (removeIndex !== index)
            url += `${query.name}=${query.value}${index !== queryParams.length - 1 && index + 1 !== removeIndex ? '&' : ''}`
    })
    return url
}

function constructUrlWithPathParams(url: string, pathParams: PathParamI[], removeIndex?: number) {
    url += '/'
    pathParams.forEach((path, index) => {
        if (removeIndex !== index)
            url += `{${path.name}}${index !== pathParams.length - 1 && index + 1 !== removeIndex ? '/' : ''}`
    })
    return url
}

function constructObjToMatchWithProxyConfig(endpoint: string, httpMethod: httpMethods = "GET") {
    const configWProxy: AxiosRequestConfig = {
        url: "http://localhost:5000/restimport",
        data: {
            "endpointAddress": endpoint,
            "method": httpMethod,
            "contentType": "application/json",
            "requestBody": "",
            "headers": {},
            "authDetails": null
        },
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    }
    return configWProxy
}

async function addHeadersOrQueryParamsInTheFields(data: GENERAL_PARAM_STRUCTURE, index: number) {
    const paramTypeFields: HTMLElement[] = []
    const paramValueFields: HTMLElement[] = []
    const combobox = await screen.findAllByRole('combobox')
    expect(combobox.length).toBe(index + 1)
    await user.type(combobox[index], data.name)

    const paramTypeContainers = screen.getAllByTestId('param-type')
    paramTypeContainers.forEach(parent => {
        paramTypeFields.push(within(parent).getByRole('button'))
    })
    expect(paramTypeFields.length).toBe(index + 1)
    await user.click(paramTypeFields[index])
    const paramType = await screen.findByRole('option', { name: data.type })
    await user.click(paramType)

    const paramValueContainers = screen.getAllByTestId('param-value')
    paramValueContainers.forEach(parent => {
        paramValueFields.push(within(parent).getByRole('textbox'))
    })
    expect(paramValueFields.length).toBe(index + 1)
    await user.type(paramValueFields[index], data.value)
    const addIcon = screen.getByTestId("AddIcon")
    await user.click(addIcon)
}

async function verifyPathLabelsAndEnterValues(pathParamsArray: PathParamI[]) {
    const pathLabels = await screen.findAllByTestId('path-param-label')
    expect(pathLabels.length).toBe(pathParamsArray.length)
    pathLabels.forEach((label, index) => {
        expect(label).toHaveTextContent(pathParamsArray[index].name)
    })

    const containers = screen.getAllByTestId('path-param-value')
    expect(containers.length).toBe(pathParamsArray.length)
    for (let index = 0; index < containers.length; index++) {
        const pathValueField = within(containers[index]).getByRole('textbox')
        const pathValueFromField = pathValueField.getAttribute("value");

        (pathValueFromField && pathValueFromField === pathParamsArray[index].value) || await user.type(pathValueField, pathParamsArray[index].value)
    }
}

async function isErrorMsgDisplayed(msgToCheck: string) {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    let errorMsgDisplayed = false

    switch (errorMethod) {
        case "default": {
            const errorField = await screen.findByTestId('default-error')
            if (errorField.textContent === msgToCheck) {
                errorMsgDisplayed = true
            }
            break;
        }
        case "toast": {
            const toasts = await screen.findAllByRole('status')
            toasts.forEach((toast) => {
                if (toast.textContent === msgToCheck) {
                    errorMsgDisplayed = true
                    return;
                }
            })
            break;
        }
    }

    return errorMsgDisplayed;
}