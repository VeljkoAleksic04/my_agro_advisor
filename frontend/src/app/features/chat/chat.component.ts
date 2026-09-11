import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenStorageService } from '../../core/auth/token-storage.service';
import { selectKorisnik } from '../../core/auth/store/auth.reducer';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatApiService, ChatKorisnik, ChatPoruka } from './chat-api.service';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  private readonly chatApi = inject(ChatApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly store = inject(Store);

  protected readonly korisnik = toSignal(this.store.select(selectKorisnik), { initialValue: null });
  protected readonly korisnici = signal<ChatKorisnik[]>([]);
  protected readonly izabraniKorisnik = signal<ChatKorisnik | null>(null);
  protected readonly poruke = signal<ChatPoruka[]>([]);
  protected readonly ucitavanjeKorisnika = signal(true);
  protected readonly ucitavanjePoruka = signal(false);
  protected readonly tipka = signal(false);
  protected readonly greska = signal<string | null>(null);
  protected novaPoruka = '';

  private socket: Socket | null = null;

  ngOnInit(): void {
    this.ucitajKorisnike();
    this.poveziSocket();
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }

  izaberiKorisnika(korisnik: ChatKorisnik): void {
    this.izabraniKorisnik.set(korisnik);
    this.poruke.set([]);
    this.greska.set(null);
    this.ucitavanjePoruka.set(true);

    this.chatApi.poruke(korisnik.id).subscribe({
      next: (poruke) => {
        this.poruke.set(poruke);
        this.ucitavanjePoruka.set(false);
        this.chatApi.oznaciProcitano(korisnik.id).subscribe();
        setTimeout(() => this.scrollujDole());
      },
      error: () => {
        this.ucitavanjePoruka.set(false);
        this.greska.set('Nije moguće učitati poruke.');
      },
    });
  }

  posalji(): void {
    const primalac = this.izabraniKorisnik();
    const sadrzaj = this.novaPoruka.trim();
    if (!primalac || !sadrzaj || !this.socket?.connected) return;

    this.socket.emit('chat:send', { primalacId: primalac.id, sadrzaj });
    this.novaPoruka = '';
    this.socket.emit('chat:typing', { primalacId: primalac.id, aktivno: false });
  }

  promenaTeksta(): void {
    const primalac = this.izabraniKorisnik();
    if (!primalac || !this.socket?.connected) return;

    this.socket.emit('chat:typing', { primalacId: primalac.id, aktivno: this.novaPoruka.trim().length > 0 });
  }

  vreme(datum: string): string {
    return new Date(datum).toLocaleString('sr-Latn-RS', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  jeMoja(poruka: ChatPoruka): boolean {
    return poruka.posiljalacId === this.korisnik()?.id;
  }

  inicijal(korisnik: ChatKorisnik): string {
    return (korisnik.ime?.charAt(0) || korisnik.username.charAt(0)).toUpperCase();
  }

  trackPoruka(_index: number, poruka: ChatPoruka): number {
    return poruka.id;
  }

  private ucitajKorisnike(): void {
    this.chatApi.korisnici().subscribe({
      next: (lista) => {
        this.korisnici.set(lista);
        this.ucitavanjeKorisnika.set(false);
        if (lista.length > 0) this.izaberiKorisnika(lista[0]);
      },
      error: () => {
        this.ucitavanjeKorisnika.set(false);
        this.greska.set('Nije moguće učitati korisnike.');
      },
    });
  }

  private poveziSocket(): void {
    const token = this.tokenStorage.ucitajToken();
    if (!token) return;

    const socketBase = environment.apiUrl.replace(/\/api\/?$/, '');
    this.socket = io(`${socketBase}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('chat:error', (podaci: { message?: string }) => {
      this.greska.set(podaci.message ?? 'Chat veza nije dostupna.');
    });

    this.socket.on('chat:message', (poruka: ChatPoruka) => {
      const trenutni = this.izabraniKorisnik();
      if (!trenutni) return;

      const mojId = this.korisnik()?.id;
      const pripadaRazgovoru =
        (poruka.posiljalacId === mojId && poruka.primalacId === trenutni.id) ||
        (poruka.posiljalacId === trenutni.id && poruka.primalacId === mojId);

      if (!pripadaRazgovoru) return;
      if (this.poruke().some((p) => p.id === poruka.id)) return;

      this.poruke.update((lista) => [...lista, poruka]);
      if (poruka.primalacId === mojId) this.chatApi.oznaciProcitano(trenutni.id).subscribe();
      setTimeout(() => this.scrollujDole());
    });

    this.socket.on('chat:typing', (podaci: { korisnikId: number; aktivno: boolean }) => {
      this.tipka.set(podaci.korisnikId === this.izabraniKorisnik()?.id && podaci.aktivno);
      if (podaci.aktivno) setTimeout(() => this.tipka.set(false), 2500);
    });
  }

  private scrollujDole(): void {
    const element = document.querySelector('.chat-poruke');
    if (element) element.scrollTop = element.scrollHeight;
  }
}
