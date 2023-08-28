import { rest } from 'msw'
import testData, { endPoints, QueryParamsI } from '../testdata'

export const handlers = [
    rest.get(endPoints.getUsers, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testData.totalUsers))
    }),

    rest.post(endPoints.postLogin, (req, res, ctx) => {
        console.log(req.headers.all())
        return res(
            ctx.status(200),
            ctx.json({
                requestHeader: req.headers.all(),
                body: "Login Successful"
            })
        )
    }),

    rest.post(endPoints.postCreateAccount, async (req, res, ctx) => {
        let requestObject = null
        requestObject = await req.json().then(data => data)
        return res(
            ctx.status(200),
            ctx.json({
                request: requestObject,
                body: "User account created successfully"
            })
        )
    }),

    rest.post(endPoints.postVerifyHeader, async (req, res, ctx) => {
        const requestBody = await req.json().then(data => data)

        return res(
            ctx.status(200),
            ctx.json({
                requestHeaders: req.headers.all(),
                requestBody,
                message: "Received the headers successfully"
            })
        )
    }),
    rest.put(`${endPoints.putResource}/:userId`, async (req, res, ctx) => {
        const { userId } = req.params
        return res(
            ctx.status(204),
            ctx.json({
                userId,
                message: "User details updated successfully"
            })
        )
    }),

    rest.get(endPoints.getQueryParams, (req, res, ctx) => {
        let queries: any = {};
        for (const [key, value] of req.url.searchParams) {
            queries[key] = value;
        }
        return res(
            ctx.status(200),
            ctx.json({
                queries,
                message: "Received the query parameters successfully"
            }
            )
        )
    }),

    rest.delete(`${endPoints.deleteResource}/:userId`, async (req, res, ctx) => {
        const { userId } = req.params
        return res(
            ctx.status(200),
            ctx.json({
                userId,
                message: "User deleted successfully"
            })
        )
    })
]
