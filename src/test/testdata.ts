import { AxiosRequestConfig, AxiosResponse } from "axios";
import { restImportConfigI } from "../core/components/RestImport";

export interface mockPropsI {
  language: string;
  restImportConfig: restImportConfigI;
}

const testData: TestData = {
  // To create an account by sending POST request
  user: {
    id: 1,
    fullName: "Terza",
    jobTitle: "Junior Executive",
    gender: "Female",
    userName: "twoehler0",
    password: "Ajbjhbs24",
  },

  userList: {
    data: [
      {
        id: 1,
        fullName: "Jenica",
        jobTitle: "Legal Assistant",
        gender: "Female",
        userName: "jfrears0",
        password: "AJHjhadb",
      },
      {
        id: 2,
        fullName: "Gordy",
        jobTitle: "GIS Technical Architect",
        gender: "Male",
        userName: "ghawarden1",
        password: "kne3ids",
      },
      {
        id: 3,
        fullName: "Estelle",
        jobTitle: "Senior Financial Analyst",
        gender: "Female",
        userName: "equinnell2",
        password: "asbcahsHJ",
      },
      {
        id: 4,
        fullName: "Mufi",
        jobTitle: "Food Chemist",
        gender: "Female",
        userName: "mneely3",
        password: "HbdehdaJSad",
      },
    ],
  },
  //Use the exact name , type appears in the UI
  headerParams: [
    {
      name: "Accept-Language",
      type: "String",
      value: "en-IN",
    },
    {
      name: "Accept",
      type: "String",
      value: "application/json;q=0.8, application/xml;q=1.0",
    },
    {
      name: "Authorization",
      type: "String",
      value: "INbubinBUCYVB6rcubCHJ",
    },
  ],
  queries: [
    {
      name: "Sort",
      type: "String",
      value: "ascending",
    },
    {
      name: "page",
      type: "String",
      value: "2",
    },
    {
      name: "count",
      type: "String",
      value: "50",
    },
  ],
  pathParams: [
    {
      name: "userId",
      type: "String",
      value: "02",
    },
    {
      name: "event",
      type: "String",
      value: "34",
    },
  ],
};

export const githubOrGoogleUserInfoResponse = {
  id: "1024312046741520124",
  name: "John Doe",
  given_name: "John",
  family_name: "Doe",
  picture: "https://lh3.gitgoogleusercontent.com/a/ACg8ogAJ47YWegWNFpw=s96-c",
  locale: "en",
};
export const amazonUserInfoResponse = {
  id: "1024312046741520124",
};

export const githubTokenDataObj = {
  access_token: "github-access-token",
  expires_in: 3599,
  scope: "https://www.githubapis.com/auth/userinfo.profile",
  token_type: "Bearer",
  id_token: "github-token-id",
};
export const eventMessage = {
  tokenData: JSON.stringify(githubTokenDataObj),
  code: "",
  error: "",
};

export const getPKCEeventMsg = (success: boolean) => ({
  tokenData: "",
  code: `${success ? "success" : "failure"}-pkce-access-code`,
  error: "",
});
export const amazonTokenDataObj = {
  access_token: "amazon-access-token",
  expires_in: 3599,
  scope: "https://www.amazonapis.com/auth/userinfo.profile",
  token_type: "Bearer",
  id_token: "amazon-token-id",
};

export const responseHeaders = {
  "accept-language": "en-US",
  "content-encoding": "gzip",
  "content-length": "40032",
};

