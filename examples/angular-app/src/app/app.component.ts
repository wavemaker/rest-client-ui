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

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, {
      size: 'xl',
      centered: true,
    });
  }
}
