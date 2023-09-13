import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event'
import ProviderModal from '../core/components/ProviderModal'
import { ProviderI } from '../core/components/ProviderModal';
import { restImportConfigI } from '../core/components/WebServiceModal';
import { emptyConfig } from './testdata';
import { Provider } from 'react-redux'
import { server } from './mocks/server'
import appStore from '../core/components/appStore/Store';
import { AxiosResponse } from 'axios';
interface mockPropsI {
    handleOpen: boolean,
    handleClose: () => void,
    handleParentModalClose?: () => void,
    providerConf?: ProviderI | null,
    proxyObj: restImportConfigI
}

const mockProps: mockPropsI = {
    handleOpen: true,
    handleClose: jest.fn(() => console.log("closed")),
    proxyObj: emptyConfig
}

export const ProxyOFFConfig: restImportConfigI = {
    proxy_conf: {
        base_path: "http://localhost:4000",
        proxy_path: "/restimport",
        list_provider: "/get-default-provider",
        getprovider: "/getprovider",
        addprovider: "/addprovider",
        authorizationUrl: "/authorizationUrl",
    },
    default_proxy_state: "OFF", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
    oAuthConfig: {
        base_path: "https://www.wavemakeronline.com/studio/services",
        proxy_path: "/proxy_path",
        project_id: "",
        list_provider: "/oauth2/providers/default",
        getprovider: "/projects/oauth2/providers", // /projects/{projectID}/oauth2/providers
        addprovider: "/projects/oauth2/addprovider", // /projects/{projectID}/oauth2/providers
        authorizationUrl: "/projects/oauth2/authorizationUrl", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
    },
    error: {
        errorFunction: (msg: string) => {
            alert(msg);
        },
        errorMessageTimeout: 5000,
        errorMethod: "default",
    },
    handleResponse: (response?: AxiosResponse) => {
    },
    hideMonacoEditor: (value: boolean) => {
    }
}

const mockProxyOFFProps: mockPropsI = {
    handleOpen: true,
    handleClose: jest.fn(() => console.log("closed")),
    proxyObj: ProxyOFFConfig
}

function renderComponent() {
    render(<Provider store={appStore}><ProviderModal {...mockProps} /></Provider >)
}

beforeAll(() => server.listen())

afterEach(() => server.restoreHandlers())

afterAll(() => server.close())

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

    it("Click Add Provider", async () => {
        user.setup()
        renderComponent()
        const addprovider_card = await screen.findByTestId('add-provider')
        await user.click(addprovider_card);
    }, 80000);

    it("OAuth Provider Configuration Modal render ", async () => {
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

    }, 80000);

    it("Select unsaved Provider", async () => {
        user.setup()
        renderComponent()
        const select_provider = await screen.findByText(/amazon/i, {}, { timeout: 1000 })
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
    }, 80000);

    it("Default Provider List Proxy OFF", async () => {
        render(<Provider store={appStore}><ProviderModal {...mockProxyOFFProps} /></Provider >)
        const select_provider = await screen.findByText(/google/i, {}, { timeout: 1000 })
        expect(select_provider).toBeInTheDocument();
        await user.click(select_provider);
    }, 80000);
})