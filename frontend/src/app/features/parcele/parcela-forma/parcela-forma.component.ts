import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { JedinicaPovrsine } from '../../../core/models/domain.models';
import { NovaParcela } from '../parcele-api.service';

@Component({
  selector: 'app-parcela-forma',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './parcela-forma.component.html',
  styleUrl: './parcela-forma.component.scss',
})
export class ParcelaFormaComponent {
  private readonly fb = inject(FormBuilder);

  @Output() readonly sacuvano = new EventEmitter<NovaParcela>();
  @Output() readonly otkazano = new EventEmitter<void>();

  protected readonly jediniceOpcije = Object.values(JedinicaPovrsine);

  protected readonly forma = this.fb.nonNullable.group({
    naziv: ['', [Validators.required, Validators.minLength(2)]],
    povrsina: [1, [Validators.required, Validators.min(1)]],
    jedinicaMere: [JedinicaPovrsine.A, [Validators.required]],
    klasa: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
  });

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.sacuvano.emit(this.forma.getRawValue());
    this.forma.reset({ naziv: '', povrsina: 1, jedinicaMere: JedinicaPovrsine.A, klasa: 1 });
  }
}
