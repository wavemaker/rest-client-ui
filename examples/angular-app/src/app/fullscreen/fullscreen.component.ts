import { Component, OnInit } from '@angular/core';
import { AxiosResponse } from 'axios';

declare const RestImport: any;

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
})
export class FullscreenComponent implements OnInit {
  public editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    domReadOnly: true,
    readOnly: true,
  };
  public code: string = '';
  public hideMonacoEditor: boolean = false;
  restDataW = {
    url: 'https://jsonplaceholder.typicode.com/posts/{id}',
    httpMethod: 'POST',
    useProxy: true,
    httpAuth: 'BASIC',
    headerParams: [
      {
        name: 'new',
        type: 'DATE',
        value: 'vew',
      },
    ],
    bodyParams: '{userName:password}',
    userName: 'userName',
    userPassword: 'userPassword',
    contentType: 'multipart/form-data',
    proxy_conf: {
      base_path: 'http://localhost:4000',
      proxy_path: '/restimport',
      list_provider: '/get-default-provider',
      getprovider: '/getprovider',
      addprovider: '/addprovider',
      authorizationUrl: '/authorizationUrl',
    },
    state_val:
      'eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==',
    default_proxy_state: 'ON', // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
    oAuthConfig: {
      base_path: 'https://www.wavemakeronline.com/studio/services',
      project_id: '',
      list_provider: '/oauth2/providers/default',
      getprovider: '', // /projects/{projectID}/oauth2/providers
      addprovider: '', // /projects/{projectID}/oauth2/providers
      authorizationUrl: '', // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
    },
    error: {
      errorFunction: (msg: any, response: any) => {
        alert(msg);
        console.log(response);
      },
      errorMethod: 'default',
      errorMessageTimeout: 5000,
    },
    handleResponse: (response: { data: any }) => {
      console.log(response?.data);
    },
    hideMonacoEditor: (value: any) => {},
  };
  restDataWO = {
    url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
    httpMethod: 'POST',
    useProxy: true,
    httpAuth: 'BASIC',
    bodyParams: '{userName:password}',
    userName: 'userName',
    userPassword: 'userPassword',
    contentType: 'multipart/form-data',
    proxy_conf: {
      base_path: 'http://localhost:4000',
      proxy_path: '/restimport',
      list_provider: '/get-default-provider',
      getprovider: '/getprovider',
      addprovider: '/addprovider',
      authorizationUrl: '/authorizationUrl',
    },
    state_val:
      'eyJtb2RlIjoiZGVzaWduVGltZSIsInByb2plY3RJZCI6IldNUFJKMmM5MTgwODg4OWE5NjQwMDAxOGExYzE0YjBhNzI4YTQifQ==',
    default_proxy_state: 'ON', // Execute the proxy configuration if the value of default_proxy_state is set to "ON"; otherwise, execute the OAuth configuration.
    oAuthConfig: {
      base_path: 'https://www.wavemakeronline.com/studio/services',
      project_id: '',
      list_provider: '/oauth2/providers/default',
      getprovider: '', // /projects/{projectID}/oauth2/providers
      addprovider: '', // /projects/{projectID}/oauth2/providers
      authorizationUrl: '', // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
    },
    error: {
      errorFunction: (msg: any, response: any) => {
        alert(msg);
        console.log(response);
      },
      errorMethod: 'default',
      errorMessageTimeout: 5000,
    },
    handleResponse: (response: { data: any }) => {
      console.log(response?.data);
    },
    hideMonacoEditor: (value: any) => {},
  };
  ngOnInit(): void {
    const reactUI = RestImport({
      dom_id: '#full-screen',
      language: 'en',
      config: this.restDataW,
    });
  }
}
