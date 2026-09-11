import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
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
    path: 'forum/tema/:temaId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/forum/forum.component').then((m) => m.ForumComponent),
  },
  {
    path: 'forum',
    canActivate: [authGuard],
    loadComponent: () => import('./features/forum/forum.component').then((m) => m.ForumComponent),
  },
  {
    path: 'profil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profil/profil-layout/profil-layout.component').then((m) => m.ProfilLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'nalog',
        data: { naslov: 'Moj nalog' },
        loadComponent: () =>
          import('./features/profil/profil-nalog/profil-nalog.component').then((m) => m.ProfilNalogComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'places',
        loadComponent: () =>
          import('./features/parcele/parcele-lista/parcele-lista.component').then((m) => m.ParceleListaComponent),
      },
      {
        path: 'biljke',
        loadComponent: () =>
          import('./features/biljke/biljke-lista/biljke-lista.component').then((m) => m.BiljkeListaComponent),
      },
      {
        path: 'sejanje',
        loadComponent: () =>
          import('./features/sadnja/sadnje-lista/sadnje-lista.component').then((m) => m.SadnjeListaComponent),
      },
      {
        path: 'istorija',
        data: { naslov: 'History' },
        loadComponent: () =>
          import('./features/istorija/istorija-lista/istorija-lista.component').then(
            (m) => m.IstorijaListaComponent,
          ),
      },
      {
        path: 'statistika',
        data: { naslov: 'Statistics' },
        loadComponent: () =>
          import('./features/statistika/statistika-pregled/statistika-pregled.component').then(
            (m) => m.StatistikaPregledComponent,
          ),
      },

      {
        path: 'chat',
        data: { naslov: 'Chat' },
        loadComponent: () =>
          import('./features/chat/chat.component').then((m) => m.ChatComponent),
      },

    ],
  },
  { path: '**', redirectTo: '' },
];
