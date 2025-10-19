import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  paginatedCustomers: any[] = [];

  loading = false;
  searchText = '';

  // pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalEntries = 0;

  // page button window size
  pageWindow = 5;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.loading = true;

    this.customerService
      .getCustomers()
      .pipe(map((data: any[]) => data || []))
      .subscribe({
        next: (data) => {
          // you may want to map fields to expected names here
          this.customers = data;
          this.applyFilterAndPagination();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          // fallback: set empty
          this.customers = [];
          this.applyFilterAndPagination();
          this.loading = false;
        },
      });
  }

  applyFilterAndPagination() {
    const keyword = this.searchText?.trim().toLowerCase();
    if (!keyword) {
      this.filteredCustomers = [...this.customers];
    } else {
      this.filteredCustomers = this.customers.filter((c) =>
        [c.cus_name, c.cus_email, c.cus_phone, c.address].some((f) =>
          (f ?? '').toString().toLowerCase().includes(keyword)
        )
      );
    }

    this.totalEntries = this.filteredCustomers.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalEntries / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.setPage(this.currentPage);
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  setPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(start, end);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

  // generate page numbers with simple ellipsis logic
  get pageNumbers(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const window = this.pageWindow;
    if (total <= window + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    const left = Math.max(2, current - Math.floor(window / 2));
    const right = Math.min(total - 1, current + Math.floor(window / 2));

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('...');
    pages.push(total);
    return pages;
  }

  toggleBan(id: number) {
    this.customerService.toggleBan(id).subscribe({
      next: () => this.fetchCustomers(),
      error: (err) => console.error(err),
    });
  }
}
