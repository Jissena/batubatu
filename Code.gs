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
 *    operasional.html, dan forum.html
 *
 * Lihat SETUP_GOOGLE_SHEETS.md untuk panduan lengkap.
 */

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var sheetName = body.sheet;
    var data = body.data;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Sheet "' + sheetName + '" tidak ditemukan' }))
        .setMimeType(ContentService.MimeType.JSON);
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

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Dipakai untuk tes cepat lewat browser (buka URL Web App langsung)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: 'Apps Script KKN-T 34 aktif.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
