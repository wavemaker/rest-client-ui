import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare const RestImport: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  @Input() configtype :boolean | undefined;
  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    const reactUI = RestImport({
      dom_id: '#rest-import-ui-modal',
      language: 'en',
      proxy_config: {
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
          list_provider:
            'https://www.wavemakeronline.com/studio/services/oauth2/providers/default',
          getprovider:
            'https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
          addprovider:
            'https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers',
        },
      },
    });
    console.log(this.configtype)
  }
}
