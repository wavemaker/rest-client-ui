import { restImportConfigI } from "../core/components/WebServiceModal";

interface mockEmptyPropsI {
  language: string;
  restImportConfig: restImportConfigI;
}

const testData: TestData = {
  // To create an account by sending POST request
  user: {
    id: 105,
    fullName: "Britt Pichan",
    jobTitle: "VP Accounting",
    gender: "Male",
  },
  // To assert Request headers are properly set when making the http request
  headerParams: {
    label: "Accept-Language",
    type: "String",
    header: "accept-language",
    value: "en-IN",
  },
  queryParams: {
    sort: "ascending",
    page: "2",
  },
  totalUsers: {
    data: [
      {
        id: 1,
        fullName: "Britt Pichan",
        jobTitle: "VP Accounting",
        gender: "Male",
      },
      {
        id: 2,
        fullName: "Shirleen Swinnerton",
        jobTitle: "VP Product Management",
        gender: "Female",
      },
      {
        id: 3,
        fullName: "Andros Brewett",
        jobTitle: "Cost Accountant",
        gender: "Male",
      },
      {
        id: 4,
        fullName: "Gladys Brittles",
        jobTitle: "Analyst Programmer",
        gender: "Female",
      },
    ],
  },
};

export const endPoints = {
  getUsers: "https://wavemaker.unittest.com/users",
  postLogin: "https://wavemaker.unittest.com/login",
  postCreateAccount: "https://wavemaker.unittest.com/create",
  postVerifyHeader: "https://wavemaker.com/header",
  putResource: "https://wavemaker.com/update",
  getQueryParams: "https://wavemaker.com/query",
  deleteResource: "https://wavemaker.com/delete",
};

export const mockEmptyProps: mockEmptyPropsI = {
  language: "en",
  restImportConfig: {
    proxy_conf: {
      base_path: "http://localhost:5000",
      proxy_path: "/restimport",
      list_provider: "/get-default-provider",
      getprovider: "/getprovider",
      addprovider: "/addprovider",
      authorizationUrl: "/authorizationUrl",
    },
    default_proxy_state: "ON", // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
    state_val : "eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==",
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
      errorMethod: "toast",
    },
  },
};

// Interfaces
export interface QueryParamsI {
  sort: string;
  page: string;
  [key: string]: string; // Index signature allowing any string property
}

interface HeaderParams {
  label: string;
  type: string;
  header: string;
  value: string;
}
interface TotalUsers {
  data: User[];
}

interface User {
  id: number;
  fullName: string;
  jobTitle: string;
  gender: string;
}

interface TestData {
  queryParams: QueryParamsI;
  user: User;
  headerParams: HeaderParams;
  totalUsers: TotalUsers;
}
export default testData;
