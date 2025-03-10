import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event'
import ProviderModal from '../core/components/ProviderModal'
import { ProviderI } from '../core/components/ProviderModal';
import { restImportConfigI } from '../core/components/RestImport';
import { ERROR_MESSAGES, emptyConfig } from './testdata';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
interface mockPropsI {
    handleOpen: boolean,
    handleClose: () => void,
    handleParentModalClose?: () => void,
    providerConf?: ProviderI | null,
    proxyObj: restImportConfigI,
    isCustomErrorFunc: boolean,
    customFunction: () => void,
    handleSuccessCallback: () => void,
    providerConfig: [],
    updateProviderConfig: (key: string, value: any) => void
}

export const ProxyOFFConfig: restImportConfigI = {
    proxy_conf: {
        base_path: "http://localhost:4000",
        proxy_path: "/restimport",
        settingsUpload: "",
        list_provider: "/get-default-provider",
        getprovider: "/getprovider",
        addprovider: "/addprovider",
        authorizationUrl: "/authorizationUrl",
        updateSwagger: "updateSwagger"
    },
    appEnvVariables: [],
    projectId: "",
    error: {
        errorFunction: (msg: string) => {
            alert(msg);
        },
        errorMessageTimeout: 5000,
        errorMethod: "default",
    },
    handleResponse: (requset: AxiosRequestConfig, response?: AxiosResponse) => {
    },
    hideMonacoEditor: (value: boolean) => { },
    getServiceName(value: string) { },
    getUseProxy(value) {
        return value
    },
    setServiceName: '',
    viewMode: false,
    setResponseHeaders: { namespace: "test" },
    monacoEditorURL: "",
    urlBasePath: '',
    settingsDetailsResponse : {}
}

const mockProxyOFFProps: mockPropsI = {
    handleOpen: true,
    handleClose: jest.fn(() => console.log("closed")),
    proxyObj: ProxyOFFConfig,
    isCustomErrorFunc: false,
    customFunction: jest.fn(() => console.log("Toast Error")),
    handleSuccessCallback: jest.fn(() => console.log("Success Msg")),
    providerConfig: [],
    updateProviderConfig: jest.fn(() => console.log("Provider Config")),
}

const proxyObjConfig = emptyConfig

let mockProps: mockPropsI = {
    handleOpen: true,
    handleClose: jest.fn(() => console.log("closed")),
    proxyObj: proxyObjConfig,
    isCustomErrorFunc: false,
    customFunction: jest.fn(() => console.log("Toast Error")),
    handleSuccessCallback: jest.fn(() => console.log("Success Msg")),
    providerConfig: [],
    updateProviderConfig: jest.fn(() => console.log("Provider Config")),
}

function renderComponent(type?: string) {
    const copymockProps = { ...mockProps }
    if (type === 'withErrorAPI') {
        copymockProps.proxyObj.proxy_conf['getprovider'] = '/getproviderError'
        copymockProps.proxyObj.proxy_conf['list_provider'] = '/getproviderError'
    } else if (type === 'withErrorAPIAfterSelectProvider') {
        copymockProps.proxyObj.proxy_conf['authorizationUrl'] = '/authorizationUrlError'
    }
    render(<ProviderModal {...copymockProps} />)
}


export const providerObj = {
    providerId: "ProviderTest",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    accessTokenUrl: "https://oauth2.googleapis.com/token",
    clientId:
        "987654321.apps.googleusercontent.com",
    clientSecret: "CLIENT_SECRET",
    sendAccessTokenAs: "HEADER",
    accessTokenParamName: "Bearer",
    scopes: [{ name: "Basic Profile", value: "profile" }],
    oauth2Flow: "AUTHORIZATION_CODE",
    responseType: "token",
}

