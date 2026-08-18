set -e
cd "$(dirname "$0")"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Nasumicna pauza izmedju 1h (3600s) i 2h (7200s)
#pauza() {
 # local sek=$(( RANDOM % 900 + 1800 ))
  #local min=$(( sek / 60 ))
  #log "Pauza od ${min} min pre sledeceg komita..."
  #sleep "$sek"
#}

#!/bin/bash
# Skripta za redosledno izvršavanje git commit-ova sa pauzama između.
# Podesite je da bude izvršna: chmod +x commit-script.sh

set -e  # Prekida izvršavanje ako bilo koja komanda vrati grešku
# ==================================================================
# commit: ff9d5002677898952338c9cb9c6b38448298409a
# ==================================================================
log "==================================================================="
git add "backend/prisma/seed.ts"
git commit -m "fix(seed): findFirst+create/update umesto upsert po (parcelaId,vrsta); dodaj nazivKulture/vrstaKulture u sadnja.create"

# ===================================================================
sleep 749
# commit: 878c7250c37f6fa2c50a0871eb3a1f1bc08607a5
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/statistika/statistika-pregled/statistika-pregled.component.ts"
git commit -m "fix(statistika): Y osa grafikona sada raste dinamicki (0..trenutni max, zaokruzeno na lepu vrednost)"

# ===================================================================
sleep 1536
# commit: be9517fbc0bc97110eff56421ce36a6823542ebd
# ===================================================================
log "==================================================================="
git add "frontend/src/app/core/models/domain.models.ts"
git commit -m "feat(models): dodaj tipove za kreiranje preparata (TipPesticida, TipDjubriva, JedinicaKarence, Elementi, Sastojak, CreatePreparatZahtev)"

# ===================================================================
sleep 712
# commit: 453011eb8709d055a6f244fbce3bd9a11c1e6c12
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/preparat/preparat-api.service.ts"
git commit -m "feat(preparat): PreparatApiService sada kesira preparate i azurira ih odmah pri kreiranju
BehaviorSubject kes umesto obicnog HTTP GET-a na svaki ucitajSve() poziv -
kreiraj() dodaje novi preparat u kes, pa se on ODMAH pojavljuje u svim
dropdown listama (tretman biljke, djubrenje parcele) bez rucnog refetch-a."

# ===================================================================
sleep 1179
# commit: f8e460e3e6ac0f48a34362df9be6a05f36540006
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/preparat/preparat-forma-modal/preparat-forma-modal.component.html"
git add "frontend/src/app/features/preparat/preparat-forma-modal/preparat-forma-modal.component.scss"
git add "frontend/src/app/features/preparat/preparat-forma-modal/preparat-forma-modal.component.ts"
git commit -m "feat(preparat): modal komponenta za kreiranje sopstvenog preparata (pesticid/djubrivo)
Forma: naziv, proizvodjac, tip preparata (+ pod-tip pesticida/djubriva),
karenca, opis, i opcioni sastojci (element/kolicina/jedinica, dinamican
FormArray). 'podrazumevaniTip' Input unapred selektuje tip preparata u
zavisnosti od konteksta iz kog je modal otvoren (tretman -> pesticid,
djubrenje -> djubrivo)."

# ===================================================================
sleep 3841
# commit: bed5b9803f6fde4de88a54f5882888597788890e
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/biljke/biljka-detalji-modal/biljka-detalji-modal.component.html"
git add "frontend/src/app/features/biljke/biljka-detalji-modal/biljka-detalji-modal.component.scss"
git add "frontend/src/app/features/biljke/biljka-detalji-modal/biljka-detalji-modal.component.ts"
git commit -m "feat(biljka-modal): dugme '+ Novi preparat' u panelu Tretman, otvara PreparatFormaModalComponent
Nakon kreiranja, novi preparat se automatski selektuje u formi tretmana."

# ===================================================================
sleep 938
# commit: 475e1bf145eeb117719fac2a68fd881df2463613
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/parcele/parcela-detalji-modal/parcela-detalji-modal.component.html"
git add "frontend/src/app/features/parcele/parcela-detalji-modal/parcela-detalji-modal.component.ts"
git commit -m "feat(parcela-modal): dugme '+ Novo djubrivo' u panelu Djubrenje, otvara PreparatFormaModalComponent
Isti obrazac kao kod biljka-detalji-modal, samo sa podrazumevaniTip=DJUBRIVO."

# ===================================================================
sleep 693
# commit: e46fde94a7f192c289bece728beb34c9cb0ce06c
# ===================================================================
log "===================================================================log "===================================================================
git add "frontend/src/app/shared/components/korisnik-meni/korisnik-meni.component.html"
git add "frontend/src/app/shared/components/korisnik-meni/korisnik-meni.component.scss"
git add "frontend/src/app/shared/components/korisnik-meni/korisnik-meni.component.ts"
git commit -m "feat(korisnik-meni): deljena padajuca meni komponenta za ikonu korisnika
Prijavljen korisnik: 'Pregled profila' + 'Odjava'.
Neprijavljen: 'Prijava' + 'Registracija'.
Zatvara se klikom van menija (HostListener document:click)."

# ===================================================================
sleep 812
# commit: 988bc72cd930293043cdb7607e8cf91c8ff37211
# ===================================================================
log "==================================================================="
git add "frontend/src/app/features/landing/landing.component.html"
git add "frontend/src/app/features/landing/landing.component.ts"
git commit -m "feat(landing): ikona korisnika u zaglavlju sada otvara KorisnikMeniComponent (Prijava/Registracija/Profil/Odjava)
Hero CTA dugme ('Pridruži se' / 'Otvori profil') ostaje nepromenjeno -
i dalje direktno navigira, samo ikona u zaglavlju sada otvara meni."

# ===================================================================
sleep 2174
# commit: e5803d12baf1d394cd5f649cfc30fa734de13361
# ===================================================================
log "===================================================================
git add "frontend/src/app/features/profil/profil-layout/profil-layout.component.html"
git add "frontend/src/app/features/profil/profil-layout/profil-layout.component.scss"
git add "frontend/src/app/features/profil/profil-layout/profil-layout.component.ts"
git commit -m "feat(profil-zaglavlje): ikonice Chat/Forum i Obaveštenja + ikona korisnika sada otvara padajuci meni



log "========================================"
log "  Svi commit-ovi su uspešno izvršeni!   "
log "========================================"

git push
