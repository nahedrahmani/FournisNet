import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StockAlert, StockWsService } from '../../services/stock-ws.service';

interface Toast extends StockAlert {
  id: number;
}

@Component({
  selector: 'app-stock-toast',
  templateUrl: './stock-toast.component.html',
  styleUrls: ['./stock-toast.component.css']
})
export class StockToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;
  private counter = 0;

  constructor(private ws: StockWsService) {}

  ngOnInit(): void {
    this.sub = this.ws.alerts$.subscribe(alert => {
      if (!alert.lowStock) return; // only show low-stock alerts
      const toast: Toast = { ...alert, id: ++this.counter };
      this.toasts.unshift(toast);
      if (this.toasts.length > 5) this.toasts.pop(); // keep max 5
      setTimeout(() => this.dismiss(toast.id), 6000);
    });
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
