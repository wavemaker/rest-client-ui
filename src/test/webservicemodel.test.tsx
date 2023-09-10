/* eslint-disable jest/no-conditional-expect */
import { render, screen, within, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event'
import WebServiceModal from '../core/components/WebServiceModal'
import '@testing-library/jest-dom';
import { server } from './mocks/server'
import testData, { mockEmptyProps, endPoints, HTTP_METHODS, REQUEST_TABS, RESPONSE_TABS, ERROR_MESSAGES, GENERAL_PARAM_STRUCTURE, PathParamI, QueryI, AUTH_OPTIONS, HEADER_NAME_OPTIONS, HEADER_TYPE_OPTIONS, CONTENT_TYPE, SUBHEADER_UNDER_TABS, wavemakerMoreInfoLink, mockPropsI, preLoadedProps, getCustomizedError, responseHeaders, HeaderParamI } from './testdata'
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';
import { ResponseI } from './mocks/handlers';
import { AxiosRequestConfig } from 'axios';
import { httpStatusCodes } from '../core/components/common/common';

type httpMethods = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE"
type authMethods = "None" | "Basic" | "OAuth 2.0"
type contentTypes = "multipart/form-data"
type multipartFileTypes = "File" | "Text" | "Text(Text/Plain)" | "application/json"
type options = httpMethods | authMethods | contentTypes | multipartFileTypes
type dropdownIDs = "http-auth" | "http-method" | "select-content-type" | "multipart-type" | "param-type"
type tabs = "AUTHORIZATION" | "HEADER PARAMS" | "BODY PARAMS" | "QUERY PARAMS" | "PATH PARAMS" | "RESPONSE BODY" | "RESPONSE HEADER" | "RESPONSE STATUS"

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
        renderComponent(mockEmptyProps)
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

    it("Able to type in the URL field", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        expect(urlTextField).toHaveValue(endPoints.getUsers)
    }, 80000)

    it("Authorization tab selected by default", () => {
        renderComponent(mockEmptyProps)
        const authTab = screen.getByRole('tab', { name: /authorization/i })
        expect(authTab).toHaveClass("Mui-selected")
    }, 80000)

    it("Body Params tab disabled for GET method by default", () => {
        renderComponent(mockEmptyProps)
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeDisabled()
    }, 80000)

    it("Body Params tab enabled for POST method", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
    }, 80000)

    it("Returns a successful response [GET]", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.data).toEqual(testData.userList)
    }, 80000)

    it("Basic authentication works properly [POST]", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postLogin)
        await selectOptionFromDropdown('http-auth', 'Basic')
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, testData.user.userName)
        const password = await screen.findByRole('textbox', { name: /password/i })
        await user.type(password, testData.user.password)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response?.requestHeaders?.authorization).toMatch(/basic/i)
    }, 80000)

    it("Sends data to the server successfully [POST]", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
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

    it("Sends Header Parameters to the server successfully [GET]", async () => {
        const headersArray = testData.headerParams;
        user.setup()
        renderComponent(mockEmptyProps)
        const modalTitle = screen.getByRole('heading', { name: /Web Service/i });
        expect(modalTitle).toBeInTheDocument();
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getVerifyHeader)
        await switchTab('HEADER PARAMS')
        for (let [index, header] of headersArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(header, index)
        }
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        validateResponseWithTestData(response.requestHeaders, headersArray, true)
    }, 80000)

    it("Sends Query Parameters in the Request URL [GET]", async () => {
        const queriesArray = testData.queries;
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray))
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('QUERY PARAMS')
        await checkIfQueryParamsAreReflectedInFieldsFromURL(queriesArray)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        validateResponseWithTestData(response.queries, queriesArray)
    }, 80000)

    it("Sends Path Parameters in the Request URL [PUT]", async () => {
        user.setup()
        const pathParam = "userId"
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'PUT')
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

    it("Deletes a resource with a Path param [DELETE]", async () => {
        user.setup()
        const pathParam = "userId"
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'DELETE')
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

    it("Error Msg displayed when clicking 'TEST' btn without entering URL [Default Error]", async () => {
        const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
        user.setup()
        renderComponent(mockEmptyProps)
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_URL)
        expect(errorDisplayed).toBeTruthy()
    }, 80000)

    it("Error Msg displayed when clicking 'TEST' btn with an invalid URL", async () => {
        const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.invalidURL)
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_URL)
        expect(errorDisplayed).toBeTruthy()
    })

    it("Check if all HTTP methods present in the dropdown", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const dropdownOptions = await screen.findAllByRole('option')
        expect(dropdownOptions.length).toBe(HTTP_METHODS.length)
        dropdownOptions.forEach((option, index) => {
            expect(option).toHaveTextContent(HTTP_METHODS[index])
        })
    }, 80000)

    it("Check validation for Basic Auth Username/Password", async () => {
        const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postLogin)
        await selectOptionFromDropdown('http-auth', 'Basic')
        await clickTestBtn()
        const userNameErrorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_BASIC_AUTH_USERNAME)
        expect(userNameErrorDisplayed).toBeTruthy()
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, testData.user.userName)
        await clickTestBtn()
        const passwordErrorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_BASIC_AUTH_PASSWORD)
        expect(passwordErrorDisplayed).toBeTruthy()
    }, 80000)

    it("Check for delete headers", async () => {
        const headersArray = testData.headerParams;
        const deleteHeaderAtIndex = headersArray.length - 1  //Removes a header from the last index by default
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getVerifyHeader)
        await switchTab('HEADER PARAMS')
        for (let [index, header] of headersArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(header, index)
        }
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        validateResponseWithTestData(response.requestHeaders, headersArray, true)
        const deleteIcons = screen.getAllByTestId('DeleteIcon')
        await user.click(deleteIcons[deleteHeaderAtIndex])
        await clickTestBtn()
        const updatedResponse: ResponseI = await getResponse()
        validateResponseWithTestData(updatedResponse.requestHeaders, headersArray, true, deleteHeaderAtIndex)
    }, 100000)

    it("Adding/Deleting Query Parameters using fields", async () => {
        const queriesArray = testData.queries;
        const deleteQueryAtIndex = queriesArray.length - 1  //Removes a query from the last index by default
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getQueryParams)
        await switchTab('QUERY PARAMS')
        for (let [index, query] of queriesArray.entries()) {
            await addHeadersOrQueryParamsInTheFields(query, index)
        }
        const constructedUrl = constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray)
        expect(urlTextField.getAttribute('value')).toEqual(constructedUrl)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        validateResponseWithTestData(response.queries, queriesArray)
        const deleteIcons = screen.getAllByTestId('DeleteIcon')
        await user.click(deleteIcons[deleteQueryAtIndex])
        const reconstructedUrl = constructUrlWithQueryParams(endPoints.getQueryParams, queriesArray, deleteQueryAtIndex)
        const urlFieldAfterQueryDeletion = screen.getByRole('textbox', { name: /url/i })
        expect(urlFieldAfterQueryDeletion.getAttribute('value')).toEqual(reconstructedUrl)
        await clickTestBtn()
        const updatedResponse: ResponseI = await getResponse()
        validateResponseWithTestData(updatedResponse.queries, queriesArray, false, deleteQueryAtIndex)
    }, 80000)

    it("Info message displayed if there aren't any path params", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'PUT')
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


    it("Adding and deleting Path params in the URL [PUT]", async () => {
        user.setup()
        const pathParamsArray = testData.pathParams;
        const deletePathParamAtIndex = pathParamsArray.length - 1  //Removes a path from the last index by default
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'PUT')
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
        const response: ResponseI = await getResponse()
        validateResponseWithTestData(response.pathParams, pathParamsArray)
        const reconstructedUrl = constructUrlWithPathParams(endPoints.putResource, pathParamsArray, deletePathParamAtIndex)
        fireEvent.change(urlTextField, { target: { value: reconstructedUrl } })
        urlTextField.focus()
        urlTextField.blur()
        await switchTab('PATH PARAMS')
        await verifyPathLabelsAndEnterValues(pathParamsArray.filter((_, index) => index !== deletePathParamAtIndex))
        await clickTestBtn()
        const updatedResponse: ResponseI = await getResponse()
        validateResponseWithTestData(updatedResponse.pathParams, pathParamsArray, false, deletePathParamAtIndex)
    }, 80000)

    it("Request reaches the proxy server and displays the result", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        const useProxySwitch = screen.getByTestId('proxy-switch')
        await user.click(within(useProxySwitch).getByRole('checkbox'))
        expect(useProxySwitch).toHaveClass("Mui-checked")
        await clickTestBtn()
        const requestConfig = constructObjToMatchWithProxyConfig(endPoints.getUsers)
        const configFromResponse = await getResponse()
        expect(configFromResponse).toEqual(requestConfig.data)
    }, 80000)

    it("Checking error response from the proxy server", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, "http://wavemaker.com/proxyerror")
        const useProxySwitch = screen.getByTestId('proxy-switch')
        await user.click(within(useProxySwitch).getByRole('checkbox'))
        expect(useProxySwitch).toHaveClass("Mui-checked")
        await clickTestBtn()
        const configFromResponse = await getResponse()
        expect(configFromResponse).toEqual(httpStatusCodes.get(400))
    }, 80000)


    it("All HTTP authentication dropdown options are present in the Authorization Tab", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
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
        renderComponent(mockEmptyProps)
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
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        await switchTab('BODY PARAMS')
        const contentTypeDropdown = within(await screen.findByTestId('select-content-type')).getByRole("button")
        await user.click(contentTypeDropdown)
        await verifyDropdownOptionsArePresent(CONTENT_TYPE)
    }, 80000)

    it("Check query type dropdown options in Query Params Tab", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await switchTab('QUERY PARAMS')
        const queryTypeField = within(screen.getByTestId('param-type')).getByRole('button')
        await user.click(queryTypeField)
        await verifyDropdownOptionsArePresent(HEADER_TYPE_OPTIONS)
    })

    it("Checking for required fields under Auth/Header/Body/Query/Path Tabs", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        const httpAuthenticationLabel = screen.getByText('HTTP Authentication')
        expect(httpAuthenticationLabel).toBeInTheDocument()
        const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
        expect(httpAuthDropdown).toHaveTextContent('None')
        await switchTab('HEADER PARAMS')
        await verifySubheadersAndTheirFieldsUnderHeaderandQueryTabs()
        await switchTab('BODY PARAMS')
        expect(await screen.findByText("Content Type")).toBeInTheDocument()
        expect(within(screen.getByTestId('select-content-type')).getByRole('button')).toBeInTheDocument()
        expect(within(screen.getByRole("tabpanel")).getByTestId('HelpOutlineIcon')).toBeInTheDocument()
        expect(screen.getByTestId('AddIcon')).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Request Body:Provide sample POST data here that the service would consume")).toBeInTheDocument()
        await switchTab('QUERY PARAMS')
        await verifySubheadersAndTheirFieldsUnderHeaderandQueryTabs()
    }, 80000)

    it("Adding custom Content type in Body params tab", async () => {
        const customValue = "audio/*,video/*,image/*"
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        await switchTab('BODY PARAMS')
        await user.click(await screen.findByTestId('AddIcon'))
        const customTypeField = within(await screen.findByTestId('custom-type-field')).getByRole('textbox')
        await user.type(customTypeField, customValue)
        await user.click(screen.getByTestId('DoneIcon'))
        expect(customTypeField).not.toBeInTheDocument()
        expect(within(screen.getByTestId('select-content-type')).getByRole('button')).toHaveTextContent(customValue)
    }, 80000)

    it("Component is rendering with the given data", async () => {
        const config = preLoadedProps.restImportConfig
        const headerParams = config?.headerParams
        const queryParams = retrieveQueryParamsFromURL(config.url!)
        const pathParams = retrievePathParamsFromURL(config.url!, '{', '}')
        user.setup()
        renderComponent(preLoadedProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        expect(urlTextField.getAttribute('value')).toBe(config.url)
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        expect(httpMethodDropdown).toHaveTextContent(new RegExp(config.httpMethod!, 'i'))
        const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
        expect(httpAuthDropdown).toHaveTextContent(new RegExp(config.httpAuth!, 'i'))
        await switchTab('HEADER PARAMS')
        const headerNameFields = await screen.findAllByRole('combobox')
        const paramTypeDropdowns = await screen.findAllByTestId('param-type')
        const paramValueFields = await screen.findAllByTestId('param-value')
        headerParams?.forEach((header, index) => {
            expect(headerNameFields[index]).toHaveDisplayValue(header.name)
            expect(within(paramTypeDropdowns[index]).getByRole('button')).toHaveTextContent(new RegExp(header.type, 'i'))
            expect(within(paramValueFields[index]).getByRole('textbox')).toHaveDisplayValue(header.value)
        })
        await switchTab('BODY PARAMS')
        expect(within(screen.getByTestId('select-content-type')).getByRole('button')).toHaveTextContent(config.contentType!)
        // Add code to test multipart data
        await switchTab('QUERY PARAMS')
        await checkIfQueryParamsAreReflectedInFieldsFromURL(queryParams)
        await switchTab('PATH PARAMS')
        const pathLabels = await screen.findAllByTestId('path-param-label')
        expect(pathLabels.length).toBe(pathParams.length)
        pathLabels.forEach((label, index) => {
            expect(label).toHaveTextContent(pathParams[index])
        })
    }, 80000)

    it("Error Msg displayed when clicking 'TEST' without entering URL[Toast Error]", async () => {
        const props = getCustomizedError('toast')
        const errorMethod = props.restImportConfig.error.errorMethod
        user.setup()
        renderComponent(props)
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_URL)
        expect(errorDisplayed).toBeTruthy()
    }, 80000)

    it("Error Msg displayed when clicking 'TEST' without entering URL [Custom Function Error]", async () => {
        const customFunction = jest.fn((msg) => console.log(msg))
        const props = getCustomizedError('customFunction', customFunction)
        user.setup()
        renderComponent(props)
        await clickTestBtn()
        expect(customFunction).toHaveBeenCalledWith(ERROR_MESSAGES.EMPTY_URL)
    }, 80000)

    it("TEST button disabled right after selecting OAuth 2.0 authentication method", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-auth', 'OAuth 2.0')
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toHaveClass('Mui-disabled')
    }, 80000)

    it("Error displayed on clicking TEST button without entering path param value", async () => {
        const errorMethod = preLoadedProps.restImportConfig.error.errorMethod
        user.setup()
        renderComponent(preLoadedProps)
        await clickTestBtn()
        const errorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_PATH_PARAM_VALUE)
        expect(errorDisplayed).toBeTruthy()
    }, 80000)

    it("URL field accepts duplicate query params without any error", async () => {
        const duplicateQueryStr = "?id=2&id=5"
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getQueryParams + duplicateQueryStr)
        await clickTestBtn()
        expect(urlTextField).toHaveValue(endPoints.getQueryParams + duplicateQueryStr)
        const errorField = screen.queryByTestId('default-error')
        expect(errorField).toBeFalsy()
    }, 80000)

    it("Adding empty custom content type under Body Params Tab hides the field and doesn't affect the defaults", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        await switchTab('BODY PARAMS')
        const contentTypesDropdown = within(screen.getByTestId('select-content-type')).getByRole('button')
        const defaultValue = contentTypesDropdown.textContent
        await user.click(await screen.findByTestId('AddIcon'))
        await user.click(screen.getByTestId('DoneIcon'))
        expect(contentTypesDropdown).toHaveTextContent(defaultValue!)

    }, 80000)

    it("Switched between response tabs and verified their content", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        await clickTestBtn()
        const response: ResponseI = await getResponse()
        expect(response.data).toEqual(testData.userList)
        await switchTab('RESPONSE HEADER')
        const header = await getResponse()
        for (let [key, value] of Object.entries(responseHeaders)) {
            expect(header).toHaveProperty(key, value)
        }
        await switchTab('RESPONSE STATUS')
        const status = await getResponse()
        expect(status.statusCode).toEqual("200 " + httpStatusCodes.get(200))
    }, 80000)

    it("Handling the error response from the server", async () => {
        user.setup()
        renderComponent(mockEmptyProps)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.badRequest)
        await clickTestBtn()
        await switchTab('RESPONSE STATUS')
        const response = await getResponse()
        expect(response.statusCode).toEqual("400 " + httpStatusCodes.get(400))
    }, 80000)

    it("Adding multipart data(file upload)", async () => {
        const filename = 'multipart.txt'
        const text = 'This is a multipart file content'
        const blobData = new Blob([text], { type: 'text/plain' });
        const file = new File([blobData], filename, { type: 'text/plain' });
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postMultipartData)
        await switchTab('BODY PARAMS')
        await selectOptionFromDropdown('select-content-type', 'multipart/form-data')
        const multipartName = within(screen.getByTestId('multipart-name')).getByRole('textbox')
        await user.type(multipartName, "Test-file")
        await selectOptionFromDropdown('multipart-type', 'File')
        const fileInput = screen.getByTestId('file-upload')
        await user.upload(fileInput, file)
        const fileNameContainer = await screen.findByTestId('test-value')
        const fileNameField = within(fileNameContainer).getAllByRole('textbox')[0]
        expect(fileNameField).toHaveValue(filename)
        await user.click(within(screen.getByTestId('multipart-table')).getByTestId('AddIcon'))
        await clickTestBtn()
        await switchTab('RESPONSE STATUS')
        const response = await getResponse()
        expect(response.statusCode).toEqual("200 " + httpStatusCodes.get(200))
    }, 80000)

    it("Adding already available content type as custom content type doesn't create duplicate entry in the dropdown", async () => {
        const contentTypeSet = new Set()
        const alreadyAvailableContentType = "text/plain"
        let hasDuplicates = false
        user.setup()
        renderComponent(mockEmptyProps)
        await selectOptionFromDropdown('http-method', 'POST')
        await switchTab('BODY PARAMS')
        await user.click(await screen.findByTestId('AddIcon'))
        const customTypeField = within(await screen.findByTestId('custom-type-field')).getByRole('textbox')
        await user.type(customTypeField, alreadyAvailableContentType)
        await user.click(screen.getByTestId('DoneIcon'))
        const contentTypeDropdown = within(screen.getByTestId('select-content-type')).getByRole('button')
        expect(contentTypeDropdown).toHaveTextContent(alreadyAvailableContentType)
        await user.click(contentTypeDropdown)
        const options = await screen.findAllByRole('option')
        options.forEach((option) => {
            const contentType = option.textContent;
            if (contentTypeSet.has(contentType)) {
                hasDuplicates = true
                return
            }
            contentTypeSet.add(contentType)
        })
        expect(hasDuplicates).toBeFalsy()
    })

    it("Error Msg displayed when adding duplicate(already present in other parameters) path params on blur of the URL field", async () => {
        const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
        const url = endPoints.getUsers
        const header: HeaderParamI = {
            name: "Accept", type: "String", value: "application/json;q=0.8"
        }
        user.setup()
        renderComponent(mockEmptyProps)
        await switchTab('HEADER PARAMS')
        await addHeadersOrQueryParamsInTheFields(header, 0)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        const urlWithPathParam = `${url}/{${header.name}}`
        fireEvent.change(urlTextField, { target: { value: urlWithPathParam } })
        urlTextField.focus()
        urlTextField.blur()
        const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `Parameters cannot have duplicates, removed the duplicates[${header.name}]`)
        expect(errorDisplayed).toBeTruthy()
    }, 80000)
})

