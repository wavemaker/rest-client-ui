import { Component, OnInit } from '@angular/core';
import { AxiosResponse } from 'axios'

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
  ngOnInit(): void {
    const reactUI = RestImport({
      dom_id: '#full-screen',
      language: 'en',
      config: {
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
          proxy_path: '',
          project_id: '',
          list_provider: '/oauth2/providers/default',
          getprovider: '', // /projects/{projectID}/oauth2/providers
          addprovider: '', // /projects/{projectID}/oauth2/providers
          authorizationUrl: '', // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
        },
        error: {
          errorFunction: (msg: string, response?: AxiosResponse) => {
            alert(msg);
            console.log(response)
          },
          errorMethod: 'customFunction',
          errorMessageTimeout: 5000,
        },
        handleResponse: (response: { data: any }) => {
          this.code = JSON.stringify(response?.data, null, 2);
        },
        hideMonacoEditor: (value: any) => {
          this.hideMonacoEditor = value;
        },
      },
    });
  }
}
