import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RestaurantService {
    constructor(private http: HttpClient, private auth: AuthService) {}

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getRestaurants(): Observable<any[]> {
        return this.http.get<any[]>(`${this.auth.apiUrl}/admin/restaurants`, { headers: this.getHeaders() });
    }
        
    toggleBan(id: number): Observable<any> {
        return this.http.put(`${this.auth.apiUrl}/admin/restaurants/${id}/ban`, {}, { headers: this.getHeaders() });
    }

}
