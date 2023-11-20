/* eslint-disable jest/no-conditional-expect */
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event'
import RestImport from '../core/components/RestImport'
import '@testing-library/jest-dom';
import testData, {
  mockEmptyProps, endPoints, HTTP_METHODS, REQUEST_TABS, RESPONSE_TABS, ERROR_MESSAGES, GENERAL_PARAM_STRUCTURE, PathParamI,
  QueryI, AUTH_OPTIONS, HEADER_NAME_OPTIONS, HEADER_TYPE_OPTIONS, CONTENT_TYPE, SUBHEADER_UNDER_TABS, wavemakerMoreInfoLink, mockPropsI,
  preLoadedProps, getCustomizedProps, responseHeaders, HeaderParamI, eventMessage, getPKCEeventMsg, amazonUserInfoResponse,
  githubOrGoogleUserInfoResponse,
} from './testdata'
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';
import { ResponseI } from './mocks/handlers';
import { AxiosRequestConfig } from 'axios';
import { httpStatusCodes } from '../core/components/common/common';
import { createHash } from 'crypto';
import { sessionData } from '../setupTests';

type httpMethods = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE"
type authMethods = "None" | "Basic" | "OAuth 2.0"
type contentTypes = "multipart/form-data"
type multipartFileTypes = "File" | "Text" | "Text(Text/Plain)" | "application/json"
type options = httpMethods | authMethods | contentTypes | multipartFileTypes
type dropdownIDs = "http-auth" | "http-method" | "select-content-type" | "multipart-type" | "param-type"
type tabs = "AUTHORIZATION" | "HEADER PARAMS" | "BODY PARAMS" | "QUERY PARAMS" | "PATH PARAMS" | "RESPONSE BODY" | "RESPONSE HEADER" | "RESPONSE STATUS"


