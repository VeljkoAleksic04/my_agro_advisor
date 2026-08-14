set -e
cd "$(dirname "$0")"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Nasumicna pauza izmedju 1h (3600s) i 2h (7200s)
pauza() {
  local sek=$(( RANDOM % 900 + 1800 ))
  local min=$(( sek / 60 ))
  log "Pauza od ${min} min pre sledeceg komita..."
  sleep "$sek"
}

log "[frontend] Povezivanje lista komponenti sa novim modalima"
git add frontend/src/app/features/parcele/parcele-lista/ frontend/src/app/features/biljke/biljke-lista/
git commit -m "refactor(lista): otvaranje detalja klikom na karticu, badge broja kultura"
pauza

log "[backend] Prisma sema"
git add backend/prisma/schema.prisma
git commit -m "feat(schema): status/povrsina/datumSadnje na Biljka, opis na Parcela, MRKVA->SARGAREPA"
pauza

log "[backend] Biljka DTO + servis (server racuna periode, proverava povrsinu)"
git add backend/src/biljka/dto/create-biljka.dto.ts backend/src/biljka/biljka.service.ts
git commit -m "feat(biljka): server racuna periode sadnje/berbe, validacija slobodne povrsine (409)"
pauza

log "[backend] Parcela DTO + servis (opis, _count.biljke)"
git add backend/src/parcela/dto/create-parcela.dto.ts backend/src/parcela/parcela.service.ts
git commit -m "feat(parcela): opis polje + _count.biljke za badge u listi"
pauza

log "[frontend] Modeli usklajeni sa backend semom"
git add frontend/src/app/core/models/domain.models.ts
git commit -m "refactor(models): uskladi Biljka/Parcela sa backend semom, ukloni mock polja"
pauza

log "[frontend] Novi API servisi za preparat i tretman (djubrenje)"
git add frontend/src/app/features/preparat/preparat-api.service.ts \
        frontend/src/app/features/tretman/tretman-api.service.ts
git commit -m "feat(preparat,tretman): API servisi za djubrenje i tretmane"
pauza

log "[frontend] Biljke store + forma + lista - povezano na pravi API"
git add frontend/src/app/features/biljke/biljke-api.service.ts \
        frontend/src/app/features/biljke/biljka-forma/biljka-forma.component.ts \
        frontend/src/app/features/biljke/biljka-forma/biljka-forma.component.html \
        frontend/src/app/features/biljke/biljke-lista/biljke-lista.component.ts \
        frontend/src/app/features/biljke/biljke-lista/biljke-lista.component.html \
        frontend/src/app/features/biljke/store/biljke.actions.ts \
        frontend/src/app/features/biljke/store/biljke.effects.ts \
        frontend/src/app/features/biljke/store/biljke.reducer.ts
git commit -m "refactor(biljke): povezi formu, listu i store na pravi API, hvatanje NEDOVOLJNO_POVRSINE"
pauza

log "[frontend] Modal akcija biljke - povezan na /biljke/:id/akcija i /tretmani"
git add frontend/src/app/features/biljke/biljka-detalji-modal/
git commit -m "feat(biljke): modal akcija povezan na /biljke/:id/akcija i /tretmani"
pauza

log "[frontend] Modal detalja parcele - store umesto mock podataka"
git add frontend/src/app/features/parcele/parcele-api.service.ts \
        frontend/src/app/features/parcele/parcela-detalji-modal/ \
        frontend/src/app/features/parcele/parcele-lista/parcele-lista.component.ts
git commit -m "feat(parcele): modal detalja koristi pravi store/API umesto mock podataka"
pauza
