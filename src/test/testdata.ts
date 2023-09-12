import { AxiosResponse } from "axios";
import { restImportConfigI } from "../core/components/WebServiceModal";

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
        password: "AJHjhadb"
      },
      {
        id: 2,
        fullName: "Gordy",
        jobTitle: "GIS Technical Architect",
        gender: "Male",
        userName: "ghawarden1",
        password: "kne3ids"
      },
      {
        id: 3,
        fullName: "Estelle",
        jobTitle: "Senior Financial Analyst",
        gender: "Female",
        userName: "equinnell2",
        password: "asbcahsHJ"
      },
      {
        id: 4,
        fullName: "Mufi",
        jobTitle: "Food Chemist",
        gender: "Female",
        userName: "mneely3",
        password: "HbdehdaJSad"
      }
    ]
  },
  //Use the exact name , type appears in the UI
  headerParams: [
    {
      name: "Accept-Language",
      type: "String",
      value: "en-IN"
    }, {
      name: "Accept",
      type: "String",
      value: "application/json;q=0.8, application/xml;q=1.0"
    },
    {
      name: "Authorization",
      type: "String",
      value: "INbubinBUCYVB6rcubCHJ"
    }
  ],
  queries: [
    {
      name: "Sort",
      type: "String",
      value: "ascending"
    }, {
      name: "page",
      type: "String",
      value: "2"
    }, {
      name: "count",
      type: "String",
      value: "50"
    }
  ],
  pathParams: [
    {
      name: "userId",
      type: "String",
      value: "02"
    }, {
      name: "event",
      type: "String",
      value: "34"
    }
  ],
}

export const responseHeaders = {
  'accept-language': 'en-US',
  'content-encoding': 'gzip',
  'content-length': '40032',
}

export const HTTP_METHODS = ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"]
export const REQUEST_TABS = ["AUTHORIZATION", "HEADER PARAMS", "BODY PARAMS", "QUERY PARAMS", "PATH PARAMS"]
export const RESPONSE_TABS = ["RESPONSE BODY", "RESPONSE HEADER", "RESPONSE STATUS"]
export const AUTH_OPTIONS = ["None", "Basic", "OAuth 2.0"]
export const ERROR_MESSAGES = {
  EMPTY_URL: "Please provide a valid URL",
  EMPTY_BASIC_AUTH_USERNAME: "Please enter a username for basic authentication",
  EMPTY_BASIC_AUTH_PASSWORD: "Please enter a password for basic authentication",
  EMPTY_PATH_PARAM_VALUE: "Please provide the path parameter value",
  DUPLICATE_QUERY_PARAM: "Queries cannot have duplicates, removed the dupicates"
}
export const HEADER_NAME_OPTIONS = [
  'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Authorization', 'Content-Length', 'Content-Type', 'Cookie', 'Origin', 'Referer', 'User-Agent'
]
export const HEADER_TYPE_OPTIONS = [
  'Boolean', 'Date', 'Date Time', 'Double', 'Float', 'Integer', 'Long', 'String', 'Current Date', 'Current Date Time', 'Current Time', 'Current Timestamp', 'LoggedIn UserId', 'LoggedIn Username', 'Option 1'
]

export const CONTENT_TYPE = [
  "application/json", "application/octet-stream", "application/pdf", "application/x-www-form-urlencoded", "application/xml", "multipart/form-data", "text/html", "text/plain"
]

export const SUBHEADER_UNDER_TABS = ["Name", "Type", "Test Value", "Actions"]

export const endPoints = {
  getUsers: "https://wavemaker.unittest.com/users",
  postLogin: "https://wavemaker.unittest.com/login",
  postCreateAccount: "https://wavemaker.unittest.com/create",
  getVerifyHeader: "https://wavemaker.com/header",
  putResource: "https://wavemaker.com/update",
  getQueryParams: "https://wavemaker.com/query",
  deleteResource: "https://wavemaker.com/delete",
  proxyServer: "http://localhost:5000/restimport",
  invalidURL: "http://invalid$url",
  badRequest: "http://wavemaker.com/badrequest",
  postMultipartData: "http://wavemaker.com/multipart",
  duplicatePathParams: "http://wavemaker.com/{path}/name/{path}",
  emptyPathParam: "http://wavemaker.com/{}/name",
  duplicateQueryParams: "http://wavemaker.com/query?id=2&id=5",
  oneQueryParam: "http://wavemaker.com/query?id=2",
  invalidQueryParam: "http://wavemaker.com/query?id="
}

export const wavemakerMoreInfoLink = "https://docs.wavemaker.com/learn/app-development/services/web-services/rest-services/"

export const emptyConfig: restImportConfigI = {
  proxy_conf: {
    base_path: "http://localhost:5000",
    proxy_path: "/restimport",
    list_provider: "/get-default-provider",
    getprovider: "/getprovider",
    addprovider: "/addprovider",
    authorizationUrl: "/authorizationUrl",
  },
  default_proxy_state: "ON", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
  oAuthConfig: {
    base_path: "https://www.wavemakeronline.com/studio/services",
    proxy_path: "",
    project_id: "",
    list_provider: "/oauth2/providers/default",
    getprovider: "", // /projects/{projectID}/oauth2/providers
    addprovider: "", // /projects/{projectID}/oauth2/providers
    authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
  },
  error: {
    errorFunction: (msg: string) => {
      alert(msg);
    },
    errorMessageTimeout: 5000,
    errorMethod: "default",
  },
  handleResponse: (response?: AxiosResponse) => {
  },
  hideMonacoEditor: (value: boolean) => {
  }
}
export const mockEmptyProps: mockPropsI = {
  language: 'en',
  restImportConfig: emptyConfig
};

const configWithData: restImportConfigI = {
  url: "https://wavemaker.com/users/{location}?sort=alpha",
  httpMethod: "POST",
  useProxy: true,
  httpAuth: "BASIC",
  bodyParams: "{name:Ardella}",
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
    base_path: "http://localhost:5000",
    proxy_path: "/restimport",
    list_provider: "/get-default-provider",
    getprovider: "/getprovider",
    addprovider: "/addprovider",
    authorizationUrl: "/authorizationUrl",
  },
  default_proxy_state: "ON", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
  oAuthConfig: {
    base_path: "https://www.wavemakeronline.com/studio/services",
    proxy_path: "",
    project_id: "",
    list_provider: "/oauth2/providers/default",
    getprovider: "", // /projects/{projectID}/oauth2/providers
    addprovider: "", // /projects/{projectID}/oauth2/providers
    authorizationUrl: "", // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
  },
  error: {
    errorFunction: (msg) => {
      alert(msg)
    },
    errorMethod: "toast",
    errorMessageTimeout: 5000
  },
  handleResponse: (response?: AxiosResponse) => {
  },
  hideMonacoEditor: (value: boolean) => {
  }
}

export const preLoadedProps: mockPropsI = {
  language: 'en',
  restImportConfig: configWithData
}

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


export function getCustomizedError(errMethod: typeof emptyConfig.error.errorMethod, errFunction?: typeof emptyConfig.error.errorFunction) {
  const data: mockPropsI = {
    language: 'en',
    restImportConfig: { ...emptyConfig, error: { ...emptyConfig.error, errorMethod: errMethod, errorFunction: errMethod === 'customFunction' ? errFunction! : (msg) => console.log("custom function") } }
  }
  return data
}