import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { SignalrService } from '../signalr.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  allNews: Array<string>;
  constructor(private signalRService: SignalrService, private zone: NgZone) { 
    
    this.allNews = new Array();
    
  }

  ngOnInit() {
    this.signalRService.initializeSignalRConnection();
    this.subscription = this.signalRService.signalResponse.subscribe((news) => this.onNewsUpdate(news));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNewsUpdate(news: any) {
    debugger;
    if (news.method == 'news') {
      //this.zone.run(() => {
        this.allNews.push(news.data);
      //})
    }
    else if (news.method == 'all-news-update') {
      //this.zone.run(() => {
        this.allNews = news.data
      //})
    }
    else if (news.method == "connection") {
      //this.zone.run(() => {
        this.signalRService.getUpdatedNews();
      //})
    console.log(this.allNews);
    }
  }
}
