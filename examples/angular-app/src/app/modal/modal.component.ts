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
          
        });
  }
 
}
