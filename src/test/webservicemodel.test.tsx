import { render, screen, within, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event'
import WebServiceModal from '../core/components/WebServiceModal'
import '@testing-library/jest-dom';
import { server } from './mocks/server'
import testData, { mockEmptyProps, endPoints, HTTP_METHODS, TOAST_MESSAGES, GENERAL_PARAM_STRUCTURE, PathParamI, Query } from './testdata'
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';
import { ResponseI } from './mocks/handlers';

interface ParamStructureInResponseI {
    [key: string]: any
}

type httpMethods = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE"

type authMethods = "Basic" | "OAuth 2.0"

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
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
        await user.click(bodyParams)
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        const jsonStr = JSON.stringify(testData.user)
        fireEvent.change(bodyTextArea, { target: { value: `${jsonStr}` } })
        await clickTestBtn()
        const view = await screen.findByTestId('mock-response',);
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        expect(JSON.parse(responseTextField.getAttribute('value')!).data).toEqual(testData.user)
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
        const headerParams = screen.getByRole('tab', { name: /header params/i })
        await user.click(headerParams)
        for (let [index, header] of headersArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(header, index)
        }
        await clickTestBtn()
        const matchResponse = constructObjToMatchWithResponseStructure(headersArray, true)
        const response: ResponseI = await getResponse()
        expect(response.requestHeaders).toEqual(matchResponse)
    }, 80000)

    it("Sending Query Parameters in the Request", async () => {
        const queryValueTextFields: HTMLElement[] = [];
        const queriesArray = testData.queries;
        user.setup()
        renderComponent()
        const queryParams = screen.getByRole('tab', { name: /query params/i })
        expect(queryParams).toBeInTheDocument()
        await user.click(queryParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray))
        urlTextField.focus()
        urlTextField.blur()
        await user.click(queryParams)
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
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        await user.click(pathParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.putResource}/{${pathParam}}` } })
        urlTextField.focus()
        urlTextField.blur()
        const pathParamLabelField = await screen.findByTestId('path-param-label')
        expect(pathParamLabelField).toHaveTextContent(pathParam)
        const pathParamValueField = await within(screen.getByTestId('path-param-value')).findByRole('textbox')
        fireEvent.change(pathParamValueField, { target: { value: testData.user.id } })
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
        await user.click(bodyParams)
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
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        await user.click(pathParams)
        const pathParamLabelField = await screen.findByTestId('path-param-label')
        expect(pathParamLabelField).toHaveTextContent(pathParam)
        const pathParamValueField = await within(screen.getByTestId('path-param-value')).findByRole('textbox')
        fireEvent.change(pathParamValueField, { target: { value: testData.user.id } })
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.pathParams.userId).toMatch(testData.user.id.toString())
    }, 80000)

    it("Check for Toast when clicking 'TEST' without a URL", async () => {
        user.setup()
        renderComponent()
        await clickTestBtn()
        const toastDisplayed = await isToastDisplayedWithMsg(TOAST_MESSAGES.EMPTY_URL)
        expect(toastDisplayed).toBeTruthy()
    }, 80000)

    it("Check for all HTTP methods in the dropdown", async () => {
        user.setup()
        renderComponent()
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const dropdownOptions = await screen.findAllByRole('option')
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
        const userNameToastDisplayed = await isToastDisplayedWithMsg(TOAST_MESSAGES.EMPTY_BASIC_AUTH_USERNAME)
        expect(userNameToastDisplayed).toBeTruthy()
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, testData.user.userName)
        await clickTestBtn()
        const passwordToastDisplayed = await isToastDisplayedWithMsg(TOAST_MESSAGES.EMPTY_BASIC_AUTH_PASSWORD)
        expect(passwordToastDisplayed).toBeTruthy()
    }, 80000)

    it("Check for delete headers", async () => {
        const headersArray = testData.headerParams;
        const deleteHeaderAtIndex = headersArray.length - 1  //Removes a header from the last index by default
        user.setup()
        renderComponent()
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getVerifyHeader)
        const headerParams = screen.getByRole('tab', { name: /header params/i })
        await user.click(headerParams)
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
        const queryParams = screen.getByRole('tab', { name: /query params/i })
        expect(queryParams).toBeInTheDocument()
        await user.click(queryParams)
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
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        await user.click(pathParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.putResource}` } })
        urlTextField.focus()
        urlTextField.blur()
        expect(screen.queryByTestId('path-param-label')).not.toBeInTheDocument()
        const infoMsg = screen.getByText(/No path param found/i)
        expect(infoMsg).toBeInTheDocument()
    }, 80000)


    it("PUT with Path params", async () => {
        user.setup()
        const pathParamsArray = testData.pathParams;
        const deletePathParamAtIndex = pathParamsArray.length - 1  //Removes a path from the last index by default
        renderComponent()
        await selectHttpMethodFromDropdown('PUT')
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        await user.click(pathParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        const constructedUrl = constructUrlWithPathParams(endPoints.putResource, pathParamsArray)
        fireEvent.change(urlTextField, { target: { value: constructedUrl } })
        urlTextField.focus()
        urlTextField.blur()
        await verifyPathLabelsAndEnterValues([...pathParamsArray])
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
        await user.click(bodyParams)
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
        await user.click(pathParams)
        await verifyPathLabelsAndEnterValues(pathParamsArray.filter((_, index) => index !== deletePathParamAtIndex))
        await clickTestBtn()
        const modifiedPathParamObj = constructObjToMatchWithResponseStructure(pathParamsArray, false, deletePathParamAtIndex)
        const updatedResponse: ResponseI = await getResponse()
        expect(updatedResponse.pathParams).toEqual(modifiedPathParamObj)
    }, 80000)
});


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

async function clickTestBtn() {
    const testBtn = screen.getByRole('button', { name: /test/i })
    expect(testBtn).toBeInTheDocument()
    await user.click(testBtn)
}

async function getResponse(): Promise<ResponseI> {
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

function constructUrlWithQueryParams(url: string, queryParams: Query[], removeIndex?: number) {
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

async function isToastDisplayedWithMsg(msgToCheck: string) {
    let toastDisplayed = false
    const toasts = await screen.findAllByRole('status')
    toasts.forEach((toast) => {
        if (toast.textContent === msgToCheck) {
            toastDisplayed = true
            return
        }
    })
    return toastDisplayed;
}