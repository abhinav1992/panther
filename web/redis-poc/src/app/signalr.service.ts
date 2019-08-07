import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { SignalR, SignalRConnection } from 'ng2-signalr'
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private conn: SignalRConnection;
  public signalResponse: EventEmitter<any>;
  private connection: any;
  private proxy: any;
  constructor(private zone: NgZone, private _signalR: SignalR) { 
    this.signalResponse = new EventEmitter();
  }

  public initializeSignalRConnection(): void {
    if (!this.conn) {
      this.conn = this._signalR.createConnection();
      this.conn.listenFor('joined').subscribe((success:boolean) => this.onJoined(success));
      this.conn.listenFor('messageReceived').subscribe((serverMessage:string) => this.onMessageReceived(serverMessage));
      this.conn.listenFor('scoreUpdate').subscribe((updatedScores:Array<any>) => this.onScoreUpdate(updatedScores));
      this.conn.listenFor('newsPublished').subscribe((news:string) => this.onNewsReceived(news));
      this.conn.listenFor('publishAllNews').subscribe((allNews:Array<string>) => this.onAllNewsUpdate(allNews));
  
      this.conn.start().then((data: any) => {
        console.log('connection is made')
        this.signalResponse.emit({ method: 'connection', data: null })
      });
    }
    else {
      this.conn.start().then((data: any) => {
        console.log('connection is made')
        this.signalResponse.emit({ method: 'connection', data: null })
      });
    }
    
  }
  public join(name: String): void {
    this.conn.invoke('join', name).catch((err) => {
      console.log('broadcastMessage error -> ' + err);
    })
  }

  public getUpdatedScores() {
    this.conn.invoke('getUpdatedScore')
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      })
  }

  public unjoin(name: String): void {
    this.conn.invoke('unjoin', name)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  public updateScore(name: string, score: number) {
    this.conn.invoke('updateScore', name, score).catch((error: any) => {
      console.log('broadcastMessage error -> ' + error);
    })
  }

  public getUpdatedNews() {
    this.conn.invoke('GetNewsUpdate').catch((error: any) => {
      console.log('broadcastMessage error -> ' + error);
    })
  }

  private onAllNewsUpdate(allNews: Array<string>) {
    let message = {
      method: 'all-news-update',
      data: allNews
    };
    this.signalResponse.emit(message);
  }

  private onMessageReceived(serverMessage: string) {
    console.log('New message received from Server: ' + serverMessage);
  }

  private onScoreUpdate(updatedScores: Array<any>) {
    let message = {
      method: 'score-update',
      data: updatedScores
    };
    this.signalResponse.emit(message);
  }

  private onJoined(success: boolean) {
    console.log("Joined Successfully? ", success);
    let message = {
      method: 'joined',
      data: success
    };
    this.signalResponse.emit(message);
  }

  private onNewsReceived(newsMessage: string) {
    console.log("News Received: ", newsMessage);
    let message = {
      method: 'news',
      data: newsMessage
    }
    this.signalResponse.emit(message);
  }
}
