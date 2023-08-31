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

      config: {
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
      },
    });
  }
}