export const HTTP_METHODS = ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"];
export const REQUEST_TABS = [
  "AUTHORIZATION",
  "HEADER PARAMS",
  "BODY PARAMS",
  "QUERY PARAMS",
  "PATH PARAMS",
];
export const RESPONSE_TABS = [
  "RESPONSE BODY",
  "RESPONSE HEADER",
  "RESPONSE STATUS",
];
export const AUTH_OPTIONS = ["None", "Basic", "OAuth 2.0"];
export const ERROR_MESSAGES = {
  EMPTY_URL: "Please provide a valid URL",
  EMPTY_BASIC_AUTH_USERNAME: "Please enter a username for basic authentication",
  EMPTY_BASIC_AUTH_PASSWORD: "Please enter a password for basic authentication",
  EMPTY_PATH_PARAM_VALUE: "Please provide the path parameter value",
  DUPLICATE_QUERY_PARAM:
    "Queries cannot have duplicates, removed the dupicates",
  PROVIDERID_ALERT: "Provider Id is required ",
  AUTHORIZATIONURL_ALERT: "Authorization URL is required ",
  ACCESSTOKEN_ALERT: "Access Token URL is required ",
  CLIENTID_ALERT: "Client ID is required ",
  CLIENTSECRET_ALERT: "Client Secret is required ",
  ALREADY_EXIST: 'Provider ("google") already exists! ',
  SUCCESS_MSG: "Saved Successfully",
};
export const HEADER_NAME_OPTIONS = [
  "Accept",
  "Accept-Charset",
  "Accept-Encoding",
  "Accept-Language",
  "Authorization",
  "Content-Length",
  "Content-Type",
  "Cookie",
  "Origin",
  "Referer",
  "User-Agent",
];
export const HEADER_TYPE_OPTIONS = [
  "Boolean",
  "Date",
  "Date Time",
  "Double",
  "Float",
  "Integer",
  "Long",
  "String",
  "Current Date",
  "Current Date Time",
  "Current Time",
  "Current Timestamp",
  "LoggedIn UserId",
  "LoggedIn Username",
];

export const CONTENT_TYPE = [
  "application/json",
  "application/octet-stream",
  "application/pdf",
  "application/x-www-form-urlencoded",
  "application/xml",
  "multipart/form-data",
  "text/html",
  "text/plain",
];

export const SUBHEADER_UNDER_TABS = ["Name", "Type", "Test Value", "Actions"];

export const SEND_ACCESSTOKEN = ["Header", "Query"];

export const endPoints = {
  getUsers: "https://wavemaker.unittest.com/users",
  postLogin: "https://wavemaker.unittest.com/login",
  postCreateAccount: "https://wavemaker.unittest.com/create",
  getVerifyHeader: "https://wavemaker.com/header",
  putResource: "https://wavemaker.com/update",
  getQueryParams: "https://wavemaker.com/query",
  deleteResource: "https://wavemaker.com/delete",
  proxyServer: "http://localhost:4000/restimport",
  invalidURL: "http://invalid$url",
  badRequest: "http://wavemaker.com/badrequest",
  postMultipartData: "http://wavemaker.com/multipart",
  duplicatePathParams: "http://wavemaker.com/{path}/name/{path}",
  emptyPathParam: "http://wavemaker.com/{}/name",
  duplicateQueryParams: "https://wavemaker.com/query?id=2&id=5",
  oneQueryParam: "http://wavemaker.com/query?id=2",
  invalidQueryParam: "http://wavemaker.com/query?id=",
  listProvider: "http://localhost:4000/get-default-provider",
  getprovider: "http://localhost:4000/getprovider",
  authorizationUrlGoogle: "http://localhost:4000/authorizationUrl/google",
  listProviderWavemaker:
    "https://www.wavemakeronline.com/studio/services/oauth2/providers/default",
  getproviderWavemaker:
    "https://www.wavemakeronline.com/studio/services/projects/oauth2/providers",
  authorizationURLWavemakerGoogle:
    "https://www.wavemakeronline.com/studio/services/projects/oauth2/authorizationUrl/google",
  addprovider: "http://localhost:4000/addprovider",
  authorizationUrlProviderTest:
    "http://localhost:4000/authorizationUrl/ProviderTest",
  authorizationUrlWavemakerProviderTest:
    "https://www.wavemakeronline.com/studio/services/projects/oauth2/authorizationUrl/ProviderTest",
  addproviderWavemaker:
    "https://www.wavemakeronline.com/studio/services/projects/oauth2/addprovider",
  addProviderErrorResponse: "http://localhost:4000/addErrorproviders",
  getproviderErrorResponse: "http://localhost:4000/getproviderError",
  authorizationUrlGoogleErrorResponse:
    "http://localhost:4000/authorizationUrlError/google",
  googleUserInfo: "https://www.googleapis.com/oauth2/v1/userinfo",
  amazonUserInfo: "https://api.amazon.com/user/profile",
  amazonAccessTokenUrl: "https://api.amazon.com/auth/o2/token",
  githubUserInfo: "https://api.github.com/user",
  getProviderError: "http://localhost:4000/getprovider_error",
  proxy: "http://localhost:4000",
  settingsUpload: `http://localhost:4000/services/projects/WMPRJ2c91808889a96400018a26070b7b2e68/restservice/settings`,
};

