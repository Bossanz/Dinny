import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

// ใช้ interface เดียวสำหรับหน้า RevenueComponent
export interface RevenueSummary {
  type: 'Admin' | 'Restaurant' | 'Rider';
  id: number;
  name: string;
  income: number;
}

// สำหรับหน้า revenue-detail
export interface OrderDetail {
  ord_id: number;
  ord_date: string;
  total_order_price: number;
  income: number;
  ord_status: string;
}

export type FilterType = 'day' | 'month' | 'year';

@Injectable({ providedIn: 'root' })
export class RevenueService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ดึงรายได้รวมตามคน
  getRevenueByPerson(month: string): Observable<RevenueSummary[]> {
    return this.http.get<RevenueSummary[]>(
      `${this.auth.apiUrl}/admin/revenue/person?month=${month}`,
      { headers: this.getHeaders() }
    );
  }

  // ดึงคำสั่งซื้อของคน (รองรับการกรองแบบใหม่)
  getOrdersByPerson(
    type: string, 
    id: number, 
    filterType: FilterType, 
    filterValue: string
  ): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(
      `${this.auth.apiUrl}/admin/revenue/person/${type}/${id}`,
      { 
        headers: this.getHeaders(),
        params: {
          filterType,
          filterValue
        }
      }
    );
  }
}