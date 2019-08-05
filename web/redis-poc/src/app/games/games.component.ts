import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  play() {
    this.router.navigate(['/playgame']);
  }
}
