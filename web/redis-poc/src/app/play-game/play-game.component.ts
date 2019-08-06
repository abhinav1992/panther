import { Component, OnInit, TemplateRef, ElementRef, OnDestroy  } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { SignalrService } from '../signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  userName: string = '';
  userNameError: boolean = false;
  gameStarted: boolean = false;
  gameCompleted: boolean = false;
  subscription: Subscription;
  totalScore: number = 0;
  constructor(private modalService: BsModalService, private router: Router, private signalRService: SignalrService, private elementRef: ElementRef) { 
    this.signalRService.initializeSignalRConnection();
  }

  ngOnInit() {
    this.subscription = this.signalRService.signalResponse.subscribe(message => this.onSignalMessageReceived(message));
  }

  ngOnDestroy() {
    //this.signalRService.unjoin(this.userName);
    this.subscription.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.userNameError = false;
    this.userName = '';
    this.modalRef = this.modalService.show(template);
  }

  backToGames() {
    this.router.navigate(['/games']);
  }

  proceedToPlay() {
    this.userNameError = false;
    this.signalRService.join(this.userName);
  }

  gameFinished(event) {
    this.gameCompleted = true;
    this.totalScore = event;
  }

  goToLeaderBoard() {
    this.signalRService.updateScore(this.userName, this.totalScore);
    this.router.navigate(['/leaderboard']);
  }

  private onSignalMessageReceived(message: any) {
    if (message.method && message.data == true && message.method == "joined") {
      this.modalRef.hide();
      this.gameStarted = true;
    }
    else {
      this.userNameError = true;
    }
  }

}
