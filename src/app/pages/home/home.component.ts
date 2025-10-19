import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HomeService } from '../../services/home.service';
import { RiderService } from '../../services/rider.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  reports: any[] = [];
  riders: any[] = [];
  ad: any[] = [];
  selectedRider: any = null;
  selectedreport: any = null;

  // 🔹 สำหรับ fullscreen image
  selectedImage: string | null = null;

  constructor(private homeService: HomeService, private riderService: RiderService) { }

  ngOnInit(): void {
    this.loadReports();
    this.loadRider();
    this.loadAdmin();
  }

  loadAdmin() {
    this.homeService.getAdmin().subscribe({
      next: (res) => (this.ad = res),
      error: (err) => console.error(err)
    });
  }

  loadReports() {
    this.homeService.getReports().subscribe({
      next: (res) => (this.reports = res),
      error: (err) => console.error(err)
    });
  }

  loadRider() {
    this.riderService.getRiders().subscribe({
      next: (res) => {
        this.riders = res.filter((r: any) => !r.rid_ver_status || r.rid_ver_status === 0);
      },
      error: (err) => console.error(err)
    });
  }

  openRiderDetail(rider: any) {
    this.selectedRider = rider;
  }

  openReport(report: any) {
    this.selectedreport = report;
  }

  closeReport() {
    this.selectedreport = null;
  }

  verifyRider(rider: any) {
    this.riderService.verifyRider(rider.rid_id).subscribe({
      next: () => {
        alert('✅ Verified successfully!');
        this.selectedRider = null;
        this.loadRider();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔹 ฟังก์ชันสำหรับเปิด/ปิด fullscreen image
  openImage(src: string) {
    this.selectedImage = src;
  }

  closeImage() {
    this.selectedImage = null;
  }

  saveShareRate() {
    if (!this.ad[0]) return;

    const updatedData = {
      ad_id: this.ad[0].ad_id,
      ad_share_rate: this.ad[0].ad_share_rate,
      res_share_rate: this.ad[0].res_share_rate,
      rid_share_rate: this.ad[0].rid_share_rate
    };

    this.homeService.updateShareRate(updatedData).subscribe({
      next: () => alert('✅ Share rates saved successfully!'),
      error: (err) => console.error('Error saving share rates', err)
    });
  }
};
