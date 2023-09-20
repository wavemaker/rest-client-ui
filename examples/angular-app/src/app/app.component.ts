import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';

declare const RestImport: any;
declare const configImport: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}
  public fullScreen: boolean = false;
  enableFullScreen() {
    this.fullScreen = !this.fullScreen;
  }


  openModal(type: number) {
    const modalRef = this.modalService.open(ModalComponent, {
      size: 'xl',
      centered: true,
    });
    if (type === 1) {
      modalRef.componentInstance.configtype = false;
    } else {
      modalRef.componentInstance.configtype = true;
    }
  }

  openConfigModal() {
    const reactUI = configImport({
      dom_id: '#configModalUI',
      language: 'en',
      providerConf: {
        accessTokenParamName: 'Bearer',
        accessTokenUrl: 'https://www.googleapis.com/oauth2/v3/token',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        clientId:
          '74834293428jsjas.apps.googleusercontent.com  ',
        clientSecret: 'LKJHFHS-KSDHOSDMNSDH',
        oauth2Flow: 'AUTHORIZATION_CODE',
        providerId: 'ProviderTest',
        scopes: [],
        sendAccessTokenAs: 'HEADER',
      },
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
          proxy_path: '', // /projects/{projectID}/restservices/invoke?optimizeResponse=true
          list_provider: '/oauth2/providers/default',
          getprovider: '', // /projects/{projectID}/oauth2/providers
          addprovider: '', // /projects/{projectID}/oauth2/providers
          authorizationUrl: '', // /projects/{projectID}/oauth2/{providerId}/authorizationUrl
        },
      }
    });
  }
}
