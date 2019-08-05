import { Component, OnInit, TemplateRef  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  modalRef: BsModalRef;
  userName: String = '';
  constructor(private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  backToGames() {
    this.router.navigate(['/games']);
  }

  proceedToPlay() {
    this.modalRef.hide();
    console.log("Welcome ", this.userName);
  }
}
