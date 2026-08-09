import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly temaServis = inject(ThemeService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });

  promeniTemu(): void {
    this.temaServis.promeniTemu();
  }

  otvoriProfil(): void {
    if (this.korisnik()) {
      this.router.navigateByUrl('/profil');
    } else {
      this.router.navigateByUrl('/prijava');
    }
  }
}
