import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ModalComponent } from './modal/modal.component';
import { FullscreenComponent } from './fullscreen/fullscreen.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    FullscreenComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
