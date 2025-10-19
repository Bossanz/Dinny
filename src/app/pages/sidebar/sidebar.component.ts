import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // แก้จาก styleUrl
})
export class SidebarComponent implements OnInit {

  ad: any[] = [];

  constructor(private router: Router, private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadAdmin();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  loadAdmin(): void {
    this.homeService.getAdmin().subscribe({
      next: (res) => this.ad = res,
      error: (err) => console.error(err)
    });
  }
}
