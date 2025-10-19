import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient, private auth: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getReports(): Observable<any> {
        return this.http.get<any>(`${this.auth.apiUrl}/admin/reports`, { headers: this.getHeaders() });
    }

    getAdmin(): Observable<any> {
        return this.http.get<any>(`${this.auth.apiUrl}/admin/admin`, { headers: this.getHeaders() });
    }

    updateShareRate(data: {
        ad_id: number,
        ad_share_rate: number,
        res_share_rate: number,
        rid_share_rate: number
    }): Observable<any> {
        return this.http.put<any>(
            `${this.auth.apiUrl}/admin/admin/sharerate`,
            data,
            { headers: this.getHeaders() }
        );
    }

}
