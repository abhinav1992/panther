import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  subscription: Subscription;
  userScores: Array<any>;
  
  constructor(private signalRService: SignalrService) { 
    this.userScores = new Array();
    this.signalRService.initializeSignalRConnection();
  }

  ngOnInit() {

    this.subscription = this.signalRService.signalResponse.subscribe(message => this.onSignalMessageReceived(message));
  }

  private onSignalMessageReceived(message: any) {
    if (message.method == "score-update") {
      this.userScores = message.data;
    }
    else if (message.method == "connection") {
      this.signalRService.getUpdatedScores();
    }
  }

}
