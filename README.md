# AgroPlatforma

Full-stack aplikacija za evidenciju poljoprivrednih parcela i biljaka.

- **Backend:** NestJS + Prisma + PostgreSQL (Docker), Passport.js (JWT) auth
- **Frontend:** Angular 22 (standalone komponente, signali), NgRx (store, entity, effects), RxJS

---

## 0. Preduslovi

- Node.js **v22.22.3+** (ili v24.15+ / v26+) — proveri sa `node -v`
- npm 10+
- Docker Desktop (ili Docker Engine + Docker Compose)

Tvoja mašina (sa slike) ima Angular CLI 22.0.8 / Node 24.18.0 / npm 11.16.0 — to je **više nego dovoljno**, sve radi.

---

## 1. Pokretanje baze (Docker)

Iz korena projekta (`agroplatforma/`):

```bash
docker compose up -d
```

Ovo podiže PostgreSQL kontejner na `localhost:5432` sa korisnikom/bazom definisanim u `docker-compose.yml` (`agro_user` / `agro_pass` / baza `agroplatforma`). Proveri da je zdrav:

```bash
docker compose ps
```

---

## 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed      # opciono, ubacuje test podatke
npm run start:dev
```

Backend se pokreće na **http://localhost:3000/api**.

Ako `prisma migrate dev` ne uspe, proveri da li je Docker kontejner sa bazom zaista pokrenut (korak 1) i da `.env` sadrži tačan `DATABASE_URL`.

---

## 3. Frontend (Angular)

U novom terminalu:

```bash
cd frontend
npm install
npm start
```

Frontend se pokreće na **http://localhost:4200** i već je podešen (`environment.ts`) da gađa `http://localhost:3000/api`.

---

## 4. Redosled testiranja

1. Otvori `http://localhost:4200` → automatski te vodi na `/parcele`, a kako nisi ulogovan, guard te šalje na `/prijava`.
2. Klikni **"Registrujte se"**, popuni formu → nakon uspešne registracije automatski si ulogovan i token je sačuvan (`localStorage`), preusmerava te na `/parcele`.
3. Na `/parcele`: **"+ Nova parcela"** otvara formu, sačuvaj — parcela se odmah pojavljuje u listi (NgRx entity store). Pretraga po nazivu radi uživo (RxJS `merge` + `combineLatest`).
4. Idi na `/biljke`, izaberi parcelu iz padajućeg menija, dodaj biljku vezanu za nju.
5. Osveži stranicu (F5) — sesija se automatski obnavlja (`AuthActions.ucitajSacuvanuSesiju` poziva `/auth/me` sa sačuvanim tokenom).
6. Dugme 🌙/☀️ u zaglavlju menja temu (svetla/tamna), izbor se pamti u `localStorage`.
7. **"Odjava"** briše token i vraća te na `/prijava`.

---

## 5. Struktura frontenda (šta je urađeno u ovoj iteraciji)

```
frontend/src/app/
├── core/
│   ├── auth/store/          # actions, reducer, effects (uklj. obnovu sesije)
│   ├── guards/               # authGuard + guestGuard
│   └── interceptors/         # jwtInterceptor
├── features/
│   ├── auth/login, register  # NOVO
│   ├── parcele/               # NOVO: reducer (ngrx/entity), selectors, effects, lista + forma
│   └── biljke/                 # NOVO: api servis + kompletan store + lista + forma
├── shared/services/theme.service.ts   # NOVO: light/dark tema
├── app.component.ts/html/scss          # NOVO: navigacija, tema, obnova sesije
└── app.routes.ts                       # NOVO

frontend/src/styles.scss                # NOVO: CSS promenljive za svetlu/tamnu temu
```

### Bagovi koji su postojali u polaznom projektu i koje sam usput ispravio (build je bez toga pucao):
- `package.json` — nedostajali su `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools`, i TypeScript je bio zaključan na `~5.8.0` iako Angular 22 zahteva `~6.0.0`.
- `angular.json` — `assets` je pokazivao na nepostojeće `src/favicon.ico` i `src/assets`.
- `parcele-api.service.ts` — pogrešna relativna putanja ka `environment.ts` (jedan `../` previše).
- `AuthActions['Ucitaj Sacuvanu Sesiju']` — akcija je postojala, ali bez reducer grane i bez efekta (obnova sesije posle F5 ne bi radila).

Build je proveren lokalno (`ng build`) i prolazi bez grešaka.

---

## 6. Git

Repozitorijum još nije inicijalizovan u ovom zip-u. Preporučeno:

```bash
git init
git add .
git commit -m "Kompletiran frontend: parcele, biljke, auth komponente, rute, tema"
git remote add origin <tvoj-github-url>
git push -u origin main
```

Ubuduće commit-uj inkrementalno (po celinama), ne sve odjednom pred rok.
