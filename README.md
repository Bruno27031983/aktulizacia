# Bruno's Calculator 🧮

Progressive Web Application (PWA) pre sledovanie pracovného času a výpočet mzdy.

## 📋 Popis

Bruno's Calculator je moderná webová aplikácia určená na evidenciu pracovného času, prestávok a automatický výpočet hrubej a čistej mzdy. Aplikácia funguje offline vďaka PWA technológii a umožňuje export dát do PDF formátu.

## ✨ Funkcie

- ✅ **Sledovanie pracovného času** - zaznamenávanie príchodu, odchodu a prestávok
- ✅ **Automatický výpočet mzdy** - hrubá a čistá mzda s nastaviteľnou daňou
- ✅ **Mesačné prehľady** - kalendár pre roky 2020-2030
- ✅ **Export do PDF** - profesionálne výkazy práce
- ✅ **Offline režim** - funguje bez pripojenia na internet (PWA)
- ✅ **Dark Mode** - tmavý režim pre pohodlie očí
- ✅ **Zálohovanie** - export a import dát v JSON formáte
- ✅ **Responzívny dizajn** - optimalizované pre mobily a tablety
- ✅ **Zdieľanie** - priame odoslanie PDF cez mobilné zariadenie

## 🚀 Inštalácia

### Spustenie v prehliadači

1. Otvorte súbor `index.html` v modernom webovom prehliadači
2. Aplikácia beží priamo bez potreby servera

### Inštalácia ako PWA

1. Otvorte aplikáciu v mobilnom prehliadači
2. Kliknite na "Pridať na domovskú obrazovku"
3. Aplikácia sa nainštaluje ako samostatná aplikácia

### Vývoj a testovanie

```bash
# Nainštalujte Node.js dependencies (pre testy)
npm install

# Spustite testy
npm test

# Spustite všetky testy
npm run test:all
```

## 📦 Požiadavky

- Moderný webový prehliadač (Chrome, Firefox, Safari, Edge)
- Pre PWA: HTTPS alebo localhost
- Pre testy: Node.js 12+

## 🔧 Konfigurácia

### Nastavenia aplikácie

- **Hodinová mzda** - predvolená hodnota: 10€
- **Daňové percento** - predvolená hodnota: 2%
- **Desatinné miesta** - 1 alebo 2 (pre zobrazenie mzdy)
- **Meno pracovníka** - zobrazí sa v PDF exportoch

### LocalStorage limit

Aplikácia používa LocalStorage s limitom 4 MB. Pri prekročení 80% kapacity sa zobrazí upozornenie.

## 📱 Použitie

1. **Zadajte svoje meno** a nastavte hodinovú mzdu
2. **Vyberte mesiac a rok** pre sledovanie
3. **Zadávajte časy** - príchod (HH:MM), odchod (HH:MM), prestávka (hodiny)
4. Aplikácia **automaticky vypočíta** odpracované hodiny a mzdu
5. **Exportujte výkaz** do PDF alebo vytvorte zálohu

### Klávesové skratky

- Po zadaní času vo formáte HH:MM sa kurzor automaticky presunie na ďalšie pole
- Tlačidlo "Vynulovať" vymaže záznam pre daný deň
- Tlačidlo "Resetovať všetko" vymaže všetky záznamy pre aktuálny mesiac

## 🛡️ Bezpečnosť

Aplikácia implementuje:

- ✅ Content Security Policy (CSP)
- ✅ Validácia vstupov
- ✅ Žiadne citlivé dáta sa neposielajú na server
- ✅ Všetky dáta sa ukladajú lokálne v prehliadači

Bezpečnostné auditované súbory:
- `test-app.js` - základné testy aplikácie
- `test-calculations.js` - testy výpočtov
- `test-integrations.js` - integračné testy
- `test-integrations-offline.js` - offline testy

## 🏗️ Technológie

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **PWA:** Service Worker, Web App Manifest
- **Export:** jsPDF, jsPDF-AutoTable
- **Storage:** LocalStorage API
- **Offline:** Cache API

## 📂 Štruktúra projektu

```
aktulizacia/
├── index.html              # Hlavná aplikácia
├── manifest.json           # PWA manifest
├── service-worker.js       # Service Worker pre offline režim
├── icons/                  # Ikony aplikácie
│   ├── icon-192.png
│   └── icon-512.png
├── test-app.js            # Testy aplikácie
├── test-calculations.js   # Testy výpočtov
├── test-integrations.js   # Integračné testy
└── test-integrations-offline.js  # Offline testy
```

## 🧪 Testovanie

```bash
# Základné testy aplikácie
npm test

# Testy výpočtov
npm run test:calculations

# Integračné testy
npm run test:integrations

# Offline testy
npm run test:offline

# Všetky testy
npm run test:all
```

## 🔄 Aktualizácie

Aplikácia používa Service Worker cache s verziou `brunos-calculator-cache-v2`. Pri aktualizácii aplikácie sa automaticky vymaže stará cache.

## 📄 Licencia

MIT License - Vytvoril a financoval Bruno

## 👨‍💻 Autor

**Bruno** - Vytvorené s ❤️ pre jednoduchú evidenciu práce

## 🐛 Hlásenie chyby

V prípade problémov vytvorte issue v GitHub repozitári.

## 📝 Changelog

### v2.0 (Aktuálna verzia)
- ✅ Pridaná Content Security Policy
- ✅ Odstránený podozrivý kód
- ✅ Vylepšené cache management
- ✅ Pridaná komplexná testovacia sada

### v1.0
- 🎉 Prvé vydanie aplikácie
- Základná funkcionalita sledovania času
- PWA podpora
- Export do PDF
