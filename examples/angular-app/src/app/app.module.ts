import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { ModalComponent } from './modal/modal.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', 
  requireConfig: { preferScriptTags: true }
};

@NgModule({
  declarations: [
    AppComponent,
    FullscreenComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MonacoEditorModule.forRoot(monacoConfig),
    FormsModule 
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
