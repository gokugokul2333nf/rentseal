/**
 * RentSeal order book.
 *
 * Receives a JSON submission from the site's /api/orders route and appends it
 * to the Orders tab. Headers are managed here rather than by hand: the first
 * submission writes them, and any later submission carrying a new field adds a
 * column for it, so the sheet keeps up with the form without breaking the rows
 * or formulas already in place.
 */
var SHEET_NAME = 'Orders';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    }

    var headers = sheet.getLastColumn()
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];

    // Put the columns an operator scans first at the front; everything else
    // follows in whatever order it arrives.
    var preferred = ['submittedAt', 'kind', 'contactName', 'contactPhone',
      'contactEmail', 'city', 'summary', 'estimate', 'notes', 'reference'];
    if (!headers.length) {
      headers = preferred.slice();
    }

    var added = false;
    Object.keys(data).forEach(function (key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        added = true;
      }
    });
    if (added || sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var row = headers.map(function (key) {
      var value = data[key];
      if (value === undefined || value === null) return '';
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'RentSeal order book' }))
    .setMimeType(ContentService.MimeType.JSON);
}
