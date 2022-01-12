import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketCustomMessage } from '../interfaces/web-socket-custom-message.interface';
import { environment } from 'src/environments/environment';

export interface IWebSocketService {
  subscribe(url: string, handler: (message: any) => any, keepActive?: boolean): any;
  clearSubscriptions(): void;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements IWebSocketService {

  private webSocketSubject$!: WebSocketSubject<WebSocketCustomMessage>;

  private _onClearSubscriptions$: Subject<void> = new Subject();
  private _onConnectionOpened$: Subject<void> = new Subject();
  private _onConnectionClosed$: Subject<void> = new Subject();

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.webSocketSubject$ = webSocket({
      url: environment.socketServerUrl,
      deserializer: e => JSON.parse(e.data),
      openObserver: {
        next: () => {
          console.log('Connection OK');
          // Permet de remplacer le broadcast à l'ouverture de la connexion effectué en AngularJS (voir facts component)
          this._onConnectionOpened$.next();
        }
      },
      closeObserver: {
        next: () => {
          console.log('Connection closed');
          // Permet de remplacer le broadcast à la fermeture de la connexion éffectué en AngularJS
          this._onConnectionClosed$.next();
        }
      }
    });
  }

  subscribe(url: string, handler: (message: any) => any, keepActive?: boolean): void {
    let webSocketObservable$ = this.webSocketSubject$.multiplex(
      () => ({subscribe: url}),
      () => ({unsubscribe: url}),
      data => data.url === url
    );

    if(!keepActive) {
      // si keepActive n'est pas vrai, il émettra tant que _onClearSubscriptions$ n'émet pas
      webSocketObservable$.pipe(
        takeUntil(this._onClearSubscriptions$.asObservable())
      );
    }

    webSocketObservable$.subscribe(data => handler(data.message));
  }

  clearSubscriptions(): void {
    this._onClearSubscriptions$.next();
  }

  onConnectionOpened$(): Observable<void> {
    return this._onConnectionOpened$.asObservable();
  }

  onConnectionClosed$(): Observable<void> {
    return this._onConnectionClosed$.asObservable();
  }

}
