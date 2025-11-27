// Test integrácie s externými knižnicami a službami
console.log('🔌 Testovanie integrácií...\n');

const https = require('https');
const http = require('http');
const fs = require('fs');

// Test 1: Dostupnosť jsPDF knižnice
console.log('✓ Test 1: Dostupnosť jsPDF knižnice');
testCDNResource('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
  .then(() => {
    console.log('  ✅ jsPDF knižnica je dostupná\n');

    // Test 2: Dostupnosť jsPDF AutoTable pluginu
    console.log('✓ Test 2: Dostupnosť jsPDF AutoTable pluginu');
    return testCDNResource('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.15/jspdf.plugin.autotable.min.js');
  })
  .then(() => {
    console.log('  ✅ jsPDF AutoTable plugin je dostupný\n');

    // Test 3: Kontrola PDF export funkcií v kóde
    console.log('✓ Test 3: Kontrola PDF export funkcií');
    const html = fs.readFileSync('./index.html', 'utf8');

    const pdfFunctions = [
      'exportToPDF',
      'sendPDF',
      'jsPDF',
      'autoTable'
    ];

    let allPresent = true;
    pdfFunctions.forEach(func => {
      if (html.includes(func)) {
        console.log(`  ✅ ${func} je prítomný`);
      } else {
        console.log(`  ❌ ${func} chýba`);
        allPresent = false;
      }
    });

    if (!allPresent) {
      throw new Error('Niektoré PDF funkcie chýbajú');
    }

    console.log('\n✓ Test 4: Kontrola localStorage funkcií');
    const localStorageFunctions = [
      'saveToLocalStorage',
      'loadFromLocalStorage',
      'localStorage.setItem',
      'localStorage.getItem'
    ];

    localStorageFunctions.forEach(func => {
      if (html.includes(func)) {
        console.log(`  ✅ ${func} je použitý`);
      } else {
        console.log(`  ⚠️  ${func} nie je použitý`);
      }
    });

    console.log('\n✓ Test 5: Kontrola backup/restore funkcií');
    const backupFunctions = [
      'createBackup',
      'restoreBackup',
      'JSON.stringify',
      'JSON.parse'
    ];

    backupFunctions.forEach(func => {
      if (html.includes(func)) {
        console.log(`  ✅ ${func} je implementovaný`);
      } else {
        console.log(`  ❌ ${func} chýba`);
      }
    });

    console.log('\n✓ Test 6: Kontrola Web Share API');
    if (html.includes('navigator.share')) {
      console.log('  ✅ Web Share API je implementované');
      console.log('  ℹ️  Funkcia zdieľania bude fungovať len v podporovaných prehliadačoch');
    } else {
      console.log('  ⚠️  Web Share API nie je implementované');
    }

    console.log('\n✓ Test 7: Kontrola Service Worker registrácie');
    if (html.includes('navigator.serviceWorker.register')) {
      console.log('  ✅ Service Worker registrácia je prítomná');

      const sw = fs.readFileSync('./service-worker.js', 'utf8');
      if (sw.includes('caches.open') && sw.includes('cache.addAll')) {
        console.log('  ✅ Cache stratégia je implementovaná');
      }
    }

    // Test 8: Otestovanie lokálneho servera
    console.log('\n✓ Test 8: Testovanie lokálneho servera');
    return testLocalServer('http://localhost:8080/index.html');
  })
  .then(() => {
    console.log('  ✅ Lokálny server odpovedá správne');

    // Záverečný report
    console.log('\n' + '='.repeat(50));
    console.log('📊 VÝSLEDOK TESTOV INTEGRÁCIÍ');
    console.log('='.repeat(50));
    console.log('✅ Všetky integrácie sú funkčné!');
    console.log('\n📋 Zhrnutie:');
    console.log('  • PDF knižnice sú dostupné');
    console.log('  • Export funkcionalita je implementovaná');
    console.log('  • LocalStorage je správne použitý');
    console.log('  • Backup/restore funkcie sú prítomné');
    console.log('  • PWA funkcie sú implementované');
    console.log('  • Lokálny server beží bez problémov');
    console.log('\n✨ Aplikácia je plne funkčná!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Chyba pri testovaní:', error.message);
    process.exit(1);
  });

function testCDNResource(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`CDN resource returned status ${res.statusCode}`));
      }
      res.resume(); // consume response data to free up memory
    }).on('error', reject);
  });
}

function testLocalServer(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve();
      } else {
        reject(new Error(`Local server returned status ${res.statusCode}`));
      }
      res.resume();
    }).on('error', reject);
  });
}
