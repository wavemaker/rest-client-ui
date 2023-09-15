
import { server } from './test/mocks/server'

export let warn: any = null;
export let error: any = null;
export let log: any = null;
export const sessionData = new Map<string, string>([])

// Establish API mocking before all tests.
beforeAll(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => { });
    error = jest.spyOn(console, "error").mockImplementation(() => { });
    log = jest.spyOn(console, "log").mockImplementation(() => { });
    server.listen();
});

// Defines new properties to the window object before each test
beforeEach(() => {
    Object.defineProperties(window, {
        matchMedia: {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        },
        open: {
            writable: true,
            value: jest.fn().mockImplementation((url, target, features) => {
                return { closed: true }
            }),
        },

        google: {
            writable: true,
            value: {
                accounts: {
                    oauth2: {
                        initTokenClient: (data: any) => ({
                            requestAccessToken: () => {
                                data.client_id.includes('google') ? data.callback({ access_token: 'google_implicit_flow_accessToken' }) : data.error_callback({
                                    type: "popup_closed"
                                })
                            }
                        })
                    }
                }
            }
        },

        sessionStorage: {
            value: {
                getItem: (key: string) => sessionData.get(key),
                setItem: (key: string, value: string) => sessionData.set(key, value),
                removeItem: (key: string) => sessionData.delete(key)
            }

        }
    });
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => {
    log.mockReset()
    warn.mockReset()
    error.mockReset()
    server.close()
})