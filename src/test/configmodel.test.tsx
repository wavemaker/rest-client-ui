import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfigModel from '../core/components/ConfigModel'
import { ProviderI } from '../core/components/ProviderModal';
import { restImportConfigI } from '../core/components/WebServiceModal';
import { emptyConfig } from './testdata';
import { Provider } from 'react-redux'
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

describe("Config Modal", () => {
    it("Renders correctly", () => {
        render(<Provider store={appStore}><ConfigModel {...mockProps} /></Provider >)
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();
    }, 80000);
})