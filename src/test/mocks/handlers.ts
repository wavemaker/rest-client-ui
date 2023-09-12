import { rest } from "msw";
import testData, { endPoints } from "../testdata";
import { ProviderI } from "../../core/components/ProviderModal";


export const handlers = [
  rest.get(endPoints.getUsers, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: {},
      data: testData.userList,
      queries: null,
      pathParams: null,
      message: "User List fetched successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.postLogin, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: req.headers.all(),
      data: null,
      queries: null,
      pathParams: null,
      message: "Login Successful",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.postCreateAccount, async (req, res, ctx) => {
    const requestObject = await req.json().then((data) => data);
    const response: ResponseI = {
      requestHeaders: {},
      data: requestObject,
      queries: null,
      pathParams: null,
      message: "User account created successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.getVerifyHeader, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: req.headers.all(),
      data: null,
      queries: null,
      pathParams: null,
      message: "Received the headers successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.put(`${endPoints.putResource}/:userId`, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: {},
      data: null,
      queries: null,
      pathParams: req.params,
      message: "User details updated successfully",
    };

    return res(ctx.status(204), ctx.json(response));
  }),

  rest.put(`${endPoints.putResource}/:userId/:event`, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: {},
      data: null,
      queries: null,
      pathParams: req.params,
      message: "User details updated successfully",
    };

    return res(ctx.status(204), ctx.json(response));
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
      pathParams: null,
      message: "Received the query parameters successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.delete(`${endPoints.deleteResource}/:userId`, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: {},
      data: null,
      queries: null,
      pathParams: req.params,
      message: "User deleted successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.proxyServer, async (req, res, ctx) => {
    const requestObject = await req.json().then((data) => data);
    console.log(requestObject);
    const proxyResponse: ProxyResponseI = {
      headers: req.headers.all(),
      responseBody: JSON.stringify(requestObject),
      statusCode: "200",
    };

    return res(ctx.status(200), ctx.json(proxyResponse));
  }),

  rest.get(endPoints.getprovider, async (req, res, ctx) => {
    const requestObject = await req.json().then((data) => data);
    console.log(requestObject);
    const response = [
      {
        providerId: "provider",
        authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
        accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
        clientId:
          "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
        clientSecret: "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",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: null,
        scopes: [],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "provider 2",
        authorizationUrl: "1",
        accessTokenUrl: "1",
        clientId: "1",
        clientSecret: "1",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: null,
        scopes: [],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.listProvider, async (req, res, ctx) => {
    const requestObject = await req.json().then((data) => data);
    console.log(requestObject);
    const response = [
      {
        accessTokenParamName: null,
        accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
        authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
        providerId: "google",
        scopes: [
          {
            name: "Calendar",
            value:
              "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly",
          },
          {
            name: "Google Drive",
            value:
              "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.photos.readonly",
          },
        ],
        sendAccessTokenAs: "HEADER",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),
];

export interface ResponseI {
  requestHeaders: Record<string, string>;
  message: string;
  data: any;
  pathParams: any;
  queries: any;
}

export interface ProxyResponseI {
  responseBody: any;
  statusCode: any;
  headers: any;
}
