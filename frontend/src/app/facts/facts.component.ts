import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss']
})
export class FactsComponent implements OnInit {

  public facts: string[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.onConnectionOpened$().subscribe(() => console.log("Connection OK detected from facts component"));

    this.webSocketService.onConnectionClosed$().subscribe(() => console.log("Connection closed detected from facts component"));

    setTimeout(() => {
      this.webSocketService.subscribe('/facts', (message) => {
        this.facts.push(message);
      }, true);

      this.webSocketService.subscribe('/facts', (message) => {
        console.log("New Chuck Norris Fact :", message);
      });
    }, 2000);

    setTimeout(() => {
      this.webSocketService.subscribe('/users', (message) => {
        console.log("Nouvel utilisateur :", message);
      }, false)
    }, 10000);

    setTimeout(() => {
      this.webSocketService.clearSubscriptions();
    }, 20000);

  }

}
