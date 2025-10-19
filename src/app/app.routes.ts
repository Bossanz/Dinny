import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { CustomerComponent } from './pages/customer/customer.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { RiderComponent } from './pages/rider/rider.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'dashboard/customer', component: CustomerComponent, canActivate: [authGuard]},
  { path: 'dashboard/restaurant', component: RestaurantComponent, canActivate: [authGuard]},
  { path: 'dashboard/rider', component: RiderComponent, canActivate: [authGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

export const appRouter = provideRouter(routes);
