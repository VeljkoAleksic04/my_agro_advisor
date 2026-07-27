# Pokretanje projekta

1. Prvo se pokrene u korenu projekta docker compose up -d
2. U server folderu se vrsi sinhronizacija Prisma seme sa bazom, zatim se pokrene server:
	npx prisma db push
	npm run start:dev

3. Pokretanje angular frontend-a iz client foldera
	npm start ili ng serve
