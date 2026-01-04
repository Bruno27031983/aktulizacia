if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var indicator = document.getElementById('storageIndicator');
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().then(function(granted) {
      if (indicator) {
        if (granted) {
          indicator.textContent = 'Trvalé úložisko: Povolené';
          indicator.classList.add('storage-granted');
        } else {
          indicator.textContent = 'Trvalé úložisko: Dočasné';
          indicator.classList.add('storage-temporary');
        }
      }
    });
  } else if (indicator) {
    indicator.textContent = 'Trvalé úložisko: Nepodporované';
    indicator.classList.add('storage-unsupported');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var workDays = document.getElementById('workDays');
  var totalSalaryDiv = document.getElementById('totalSalary');
  var dataSizeText = document.getElementById('dataSizeText');
  var dataSizeFill = document.getElementById('dataSizeFill');
  var mainTitle = document.getElementById('mainTitle');
  var hourlyWageInput = document.getElementById('hourlyWageInput');
  var taxRateInput = document.getElementById('taxRateInput');
  var monthSelect = document.getElementById('monthSelect');
  var yearSelect = document.getElementById('yearSelect');
  var decimalPlacesSelect = document.getElementById('decimalPlacesSelect');
  var employeeNameInput = document.getElementById('employeeNameInput');

  var MAX_DATA_SIZE = 4 * 1024 * 1024;
  var MAX_DATA_SIZE_KB = MAX_DATA_SIZE / 1024;

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();

  function populateYearSelect() {
    for (var year = 2020; year <= 2030; year++) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }

  populateYearSelect();
  monthSelect.value = currentMonth;
  yearSelect.value = currentYear;

  var decimalPlaces = parseInt(localStorage.getItem('decimalPlaces')) || 1;
  decimalPlacesSelect.value = decimalPlaces;

  var employeeName = localStorage.getItem('employeeName') || '';
  employeeNameInput.value = employeeName;

  var hourlyWage = parseFloat(hourlyWageInput.value);
  var taxRate = parseFloat(taxRateInput.value) / 100;
  var monthData = {};

  function debounce(func, wait) {
    var timeout;
    return function() {
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() { func.apply(null, args); }, wait);
    };
  }

  var debouncedSaveToLocalStorage = debounce(saveToLocalStorage, 300);

  function showSaveNotification() {
    var notification = document.getElementById('saveNotification');
    notification.classList.add('show');
    setTimeout(function() { notification.classList.remove('show'); }, 2000);
  }

  function saveToLocalStorage() {
    try {
      var data = [];
      for (var i = 1; i <= getDaysInMonth(currentMonth); i++) {
        var startElement = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + i);
        var endElement = document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + i);
        var breakElement = document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + i);
        var grossElement = document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + i);
        var netElement = document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + i);
        data.push({
          start: startElement ? startElement.value : '',
          end: endElement ? endElement.value : '',
          breakTime: breakElement ? breakElement.value : '',
          gross: grossElement ? grossElement.value : '0.00',
          net: netElement ? netElement.value : '0.00'
        });
      }
      if (!monthData[currentYear]) monthData[currentYear] = {};
      monthData[currentYear][currentMonth] = data;
      var serializedData = JSON.stringify(monthData);
      var totalData = serializedData + JSON.stringify(hourlyWage) + JSON.stringify(taxRate) +
        JSON.stringify(document.body.classList.contains('dark-mode')) + JSON.stringify(decimalPlaces) + JSON.stringify(employeeName);
      if (new Blob([totalData]).size > MAX_DATA_SIZE) {
        alert('Prekročili ste maximálnu veľkosť dát (' + MAX_DATA_SIZE_KB.toFixed(2) + ' KB). Dáta neboli uložené.');
        return;
      }
      localStorage.setItem('workDaysData', serializedData);
      localStorage.setItem('hourlyWage', JSON.stringify(hourlyWage));
      localStorage.setItem('taxRate', JSON.stringify(taxRate));
      localStorage.setItem('darkMode', JSON.stringify(document.body.classList.contains('dark-mode')));
      localStorage.setItem('decimalPlaces', JSON.stringify(decimalPlaces));
      localStorage.setItem('employeeName', JSON.stringify(employeeName));
      updateDataSize();
      showSaveNotification();
    } catch (e) {}
  }

  function loadFromLocalStorage() {
    try {
      monthData = JSON.parse(localStorage.getItem('workDaysData')) || {};
      var storedHourlyWage = parseFloat(JSON.parse(localStorage.getItem('hourlyWage')));
      var storedTaxRate = parseFloat(JSON.parse(localStorage.getItem('taxRate')));
      var storedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
      decimalPlaces = parseInt(JSON.parse(localStorage.getItem('decimalPlaces'))) || 1;
      decimalPlacesSelect.value = decimalPlaces;
      employeeName = JSON.parse(localStorage.getItem('employeeName')) || '';
      employeeNameInput.value = employeeName;
      if (!isNaN(storedHourlyWage)) {
        hourlyWage = storedHourlyWage;
        hourlyWageInput.value = hourlyWage;
      }
      if (!isNaN(storedTaxRate)) {
        taxRate = storedTaxRate;
        taxRateInput.value = (taxRate * 100).toFixed(1);
      }
      var data = (monthData[currentYear] && monthData[currentYear][currentMonth]) || [];
      data.forEach(function(day, index) {
        var i = index + 1;
        var startElement = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + i);
        var endElement = document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + i);
        var breakElement = document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + i);
        var grossElement = document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + i);
        var netElement = document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + i);
        if (startElement && endElement && breakElement && grossElement && netElement) {
          startElement.value = day.start || '';
          endElement.value = day.end || '';
          breakElement.value = day.breakTime || '';
          grossElement.value = day.gross || '0.00';
          netElement.value = day.net || '0.00';
          calculateRow(i);
        }
      });
      calculateTotal();
      updateDataSize();
      if (storedDarkMode) applyDarkMode();
    } catch (e) {}
  }

  function applyDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelector('.container').classList.add('dark-mode');
    document.querySelectorAll('table, th, td, input').forEach(function(el) { el.classList.add('dark-mode'); });
    document.querySelectorAll('.btn').forEach(function(btn) { btn.classList.add('dark-mode'); });
    totalSalaryDiv.classList.add('dark-mode');
    mainTitle.classList.add('dark-mode');
    document.querySelector('.autor-info').classList.add('dark-mode');
    var currentDayRow = document.querySelector('.current-day');
    if (currentDayRow) currentDayRow.classList.add('dark-mode');
  }

  function getDayName(year, month, day) {
    var daysOfWeek = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
    return daysOfWeek[new Date(year, month, day).getDay()];
  }

  function createTable() {
    workDays.innerHTML = '';
    var currentDay = new Date().getDate();
    var currentMonthIndex = new Date().getMonth();
    var currentYearValue = new Date().getFullYear();
    for (var i = 1; i <= getDaysInMonth(currentMonth); i++) {
      var row = document.createElement('tr');
      if (i === currentDay && currentMonth === currentMonthIndex && currentYear === currentYearValue) {
        row.classList.add('current-day');
      }
      var dayName = getDayName(currentYear, currentMonth, i);
      row.innerHTML = '<td>Deň ' + i + ' (' + dayName + ')</td>' +
        '<td><input type="tel" id="start-' + currentYear + '-' + currentMonth + '-' + i + '" maxlength="5" pattern="[0-9:]*" inputmode="numeric" placeholder="HH:MM" data-next="end-' + currentYear + '-' + currentMonth + '-' + i + '"></td>' +
        '<td><input type="tel" id="end-' + currentYear + '-' + currentMonth + '-' + i + '" maxlength="5" pattern="[0-9:]*" inputmode="numeric" placeholder="HH:MM" data-next="break-' + currentYear + '-' + currentMonth + '-' + i + '"></td>' +
        '<td><input type="number" id="break-' + currentYear + '-' + currentMonth + '-' + i + '" min="0" step="0.5" placeholder="prestávka" data-day="' + i + '"></td>' +
        '<td id="total-' + currentYear + '-' + currentMonth + '-' + i + '">0h 0m (' + (0).toFixed(decimalPlaces) + ' h)</td>' +
        '<td><input type="number" id="gross-' + currentYear + '-' + currentMonth + '-' + i + '" min="0" step="0.01" placeholder="Hrubá Mzda" data-day="' + i + '" readonly></td>' +
        '<td><input type="number" id="net-' + currentYear + '-' + currentMonth + '-' + i + '" min="0" step="0.01" placeholder="Čistá Mzda" readonly></td>' +
        '<td><button class="btn reset-btn" data-day="' + i + '">Vynulovať</button></td>';
      workDays.appendChild(row);
    }
    attachTableEvents();
    loadFromLocalStorage();
  }

  function attachTableEvents() {
    workDays.querySelectorAll('input[type="tel"]').forEach(function(input) {
      input.addEventListener('input', function() {
        handleInput(this, this.dataset.next);
      });
    });
    workDays.querySelectorAll('input[id^="break-"]').forEach(function(input) {
      input.addEventListener('input', function() {
        handleBreakInput(parseInt(this.dataset.day));
      });
    });
    workDays.querySelectorAll('input[id^="gross-"]').forEach(function(input) {
      input.addEventListener('input', function() {
        handleGrossInput(parseInt(this.dataset.day));
      });
    });
    workDays.querySelectorAll('button.reset-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        resetRow(parseInt(this.dataset.day));
      });
    });
  }

  window.handleInput = function(input, nextId) {
    formatAndMoveNext(input, nextId);
    calculateAndUpdateTotals();
  };

  window.handleBreakInput = function(day) {
    calculateRow(day);
    var nextDay = day + 1;
    if (nextDay <= getDaysInMonth(currentMonth)) {
      var nextElement = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + nextDay);
      if (nextElement) nextElement.focus();
    }
    calculateAndUpdateTotals();
  };

  window.handleGrossInput = function(day) {
    updateNetSalary(day);
    calculateAndUpdateTotals();
  };

  function calculateAndUpdateTotals() {
    calculateTotal();
    debouncedSaveToLocalStorage();
  }

  function formatAndMoveNext(input, nextId) {
    var value = input.value.replace(/[^\d:]/g, '');
    if (value.length === 4 && value.indexOf(':') === -1) {
      value = value.slice(0, 2) + ':' + value.slice(2);
    }
    input.value = value;
    var day = parseInt(input.id.split('-')[3]);
    calculateRow(day);
    if (value.length === 5) {
      var parts = value.split(':').map(Number);
      if (parts[0] >= 0 && parts[0] < 24 && parts[1] >= 0 && parts[1] < 60) {
        var nextElement = document.getElementById(nextId);
        if (nextElement) nextElement.focus();
      } else {
        alert("Neplatný čas. Prosím, zadajte čas vo formáte HH:MM (napr. 06:30).");
        input.value = '';
      }
    }
  }

  function calculateRow(day) {
    var startTime = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + day).value;
    var endTime = document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + day).value;
    var breakTime = parseFloat(document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + day).value) || 0;
    if (startTime && endTime) {
      var startParts = startTime.split(':').map(Number);
      var endParts = endTime.split(':').map(Number);
      var startDate = new Date();
      startDate.setHours(startParts[0], startParts[1], 0, 0);
      var endDate = new Date();
      endDate.setHours(endParts[0], endParts[1], 0, 0);
      var diff = (endDate - startDate) / 60000 - (breakTime * 60);
      if (diff < 0) diff += 24 * 60;
      var hours = Math.floor(diff / 60);
      var minutes = Math.round(diff % 60);
      document.getElementById('total-' + currentYear + '-' + currentMonth + '-' + day).textContent =
        hours + 'h ' + minutes + 'm (' + (diff / 60).toFixed(decimalPlaces) + ' h)';
      var grossSalary = (diff / 60) * hourlyWage;
      document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + day).value =
        isFinite(grossSalary) ? grossSalary.toFixed(decimalPlaces) : '0.00';
      updateNetSalary(day);
    }
  }

  function updateNetSalary(day) {
    var grossSalary = parseFloat(document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + day).value) || 0;
    var netSalary = grossSalary * (1 - taxRate);
    document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + day).value =
      isFinite(netSalary) ? netSalary.toFixed(decimalPlaces) : '0.00';
  }

  window.resetRow = function(day) {
    document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + day).value = '';
    document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + day).value = '';
    document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + day).value = '';
    document.getElementById('total-' + currentYear + '-' + currentMonth + '-' + day).textContent = '0h 0m (' + (0).toFixed(decimalPlaces) + ' h)';
    document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + day).value = '0.00';
    document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + day).value = '0.00';
    calculateAndUpdateTotals();
  };

  window.resetAll = function() {
    if (confirm('Ste si istý, že chcete resetovať dáta pre aktuálny mesiac? Táto akcia sa nedá vrátiť späť.')) {
      if (monthData[currentYear] && monthData[currentYear][currentMonth]) {
        delete monthData[currentYear][currentMonth];
      }
      localStorage.setItem('workDaysData', JSON.stringify(monthData));
      createTable();
      calculateTotal();
    }
  };

  function calculateTotal() {
    var totalMinutes = 0, totalGrossSalary = 0, totalNetSalary = 0, daysWithEntries = 0;
    workDays.querySelectorAll('tr').forEach(function(row) {
      var totalCell = row.children[4];
      var grossInput = row.children[5].querySelector('input');
      var netInput = row.children[6].querySelector('input');
      if (totalCell && grossInput && netInput) {
        var match = totalCell.textContent.match(/(\d+)h (\d+)m/);
        if (match) {
          totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
          var gross = parseFloat(grossInput.value) || 0;
          var net = parseFloat(netInput.value) || 0;
          totalGrossSalary += gross;
          totalNetSalary += net;
          if (gross > 0 || net > 0) daysWithEntries++;
        }
      }
    });
    var totalHours = Math.floor(totalMinutes / 60);
    var totalMinutesRemainder = Math.round(totalMinutes % 60);
    var avgNet = daysWithEntries > 0 ? (totalNetSalary / daysWithEntries).toFixed(decimalPlaces) : 0;
    var avgMinutes = daysWithEntries > 0 ? totalMinutes / daysWithEntries : 0;
    totalSalaryDiv.innerHTML =
      'Počet odpracovaných dní: ' + daysWithEntries + '<br>' +
      'Celkový odpracovaný čas: ' + totalHours + 'h ' + totalMinutesRemainder + 'm (' + (totalMinutes / 60).toFixed(decimalPlaces) + ' h)<br>' +
      'Celková hrubá mzda: ' + totalGrossSalary.toFixed(decimalPlaces) + '€<br>' +
      'Celková čistá mzda: ' + totalNetSalary.toFixed(decimalPlaces) + '€<br>' +
      'Priemerná čistá mzda: ' + avgNet + '€<br>' +
      '<strong>Priemerný odpracovaný čas: ' + Math.floor(avgMinutes / 60) + 'h ' + Math.round(avgMinutes % 60) + 'm (' + (avgMinutes / 60).toFixed(decimalPlaces) + ' h)</strong>';
  }

  window.exportToPDF = function() {
    var doc = new window.jspdf.jsPDF();
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    doc.setFontSize(18);
    doc.text('Bruno\'s Calculator - Výkaz práce (' + getMonthName(currentMonth) + ' ' + currentYear + ')', 14, 20);
    doc.setFontSize(14);
    doc.text('Meno pracovníka: ' + employeeName, 14, 25);
    var tableData = [];
    for (var i = 1; i <= getDaysInMonth(currentMonth); i++) {
      var startTime = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + i).value;
      var endTime = document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + i).value;
      var breakTime = document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + i).value;
      if (startTime || endTime || breakTime) {
        tableData.push([
          'Deň ' + i + ' (' + getDayName(currentYear, currentMonth, i) + ')',
          startTime, endTime, breakTime,
          document.getElementById('total-' + currentYear + '-' + currentMonth + '-' + i).textContent,
          document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + i).value,
          document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + i).value
        ]);
      }
    }
    doc.autoTable({
      head: [['Deň', 'Príchod', 'Odchod', 'Prestávka', 'Odpracované', 'Hrubá Mzda (€)', 'Čistá Mzda (€)']],
      body: tableData,
      startY: 30,
      styles: { font: 'Roboto' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 25 }
    });
    doc.setFontSize(12);
    doc.text(totalSalaryDiv.innerText, 14, doc.lastAutoTable.finalY + 10);
    doc.save('brunos-calculator-report-' + getMonthName(currentMonth) + '-' + currentYear + '.pdf');
  };

  window.sendPDF = function() {
    var doc = new window.jspdf.jsPDF();
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');
    doc.setFontSize(18);
    doc.text('Bruno\'s Calculator - Výkaz práce (' + getMonthName(currentMonth) + ' ' + currentYear + ')', 14, 20);
    doc.setFontSize(14);
    doc.text('Meno pracovníka: ' + employeeName, 14, 25);
    var tableData = [];
    for (var i = 1; i <= getDaysInMonth(currentMonth); i++) {
      var startTime = document.getElementById('start-' + currentYear + '-' + currentMonth + '-' + i).value;
      var endTime = document.getElementById('end-' + currentYear + '-' + currentMonth + '-' + i).value;
      var breakTime = document.getElementById('break-' + currentYear + '-' + currentMonth + '-' + i).value;
      if (startTime || endTime || breakTime) {
        tableData.push([
          'Deň ' + i + ' (' + getDayName(currentYear, currentMonth, i) + ')',
          startTime, endTime, breakTime,
          document.getElementById('total-' + currentYear + '-' + currentMonth + '-' + i).textContent,
          document.getElementById('gross-' + currentYear + '-' + currentMonth + '-' + i).value,
          document.getElementById('net-' + currentYear + '-' + currentMonth + '-' + i).value
        ]);
      }
    }
    doc.autoTable({
      head: [['Deň', 'Príchod', 'Odchod', 'Prestávka', 'Odpracované', 'Hrubá Mzda (€)', 'Čistá Mzda (€)']],
      body: tableData,
      startY: 30,
      styles: { font: 'Roboto' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 25 }
    });
    doc.setFontSize(12);
    var pdfSummary = totalSalaryDiv.innerText.split('\n').filter(function(line) {
      return line.indexOf('Celková hrubá mzda') === -1 &&
             line.indexOf('Celková čistá mzda') === -1 &&
             line.indexOf('Priemerná čistá mzda') === -1;
    }).join('\n');
    doc.text(pdfSummary, 14, doc.lastAutoTable.finalY + 10);
    var pdfBlob = doc.output('blob');
    var pdfFile = new File([pdfBlob], 'brunos-calculator-report-' + getMonthName(currentMonth) + '-' + currentYear + '.pdf', { type: 'application/pdf' });
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      navigator.share({ files: [pdfFile], title: 'Bruno\'s Calculator Report', text: 'Pozrite si výkaz práce za ' + getMonthName(currentMonth) + ' ' + currentYear })
        .catch(function() { alert('Nastala chyba pri odosielaní PDF.'); });
    } else {
      alert('Funkcia zdieľania súborov nie je podporovaná vo vašom prehliadači.');
    }
  };

  window.createBackup = function() {
    var backup = {
      workDaysData: localStorage.getItem('workDaysData'),
      hourlyWage: localStorage.getItem('hourlyWage'),
      taxRate: localStorage.getItem('taxRate'),
      darkMode: localStorage.getItem('darkMode'),
      decimalPlaces: localStorage.getItem('decimalPlaces'),
      employeeName: localStorage.getItem('employeeName')
    };
    var blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup_' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  window.restoreBackup = function() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function(event) {
      var file = event.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var backup = JSON.parse(e.target.result);
          if (backup.workDaysData !== undefined) localStorage.setItem('workDaysData', backup.workDaysData);
          if (backup.hourlyWage !== undefined) localStorage.setItem('hourlyWage', backup.hourlyWage);
          if (backup.taxRate !== undefined) localStorage.setItem('taxRate', backup.taxRate);
          if (backup.darkMode !== undefined) localStorage.setItem('darkMode', backup.darkMode);
          if (backup.decimalPlaces !== undefined) localStorage.setItem('decimalPlaces', backup.decimalPlaces);
          if (backup.employeeName !== undefined) localStorage.setItem('employeeName', backup.employeeName);
          createTable();
          calculateTotal();
          updateDataSize();
          alert("Obnovenie zálohy bolo úspešné.");
        } catch (e) {
          alert("Nastala chyba pri obnove zálohy.");
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelectorAll('table, th, td, input').forEach(function(el) { el.classList.toggle('dark-mode'); });
    document.querySelectorAll('.btn').forEach(function(btn) { btn.classList.toggle('dark-mode'); });
    totalSalaryDiv.classList.toggle('dark-mode');
    mainTitle.classList.toggle('dark-mode');
    document.querySelector('.autor-info').classList.toggle('dark-mode');
    var currentDayRow = document.querySelector('.current-day');
    if (currentDayRow) currentDayRow.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(document.body.classList.contains('dark-mode')));
    updateDataSize();
  };

  function loadDarkMode() {
    var darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
    if (darkMode) applyDarkMode();
  }

  window.changeDecimalPlaces = function() {
    decimalPlaces = parseInt(decimalPlacesSelect.value);
    localStorage.setItem('decimalPlaces', JSON.stringify(decimalPlaces));
    calculateTotal();
    for (var i = 1; i <= getDaysInMonth(currentMonth); i++) calculateRow(i);
  };

  window.updateEmployeeName = function() {
    employeeName = employeeNameInput.value.trim();
    localStorage.setItem('employeeName', JSON.stringify(employeeName));
    debouncedSaveToLocalStorage();
  };

  window.updateSettings = function() {
    hourlyWage = parseFloat(hourlyWageInput.value);
    taxRate = parseFloat(taxRateInput.value) / 100;
    for (var i = 1; i <= getDaysInMonth(currentMonth); i++) calculateRow(i);
    calculateAndUpdateTotals();
  };

  window.changeMonth = function() {
    currentMonth = parseInt(monthSelect.value);
    createTable();
  };

  window.changeYear = function() {
    currentYear = parseInt(yearSelect.value);
    createTable();
  };

  function getDaysInMonth(month) {
    return new Date(currentYear, month + 1, 0).getDate();
  }

  function getMonthName(month) {
    return ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"][month];
  }

  function updateDataSize() {
    try {
      var totalData = (localStorage.getItem('workDaysData') || '{}') +
        (localStorage.getItem('hourlyWage') || '') + (localStorage.getItem('taxRate') || '') +
        (localStorage.getItem('darkMode') || 'false') + (localStorage.getItem('decimalPlaces') || '1') +
        (localStorage.getItem('employeeName') || '""');
      var bytes = new Blob([totalData]).size;
      var kilobytes = (bytes / 1024).toFixed(2);
      var percentageUsed = Math.min(((bytes / MAX_DATA_SIZE) * 100), 100);
      dataSizeText.textContent = 'Veľkosť dát: ' + kilobytes + ' KB / ' + MAX_DATA_SIZE_KB + ' KB';
      var widthClass = 'width-' + (Math.round(percentageUsed / 5) * 5);
      dataSizeFill.className = dataSizeFill.className.replace(/width-\d+/g, '').trim();
      dataSizeFill.classList.add(widthClass);
      dataSizeFill.classList.remove('data-fill-low', 'data-fill-medium', 'data-fill-high');
      if (bytes > MAX_DATA_SIZE || percentageUsed > 80) {
        dataSizeFill.classList.add('data-fill-high');
        if (bytes > MAX_DATA_SIZE) {
          alert('Aktuálna veľkosť dát (' + kilobytes + ' KB) prekročila maximálnu povolenú veľkosť (' + MAX_DATA_SIZE_KB + ' KB).');
        }
      } else if (percentageUsed > 50) {
        dataSizeFill.classList.add('data-fill-medium');
      } else {
        dataSizeFill.classList.add('data-fill-low');
      }
    } catch (e) {
      dataSizeText.textContent = 'Veľkosť dát: Nepodarilo sa vypočítať';
    }
  }

  createTable();
  calculateTotal();
  loadDarkMode();
  updateDataSize();

  document.getElementById('btnResetAll').addEventListener('click', resetAll);
  document.getElementById('btnExportPDF').addEventListener('click', exportToPDF);
  document.getElementById('btnSendPDF').addEventListener('click', sendPDF);
  document.getElementById('btnRestoreBackup').addEventListener('click', restoreBackup);
  document.getElementById('btnCreateBackup').addEventListener('click', createBackup);
  document.getElementById('btnDarkMode').addEventListener('click', toggleDarkMode);
  document.getElementById('employeeNameInput').addEventListener('input', updateEmployeeName);
  document.getElementById('hourlyWageInput').addEventListener('input', updateSettings);
  document.getElementById('taxRateInput').addEventListener('input', updateSettings);
  document.getElementById('monthSelect').addEventListener('change', changeMonth);
  document.getElementById('yearSelect').addEventListener('change', changeYear);
  document.getElementById('decimalPlacesSelect').addEventListener('change', changeDecimalPlaces);
});
