import { rest } from "msw";
import testData, {
  endPoints,
  responseHeaders,
  amazonTokenDataObj,
  amazonUserInfoResponse,
  githubTokenDataObj,
  githubOrGoogleUserInfoResponse,
} from "../testdata";

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
        providerId: "github",
        authorizationUrl: "https://github.com/login/oauth/authorize",
        accessTokenUrl: "https://github.com/login/oauth/access_token",
        clientId: "27a2434232769e833",
        clientSecret: "9c2e770c4f4b0523253604a88228a430eeaea",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: null,
        scopes: [{ name: "User Email", value: "user:email" }],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
      {
        providerId: "Provider Sample",
        authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
        accessTokenUrl: "",
        clientId:
          "238489563324-6r523352dfw43wrgcbhbda.apps.googleusercontent.com",
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
        authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
        accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
        clientId: "google_client_id",
        clientSecret: "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x",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: {
          enabled: true,
          challengeMethod: "S256",
        },
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
        providerId: "amazon",
        authorizationUrl: "https://www.amazon.com/ap/oa",
        accessTokenUrl: "https://api.amazon.com/auth/o2/token",
        clientId: "amzn1.application-oa2-client.5feff3f3teh4g3t38a7398",
        clientSecret: "",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: {
          enabled: true,
          challengeMethod: "S256",
        },
        scopes: [
          {
            name: "profile ",
            value: "profile:user_id",
          },
        ],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.getProviderError, async (req, res, ctx) => {
    const response = [
      {
        providerId: "google",
        authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
        accessTokenUrl: "https://www.googleapis.com/oauth2/v3/token",
        clientId: "error_client_id",
        clientSecret: "JHFOLSKJDID",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: {
          enabled: true,
          challengeMethod: "S256",
        },
        scopes: [
          {
            name: "profile",
            value: "https://www.googleapis.com/auth/userinfo.profile",
          },
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
        providerId: "dropbox",
        authorizationUrl: "https://www.dropbox.com/1/oauth2/authorize",
        accessTokenUrl: "https://api.dropbox.com/1/oauth2/token",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: null,
        scopes: [],
      },
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
        clientId: "63934jds9823.googleusercontent.com",
        clientSecret: "SDFSDWRTRG",
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
        clientId: "98hj783439sjkd83.apps.googleusercontent.com",
        clientSecret: "AKLSDISDKSDIS",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: null,
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
        providerId: "outlook",
        authorizationUrl:
          "https://www.linkedin.com/oauth/native-pkce/authorization",
        accessTokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        clientId: "86rh0h4eeg4h3np46vz",
        clientSecret: "ABKxJud33j35oir",
        sendAccessTokenAs: "HEADER",
        accessTokenParamName: "Bearer",
        oAuth2Pkce: { enabled: true, challengeMethod: "S256" },
        scopes: [{ name: "user", value: "User.Read" }],
        oauth2Flow: "AUTHORIZATION_CODE",
        responseType: "token",
      },
    ];
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.authorizationUrlGoogle, async (req, res, ctx) => {
    const response =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com&redirect_uri=https://www.wavemakeronline.com/remote-studio/11.4.1/services/oauth2/google/callback&response_type=code&state=eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExODA5MTE1MzI2ZGYifQ==&scope=https://www.googleapis.com/auth/userinfo.profile";
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.authorizationURLWavemakerGoogle, async (req, res, ctx) => {
    const response =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com&redirect_uri=https://www.wavemakeronline.com/remote-studio/11.4.1/services/oauth2/google/callback&response_type=code&state=eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExODA5MTE1MzI2ZGYifQ==&scope=https://www.googleapis.com/auth/userinfo.profile";
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.get(endPoints.authorizationUrlProviderTest, async (req, res, ctx) => {
    const response =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com&redirect_uri=https://www.wavemakeronline.com/remote-studio/11.4.1/services/oauth2/google/callback&response_type=code&state=eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExODA5MTE1MzI2ZGYifQ==&scope=https://www.googleapis.com/auth/userinfo.profile";
    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.addprovider, async (req, res, ctx) => {
    const response = {
      requestHeaders: {},
      queries: null,
      pathParams: null,
      message: "Provider saved successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.addproviderWavemaker, async (req, res, ctx) => {
    const response = {
      requestHeaders: {},
      queries: null,
      pathParams: null,
      message: "Provider saved successfully",
    };

    return res(ctx.status(200), ctx.json(response));
  }),

  rest.post(endPoints.addProviderErrorResponse, async (req, res, ctx) => {
    const response = {
      requestHeaders: {},
      queries: null,
      pathParams: null,
      message: "Bad Request",
    };

    return res(ctx.status(400), ctx.json(response));
  }),
  rest.get(endPoints.getproviderErrorResponse, async (req, res, ctx) => {
    const response: any[] = [];
    return res(ctx.status(400), ctx.json(response));
  }),

  rest.get(
    endPoints.authorizationUrlGoogleErrorResponse,
    async (req, res, ctx) => {
      const response = "";
      return res(ctx.status(400), ctx.json(response));
    }
  ),
  rest.get(endPoints.googleUserInfo, async (req, res, ctx) => {
    const requestHeaders = req.headers.all();
    const statusCode =
      requestHeaders["authorization"] ===
      `Bearer google_implicit_flow_accessToken`
        ? 200
        : 401;
    return res(
      ctx.status(statusCode),
      ctx.json(
        statusCode === 200
          ? githubOrGoogleUserInfoResponse
          : "Invalid authorization credentials"
      )
    );
  }),

  rest.get(endPoints.amazonUserInfo, (req, res, ctx) => {
    const requestHeaders = req.headers.all();
    const statusCode =
      requestHeaders["authorization"] ===
        `Bearer ${amazonTokenDataObj.access_token}` &&
      !requestHeaders["accept-language"]
        ? 200
        : 401;
    return res(
      ctx.status(statusCode),
      ctx.json(
        statusCode === 200
          ? amazonUserInfoResponse
          : "Invalid authorization credentials"
      )
    );
  }),

  rest.post(endPoints.amazonAccessTokenUrl, async (req, res, ctx) => {
    const requestObjAsText: string = await req.text().then((data) => data);
    const statusCode = requestObjAsText.includes(`code=success`) ? 200 : 401;
    return res(
      ctx.status(statusCode),
      ctx.json(statusCode === 200 ? amazonTokenDataObj : "Invalid access code")
    );
  }),

  rest.get(endPoints.githubUserInfo, async (req, res, ctx) => {
    const requestHeaders = req.headers.all();
    const statusCode =
      requestHeaders["authorization"] ===
      `Bearer ${githubTokenDataObj.access_token}`
        ? 200
        : 401;
    return res(
      ctx.status(statusCode),
      ctx.json(
        statusCode === 200
          ? githubOrGoogleUserInfoResponse
          : "Invalid authorization credentials"
      )
    );
  }),

  rest.get(endPoints.proxy, (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post(endPoints.settingsUpload, (req, res, ctx) => {
    const response = {
      serviceId: "typicode7",
      swagger: {
        swagger: "2.0",
        info: {
          version: "2.0",
          "x-WM-API_ID": "539bcfcd-d39e-4e23-9f6e-3c420db3840d",
          "x-WM-SERVICE_ID": "typicode7",
          "x-WM-SERVICE_TYPE": "RestService",
        },
        host: "jsonplaceholder.typicode.com",
        basePath: "",
        tags: [
          {
            name: "RestServiceVirtualController",
            description: "Rest service swagger documentation",
          },
        ],
        schemes: ["https"],
        paths: {
          "/posts/3": {
            post: {
              tags: ["RestServiceVirtualController"],
              operationId: "RestServiceVirtualController-invoke",
              consumes: ["application/json"],
              produces: ["application/json"],
              parameters: [
                {
                  name: "Accept",
                  in: "header",
                  description: "Accept",
                  required: false,
                  type: "string",
                  items: {
                    type: "string",
                  },
                  "x-WM-EDITABLE": true,
                  "x-WM-FULLY_QUALIFIED_TYPE": "java.lang.String",
                },
              ],
              responses: {
                "200": {
                  description: "Success",
                  schema: {
                    $ref: "#/definitions/RootResponse",
                  },
                },
              },
              "x-WM-METHOD_NAME": "invoke",
              "x-WM-ACCESS_SPECIFIER": "APP_ONLY",
            },
            "x-WM-BASE_PATH": "/posts/3",
            "x-WM-TAG": "RestServiceVirtualController",
            "x-WM-RELATIVE_PATH": "",
          },
        },
        definitions: {
          RootResponse: {
            "x-WM-FULLY_QUALIFIED_NAME": "RootResponse",
            "x-WM-TAGS": ["RestServiceVirtualController"],
          },
        },
      },
      filteredOperationId: null,
      filteredEndPointId: null,
      prependServiceIdInModelsFullyQualifiedType: true,
      proxySettings: null,
      httpRequestDetails: {
        endpointAddress: "https://jsonplaceholder.typicode.com/posts/3",
        method: "POST",
        headers: {
          Accept: ["2023-11-10"],
        },
        redirectEnabled: true,
        requestBody: "",
        queryParams: null,
        authDetails: null,
        contentType: "application/json",
        multiParamInfoList: null,
        sampleHttpResponseDetails: {
          statusCode: 404,
          headers: {
            Date: ["Wed, 15 Nov 2023 07:22:11 GMT"],
            "Content-Type": ["application/json; charset=utf-8"],
            "Content-Length": ["2"],
            Connection: ["keep-alive"],
            "Report-To": [
              '{"group":"heroku-nel","max_age":3600,"endpoints":[{"url":"https://nel.heroku.com/reports?ts=1700032931&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&s=odMFvzBFNelPMUkrSMqY1WCVXF9UZbHifi1Qd9KTolI%3D"}]}',
            ],
            "Reporting-Endpoints": [
              "heroku-nel=https://nel.heroku.com/reports?ts=1700032931&sid=e11707d5-02a7-43ef-b45e-2cf4d2036f7d&s=odMFvzBFNelPMUkrSMqY1WCVXF9UZbHifi1Qd9KTolI%3D",
            ],
            Nel: [
              '{"report_to":"heroku-nel","max_age":3600,"success_fraction":0.005,"failure_fraction":0.05,"response_headers":["Via"]}',
            ],
            "X-Powered-By": ["Express"],
            "X-Ratelimit-Limit": ["1000"],
            "X-Ratelimit-Remaining": ["999"],
            "X-Ratelimit-Reset": ["1700032949"],
            Vary: ["Origin, X-HTTP-Method-Override, Accept-Encoding"],
            "Access-Control-Allow-Credentials": ["true"],
            "Cache-Control": ["no-cache"],
            Pragma: ["no-cache"],
            Expires: ["-1"],
            "X-Content-Type-Options": ["nosniff"],
            Etag: ['W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"'],
            Via: ["1.1 vegur"],
            "CF-Cache-Status": ["DYNAMIC"],
            Server: ["cloudflare"],
            "CF-RAY": ["8265bddce8e807d0-IAD"],
            "alt-svc": ['h3=":443"; ma=86400'],
          },
          responseBody: "{}",
          convertedResponse: null,
        },
      },
      originalSpecFileId: null,
    };
    return res(ctx.set(responseHeaders), ctx.status(200), ctx.json(response));
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
