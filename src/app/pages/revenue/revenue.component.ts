import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RevenueService, RevenueSummary } from '../../services/revenue.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-revenue',
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './revenue.component.html'
})
export class RevenueComponent implements OnInit {
  revenues: RevenueSummary[] = [];
  selectedMonth: string = '';
  selectedType: string = 'All';
  loading: boolean = false;

  constructor(private revenueService: RevenueService, private router: Router) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedMonth = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}`;
    this.fetchRevenue();
  }

  fetchRevenue(): void {
    this.loading = true;
    this.revenueService.getRevenueByPerson(this.selectedMonth).subscribe({
      next: (res) => { this.revenues = res; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  get filteredRevenues(): RevenueSummary[] {
    if(this.selectedType === 'All') return this.revenues;
    return this.revenues.filter(r => r.type === this.selectedType);
  }

  getTotalIncome(): number {
    return this.filteredRevenues.reduce((sum,r)=>sum+(r.income||0),0);
  }

  goToDetail(person: RevenueSummary) {
    this.router.navigate(
      ['/dashboard/revenue', person.type.toLowerCase(), person.id],
      { queryParams: { month: this.selectedMonth } }
    );
  }
}
