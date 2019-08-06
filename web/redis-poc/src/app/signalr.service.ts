import { Injectable, EventEmitter } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  public signalResponse: EventEmitter<any>;
  private connection: any;
  private proxy: any;
  constructor() { 
    this.signalResponse = new EventEmitter();
  }

  public initializeSignalRConnection(): void {
    //if (!this.connection) {
      let signalRServerEndPoint = 'http://192.168.10.196:4201';
      this.connection = $.hubConnection(signalRServerEndPoint);
      this.proxy = this.connection.createHubProxy('GameZoneHub');
  
      this.proxy.on('messageReceived', (serverMessage) => this.onMessageReceived(serverMessage));
      this.proxy.on('joined', (success) => this.onJoined(success));
      this.proxy.on('scoreUpdate', (updatedScores) => this.onScoreUpdate(updatedScores));
  
      this.connection.start().done((data: any) => {
        console.log('Connected to Notification Hub');
        this.signalResponse.emit({ method: 'connection', data: null })
        //this.broadcastMessage();
      }).catch((error: any) => {
        console.log('Notification Hub error -> ' + error);
      });
    //}
    //else {
    //  this.signalResponse.emit({ method: 'connection', data: null })
    //}
  }
  public join(name: String): void {
    this.proxy.invoke('join', name)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  public getUpdatedScores() {
    this.proxy.invoke('getUpdatedScore')
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      })
  }

  public unjoin(name: String): void {
    this.proxy.invoke('unjoin', name)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  public updateScore(name: string, score: number) {
    this.proxy.invoke('updateScore', name, score).catch((error: any) => {
      console.log('broadcastMessage error -> ' + error);
    })
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
}
