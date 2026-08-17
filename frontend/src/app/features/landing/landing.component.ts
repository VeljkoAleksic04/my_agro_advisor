import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/auth/store/auth.actions';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { ThemeService } from '../../shared/services/theme.service';
import { KorisnikMeniComponent } from '../../shared/components/korisnik-meni/korisnik-meni.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, KorisnikMeniComponent],
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

  /** Dugme u hero sekciji (nije padajuci meni) - direktno vodi na profil ili prijavu. */
  otvoriProfil(): void {
    if (this.korisnik()) {
      this.router.navigateByUrl('/profil');
    } else {
      this.router.navigateByUrl('/prijava');
    }
  }

  odjaviSe(): void {
    this.store.dispatch(AuthActions.odjava());
  }
}
