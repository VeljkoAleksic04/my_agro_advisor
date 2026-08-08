import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../core/auth/store/auth.actions';
import { selectGreska, selectUcitavanje } from '../../../core/auth/store/auth.reducer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  protected readonly ucitavanje = toSignal(this.store.select(selectUcitavanje), { initialValue: false });
  protected readonly greska = toSignal(this.store.select(selectGreska), { initialValue: null });

  protected readonly forma = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  posalji(): void {
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      return;
    }
    this.store.dispatch(AuthActions.prijava({ podaci: this.forma.getRawValue() }));
  }
}
