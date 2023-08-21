import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
declare const RestImport: any;

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
    if (type == 1) {
      modalRef.componentInstance.configtype = false;
    } else {
      modalRef.componentInstance.configtype = true;
    }
  }

  openConfigModal() {
    const reactUI = RestImport({
      dom_id: '#configModalUI',
      language: 'en',
      configModal: true,
      providerConf: {
        accessTokenParamName: 'Bearer',
        accessTokenUrl: 'https://www.googleapis.com/oauth2/v3/token',
        authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
        clientId:
          '238489563324-6rdc711u4jskjs78o1p2b0qkvgcbhbda.apps.googleusercontent.com',
        clientSecret: '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',
        oAuth2Pkce: null,
        oauth2Flow: 'AUTHORIZATION_CODE',
        providerId: 'google',
        responseType: 'token',
        scopes: [
          {
            name: 'Calendar',
            value:
              'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly',
          },
          {
            name: 'Google Drive',
            value:
              'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.photos.readonly',
          },
        ],
        sendAccessTokenAs: 'HEADER',
      },
      config: {
        proxy_conf: {
          base_path: 'http://localhost:5000',
          proxy_path: '/restimport',
          list_provider: '/get-default-provider',
          getprovider: '/getprovider',
          addprovider: '/addprovider',
        },
        default_proxy_state: 'ON',
        oAuthConfig: {
          base_path: 'https://www.wavemakeronline.com/studio/services',
          project_id: "WMPRJ2c91808888f5252401896880222516b1",
          list_provider: '/oauth2/providers/default',
          getprovider:
            '/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
          addprovider:
            '/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
        },
      },
    });
  }
}
