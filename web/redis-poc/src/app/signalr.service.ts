import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private connection: any;
  private proxy: any;
  constructor() { }

  public initializeSignalRConnection(): void {
    let signalRServerEndPoint = 'http://localhost:65484';
    this.connection = $.hubConnection(signalRServerEndPoint);
    this.proxy = this.connection.createHubProxy('GameZoneHub');

    this.proxy.on('messageReceived', (serverMessage) => this.onMessageReceived(serverMessage));
    this.connection.start().done((data: any) => {
      console.log('Connected to Notification Hub');
      //this.broadcastMessage();
    }).catch((error: any) => {
      console.log('Notification Hub error -> ' + error);
    });
  }
  public join(name: String): void {
    this.proxy.invoke('join', name)
      .catch((error: any) => {
        console.log('broadcastMessage error -> ' + error);
      });
  }

  private onMessageReceived(serverMessage: string) {
    console.log('New message received from Server: ' + serverMessage);
  }
}
