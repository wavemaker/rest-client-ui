import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare const RestImport: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit{
  constructor(public activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    const reactUI = RestImport({
          dom_id: '#rest-import-ui-modal',
          proxy_conf :{
            'get-default-provider': '',
            "getprovider":"",
          },
          default_proxy_state: "ON",
          oAuthConfig:{
            'get-default-provider': 'https://www.wavemakeronline.com/studio/services/oauth2/providers/default',
            "getprovider":"https://www.wavemakeronline.com/studio/services/projects/WMPRJ2c91808888f5252401896880222516b1/oauth2/providers",
          }
        });
  }
 
}
