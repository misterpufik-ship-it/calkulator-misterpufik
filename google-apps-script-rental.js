const RENTAL_SHEET_NAME = 'Аренда';
const BEANBAG_SHEET_NAME = 'Кресла мешки';

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents || '{}');
  const isBeanbag = data.orderType === 'Кресла мешки';
  const sheet = ss.getSheetByName(isBeanbag ? BEANBAG_SHEET_NAME : RENTAL_SHEET_NAME)
    || ss.insertSheet(isBeanbag ? BEANBAG_SHEET_NAME : RENTAL_SHEET_NAME);

  if (isBeanbag) {
    ensureBeanbagHeaders_(sheet);
    sheet.appendRow([
      data.date || '',
      data.whatOrdered || data.item || '',
      data.amount || '',
      data.cost || '',
      data.dimaProfit || '',
      data.nikitaProfit || '',
      data.profit || '',
      data.filler || '',
      data.paymentTo || '',
      data.result || '',
      data.nikitaBalance || '',
      data.payment || '',
      data.deliveryAmount || '',
      data.deliveryPaidBy || '',
    ]);
  } else {
    ensureRentalHeaders_(sheet);
    sheet.appendRow([
      data.createdAt || new Date(),
      data.date || '',
      data.client || '',
      data.phone || '',
      data.driver || '',
      data.item || '',
      data.colorSummary || '',
      data.quantity || '',
      data.days || '',
      data.unitPrice || '',
      data.subtotal || '',
      data.deliveryAmount || '',
      data.mountingAmount || '',
      data.amount || '',
      data.profit || '',
      data.dimaProfit || '',
      data.nikitaProfit || '',
      data.paymentTo || '',
      data.pickup || '',
      data.startDate || '',
      data.startTime || '',
      data.endDate || '',
      data.endTime || '',
      data.status || '',
      JSON.stringify(data.lines || []),
      data.comment || '',
    ]);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureRentalHeaders_(sheet) {
  ensureHeaders_(sheet, [
    'Создано',
    'Дата оформления',
    'Клиент',
    'Телефон',
    'Водитель',
    'Позиция',
    'Разбивка по цветам',
    'Количество',
    'Суток',
    'Цена за шт',
    'Аренда',
    'Доставка',
    'Монтаж',
    'Общая сумма',
    'Прибыль',
    'Диме',
    'Никите',
    'Кому оплата',
    'Самовывоз',
    'Дата доставки',
    'Время доставки',
    'Дата забора',
    'Время забора',
    'Статус',
    'Строки заказа',
    'Комментарий',
  ]);
}

function ensureBeanbagHeaders_(sheet) {
  ensureHeaders_(sheet, [
    'Дата оформления',
    'Что заказали',
    'Сумма',
    'Себест',
    'Диме',
    'Никите',
    'Прибыль',
    'Наполнитель',
    'У кого оплата',
    'Итог',
    'Баланс для Никиты',
    'Оплата',
    'Доставка',
    'Оплатил доставку',
  ]);
}

function ensureHeaders_(sheet, headers) {
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = current.some(Boolean);
  const needsUpdate = headers.some((header, index) => current[index] !== header);
  if (!hasHeaders || needsUpdate) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
