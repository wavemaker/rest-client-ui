import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event'
import ConfigModel from '../core/components/ConfigModel'
import { ProviderI } from '../core/components/ProviderModal';
import { restImportConfigI } from '../core/components/RestImport';
import { ERROR_MESSAGES, SEND_ACCESSTOKEN, emptyConfig } from './testdata';
import { Provider } from 'react-redux'
import appStore from '../core/components/appStore/Store';

interface mockPropsI {
    handleOpen: boolean,
    handleClose: () => void,
    handleParentModalClose?: () => void,
    providerConf?: ProviderI | null,
    proxyObj: restImportConfigI
}

const providerObj = {
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




let mockProps: mockPropsI = {
    handleOpen: true,
    handleParentModalClose: jest.fn(() => console.log("Parent Modal Closed")),
    handleClose: jest.fn(() => console.log("closed")),
    proxyObj: emptyConfig
}

function renderComponent(type: string) {

    const copymockProps = { ...mockProps }
    if (type === 'ProviderConfigWithoutPKCE') {
        copymockProps['providerConf'] = providerObj
    } else if (type === 'ProviderConfigWithPKCES256') {
        copymockProps['providerConf'] = providerObj
        copymockProps.providerConf['oAuth2Pkce'] = { enabled: true, challengeMethod: "S256" }
    } else if (type === 'ProviderConfigWithPKCEBasic') {
        copymockProps['providerConf'] = providerObj
        copymockProps.providerConf['oAuth2Pkce'] = { enabled: true, challengeMethod: "plain" }
    } else if (type === 'withOAuthConfig') {
        copymockProps.proxyObj['default_proxy_state'] = 'OFF'
    } else if (type === 'withAddProviderAPIError') {
        copymockProps.proxyObj.proxy_conf['addprovider'] = '/addErrorproviders'
    } else if (type === 'withListAPIError') {
        copymockProps.proxyObj.proxy_conf['addprovider'] = '/addprovider'
        copymockProps.proxyObj.proxy_conf['getprovider'] = '/getproviderError'
    }


    render(<Provider store={appStore}><ConfigModel {...copymockProps} /></Provider >)

}
async function isErrorMsgDisplayed(msgToCheck: string) {
    let errorMsgDisplayed = false
    const errorField = await screen.findByTestId('config-alert')
    if (errorField.textContent === msgToCheck) {
        errorMsgDisplayed = true
    }
    return errorMsgDisplayed;
}

async function selectOptionFromDropdown(dropdownElementId: string, selectOption: string) {
    const regexPattern = new RegExp(selectOption, 'i')
    const dropdown = within(screen.getByTestId(dropdownElementId)).getByRole("button")
    await user.click(dropdown);
    const option = await screen.findByRole('option', { name: regexPattern })
    expect(option).toBeInTheDocument()
    await user.click(option)
    expect(dropdown).toHaveTextContent(selectOption)
}

async function clickSaveBtn() {
    const saveBtn = screen.getByRole('button', { name: /save/i })
    expect(saveBtn).toBeInTheDocument()
    await user.click(saveBtn)
}

export async function prefillConfigModal() {
    // Provider ID    
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

}

async function checkAllFieldPrefilled() {
    const providerId = screen.getByRole('textbox', {
        name: /provider id/i
    })
    expect(providerId).toBeInTheDocument();
    expect(providerId).toHaveValue(providerObj.providerId)

    const authorizationURL = screen.getByRole('textbox', {
        name: /authorization url/i
    })
    expect(authorizationURL).toBeInTheDocument();
    expect(authorizationURL).toHaveValue(providerObj.authorizationUrl)

    const accessTokenUrl = screen.getByRole('textbox', {
        name: /access token url/i
    })
    expect(accessTokenUrl).toBeInTheDocument();
    expect(accessTokenUrl).toHaveValue(providerObj.accessTokenUrl)

    const clientId = screen.getByRole('textbox', {
        name: /client id/i
    })
    expect(clientId).toBeInTheDocument();
    expect(clientId).toHaveValue(providerObj.clientId)

    const scope_val = screen.getByRole('checkbox', {
        name: /profile/i
    })

    expect(scope_val).toBeChecked()
}


describe("Config Modal", () => {

    it("Renders correctly", () => {
        renderComponent('withoutProviderConf')
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        expect(providerId).toBeInTheDocument();
        const callbackURL = screen.getByRole('textbox', {
            name: /callback url/i
        })
        expect(callbackURL).toBeInTheDocument();
        const flow = screen.getByRole('button', {
            name: /authorization code/i
        })
        expect(flow).toBeInTheDocument();

        const usePKCE = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        expect(usePKCE).toBeInTheDocument();
        const authorizationURL = screen.getByRole('textbox', {
            name: /authorization url/i
        })
        expect(authorizationURL).toBeInTheDocument();
        const accessTokenUrl = screen.getByRole('textbox', {
            name: /access token url/i
        })
        expect(accessTokenUrl).toBeInTheDocument();
        const clientId = screen.getByRole('textbox', {
            name: /client id/i
        })
        expect(clientId).toBeInTheDocument();
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        expect(clientSecret).toBeInTheDocument();
        const sendAccessTokenAs = screen.getByRole('button', {
            name: /header/i
        })
        expect(sendAccessTokenAs).toBeInTheDocument();
        const scopeKey = screen.getByRole('textbox', {
            name: /scope key/i
        })
        expect(scopeKey).toBeInTheDocument();
        const scopeValue = screen.getByRole('textbox', {
            name: /scope value/i
        })
        expect(scopeValue).toBeInTheDocument();
        const addScopeBtn = screen.getByRole('button', {
            name: /add/i
        })
        expect(addScopeBtn).toBeInTheDocument();

    }, 80000);

    it("Check Add Provider With Error Response", async () => {
        user.setup()
        renderComponent('withAddProviderAPIError')
        await prefillConfigModal()

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        // clientSecret
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn()
        expect(mockProps.handleClose).not.toBeCalled()
    }, 80000);

    it("Handle API Error Response", async () => {
        user.setup()
        renderComponent('withListAPIError')
        await prefillConfigModal()

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        // clientSecret
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn()
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Check While Enable PKCE the Code Change Method Show", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        await user.click(pkce);
        const changeMethod = screen.getByRole('button', {
            name: /s256/i
        })
        expect(changeMethod).toBeInTheDocument();
        const clinetSecret = screen.queryByRole('textbox', {
            name: /client secret/i
        })
        expect(clinetSecret).not.toBeInTheDocument();
    }, 80000);

    it("Check Form validation for all field", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        // Provider ID

        await clickSaveBtn();
        const providerErrorDisplayed = await isErrorMsgDisplayed(ERROR_MESSAGES.PROVIDERID_ALERT)
        expect(providerErrorDisplayed).toBeTruthy()
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })

        await user.type(providerId, providerObj.providerId)

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        // authorizationUrl
        await clickSaveBtn();
        const authorizationErrorDisplayed = await isErrorMsgDisplayed(ERROR_MESSAGES.AUTHORIZATIONURL_ALERT)
        expect(authorizationErrorDisplayed).toBeTruthy()
        const authorizationUrl = screen.getByRole('textbox', {
            name: /authorization url/i
        })
        await user.type(authorizationUrl, providerObj.authorizationUrl)

        // accessTokenUrl
        await clickSaveBtn();
        const accessTokenErrorDisplayed = await isErrorMsgDisplayed(ERROR_MESSAGES.ACCESSTOKEN_ALERT)
        expect(accessTokenErrorDisplayed).toBeTruthy()
        const accessTokenUrl = screen.getByRole('textbox', {
            name: /access token url/i
        })
        await user.type(accessTokenUrl, providerObj.authorizationUrl)

        // clientId
        await clickSaveBtn();
        const clientIdErrorDisplayed = await isErrorMsgDisplayed(ERROR_MESSAGES.CLIENTID_ALERT)
        expect(clientIdErrorDisplayed).toBeTruthy()
        const clientId = screen.getByRole('textbox', {
            name: /client id/i
        })
        await user.type(clientId, providerObj.authorizationUrl)

        // clientSecret
        await clickSaveBtn();
        const clientSecretErrorDisplayed = await isErrorMsgDisplayed(ERROR_MESSAGES.CLIENTSECRET_ALERT)
        expect(clientSecretErrorDisplayed).toBeTruthy()
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.authorizationUrl)
        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider With Authorization code flow", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        // clientSecret
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn()
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider With Implict flow", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()

        await selectOptionFromDropdown('flow', 'Implicit')

        // clientSecret
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()


    }, 80000);

    it("Add Provider with PKCE S256", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        await user.click(pkce);

        const challengeMethod = within(screen.getByTestId("challenge-method")).getByRole("button")
        expect(challengeMethod).toHaveTextContent('S256')

        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider with PKCE Basic", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()
        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')
        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        await user.click(pkce);
        await selectOptionFromDropdown('challenge-method', 'Basic')
        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider with Send AccessToken As Query", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()


        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')

        await selectOptionFromDropdown('send-accesstoken', 'Query')
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider with Scope Value", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        await prefillConfigModal()
        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')
        await selectOptionFromDropdown('send-accesstoken', 'Query')
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.authorizationUrl)
        const scopeKey = screen.getByRole('textbox', {
            name: /scope key/i
        })
        const scopeValue = screen.getByRole('textbox', {
            name: /scope value/i
        })

        for (const iterator of providerObj.scopes) {
            await user.type(scopeKey, iterator.name)
            await user.type(scopeValue, iterator.value)
        }

        const addBtn = screen.getByRole('button', {
            name: /add/i
        })
        await user.click(addBtn);
        const addedScope = await screen.findByRole('checkbox', {
            name: /Basic Profile/i
        }, { timeout: 2000 });
        expect(addedScope).toBeChecked()

        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Add Provider with unchecked Scope Value", async () => {
        user.setup()
        renderComponent('ProviderConfigWithoutPKCE')
        await prefillConfigModal()

        const scopeKey = screen.getByRole('textbox', {
            name: /scope key/i
        })
        const scopeValue = screen.getByRole('textbox', {
            name: /scope value/i
        })

        await user.type(scopeKey, 'userid')
        await user.type(scopeValue, 'userId')

        const addBtn = screen.getByRole('button', {
            name: /add/i
        })

        await user.click(addBtn);
        console.log(providerObj.scopes[0].name)
        const addedScope = await screen.findByTestId(providerObj.scopes[0].name)
        expect(addedScope).toHaveClass('Mui-checked')

        await user.click(within(addedScope).getByRole('checkbox'));

        expect(await screen.findByTestId(providerObj.scopes[0].name)).not.toHaveClass('Mui-checked')

        await clickSaveBtn();
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Check After enter ProviderID the callback URL Change", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, providerObj.providerId)
        const callbackURL = screen.getByRole('textbox', {
            name: /callback url/i
        })
        expect(callbackURL.getAttribute('value')).toEqual(emptyConfig.proxy_conf.base_path + '/oauth2/ProviderTest/callback')

    }, 80000);

    it("Check Callback URL for PKCE", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, providerObj.providerId)
        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        await user.click(pkce);
        const callbackURL = screen.getByRole('textbox', {
            name: /callback url/i
        })
        expect(callbackURL.getAttribute('value')).toEqual(emptyConfig.proxy_conf.base_path + '/oAuthCallback.html')

    }, 80000);



    it("Able to Copy CallBack URL", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, providerObj.providerId)

        const copyCallbackURL = screen.getByRole('button', {
            name: /copy to clipboard/i
        })
        await user.click(copyCallbackURL)
        const tooltipCopied = await screen.findByTestId('callback-copy')
        expect(tooltipCopied.getAttribute('aria-label')).toBe('Copied!')
    }, 80000);

    it("MouseLeave from copy icon ", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        await user.type(providerId, providerObj.providerId)

        const copyCallbackURL = screen.getByRole('button', {
            name: /copy to clipboard/i
        })
        const tooltip = screen.getByTestId('callback-copy')
        expect(tooltip).toBeInTheDocument()
        expect(tooltip.getAttribute('aria-label')).toBe('Copy to Clipboard')
        await user.click(copyCallbackURL)

        const tooltipCopied = await screen.findByTestId('callback-copy')
        expect(tooltipCopied.getAttribute('aria-label')).toBe('Copied!')
        fireEvent.mouseLeave(copyCallbackURL);
        expect(tooltip.getAttribute('aria-label')).toBe('Copy to Clipboard')

    }, 80000);

    it("Check if all send accessToken as present in the dropdown", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const accessTokenDropdown = within(screen.getByTestId("send-accesstoken")).getByRole("button")
        await user.click(accessTokenDropdown);
        const dropdownOptions = await screen.findAllByRole('option')
        expect(dropdownOptions.length).toBe(SEND_ACCESSTOKEN.length)
        dropdownOptions.forEach((option, index) => {
            expect(option).toHaveTextContent(SEND_ACCESSTOKEN[index])
        })
    }, 80000)

    it("Render with Provider config data without PKCE", async () => {
        user.setup()
        renderComponent('ProviderConfigWithoutPKCE')
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();

        await checkAllFieldPrefilled()

    }, 80000)

    it("Check ProviderID Disable While Render with Provider config data ", async () => {
        user.setup()
        renderComponent('ProviderConfigWithoutPKCE')
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();
        const providerId = screen.getByRole('textbox', {
            name: /provider id/i
        })
        expect(providerId).toBeInTheDocument();
        expect(providerId).toHaveValue(providerObj.providerId)
        expect(providerId).toHaveClass("Mui-readOnly")

    }, 80000)

    it("Render with Provider config data with PKCE S256", async () => {
        user.setup()
        renderComponent('ProviderConfigWithPKCES256')
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();

        await checkAllFieldPrefilled()

        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        expect(pkce).toBeChecked()
        const challengeMethod = within(screen.getByTestId("challenge-method")).getByRole("button")
        expect(challengeMethod).toHaveTextContent('S256')
    }, 80000)

    it("Render with Provider config data with PKCE Basic", async () => {
        user.setup()
        renderComponent('ProviderConfigWithPKCEBasic')
        const modalTitle = screen.getByRole('heading', { name: /oauth provider configuration help/i })
        expect(modalTitle).toBeInTheDocument();

        await checkAllFieldPrefilled()

        const pkce = within(screen.getByTestId("pkce-checkbox")).getByRole("checkbox")
        expect(pkce).toBeChecked()
        const challengeMethod = within(screen.getByTestId("challenge-method")).getByRole("button")
        expect(challengeMethod).toHaveTextContent('Basic')
    }, 80000)

    it("Close Config Modal Using Close Icon", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const heading = screen.getByRole('heading', {
            name: /oauth provider configuration help/i
        });
        const close_icon = within(heading).getByTestId('CloseIcon');
        await user.click(close_icon);
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);

    it("Close Config Modal Using Close Button", async () => {
        user.setup()
        renderComponent('withoutProviderConf')
        const closeBtn = screen.getByRole('button', {
            name: /close/i
        })
        await user.click(closeBtn);
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);


    it("Check oAuthConfig flow", async () => {
        user.setup()
        renderComponent('withOAuthConfig')
        await prefillConfigModal()

        const flow = within(screen.getByTestId("flow")).getByRole("button")
        expect(flow).toHaveTextContent('Authorization Code')
        // clientSecret
        const clientSecret = screen.getByRole('textbox', {
            name: /client secret/i
        })
        await user.type(clientSecret, providerObj.clientSecret)
        await clickSaveBtn()
        expect(mockProps.handleClose).toBeCalled()

    }, 80000);
})