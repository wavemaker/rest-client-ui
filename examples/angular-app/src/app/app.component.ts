import { Component } from '@angular/core';


declare const RestImport: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-app';

  ngAfterViewInit(): void {

    const reactUI = RestImport({
      dom_id: '#rest-import-ui',
     language:"en",
     config: {
      url: 'https://jsonplaceholder.typicode.com/posts/{id}?test=true',
      httpMethod: 'POST',
      useProxy: true,
      httpAuth: "BASIC",
      bodyParams: "{userName:password}",
      userName: "userName",
      userPassword: "userPassword",
      headerParams: [
        {
          name: 'New',
          type: 'string',
          value: 'application'
        }
      ],
      multipartParams: [
        {
          name: "post",
          type: "file",
          value: "fe"
        }
      ],
      contentType: 'multipart/form-data'
    },
    })


  }
}
