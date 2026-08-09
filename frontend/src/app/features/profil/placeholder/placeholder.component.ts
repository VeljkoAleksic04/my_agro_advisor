import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <section class="stranica">
      <header class="stranica-header">
        <div>
          <h1>{{ naslov() }}</h1>
          <p class="podnaslov">Ova sekcija je trenutno u razvoju.</p>
        </div>
      </header>
      <p class="stanje-prazno">Sadržaj za "{{ naslov() }}" uskoro stiže.</p>
    </section>
  `,
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly naslov = toSignal(
    this.route.data.pipe(map((podaci) => (podaci['naslov'] as string) ?? 'Sekcija')),
    { initialValue: 'Sekcija' },
  );
}
