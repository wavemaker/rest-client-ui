import { Component, OnInit } from '@angular/core';

declare const RestImport: any;

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
})
export class FullscreenComponent implements OnInit {
  ngOnInit(): void {
    const reactUI = RestImport({
      dom_id: '#rest-import-ui',
      language: 'en',
      config: {
        proxy_conf: {
          base_path: 'http://localhost:4000',
          proxy_path: '/restimport',
          list_provider: '/get-default-provider',
          getprovider: '/getprovider',
          addprovider: '/addprovider',
        },
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
          errorFunction: (msg: string) => {
<<<<<<< HEAD
            alert(msg);
          },
          errorMethod: 'toast',
          errorMessageTimeout: 5000,
        },
=======
            alert(msg)
          },
          errorMethod: "default",
          errorMessageTimeout: 5000
        }
>>>>>>> ab65688857d258dafc36c7ded9eb66afefc850b1
      },
    });
  }
}
