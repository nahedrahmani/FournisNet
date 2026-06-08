import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';

export interface StockAlert {
  produitId: number;
  nom: string;
  reference: string;
  quantite: number;
  quantiteMin: number;
  lowStock: boolean;
}

@Injectable({ providedIn: 'root' })
export class StockWsService implements OnDestroy {

  private client: Client;
  private alertSubject = new Subject<StockAlert>();

  readonly alerts$ = this.alertSubject.asObservable();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/stock-alerts', (msg: IMessage) => {
        const alert: StockAlert = JSON.parse(msg.body);
        this.alertSubject.next(alert);
      });
    };

    this.client.activate();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }
}
