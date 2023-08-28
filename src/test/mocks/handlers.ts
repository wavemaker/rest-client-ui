import { rest } from 'msw'
import testData, { endPoints } from '../testdata'

export const handlers = [
    rest.get(endPoints.getUsers, (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: {},
            data: testData.userList,
            queries: null,
            pathParams: null,
            message: "User List fetched successfully"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    }),

    rest.post(endPoints.postLogin, (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: req.headers.all(),
            data: null,
            queries: null,
            pathParams: null,
            message: "Login Successful"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    }),

    rest.post(endPoints.postCreateAccount, async (req, res, ctx) => {
        const requestObject = await req.json().then(data => data)
        const response: ResponseI = {
            requestHeaders: {},
            data: requestObject,
            queries: null,
            pathParams: null,
            message: "User account created successfully"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    }),

    rest.get(endPoints.getVerifyHeader, async (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: req.headers.all(),
            data: null,
            queries: null,
            pathParams: null,
            message: "Received the headers successfully"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    }),

    rest.put(`${endPoints.putResource}/:userId`, async (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: {},
            data: null,
            queries: null,
            pathParams: req.params,
            message: "User details updated successfully"
        }

        return res(
            ctx.status(204),
            ctx.json(response)
        )
    }),

    rest.put(`${endPoints.putResource}/:userId/:event`, async (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: {},
            data: null,
            queries: null,
            pathParams: req.params,
            message: "User details updated successfully"
        }

        return res(
            ctx.status(204),
            ctx.json(response)
        )
    }),

    rest.get(endPoints.getQueryParams, (req, res, ctx) => {
        let queries: any = {};
        for (const [key, value] of req.url.searchParams) {
            queries[key] = value;
        }

        const response: ResponseI = {
            requestHeaders: {},
            data: null,
            queries,
            pathParams: req.params,
            message: "Received the query parameters successfully"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    }),

    rest.delete(`${endPoints.deleteResource}/:userId`, async (req, res, ctx) => {
        const response: ResponseI = {
            requestHeaders: {},
            data: null,
            queries: null,
            pathParams: req.params,
            message: "User deleted successfully"
        }

        return res(
            ctx.status(200),
            ctx.json(response)
        )
    })
]


export interface ResponseI {
    requestHeaders: Record<string, string>,
    message: string,
    data: any,
    pathParams: any,
    queries: any,
}