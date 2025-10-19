import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { RestaurantService } from '../../services/restaurant.service';


@Component({
  selector: 'app-restaurant',
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  paginatedRestaurants: any[] = [];

  loading = false;
  searchText = '';

  // pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalEntries = 0;

  // page button window size
  pageWindow = 5;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.loading = true;

    this.restaurantService.getRestaurants()
      .pipe(map((data: any[]) => data || []))
      .subscribe({
        next: (data) => {
          this.restaurants = data;
          this.applyFilterAndPagination();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.restaurants = [];
          this.applyFilterAndPagination();
          this.loading = false;
        }
      });
}

  applyFilterAndPagination() {
    const keyword = this.searchText?.trim().toLowerCase();
    if (!keyword) {
      this.filteredRestaurants = [...this.restaurants];
    } else {
      this.filteredRestaurants = this.restaurants.filter(r =>
        [r.res_name, r.res_email, r.res_phone, r.address]
          .some(f => (f ?? '').toString().toLowerCase().includes(keyword))
      );
    }

    this.totalEntries = this.filteredRestaurants.length;
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
    this.paginatedRestaurants = this.filteredRestaurants.slice(start, end);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }

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
    this.restaurantService.toggleBan(id).subscribe({
      next: () => this.fetchRestaurants(),
      error: (err) => console.error(err)
    });
  }
}
