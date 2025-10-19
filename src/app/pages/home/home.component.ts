import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  reports: any[] = [];
  
  constructor(private homeService: HomeService) {}

   ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.homeService.getReports().subscribe({
      next: (res) => this.reports = res,
      error: (err) => console.error(err)
    });
  }
}
