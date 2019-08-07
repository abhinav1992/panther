import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  countdown: number = 10;
  scores: Array<number>;
  currentScore: number = 0;

  @Input() name: string;
  @Output() gameFinished = new EventEmitter<number>();

  constructor(private ref: ChangeDetectorRef) {
    this.scores = new Array();
  }

  ngOnInit() {
  }

  press() {
    if (this.countdown > 0) {
      let score = Math.floor(Math.random() * 40);
      this.scores.push(score);
      this.countdown = this.countdown - 1;
      this.currentScore = this.getTotalScore();
      //this.ref.detectChanges();

    }
    else {
      let totalScore = this.getTotalScore();
      //this.ref.detectChanges();
      this.gameFinished.next(totalScore);
    }
  }

  private getTotalScore(): number {
    var totalScore: number = 0;
    for (let i = 0; i < this.scores.length; i++) {
      totalScore += this.scores[i];
    }
    return totalScore;
  }

}
