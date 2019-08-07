import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  constructor(private router: Router, private signalRService: SignalrService) { 
    
  }

  ngOnInit() {
    this.signalRService.initializeSignalRConnection();
  }

  play() {
    this.router.navigate(['/playgame']);
  }
}
