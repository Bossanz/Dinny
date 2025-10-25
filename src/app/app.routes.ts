import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { CustomerComponent } from './pages/customer/customer.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { RiderComponent } from './pages/rider/rider.component';
import { RevenueComponent } from './pages/revenue/revenue.component';
import { RevenueDetailComponent } from './pages/revenue-detail/revenue-detail.component'; // เพิ่มนี้

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'dashboard/customer', component: CustomerComponent, canActivate: [authGuard]},
  { path: 'dashboard/restaurant', component: RestaurantComponent, canActivate: [authGuard]},
  { path: 'dashboard/rider', component: RiderComponent, canActivate: [authGuard]},
  { path: 'dashboard/revenue', component: RevenueComponent, canActivate: [authGuard]},
  { path: 'dashboard/revenue/:type/:id', component: RevenueDetailComponent, canActivate: [authGuard]}, // เพิ่ม Detail route
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

export const appRouter = provideRouter(routes);
