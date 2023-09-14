
import { server } from './test/mocks/server'

export let warn: any = null;
export let error: any = null;
export let log: any = null;

// Establish API mocking before all tests.
beforeAll(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => { });
    error = jest.spyOn(console, "error").mockImplementation(() => { });
    log = jest.spyOn(console, "log").mockImplementation(() => { });
    server.listen();
});
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