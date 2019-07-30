import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_ROOT } from '../models/config';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  readonly SERVER_ROOT: string = SERVER_ROOT;
  private firstConnect: boolean = true;
  socket: any;

  constructor() {
    this.socket = io(this.SERVER_ROOT, {
      autoConnect: false,
      reconnection: false // False so client only attempts to connect when user clicks join button (Only before first connect)
    });
  }

  public listenToConnect():Observable<any> {
    return new Observable(subscriber => {
      this.socket.on('connect', async () => {
        if (this.firstConnect) {
          this.firstConnect = false;
          this.socket = await io(this.SERVER_ROOT); // New connection with reconnection enabled (Can't change original connection option)
          subscriber.next(true);
        }
        // Don't do anything after successful reconnect
      });

      this.socket.on('connect_error', () => {
        if (!this.firstConnect) { return } // Dont emit to subscritions if it's a reconnect error
        subscriber.next(false);
      });
    });
  }

  public connect():void {
    this.socket.connect();
  }

  public listen(event: string):Observable<any> {
    return new Observable(subscriber => {
      this.socket.on(event, data => {
        subscriber.next(data);
      });
    });
  }

  public emit(event: string, data: any):void {
    this.socket.emit(event, data);
  }
}
