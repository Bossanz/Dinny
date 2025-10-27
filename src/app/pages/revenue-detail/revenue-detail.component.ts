import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RevenueService, OrderDetail, FilterType } from '../../services/revenue.service';
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
  
  filterType: FilterType = 'month';
  filterValue: string = '';
  
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

    // ตั้งค่าเริ่มต้นเป็นเดือนปัจจุบัน
    const today = new Date();
    this.filterValue = this.getDefaultFilterValue(today);

    this.fetchOrders();
  }

  getDefaultFilterValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (this.filterType) {
      case 'day':
        return `${year}-${month}-${day}`;
      case 'month':
        return `${year}-${month}`;
      case 'year':
        return `${year}`;
      default:
        return `${year}-${month}`;
    }
  }

  onFilterTypeChange(): void {
    // เมื่อเปลี่ยนประเภทการกรอง ให้ตั้งค่า filterValue ใหม่
    const today = new Date();
    this.filterValue = this.getDefaultFilterValue(today);
    this.fetchOrders();
  }

  onFilterValueChange(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    if (!this.personType || !this.personId || !this.filterValue) return;
    
    this.loading = true;
    
    console.log('Fetching orders:', {
      type: this.personType,
      id: this.personId,
      filterType: this.filterType,
      filterValue: this.filterValue
    });
    
    this.revenueService.getOrdersByPerson(
      this.personType, 
      this.personId, 
      this.filterType, 
      this.filterValue
    ).subscribe({
      next: res => {
        console.log('Orders received:', res.length);
        this.orders = res;
        this.loading = false;
      },
      error: err => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  getTotalIncome(): number {
    return this.orders.reduce((sum, o) => sum + (o.income || 0), 0);
  }

  getFilterLabel(): string {
    switch (this.filterType) {
      case 'day': return 'วัน';
      case 'month': return 'เดือน';
      case 'year': return 'ปี';
      default: return 'เดือน';
    }
  }

  goBack() {
    this.location.back();
  }
}