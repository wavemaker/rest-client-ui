import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare const RestImport: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  @Input() configtype: boolean | undefined;
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    if (this.configtype) {
      RestImport({
        dom_id: '#rest-import-ui-modal',
        language: 'en',
        config: {
          url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=false',
          httpMethod: 'POST',
          useProxy: true,
          httpAuth: 'BASIC',
          bodyParams: '{userName:password}',
          userName: 'userName',
          userPassword: 'userPassword',
          headerParams: [
            {
              name: 'New',
              type: 'string',
              value: 'application',
            },
          ],
          multipartParams: [
            {
              name: 'post',
              type: 'file',
              value: 'fe',
            },
          ],
          contentType: 'multipart/form-data',
          proxy_conf: {
            base_path: 'http://localhost:5000',
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
    } else {
      RestImport({
        dom_id: '#rest-import-ui-modal',
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

    console.log(this.configtype);
  }
}
