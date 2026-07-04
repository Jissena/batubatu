/**
 * Code.gs — Apps Script Web App untuk KKN-T 34
 *
 * CARA PAKAI:
 * 1. Buka spreadsheet kalian → Extensions → Apps Script
 * 2. Hapus isi default, paste seluruh isi file ini
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL yang muncul, paste ke SCRIPT_URL di data-villa.html,
 *    operasional.html, direktori.html, tentang.html, dan forum.html
 *
 * Lihat SETUP_GOOGLE_SHEETS.md untuk panduan lengkap.
 */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheetName = body.sheet;

    if (body.action === 'mark_done') {
      return markDone(sheetName, body.id);
    }

    return appendRow(sheetName, body.data);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendRow(sheetName, data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    // Tab belum ada (misal tab "Laporan"/"Kontak" belum dibuat manual) — buat otomatis
    // dengan kolom header sesuai key data yang dikirim dari form.
    sheet = ss.insertSheet(sheetName);
    var newHeaders = Object.keys(data);
    sheet.appendRow(newHeaders);
    sheet.getRange(1, 1, 1, newHeaders.length).setFontWeight('bold');
  }

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = headers.map(function (h) {
    var v = data[h];
    return (v === undefined || v === null) ? '' : v;
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Dipakai tombol "Tandai Selesai" di dashboard Laporan — cari baris dengan
// kolom "id" yang cocok, lalu isi kolom "status" jadi "Sudah Ditangani".
// Data TIDAK dihapus dari spreadsheet, hanya ditandai (biar tetap ada riwayatnya),
// tapi otomatis hilang dari daftar aktif di halaman Laporan (Dashboard Tim).
function markDone(sheetName, id) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Sheet "' + sheetName + '" tidak ditemukan' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var headers = values[0];
  var idCol = headers.indexOf('id');
  var statusCol = headers.indexOf('status');
  if (idCol === -1 || statusCol === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'Kolom id/status tidak ditemukan di tab ini' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      sheet.getRange(r + 1, statusCol + 1).setValue('Sudah Ditangani');
      break;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Dipakai untuk tes cepat lewat browser (buka URL Web App langsung)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Apps Script KKN-T 34 aktif.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
