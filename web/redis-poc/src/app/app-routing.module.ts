import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamesComponent } from "./games/games.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { NewsComponent } from "./news/news.component";
import { PlayGameComponent } from './play-game/play-game.component';


const routes: Routes = [
  { path: 'games', component: GamesComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'news', component: NewsComponent },
  { path: '*', component: GamesComponent },
  { path: 'playgame', component: PlayGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
