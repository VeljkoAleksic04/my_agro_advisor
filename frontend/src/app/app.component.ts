import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthActions } from './core/auth/store/auth.actions';
import { selectKorisnik } from './core/auth/store/auth.reducer';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly temaServis = inject(ThemeService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });

  ngOnInit(): void {
    this.store.dispatch(AuthActions.ucitajSacuvanuSesiju());
  }

  odjaviSe(): void {
    this.store.dispatch(AuthActions.odjava());
  }

  promeniTemu(): void {
    this.temaServis.promeniTemu();
  }
}
