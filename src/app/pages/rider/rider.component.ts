import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RiderService } from '../../services/rider.service';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rider',
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule],
  templateUrl: './rider.component.html',
  styleUrl: './rider.component.css',
})
export class RiderComponent {
  riders: any[] = [];
  filteredRiders: any[] = [];
  paginatedRiders: any[] = [];

  loading = false;
  searchText = '';

  // pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalEntries = 0;

  // page button window size
  pageWindow = 5;

  constructor(private riderService: RiderService) {}
  ngOnInit(): void {
    this.fetchRiders();
  }

  fetchRiders() {
    this.loading = true;

    this.riderService
      .getRiders()
      .pipe(map((data: any[]) => data || []))
      .subscribe({
        next: (data) => {
          this.riders = data;
          this.applyFilterAndPagination();
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.riders = [];
          this.applyFilterAndPagination();
          this.loading = false;
        },
      });
  }

  applyFilterAndPagination() {
    const keyword = this.searchText?.trim().toLowerCase();
    if (!keyword) {
      this.filteredRiders = [...this.riders];
    } else {
      this.filteredRiders = this.riders.filter((r) =>
        [r.rider_name, r.rider_email, r.rider_phone].some((f) =>
          (f ?? '').toString().toLowerCase().includes(keyword)
        )
      );
    }

    this.totalEntries = this.filteredRiders.length;
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
    this.paginatedRiders = this.filteredRiders.slice(start, end);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  nextPage() {
    if (this.currentPage < this.totalPages) this.setPage(this.currentPage + 1);
  }
  prevPage() {
    if (this.currentPage > 1) this.setPage(this.currentPage - 1);
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
    this.riderService.toggleBan(id).subscribe({
      next: () => this.fetchRiders(),
      error: (err) => console.error(err),
    });
  }
}