export const wavemakerMoreInfoLink =
  "https://docs.wavemaker.com/learn/app-development/services/web-services/rest-services/";

export const emptyConfig: restImportConfigI = {
  proxy_conf: {
    base_path: "http://localhost:4000/",
    proxy_path: "restimport",
    list_provider: "get-default-provider",
    getprovider: "getprovider",
    settingsUpload: "",
    addprovider: "addprovider",
    authorizationUrl: "authorizationUrl",
  },
  projectId: "WMPRJ2c91808889a96400018a26070b7b2e68",
  error: {
    errorFunction: (msg: string) => {
      alert(msg);
    },
    errorMessageTimeout: 5000,
    errorMethod: "default",
  },
  handleResponse: (requset: AxiosRequestConfig, response?: AxiosResponse) => { },
  hideMonacoEditor: (value: boolean) => { },
  getServiceName(value: string) { },
  getUseProxy(value) { 
    return value
  },
  setServiceName: "",
  setResponseHeaders: { namespace: "test" },
  viewMode: false,
  monacoEditorURL: "",
};
export const mockEmptyProps: mockPropsI = {
  language: "en",
  restImportConfig: emptyConfig,
};

const configWithData: restImportConfigI = {
  url: "https://wavemaker.com/users/{location}?sort=alpha",
  httpMethod: "POST",
  useProxy: true,
  httpAuth: { type: "NONE", providerId: "" },
  bodyParams: "{name:Ardella}",
  projectId: "WMPRJ2c91808889a96400018a26070b7b2e68",
  userName: "Ardella",
  userPassword: "HBubkbai89",
  headerParams: [
    {
      name: "Authorization",
      type: "string",
      value: "Bearer ibYkjnuIBNkbhk782b",
    },
  ],
  multipartParams: [
    {
      name: "post",
      type: "file",
      value: "fe",
    },
  ],
  contentType: "multipart/form-data",
  proxy_conf: {
    base_path: "http://localhost:4000/",
    proxy_path: "restimport",
    list_provider: "get-default-provider",
    getprovider: "getprovider_error",
    addprovider: "addprovider",
    settingsUpload: "",
    authorizationUrl: "authorizationUrl",
  },
  error: {
    errorFunction: (msg) => {
      alert(msg);
    },
    errorMethod: "toast",
    errorMessageTimeout: 5000,
  },
  handleResponse: (requset: AxiosRequestConfig, response?: AxiosResponse) => { },
  hideMonacoEditor: (value: boolean) => { },
  getServiceName(value: string) { },
  getUseProxy(value) {
    console.log(value)
    return value
  },
  setServiceName: "",
  viewMode: false,
  setResponseHeaders: { namespace: "test" },
  monacoEditorURL: "",
};

export const preLoadedProps: mockPropsI = {
  language: "en",
  restImportConfig: configWithData,
};

// Interfaces
export interface HeaderParamI {
  name: string;
  type: string;
  value: string;
}
export interface QueryI {
  name: string;
  type: string;
  value: string;
}

export interface PathParamI {
  name: string;
  type: string;
  value: string;
}
interface User {
  id: number;
  fullName: string;
  jobTitle: string;
  gender: string;
  userName: string;
  password: string;
}

interface UserList {
  data: User[];
}

interface TestData {
  user: User;
  userList: UserList;
  headerParams: HeaderParamI[];
  queries: QueryI[];
  pathParams: PathParamI[];
}

export type GENERAL_PARAM_STRUCTURE = HeaderParamI | QueryI | PathParamI;

export default testData;

export function getCustomizedProps(
  errMethod?: typeof emptyConfig.error.errorMethod,
  errFunction?: typeof emptyConfig.error.errorFunction,
  getProviderUrl?: string
) {
  const data: mockPropsI = {
    language: "en",
    restImportConfig: {
      ...emptyConfig,
      proxy_conf: {
        ...emptyConfig.proxy_conf,
        getprovider: getProviderUrl || emptyConfig.proxy_conf.getprovider,
      },
      error: {
        ...emptyConfig.error,
        errorMethod: errMethod || "default",
        errorFunction:
          errMethod === "customFunction"
            ? errFunction!
            : (msg) => console.log("custom function"),
      },
    },
  };
  return data;
}
