import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'parcele' },
  {
    path: 'prijava',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registracija',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'parcele',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/parcele/parcele-lista/parcele-lista.component').then((m) => m.ParceleListaComponent),
  },
  {
    path: 'biljke',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/biljke/biljke-lista/biljke-lista.component').then((m) => m.BiljkeListaComponent),
  },
  { path: '**', redirectTo: 'parcele' },
];
