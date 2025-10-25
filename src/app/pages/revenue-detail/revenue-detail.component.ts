import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RevenueService, OrderDetail } from '../../services/revenue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-revenue-detail',
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './revenue-detail.component.html'
})
export class RevenueDetailComponent implements OnInit {
  personType: string = '';
  personId: number = 0;
  selectedMonth: string = '';
  orders: OrderDetail[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private revenueService: RevenueService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.personType = params['type'];
      this.personId = +params['id'];
    });

    const today = new Date();
    this.selectedMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString().padStart(2, '0')}`;

    this.fetchOrders();
  }

  fetchOrders(): void {
    if (!this.personType || !this.personId) return;
    this.loading = true;
    this.revenueService.getOrdersByPerson(this.personType, this.personId, this.selectedMonth)
      .subscribe({
        next: res => {
          this.orders = res;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  getTotalIncome(): number {
    return this.orders.reduce((sum, o) => sum + (o.income || 0), 0);
  }

  goBack() {
    this.location.back();
  }
}