describe("Provider Modal", () => {
    it("Renders correctly", () => {
        renderComponent()
        const modalhead = screen.getByRole('heading', {
            name: /select or add provider help/i
        });
        expect(modalhead).toBeInTheDocument();
    }, 80000);

    it("Add Provider Renders correctly", async () => {
        renderComponent()
        const addprovider_card = await screen.findByTestId('add-provider')
        const addprovider_text = within(addprovider_card).getByText(/add provider/i);
        expect(addprovider_text).toBeInTheDocument();
    }, 80000);

    it("Click Add Provider - OAuth Provider Configuration Modal Render", async () => {
        user.setup()
        renderComponent()
        const addprovider_card = await screen.findByTestId('add-provider')
        await user.click(addprovider_card);
        const config_modal = screen.getByRole('heading', {
            name: /oauth provider configuration help/i
        });
        expect(config_modal).toBeInTheDocument();
    }, 80000);

    it("Default Provider Renders correctly", async () => {
        renderComponent()
        const default_provider_card = await screen.findByText(/amazon/i, {}, { timeout: 1000 })
        expect(default_provider_card).toBeInTheDocument();
    }, 80000);

    it("Custom Provider Renders correctly", async () => {
        renderComponent()
        const custom_provider_card = await screen.findByText(/Provider Sample/i, {}, { timeout: 1000 })
        expect(custom_provider_card).toBeInTheDocument();
    }, 80000);

    it("Select Saved Provider", async () => {
        user.setup()
        renderComponent()
        const select_provider = await screen.findByText(/google/i, {}, { timeout: 1000 })
        expect(select_provider).toBeInTheDocument();
        await user.click(select_provider);
        expect(mockProps.handleClose).toBeCalled()
    }, 80000);

    it("Select unsaved Provider", async () => {
        user.setup()
        renderComponent()
        const select_provider = await screen.findByText(/dropbox/i, {}, { timeout: 1000 })
        expect(select_provider).toBeInTheDocument();
        await user.click(select_provider);
        const config_modal = screen.getByRole('heading', {
            name: /oauth provider configuration help/i
        });
        expect(config_modal).toBeInTheDocument();
        const client_id = screen.getByRole('textbox', {
            name: /client id/i
        })
        expect(client_id.getAttribute('value')).toEqual('')
    }, 80000);

    it("Close Provider Modal Using Close Icon", async () => {
        user.setup()
        renderComponent()
        const close_icon = screen.getByTestId('CloseIcon')
        await user.click(close_icon);
        expect(mockProps.handleClose).toBeCalled()
    }, 80000);

    it("Default Provider List Proxy OFF", async () => {
        render(<ProviderModal {...mockProxyOFFProps} />)
        const select_provider = await screen.findByText(/google/i, {}, { timeout: 1000 })
        expect(select_provider).toBeInTheDocument();
        await user.click(select_provider);
        expect(mockProxyOFFProps.handleClose).toBeCalled()
    }, 80000);

    it("Check if the Provider ID already exist", async () => {
        user.setup()
        renderComponent()
        const addprovider_card = await screen.findByTestId('add-provider')
        await user.click(addprovider_card);
        const config_modal = screen.getByRole('heading', {
            name: /oauth provider configuration help/i
        });
        expect(config_modal).toBeInTheDocument();
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, 'google')

        const saveBtn = screen.getByRole('button', { name: /save/i })
        expect(saveBtn).toBeInTheDocument()
        await user.click(saveBtn)
        const errorField = await screen.findByTestId('config-alert')
        expect(errorField.textContent).toBe(ERROR_MESSAGES.ALREADY_EXIST)
    }, 80000);

    it("Select Saved Provider for Error Response", async () => {
        user.setup()
        renderComponent('withErrorAPIAfterSelectProvider')
        const select_provider = await screen.findByText(/google/i, {}, { timeout: 1000 })
        expect(select_provider).toBeInTheDocument();
        await user.click(select_provider);
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Check the Modal Config Modal close", async () => {
        user.setup()
        renderComponent()
        const addprovider_card = await screen.findByTestId('add-provider')
        await user.click(addprovider_card);

        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, providerObj.providerId)

        // Authorization Url
        const authorizationURL = screen.getByRole('textbox', {
            name: /authorization url/i
        })
        await user.type(authorizationURL, providerObj.authorizationUrl)

        // AccessTokenUrl
        const accessTokenUrl = screen.getByRole('textbox', {
            name: /access token url/i
        })

        await user.type(accessTokenUrl, providerObj.accessTokenUrl)

        // ClientId
        const clientId = screen.getByRole('textbox', {
            name: /client id/i
        })
        await user.type(clientId, providerObj.clientId)

        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        const saveBtn = screen.getByRole('button', { name: /save/i })
        expect(saveBtn).toBeInTheDocument()
        await user.click(saveBtn)
        const modalTitle = screen.queryByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).not.toBeVisible();

    }, 80000);

    it("Handle API Error Response", async () => {
        user.setup()
        renderComponent('withErrorAPI')
        const modalhead = screen.getByRole('heading', {
            name: /select or add provider help/i
        });
        expect(modalhead).toBeInTheDocument();
    }, 80000);


})