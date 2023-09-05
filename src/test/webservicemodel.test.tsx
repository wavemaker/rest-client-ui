import { render, screen, within, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event'
import WebServiceModal from '../core/components/WebServiceModal'
import '@testing-library/jest-dom';
import { server } from './mocks/server'
import testData, { mockEmptyProps, endPoints } from './testdata'
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';

beforeAll(() => server.listen())

afterEach(() => server.restoreHandlers())

afterAll(() => server.close())

describe("Web Service Modal", () => {
    it("Renders correctly", () => {
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const modalTitle = screen.getByRole('heading', { name: /Web Service/i });
        expect(modalTitle).toBeInTheDocument();
    });

    it("Able to type in URL field", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        expect(urlTextField).toHaveValue(endPoints.getUsers)
    })

    it("Authorization tab selected by default", () => {
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const authTab = screen.getByRole('tab', { name: /authorization/i })
        expect(authTab).toHaveClass("Mui-selected")
    })

    it("Body Params disabled for GET method by default", () => {
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeDisabled()
    })

    it("Body Params enabled for POST method", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        // const httpMethodDropdown = getByRole(screen.getByTestId("http-method"), "button")
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const postOption = await screen.findByRole('option', { name: /post/i })
        expect(postOption).toBeInTheDocument()
        await user.click(postOption)
        expect(httpMethodDropdown).toHaveTextContent("POST")
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
    })

    it("GET request returns the list of users", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.getUsers)
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response');
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        expect(JSON.parse(responseTextField.getAttribute('value')!)).toEqual(testData.totalUsers)
    }, 10000)

    it("POST request with basic authentication", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const postOption = await screen.findByRole('option', { name: /post/i })
        expect(postOption).toBeInTheDocument()
        await user.click(postOption)
        expect(httpMethodDropdown).toHaveTextContent("POST")
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postLogin)
        const httpAuthDropdown = within(screen.getByTestId("http-auth")).getByRole("button")
        await user.click(httpAuthDropdown);
        const basicAuthOption = await screen.findByRole('option', { name: /basic/i })
        expect(basicAuthOption).toBeInTheDocument()
        await user.click(basicAuthOption)
        expect(httpAuthDropdown).toHaveTextContent(/basic/i)
        const userName = await screen.findByRole('textbox', { name: /user name/i })
        await user.type(userName, "Wavemaker")
        const password = await screen.findByRole('textbox', { name: /password/i })
        await user.type(password, "Wavemaker@2023")
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response');
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        const response = JSON.parse(responseTextField.getAttribute('value')!)
        expect(response?.requestHeader?.authorization).toMatch(/basic/i)
    }, 10000)

    it("POST request with Body params", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const postOption = await screen.findByRole('option', { name: /post/i })
        expect(postOption).toBeInTheDocument()
        await user.click(postOption)
        expect(httpMethodDropdown).toHaveTextContent("POST")
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postCreateAccount)
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
        await user.click(bodyParams)
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        const jsonStr = JSON.stringify(testData.user)
        fireEvent.change(bodyTextArea, { target: { value: `${jsonStr}` } })
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response',);
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        expect(JSON.parse(responseTextField.getAttribute('value')!).request).toEqual(testData.user)

    }, 10000)

    it("Sending Header Parameters in the Request", async () => {
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const postOption = await screen.findByRole('option', { name: /post/i })
        expect(postOption).toBeInTheDocument()
        await user.click(postOption)
        expect(httpMethodDropdown).toHaveTextContent("POST")
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        await user.type(urlTextField, endPoints.postVerifyHeader)
        const headerParams = screen.getByRole('tab', { name: /header params/i })
        await user.click(headerParams)
        const combobox = await screen.findByRole('combobox')
        expect(combobox).toBeInTheDocument()
        await user.type(combobox, testData.headerParams.label)
        const type = await within(screen.getByTestId('param-type')).findByRole('button')
        expect(type).toBeInTheDocument()
        await user.click(type)
        await user.click(await screen.findByText(testData.headerParams.type))
        const paramValueTextField = await within(screen.getByTestId('param-value')).findByRole('textbox')
        await user.type(paramValueTextField, testData.headerParams.value)
        const bodyParams = screen.getByRole('tab', { name: /body params/i })
        expect(bodyParams).toBeEnabled()
        await user.click(bodyParams)
        const tabpanel = await screen.findByRole('tabpanel');
        const bodyTextArea = within(tabpanel).getByRole('textbox');
        fireEvent.change(bodyTextArea, { target: { value: `{"id" : "1"}` } })
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response', {}, { timeout: 5000 });
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        const requestHeader = JSON.parse(responseTextField.getAttribute('value')!).requestHeaders
        console.log(requestHeader)
        // expect(requestHeader[`${testData.headerParams.header}`]).toEqual(testData.headerParams.value)
    }, 30000)

    it("Sending Query Parameters in the Request", async () => {
        let queryValueTextField: HTMLElement[] = [];
        user.setup()
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const queryParams = screen.getByRole('tab', { name: /query params/i })
        expect(queryParams).toBeInTheDocument()
        await user.click(queryParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.getQueryParams}?sort=${testData.queryParams.sort}&page=${testData.queryParams.page}` } })
        urlTextField.focus()
        urlTextField.blur()
        await user.click(queryParams)
        const queryNames = screen.getAllByRole('combobox');
        console.log("Query Name length -> " + queryNames.length)
        const queryValueContainer = screen.getAllByTestId("param-value")
        console.log("Container length -> " + queryValueContainer.length)
        queryValueContainer.forEach((container: any) => {
            queryValueTextField.push(within(container).getByRole("textbox"))
        })
        console.log("Query Value field length -> " + queryValueTextField.length)
        Object.keys(testData.queryParams).forEach((key, index) => {
            console.log("Key - " + key + " Value - " + testData.queryParams[key])
            expect(queryNames[index]).toHaveDisplayValue(key)
            expect(queryValueTextField[index]).toHaveDisplayValue(testData.queryParams[key])
        })
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response', {}, { timeout: 5000 });
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        const body = JSON.parse(responseTextField.getAttribute('value')!)
        console.log(body)
        expect(body.queries).toEqual(testData.queryParams)
    }, 10000)

    it("Creating/Updating a resource by sending PUT request with Path params", async () => {
        user.setup()
        const pathParam = "userId"
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const putOption = await screen.findByRole('option', { name: /put/i })
        expect(putOption).toBeInTheDocument()
        await user.click(putOption)
        expect(httpMethodDropdown).toHaveTextContent("PUT")
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        await user.click(pathParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.putResource}/{${pathParam}}` } })
        urlTextField.focus()
        urlTextField.blur()
        await user.click(pathParams)
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
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response', {}, { timeout: 5000 });
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        const body = JSON.parse(responseTextField.getAttribute('value')!)
        expect(body.userId).toMatch(testData.user.id.toString())
    }, 10000)

    it("Deleting a resource with Path params", async () => {
        user.setup()
        const pathParam = "userId"
        render(<Provider store={appStore}><WebServiceModal {...mockEmptyProps} /></Provider >);
        const httpMethodDropdown = within(screen.getByTestId("http-method")).getByRole("button")
        await user.click(httpMethodDropdown);
        const putOption = await screen.findByRole('option', { name: /delete/i })
        expect(putOption).toBeInTheDocument()
        await user.click(putOption)
        expect(httpMethodDropdown).toHaveTextContent("DELETE")
        const pathParams = screen.getByRole('tab', { name: /path params/i })
        // await user.click(pathParams)
        const urlTextField = screen.getByRole('textbox', { name: /url/i })
        fireEvent.change(urlTextField, { target: { value: `${endPoints.deleteResource}/{${pathParam}}` } })
        urlTextField.focus()
        // urlTextField.blur()
        await user.click(pathParams)
        const pathParamLabelField = await screen.findByTestId('path-param-label')
        expect(pathParamLabelField).toHaveTextContent(pathParam)
        const pathParamValueField = await within(screen.getByTestId('path-param-value')).findByRole('textbox')
        fireEvent.change(pathParamValueField, { target: { value: testData.user.id } })
        const testBtn = screen.getByRole('button', { name: /test/i })
        expect(testBtn).toBeInTheDocument()
        await user.click(testBtn)
        const view = await screen.findByTestId('mock-response', {}, { timeout: 5000 });
        const responseTextField = await within(view).findByRole('textbox', {}, { timeout: 5000 });
        const body = JSON.parse(responseTextField.getAttribute('value')!)
        console.log(body)
        expect(body.userId).toMatch(testData.user.id.toString())
    }, 20000)

});