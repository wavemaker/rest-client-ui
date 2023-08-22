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
          base_path: 'http://localhost:5000',
          proxy_path: '/restimport',
          list_provider: '/get-default-provider',
          getprovider: '/getprovider',
          addprovider: '/addprovider',
        },
        default_proxy_state: 'ON',
        oAuthConfig: {
          base_path: 'https://www.wavemakeronline.com/studio/services',
          project_id: '',
          list_provider: '/oauth2/providers/default',
          getprovider: '',
          addprovider: '',
        },
      },
    });
  }
}
