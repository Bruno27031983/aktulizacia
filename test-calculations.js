// Test výpočtov pracovného času
console.log('🧮 Testovanie výpočtov pracovného času...\n');

// Simulácia výpočtu odpracovaného času
function calculateWorkedTime(startTime, endTime, breakTime) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0, 0);

  let diff = (endDate - startDate) / 60000 - (breakTime * 60);
  if (diff < 0) diff += 24 * 60;

  const hours = Math.floor(diff / 60);
  const minutes = Math.round(diff % 60);
  const decimalHours = (diff / 60).toFixed(1);

  return { hours, minutes, decimalHours, totalMinutes: diff };
}

// Výpočet mzdy
function calculateSalary(workedMinutes, hourlyWage, taxRate) {
  const workedHours = workedMinutes / 60;
  const grossSalary = workedHours * hourlyWage;
  const netSalary = grossSalary * (1 - taxRate);

  return {
    grossSalary: grossSalary.toFixed(2),
    netSalary: netSalary.toFixed(2)
  };
}

// Test scenáre
const testCases = [
  {
    name: 'Štandardný 8-hodinový deň s prestávkou',
    startTime: '08:00',
    endTime: '16:30',
    breakTime: 0.5,
    hourlyWage: 10,
    taxRate: 0.02,
    expected: {
      hours: 8,
      minutes: 0,
      decimalHours: '8.0',
      grossSalary: '80.00',
      netSalary: '78.40'
    }
  },
  {
    name: 'Ranná zmena',
    startTime: '06:00',
    endTime: '14:00',
    breakTime: 0.5,
    hourlyWage: 10,
    taxRate: 0.02,
    expected: {
      hours: 7,
      minutes: 30,
      decimalHours: '7.5',
      grossSalary: '75.00',
      netSalary: '73.50'
    }
  },
  {
    name: 'Nočná zmena (cez polnoc)',
    startTime: '22:00',
    endTime: '06:00',
    breakTime: 0.5,
    hourlyWage: 10,
    taxRate: 0.02,
    expected: {
      hours: 7,
      minutes: 30,
      decimalHours: '7.5',
      grossSalary: '75.00',
      netSalary: '73.50'
    }
  },
  {
    name: 'Krátka zmena',
    startTime: '09:00',
    endTime: '13:00',
    breakTime: 0,
    hourlyWage: 10,
    taxRate: 0.02,
    expected: {
      hours: 4,
      minutes: 0,
      decimalHours: '4.0',
      grossSalary: '40.00',
      netSalary: '39.20'
    }
  },
  {
    name: 'Dlhá zmena s prestávkou',
    startTime: '07:00',
    endTime: '19:30',
    breakTime: 1,
    hourlyWage: 10,
    taxRate: 0.02,
    expected: {
      hours: 11,
      minutes: 30,
      decimalHours: '11.5',
      grossSalary: '115.00',
      netSalary: '112.70'
    }
  }
];

let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n✓ Test ${index + 1}: ${testCase.name}`);
  console.log(`  ⏰ Vstup: ${testCase.startTime} - ${testCase.endTime}, prestávka: ${testCase.breakTime}h`);

  const result = calculateWorkedTime(testCase.startTime, testCase.endTime, testCase.breakTime);
  const salary = calculateSalary(result.totalMinutes, testCase.hourlyWage, testCase.taxRate);

  let testPassed = true;

  // Kontrola odpracovaného času
  if (result.hours !== testCase.expected.hours) {
    console.log(`  ❌ Hodiny: očakávané ${testCase.expected.hours}, získané ${result.hours}`);
    testPassed = false;
  } else {
    console.log(`  ✅ Hodiny: ${result.hours}h`);
  }

  if (result.minutes !== testCase.expected.minutes) {
    console.log(`  ❌ Minúty: očakávané ${testCase.expected.minutes}, získané ${result.minutes}`);
    testPassed = false;
  } else {
    console.log(`  ✅ Minúty: ${result.minutes}m`);
  }

  if (result.decimalHours !== testCase.expected.decimalHours) {
    console.log(`  ❌ Desatinné hodiny: očakávané ${testCase.expected.decimalHours}, získané ${result.decimalHours}`);
    testPassed = false;
  } else {
    console.log(`  ✅ Desatinné hodiny: ${result.decimalHours}h`);
  }

  // Kontrola mzdy
  if (salary.grossSalary !== testCase.expected.grossSalary) {
    console.log(`  ❌ Hrubá mzda: očakávané ${testCase.expected.grossSalary}€, získané ${salary.grossSalary}€`);
    testPassed = false;
  } else {
    console.log(`  ✅ Hrubá mzda: ${salary.grossSalary}€`);
  }

  if (salary.netSalary !== testCase.expected.netSalary) {
    console.log(`  ❌ Čistá mzda: očakávané ${testCase.expected.netSalary}€, získané ${salary.netSalary}€`);
    testPassed = false;
  } else {
    console.log(`  ✅ Čistá mzda: ${salary.netSalary}€`);
  }

  if (testPassed) {
    passedTests++;
    console.log(`  🎉 Test prešiel!`);
  } else {
    failedTests++;
    console.log(`  💥 Test zlyhal!`);
  }
});

// Záverečný report
console.log('\n' + '='.repeat(50));
console.log('📊 VÝSLEDOK TESTOV VÝPOČTOV');
console.log('='.repeat(50));
console.log(`✅ Úspešné testy: ${passedTests}/${testCases.length}`);
console.log(`❌ Neúspešné testy: ${failedTests}/${testCases.length}`);

if (failedTests === 0) {
  console.log('\n🎉 Všetky výpočty fungujú správne!');
  process.exit(0);
} else {
  console.log('\n⚠️  Niektoré výpočty zlyhali!');
  process.exit(1);
}
