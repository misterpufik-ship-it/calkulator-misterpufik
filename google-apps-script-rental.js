const SHEET_NAME = 'Аренда';

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  ensureHeaders_(sheet);

  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    data.createdAt || new Date(),
    data.date || '',
    data.client || '',
    data.phone || '',
    data.driver || '',
    data.item || '',
    data.colorSummary || '',
    data.quantity || '',
    data.startDate || '',
    data.startTime || '',
    data.endDate || '',
    data.endTime || '',
    data.status || '',
    JSON.stringify(data.lines || []),
    data.comment || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureHeaders_(sheet) {
  const headers = [
    'Создано',
    'Дата оформления',
    'Клиент',
    'Телефон',
    'Водитель',
    'Позиция',
    'Разбивка по цветам',
    'Количество',
    'Дата доставки',
    'Время доставки',
    'Дата забора',
    'Время забора',
    'Статус',
    'Строки заказа',
    'Комментарий',
  ];
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = current.some(Boolean);
  const needsUpdate = headers.some((header, index) => current[index] !== header);
  if (!hasHeaders || needsUpdate) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
