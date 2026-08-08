import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { authFeatureKey, authReducer } from './core/auth/store/auth.reducer';
import { AuthEffects } from './core/auth/store/auth.effects';
import { parceleFeatureKey, parceleReducer } from './features/parcele/store/parcele.reducer';
import { ParceleEffects } from './features/parcele/store/parcele.effects';
import { biljkeFeatureKey, biljkeReducer } from './features/biljke/store/biljke.reducer';
import { BiljkeEffects } from './features/biljke/store/biljke.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideStore({
      [authFeatureKey]: authReducer,
      [parceleFeatureKey]: parceleReducer,
      [biljkeFeatureKey]: biljkeReducer,
    }),
    provideEffects([AuthEffects, ParceleEffects, BiljkeEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