describe("Web Service Modal", () => {
  it("Renders correctly", () => {
    renderComponent(mockEmptyProps)
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
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getVerifyHeader)
    await switchTab('HEADER PARAMS')
    for (let [index, header] of headersArray.entries()) {
      await addHeadersOrQueryParamsInTheFields(header, index, true)
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
      await addHeadersOrQueryParamsInTheFields(header, index, true)
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
      await addHeadersOrQueryParamsInTheFields(query, index, true)
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

  it("Checking error response of incorrect url via the proxy server", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, "http://wavemaker.com/actualRespError")
    const useProxySwitch = screen.getByTestId('proxy-switch')
    await user.click(within(useProxySwitch).getByRole('checkbox'))
    expect(useProxySwitch).toHaveClass("Mui-checked")
    await clickTestBtn()
    const configFromResponse = await getResponse()
    expect(configFromResponse).toEqual(`400 ${httpStatusCodes.get(400)}`)
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
    console.log(httpAuthDropdown.textContent)
    expect(httpAuthDropdown).toHaveTextContent(new RegExp(config.httpAuth?.type!, 'i'))
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
    const props = getCustomizedProps('toast')
    const errorMethod = props.restImportConfig.error.errorMethod
    user.setup()
    renderComponent(props)
    await clickTestBtn()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, ERROR_MESSAGES.EMPTY_URL)
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Error Msg displayed when clicking 'TEST' without entering URL [Custom Function Error]", async () => {
    const customFunction = jest.fn((msg, response?) => console.log(msg))
    const props = getCustomizedProps('customFunction', customFunction)
    user.setup()
    renderComponent(props)
    await clickTestBtn()
    expect(customFunction).toHaveBeenCalledWith(ERROR_MESSAGES.EMPTY_URL, undefined)
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

  it("URL field accepts multiple comma separated query values for the same query name without any error", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, `${endPoints.getQueryParams}?id=1,2`)
    await switchTab('QUERY PARAMS')
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?id=1,2`)
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
  }, 80000)

  it("Handling the error response from the server", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.badRequest)
    await clickTestBtn()
    const response = await getResponse()
    expect(response).toEqual("400 " + httpStatusCodes.get(400))
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
    const response = await getResponse()
    expect(response.message).toEqual("Multipart/form data received successfully")
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
  }, 80000)

  it("Error Msg displayed when adding duplicate(already present in other parameters) path params on blur of the URL field", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    const header: HeaderParamI = testData.headerParams[1]
    user.setup()
    renderComponent(mockEmptyProps)
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields(header, 0, false)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    const urlWithPathParam = `${endPoints.getUsers}/{${header.name}}`
    fireEvent.change(urlTextField, { target: { value: urlWithPathParam } })
    urlTextField.focus()
    urlTextField.blur()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `Parameters cannot have duplicates, removed the duplicates[${header.name}]`)
    expect(errorDisplayed).toBeTruthy()
    expect(urlTextField).toHaveValue(endPoints.getUsers)
  }, 80000)

  it("Error displayed when having duplicate path parameters in the URL", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    fireEvent.change(urlTextField, { target: { value: endPoints.duplicatePathParams } })
    urlTextField.focus()
    urlTextField.blur()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, 'Path parameters cannot have duplicates')
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Error displayed when having invalid(empty) path parameters in the URL", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    fireEvent.change(urlTextField, { target: { value: endPoints.emptyPathParam } })
    urlTextField.focus()
    urlTextField.blur()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, 'Please enter a valid path parameter')
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Query Parameters with same name are reflected in the Fields", async () => {
    const duplicateQueries: QueryI[] = [{ name: 'id', value: '2,5', type: 'string' }]
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.duplicateQueryParams)
    urlTextField.blur()
    await switchTab('QUERY PARAMS')
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?id=2,5`)
    const errorField = screen.queryByTestId('default-error')
    expect(errorField).toBeFalsy()
    await switchTab('QUERY PARAMS')
    await checkIfQueryParamsAreReflectedInFieldsFromURL(duplicateQueries)
  }, 80000)

  it("Adding Query Parameters with same name one by one", async () => {
    const duplicateQueries: QueryI[] = [{ name: 'id', value: '2,5', type: 'string' }]
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.oneQueryParam)
    await switchTab('QUERY PARAMS')
    expect(urlTextField).toHaveValue(endPoints.oneQueryParam)
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: 'id', value: '2', type: 'string' }])
    await user.clear(urlTextField)
    await user.type(urlTextField, endPoints.duplicateQueryParams)
    urlTextField.blur()
    await switchTab('QUERY PARAMS')
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?id=2,5`)
    await checkIfQueryParamsAreReflectedInFieldsFromURL(duplicateQueries)
  }, 80000)


  it("Error displayed for invalid query parameter on blur of the URL field", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.invalidQueryParam)
    await switchTab('QUERY PARAMS')
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `Please enter a valid query parameter`)
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Error Msg displayed when adding duplicate(already present in other parameters) query params on blur of the URL field", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    const header: HeaderParamI = testData.headerParams[1]
    user.setup()
    renderComponent(mockEmptyProps)
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields(header, 0, false)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, `${endPoints.getQueryParams}?${header.name}=${header.value}`)
    urlTextField.blur()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `Queries cannot have duplicates, removed the duplicates[${header.name}]`)
    expect(errorDisplayed).toBeTruthy()
    expect(urlTextField).toHaveValue(endPoints.getQueryParams)
  }, 80000)

  it("Query details from last index are automatically added to the URL when clicking TEST btn", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getQueryParams)
    await switchTab('QUERY PARAMS')
    await addHeadersOrQueryParamsInTheFields(testData.queries[0], 0, false)
    expect(urlTextField).toHaveValue(endPoints.getQueryParams)
    await clickTestBtn()
    const updatedURL = constructUrlWithQueryParams(endPoints.getQueryParams, [testData.queries[0]])
    expect(urlTextField).toHaveValue(updatedURL)
  }, 80000)

  it("Only unique query values are considered & added to the URL and Fields when clicking TEST btn[entered via fields]", async () => {
    const queryData: QueryI[] = [{ name: 'name', value: 'xyz', type: 'String' }, { name: 'id', value: '1,2', type: 'String' }, { name: 'id', value: '1,2,3,1', type: 'String' }]
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getQueryParams)
    await switchTab('QUERY PARAMS')
    await addHeadersOrQueryParamsInTheFields(queryData[0], 0, true)
    await addHeadersOrQueryParamsInTheFields(queryData[1], 1, true)
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?name=xyz&id=1,2`)
    await addHeadersOrQueryParamsInTheFields(queryData[2], 2, false)
    await clickTestBtn()
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?name=xyz&id=1,2,3`)
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: 'name', value: 'xyz', type: 'String' }, { name: 'id', value: '1,2,3', type: 'String' }])
  }, 80000)

  it("Only unique query values are considered & added to the fields on blur of URL field[entered one after another via url field]", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, `${endPoints.getQueryParams}?name=xyz&id=1`)
    await switchTab('QUERY PARAMS')
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: 'name', value: 'xyz', type: 'String' }, { name: 'id', value: '1', type: 'String' }])
    await user.clear(urlTextField)
    await user.type(urlTextField, `${endPoints.getQueryParams}?name=xyz&id=1&id=2&id=1&id=3`)
    expect(urlTextField).toHaveFocus()
    urlTextField.blur()
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: 'name', value: 'xyz', type: 'String' }, { name: 'id', value: '1,2,3', type: 'String' }])
  }, 80000)

  it("Only unique query values are considered & added to the fields on blur of URL field[entered at a time via url field]", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, `${endPoints.getQueryParams}?id=1&id=1`)
    await switchTab('QUERY PARAMS')
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: 'id', value: '1', type: 'String' }])
    expect(urlTextField).toHaveValue(`${endPoints.getQueryParams}?id=1`)
  }, 80000)

  it("Error displayed when clicking TEST btn with duplicate query[already present in other parameters] added in the last row", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    const header: HeaderParamI = testData.headerParams[1]
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getQueryParams)
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields(header, 0, false)
    await switchTab('QUERY PARAMS')
    await addHeadersOrQueryParamsInTheFields({ name: header.name, value: header.value, type: header.type }, 0, false)
    await clickTestBtn()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `parameter "${header.name}" already exists`)
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Doesn't allow to add already present query parameter[name=value] using field", async () => {
    const queryData = { name: 'id', value: '1,2', type: 'String' }
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, `${endPoints.getQueryParams}?id=1&id=2`)
    await switchTab('QUERY PARAMS')
    await checkIfQueryParamsAreReflectedInFieldsFromURL([queryData])
    await addHeadersOrQueryParamsInTheFields(queryData, 1, false)
    await clickTestBtn()
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: '', value: '', type: 'String' }], 1)
  }, 80000)

  it("Doesn't allow to Add both the Basic authentication and Authorization header", async () => {
    const errorMethod = mockEmptyProps.restImportConfig.error.errorMethod
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getUsers)
    await selectOptionFromDropdown('http-auth', 'Basic')
    const userName = await screen.findByRole('textbox', { name: /user name/i })
    await user.type(userName, testData.user.userName)
    const password = await screen.findByRole('textbox', { name: /password/i })
    await user.type(password, testData.user.password)
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields({ name: 'Authorization', value: 'ajsDDWehWknBSKhk', type: 'String' }, 0, false)
    await clickTestBtn()
    const errorDisplayed = await isErrorMsgDisplayed(errorMethod, `Parameter "Authorization" already exists`)
    expect(errorDisplayed).toBeTruthy()
  }, 80000)

  it("Adds an additional empty header row when clicking TEST with one filled in row", async () => {
    user.setup()
    renderComponent(mockEmptyProps)
    const urlTextField = screen.getByRole('textbox', { name: /url/i })
    await user.type(urlTextField, endPoints.getUsers)
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields({ name: 'Authorization', value: 'ajsDDWehWknBSKhk', type: 'String' }, 0, false)
    await clickTestBtn()
    await checkIfQueryParamsAreReflectedInFieldsFromURL([{ name: '', value: '', type: 'String' }], 1)
  }, 80000)

  it("Test OAuth 2.0 - Normal Flow", async () => {
    sessionData.clear()
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/github/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("github");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.githubUserInfo);
    await clickTestBtn();
    fireEvent(window, new MessageEvent("message", { origin: "http://localhost:4000", data: eventMessage, }));
    const githubOAuthResponse = await getResponse();
    expect(githubOAuthResponse).toEqual(githubOrGoogleUserInfoResponse);
  }, 100000);

  it("Test OAuth 2.0 [PKCE Negative Flow]", async () => {
    sessionData.clear()
    defineCryptoPropertyOnWindow(true)
    const header: HeaderParamI = testData.headerParams[0]
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/amazon/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("amazon");
    await switchTab('HEADER PARAMS')
    await addHeadersOrQueryParamsInTheFields(header, 0, false)
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.amazonUserInfo);
    await clickTestBtn();
    fireEvent(window, new MessageEvent("message", { origin: "http://localhost:4000", data: getPKCEeventMsg(false), }));
    const amazonOAuthPKCEResponse = await getResponse();
    expect(amazonOAuthPKCEResponse).toEqual(`401 ${httpStatusCodes.get(401)}`);
  }, 100000);

  it("Test OAuth 2.0 [PKCE Flow - Code Challenge Error]", async () => {
    sessionData.clear()
    defineCryptoPropertyOnWindow(false)
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/amazon/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("amazon");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.amazonUserInfo);
    await clickTestBtn();
  }, 100000);

  it("Test OAuth 2.0 [PKCE Flow]", async () => {
    sessionData.clear()
    defineCryptoPropertyOnWindow(true)
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/amazon/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("amazon");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.amazonUserInfo);
    await clickTestBtn();
    fireEvent(window, new MessageEvent("message", { origin: "http://localhost:4000", data: getPKCEeventMsg(true), }));
    const amazonOAuthPKCEResponse = await getResponse();
    expect(amazonOAuthPKCEResponse).toEqual(amazonUserInfoResponse);
  }, 100000);

  it("Test OAuth 2.0 [Google Implicit Flow]", async () => {
    sessionData.clear()
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/google/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("google");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.googleUserInfo);
    await clickTestBtn();
    const googleImplicitResponse = await getResponse();
    expect(googleImplicitResponse).toEqual(githubOrGoogleUserInfoResponse);
  }, 100000);

  it("Test OAuth 2.0 [Google Implicit Flow - Error]", async () => {
    sessionData.clear()
    const props = getCustomizedProps(undefined, undefined, "getprovider_error") 
    user.setup();
    renderComponent(props);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/google/i, {}, { timeout: 5000 })); 
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("google");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.googleUserInfo);
    await clickTestBtn();
    const googleImplicitResponse = await getResponse();
    expect(googleImplicitResponse).toEqual(`401 ${httpStatusCodes.get(401)}`);
  }, 100000);

  it("Test OAuth 2.0 - Testing whether token is stored in session storage", async () => {
    sessionData.clear()
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/github/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("github");
    const urlTextField = await screen.findByRole("textbox", { name: /url/i }, { timeout: 5000 });
    await user.type(urlTextField, endPoints.githubUserInfo);
    expect(window.sessionStorage.getItem("githubaccess_token")).toBeUndefined()
    await clickTestBtn();
    fireEvent(window, new MessageEvent("message", { origin: "http://localhost:4000", data: eventMessage, }));
    const githubOAuthResponse = await getResponse();
    expect(githubOAuthResponse).toEqual(githubOrGoogleUserInfoResponse);
    expect(window.sessionStorage.getItem("githubaccess_token")).toBe("github-access-token")
    await clickTestBtn()
    const githubOAuthResponseUsingSesion = await getResponse();
    expect(githubOAuthResponseUsingSesion).toEqual(githubOrGoogleUserInfoResponse);
  }, 100000);

  it("Test OAuth 2.0 - Clicking edit icon opens the configuration modal", async () => {
    sessionData.clear()
    user.setup();
    renderComponent(mockEmptyProps);
    await selectOptionFromDropdown("http-auth", "OAuth 2.0");
    await user.click(await screen.findByTestId("select-provider"));
    await user.click(await screen.findByText(/github/i, {}, { timeout: 5000 }));
    expect(within(await screen.findByTestId("provider-name", {}, { timeout: 2000 })).getByRole("textbox", { hidden: true, })).toHaveValue("github");
    await user.click(await screen.findByTestId('edit-provider', {}, { timeout: 5000 }))
    const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
    expect(modalTitle).toBeInTheDocument();
  }, 100000);
});

function renderComponent(mockProps: mockPropsI) {
  render(
    <Provider store={appStore}>
      <RestImport {...mockProps} />
    </Provider>
  );
}

async function selectOptionFromDropdown(
  dropdownElementId: dropdownIDs,
  selectOption: options
) {
  const regexPattern = new RegExp(selectOption, "i");
  const dropdown = within(screen.getByTestId(dropdownElementId)).getByRole("button");
  await user.click(dropdown);
  const option = await screen.findByRole("option", { name: regexPattern });
  expect(option).toBeInTheDocument();
  await user.click(option);
  expect(dropdown).toHaveTextContent(selectOption);
}

async function switchTab(tabName: tabs) {
  const tab = await screen.findByRole("tab", { name: new RegExp(tabName, "i") }, { timeout: 5000 });
  expect(tab).toBeEnabled();
  await user.click(tab);
}

async function verifySubheadersAndTheirFieldsUnderHeaderandQueryTabs() {
  for (let label of SUBHEADER_UNDER_TABS) {
    const subheader = within(await screen.findByTestId("subheaders")).getByText(new RegExp(label, "i"));
    expect(subheader).toBeInTheDocument();
  }
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  expect(within(screen.getByTestId("param-type")).getByRole("button")).toBeInTheDocument();
  expect(within(screen.getByTestId("param-value")).getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByTestId("AddIcon")).toBeInTheDocument();
}

async function checkIfQueryParamsAreReflectedInFieldsFromURL(queriesArray: QueryI[], startIndex: number = 0) {
  await waitFor(
    () => {
      const queryNameFields = screen.queryAllByRole("combobox");
      expect(queryNameFields.length).toBeGreaterThanOrEqual(1);
    },
    { timeout: 5000 }
  );

  const queryValueTextFields: HTMLElement[] = [];
  const queryNames = await screen.findAllByRole("combobox", {}, { timeout: 5000 });
  const queryValueContainer = screen.getAllByTestId("param-value");
  queryValueContainer.forEach((container) => {
    queryValueTextFields.push(within(container).getByRole("textbox"));
  });
  queriesArray.forEach((query, index) => {
    expect(queryNames[startIndex]).toHaveDisplayValue(query.name);
    expect(queryValueTextFields[startIndex]).toHaveDisplayValue(query.value);
    startIndex++;
  });
}

async function verifyDropdownOptionsArePresent(arrayToCheck: string[]) {
  const optionElements = within(await screen.findByRole("presentation")).getAllByRole("option");
  const textsFromDropdown = optionElements.map((optionElement) =>
    optionElement.textContent?.trim().toLowerCase()
  );
  arrayToCheck.forEach((option) => {
    expect(textsFromDropdown).toContainEqual(option.toLowerCase());
  });
}

async function clickTestBtn() {
  const testBtn = screen.getByRole("button", { name: /test/i });
  expect(testBtn).toBeInTheDocument();
  await user.click(testBtn);
}

async function getResponse() {
  const view = await screen.findByTestId("mock-response");
  await waitFor(
    async () => {
      const responseTextField = await within(view).findByRole("textbox", {}, { timeout: 5000 })
      expect(responseTextField.getAttribute("value")).toBeTruthy()
    },
    { timeout: 10000 }
  )
  const responseTextField = await within(view).findByRole("textbox", {}, { timeout: 5000 });
  return JSON.parse(responseTextField.getAttribute("value")!);
}

function retrieveQueryParamsFromURL(url: string) {
  const queryPart = url.split("?")[1];
  const queryList = queryPart.split("&");
  const queriesArray: QueryI[] = [];
  queryList.forEach((item) => {
    const query: any = {};
    const index = item.indexOf("=");
    query.name = item.slice(0, index);
    query.value = item.slice(index + 1);
    query.type = "string";
    queriesArray.push(query);
  });
  return queriesArray;
}

function retrievePathParamsFromURL(
  url: string,
  start: string,
  end: string
): string[] {
  const paths = [];
  for (let i = 0; i < url.length; i++) {
    if (url.charAt(i) === start) {
      const endIndex = url.indexOf(end, i);
      endIndex !== -1 && paths.push(url.slice(i + 1, (i = endIndex)));
    }
  }
  return paths;
}

function validateResponseWithTestData(
  response: any,
  testArray: GENERAL_PARAM_STRUCTURE[],
  toLowerCase: boolean = false,
  removeIndex?: number
) {
  testArray.forEach((param, index) => {
    if (removeIndex !== index)
      toLowerCase
        ? expect(response).toHaveProperty(param.name.toLowerCase(), param.value)
        : expect(response).toHaveProperty(param.name, param.value);
    else
      toLowerCase
        ? expect(response).not.toHaveProperty(param.name.toLowerCase())
        : expect(response).not.toHaveProperty(param.name);
  });
}

function constructUrlWithQueryParams(url: string, queryParams: QueryI[], removeIndex?: number) {
  url += "?";
  queryParams.forEach((query, index) => {
    if (removeIndex !== index)
      url += `${query.name}=${query.value}${index !== queryParams.length - 1 && index + 1 !== removeIndex ? "&" : ""
        }`;
  });
  return url;
}

function constructUrlWithPathParams(
  url: string,
  pathParams: PathParamI[],
  removeIndex?: number
) {
  url += "/";
  pathParams.forEach((path, index) => {
    if (removeIndex !== index)
      url += `{ ${path.name}}${index !== pathParams.length - 1 && index + 1 !== removeIndex ? "/" : ""
        }`;
  });
  return url;
}

function constructObjToMatchWithProxyConfig(endpoint: string, httpMethod: httpMethods = "GET") {
  const configWProxy: AxiosRequestConfig = {
    url: "http://localhost:4000/restimport",
    data: {
      endpointAddress: endpoint,
      method: httpMethod,
      contentType: "application/json",
      requestBody: "",
      headers: {
        "Content-Type": "application/json",
      }, // put "content-type": "application/json" inside the Obj when default content type is set in body params tab
      authDetails: null,
    },
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  return configWProxy;
}

async function addHeadersOrQueryParamsInTheFields(data: GENERAL_PARAM_STRUCTURE, index: number, clickAddAfterFilling: boolean) {
  const paramTypeFields: HTMLElement[] = [];
  const paramValueFields: HTMLElement[] = [];
  const combobox = await screen.findAllByRole("combobox", {}, { timeout: 5000 });
  expect(combobox.length).toBe(index + 1);
  await user.type(combobox[index], data.name);

  const paramTypeContainers = screen.getAllByTestId("param-type");
  paramTypeContainers.forEach((parent) => {
    paramTypeFields.push(within(parent).getByRole("button"));
  });
  expect(paramTypeFields.length).toBe(index + 1);
  await user.click(paramTypeFields[index]);
  const paramType = await screen.findByRole("option", { name: data.type });
  await user.click(paramType);

  const paramValueContainers = screen.getAllByTestId("param-value");
  paramValueContainers.forEach((parent) => {
    paramValueFields.push(within(parent).getByRole("textbox"));
  });
  expect(paramValueFields.length).toBe(index + 1);
  await user.type(paramValueFields[index], data.value);
  const addIcon = screen.getByTestId("AddIcon");
  clickAddAfterFilling && (await user.click(addIcon));
}

async function verifyPathLabelsAndEnterValues(pathParamsArray: PathParamI[]) {
  const pathLabels = await screen.findAllByTestId("path-param-label");
  expect(pathLabels.length).toBe(pathParamsArray.length);
  pathLabels.forEach((label, index) => {
    expect(label).toHaveTextContent(pathParamsArray[index].name);
  });

  const containers = screen.getAllByTestId("path-param-value");
  expect(containers.length).toBe(pathParamsArray.length);
  for (let index = 0; index < containers.length; index++) {
    const pathValueField = within(containers[index]).getByRole("textbox");
    const pathValueFromField = pathValueField.getAttribute("value");

    (pathValueFromField && pathValueFromField === pathParamsArray[index].value) || (await user.type(pathValueField, pathParamsArray[index].value));
  }
}

async function isErrorMsgDisplayed(errorMethod: string, msgToCheck: string) {
  let errorMsgDisplayed = false;

  switch (errorMethod) {
    case "default": {
      const errorField = await screen.findByTestId("default-error");
      if (errorField.textContent === msgToCheck) {
        errorMsgDisplayed = true;
      }
      break;
    }
    case "toast": {
      const toasts = await screen.findAllByRole("status");
      toasts.forEach((toast) => {
        if (toast.textContent === msgToCheck) {
          errorMsgDisplayed = true;
          return;
        }
      });
      break;
    }
  }

  return errorMsgDisplayed;
}


function defineCryptoPropertyOnWindow(toBeResolved: boolean) {
  Object.defineProperty(window, 'crypto', {
    value:
    {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 10);
        }
      },
      subtle: {
        digest: (algorithm: string, data: Uint8Array) => {
          return new Promise((resolve, reject) =>
            toBeResolved ? resolve(
              createHash(algorithm.toLowerCase().replace("-", ""))
                .update(data)
                .digest()
            ) : reject("Invalid Code Verifier")
          );
        },
      },
    },
  },)
}