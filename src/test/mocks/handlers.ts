import { rest } from "msw";
import testData, { endPoints, responseHeaders } from "../testdata";

export const handlers = [
  rest.get(endPoints.getUsers, (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: {},
      data: testData.userList,
      queries: null,
      pathParams: null,
      message: "User List fetched successfully",
    };

    return res(ctx.set(responseHeaders), ctx.status(200), ctx.json(response));
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
    const error =
      requestObject.endpointAddress === "http://wavemaker.com/proxyerror";
    const proxyResponse: ProxyResponseI = {
      headers: req.headers.all(),
      responseBody: JSON.stringify(requestObject),
      statusCode: 200,
    };

    const actualError =
      requestObject.endpointAddress === "http://wavemaker.com/actualRespError";
    const actualResponse: ProxyResponseI = {
      headers: req.headers.all(),
      responseBody: JSON.stringify(requestObject),
      statusCode: 400,
    };

    return res(
      ctx.status(error ? 400 : actualError ? 200 : 200),
      ctx.json(
        error
          ? "Cannot process the request due to a client error"
          : actualError
          ? actualResponse
          : proxyResponse
      )
    );
  }),

  rest.get(endPoints.badRequest, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json("Cannot process the request due to a client error")
    );
  }),

  rest.post(endPoints.postMultipartData, async (req, res, ctx) => {
    const response: ResponseI = {
      requestHeaders: req.headers.all(),
      data: null,
      queries: null,
      pathParams: null,
      message: "Multipart/form data received successfully",
    };
    return res(ctx.status(200), ctx.json(response));
  }),
  rest.get(endPoints.getprovider, async (req, res, ctx) => {
    const response = [
      {
        providerId: "Provider Sample",
        authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
        accessTokenUrl: "",
        clientId:
          "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
        clientSecret: "",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: false, challengeMethod: "" },
        scopes: [],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "google",
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        accessTokenUrl: "https://oauth2.googleapis.com/token",
        clientId:
          "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
        clientSecret: "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",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: true, challengeMethod: "S256" },
        scopes: [
          {
            name: "profile",
            value: "https://www.googleapis.com/auth/userinfo.profile",
          },
        ],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "linkedin",
        authorizationUrl:
          "https://www.linkedin.com/oauth/native-pkce/authorization",
        accessTokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        clientId: "86rh0h4enp46vz",
        clientSecret: "ABKxJudpga7ONoir",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: true, challengeMethod: "S256" },
        scopes: [
          { name: "profile", value: "profile" },
          { name: "email", value: "email" },
        ],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.listProvider, async (req, res, ctx) => {
    const response = [
      {
        providerId: "amazon",
        authorizationUrl: "https://www.amazon.com/ap/oa",
        accessTokenUrl: "https://api.amazon.com/auth/o2/token",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: null,
        scopes: [{ name: "Basic Profile", value: "profile" }],
      },
      {
        providerId: "google",
        authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
        accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: null,
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
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.listProviderWavemaker, async (req, res, ctx) => {
    const response = [
      {
        providerId: "outlook",
        authorizationUrl:
          "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        accessTokenUrl:
          "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: null,
        scopes: [],
      },
      {
        providerId: "dropbox",
        authorizationUrl: "https://www.dropbox.com/1/oauth2/authorize",
        accessTokenUrl: "https://api.dropbox.com/1/oauth2/token",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: null,
        scopes: [],
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.getproviderWavemaker, async (req, res, ctx) => {
    const response = [
      {
        providerId: "Provider Sample",
        authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
        accessTokenUrl: "",
        clientId:
          "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
        clientSecret: "",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: false, challengeMethod: "" },
        scopes: [],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "google",
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        accessTokenUrl: "https://oauth2.googleapis.com/token",
        clientId:
          "238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com",
        clientSecret: "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",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: true, challengeMethod: "S256" },
        scopes: [
          {
            name: "profile",
            value: "https://www.googleapis.com/auth/userinfo.profile",
          },
        ],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "linkedin",
        authorizationUrl:
          "https://www.linkedin.com/oauth/native-pkce/authorization",
        accessTokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        clientId: "86rh0h4enp46vz",
        clientSecret: "ABKxJudpga7ONoir",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: true, challengeMethod: "S256" },
        scopes: [
          { name: "profile", value: "profile" },
          { name: "email", value: "email" },
        ],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.authorizationUrl, async (req, res, ctx) => {
    const response =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com&redirect_uri=https://www.wavemakeronline.com/remote-studio/11.4.1/services/oauth2/google/callback&response_type=code&state=eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExODA5MTE1MzI2ZGYifQ==&scope=https://www.googleapis.com/auth/userinfo.profile";
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.authorizationURLWavemaker, async (req, res, ctx) => {
    const response =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com&redirect_uri=https://www.wavemakeronline.com/remote-studio/11.4.1/services/oauth2/google/callback&response_type=code&state=eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExODA5MTE1MzI2ZGYifQ==&scope=https://www.googleapis.com/auth/userinfo.profile";
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
