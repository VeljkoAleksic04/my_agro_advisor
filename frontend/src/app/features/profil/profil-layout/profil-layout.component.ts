import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/auth/store/auth.actions';
import { selectKorisnik } from '../../../core/auth/store/auth.reducer';
import { ThemeService } from '../../../shared/services/theme.service';
import { KorisnikMeniComponent } from '../../../shared/components/korisnik-meni/korisnik-meni.component';
import { ObavestenjaComponent } from '../../../shared/components/obavestenja/obavestenja.component';
import { ChatNotifikacijaService } from '../../../shared/services/chat-notifikacija.service';
import { ForumIndikatorComponent } from '../../../shared/components/forum-indikator/forum-indikator.component';

@Component({
  selector: 'app-profil-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, KorisnikMeniComponent, ObavestenjaComponent, ForumIndikatorComponent],
  templateUrl: './profil-layout.component.html',
  styleUrl: './profil-layout.component.scss',
})
export class ProfilLayoutComponent implements OnInit {
  private readonly store = inject(Store);
  protected readonly temaServis = inject(ThemeService);
  protected readonly chatNotifikacije = inject(ChatNotifikacijaService);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });

  ngOnInit(): void {
    this.store.dispatch(AuthActions.ucitajSacuvanuSesiju());
    this.chatNotifikacije.pokreni();
  }

  promeniTemu(): void {
    this.temaServis.promeniTemu();
  }

  odjaviSe(): void {
    this.store.dispatch(AuthActions.odjava());
  }
}
