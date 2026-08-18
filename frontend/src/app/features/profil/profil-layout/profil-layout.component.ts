import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/auth/store/auth.actions';
import { selectKorisnik } from '../../../core/auth/store/auth.reducer';
import { ThemeService } from '../../../shared/services/theme.service';
import { KorisnikMeniComponent } from '../../../shared/components/korisnik-meni/korisnik-meni.component';

@Component({
  selector: 'app-profil-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, KorisnikMeniComponent],
  templateUrl: './profil-layout.component.html',
  styleUrl: './profil-layout.component.scss',
})
export class ProfilLayoutComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly temaServis = inject(ThemeService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });

  ngOnInit(): void {
    this.store.dispatch(AuthActions.ucitajSacuvanuSesiju());
  }

  promeniTemu(): void {
    this.temaServis.promeniTemu();
  }

  odjaviSe(): void {
    this.store.dispatch(AuthActions.odjava());
  }
}
