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

interface mockPropsI {
    handleOpen: boolean,
    handleClose: () => void,
    handleParentModalClose?: () => void,
    providerConf?: ProviderI | null,
    proxyObj: restImportConfigI
}

const mockProps: mockPropsI = {
    handleOpen: true,
    handleClose: jest.fn(),
    proxyObj: emptyConfig
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
        const custom_provider_card = await screen.findByText(/swagger_petstore_auth/i, {}, { timeout: 1000 })
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
    }, 80000);
})