function renderComponent(mockProps: mockPropsI) {
    render(<Provider store={appStore}><WebServiceModal {...mockProps} /></Provider >);
}

async function selectOptionFromDropdown(dropdownElementId: dropdownIDs, selectOption: options) {
    const regexPattern = new RegExp(selectOption, 'i')
    const dropdown = within(screen.getByTestId(dropdownElementId)).getByRole("button")
    await user.click(dropdown);
    const option = await screen.findByRole('option', { name: regexPattern })
    expect(option).toBeInTheDocument()
    await user.click(option)
    expect(dropdown).toHaveTextContent(selectOption)
}

async function switchTab(tabName: tabs) {
    const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') })
    expect(tab).toBeEnabled()
    await user.click(tab)
}

async function verifySubheadersAndTheirFieldsUnderHeaderandQueryTabs() {
    for (let label of SUBHEADER_UNDER_TABS) {
        const subheader = within(await screen.findByTestId('subheaders')).getByText(new RegExp(label, 'i'))
        expect(subheader).toBeInTheDocument()
    }
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(within(screen.getByTestId('param-type')).getByRole('button')).toBeInTheDocument()
    expect(within(screen.getByTestId('param-value')).getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByTestId("AddIcon")).toBeInTheDocument()
}

async function checkIfQueryParamsAreReflectedInFieldsFromURL(queriesArray: QueryI[]) {
    const queryValueTextFields: HTMLElement[] = []
    const queryNames = await screen.findAllByRole('combobox');
    const queryValueContainer = await screen.findAllByTestId("param-value")
    queryValueContainer.forEach((container) => {
        queryValueTextFields.push(within(container).getByRole("textbox"))
    })
    queriesArray.forEach((query, index) => {
        expect(queryNames[index]).toHaveDisplayValue(query.name)
        expect(queryValueTextFields[index]).toHaveDisplayValue(query.value)
    })
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

function retrieveQueryParamsFromURL(url: string) {
    const queryPart = url.split('?')[1]
    const queryList = queryPart.split('&')
    const queriesArray: QueryI[] = []
    queryList.forEach((item) => {
        const query: any = {}
        const index = item.indexOf('=')
        query.name = item.slice(0, index)
        query.value = item.slice(index + 1)
        query.type = "string"
        queriesArray.push(query)
    })
    return queriesArray
}

function retrievePathParamsFromURL(url: string, start: string, end: string): string[] {
    const paths = []
    for (let i = 0; i < url.length; i++) {
        if (url.charAt(i) === start) {
            const endIndex = url.indexOf(end, i)
            endIndex !== -1 && paths.push(url.slice(i + 1, i = endIndex))
        }
    }
    return paths
}

function validateResponseWithTestData(response: any, testArray: GENERAL_PARAM_STRUCTURE[], toLowerCase: boolean = false, removeIndex?: number) {
    testArray.forEach((param, index) => {
        if (removeIndex !== index)
            toLowerCase ? expect(response).toHaveProperty(param.name.toLowerCase(), param.value) : expect(response).toHaveProperty(param.name, param.value)
        else
            toLowerCase ? expect(response).not.toHaveProperty(param.name.toLowerCase()) : expect(response).not.toHaveProperty(param.name)
    })
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
            "headers": {
                "content-type": "application/json"
            }, // put "content-type": "application/json" inside the Obj when default content type is set in body params tab 
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
    const combobox = await screen.findAllByRole('combobox', {}, { timeout: 5000 })
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

async function isErrorMsgDisplayed(errorMethod: string, msgToCheck: string) {
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