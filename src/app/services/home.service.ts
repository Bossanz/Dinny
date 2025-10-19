import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient, private auth: AuthService) {}

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getReports(): Observable<any> {
        return this.http.get<any>(`${this.auth.apiUrl}/admin/reports`, { headers: this.getHeaders() });
    }
}
