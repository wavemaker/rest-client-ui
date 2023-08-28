import { restImportConfigI } from "../core/components/WebServiceModal";

interface mockEmptyPropsI {
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
        password: "Ajbjhbs24"
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
    ]
}

export const HTTP_METHODS = ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"]

export const TOAST_MESSAGES = {
    EMPTY_URL: "Please provide a valid URL",
    EMPTY_BASIC_AUTH_USERNAME: "Please enter a username for basic authentication",
    EMPTY_BASIC_AUTH_PASSWORD: "Please enter a password for basic authentication"
}

export const endPoints = {
    getUsers: "https://wavemaker.unittest.com/users",
    postLogin: "https://wavemaker.unittest.com/login",
    postCreateAccount: "https://wavemaker.unittest.com/create",
    getVerifyHeader: "https://wavemaker.com/header",
    putResource: "https://wavemaker.com/update",
    getQueryParams: "https://wavemaker.com/query",
    deleteResource: "https://wavemaker.com/delete"
}

export const restImportConfig: restImportConfigI = {
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
}
export const mockEmptyProps: mockEmptyPropsI = {
    language: 'en',
    restImportConfig
};


// Interfaces
export interface HeaderParamI {
    name: string,
    type: string,
    value: string
}
export interface Query {
    name: string,
    type: string,
    value: string,
}

export interface PathParamI {
    name: string,
    type: string,
    value: string
}
interface User {
    id: number,
    fullName: string,
    jobTitle: string,
    gender: string,
    userName: string,
    password: string
}


interface UserList {
    data: User[]
}

interface TestData {
    user: User,
    userList: UserList,
    headerParams: HeaderParamI[],
    queries: Query[],
    pathParams: PathParamI[]
}

export type GENERAL_PARAM_STRUCTURE = HeaderParamI | Query | PathParamI

export default testData;
