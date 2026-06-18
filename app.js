const defaultSettings = {
  assemblyTiers: {
    foam: [
      { max: 10, price: 100 },
      { max: 50, price: 80 },
      { max: 1000, price: 70 },
    ],
    sintepon: [
      { max: 10, price: 200 },
      { max: 50, price: 170 },
      { max: 1000, price: 150 },
    ],
    syntheticFluff: [
      { max: 10, price: 150 },
      { max: 50, price: 130 },
      { max: 1000, price: 110 },
    ],
    combo: [
      { max: 10, price: 200 },
      { max: 50, price: 170 },
      { max: 1000, price: 150 },
    ],
  },
  sewingTiers: [
    { max: 170, price: 430 },
    { max: 200, price: 490 },
    { max: 230, price: 550 },
    { max: 260, price: 610 },
    { max: 290, price: 730 },
    { max: 320, price: 800 },
    { max: 350, price: 880 },
    { max: 390, price: 950 },
    { max: 420, price: 1050 },
  ],
  types: [
    { name: "Поролоновая подушка", coeff: 0, assembly: 100, assemblyTierKey: "foam", materialLogisticsCoeff: 1 },
    { name: "Поролоновая подушка с синтепоном", coeff: 0.2, assembly: 200, assemblyTierKey: "sintepon", materialLogisticsCoeff: 1 },
    { name: "Подушка с пуговицами", coeff: 1, assembly: 150, materialLogisticsCoeff: 0.8 },
    { name: "Подушки с Синтепухом", coeff: 0.2, assembly: 150, assemblyTierKey: "syntheticFluff", materialLogisticsCoeff: 0.8 },
    { name: "Подушки с синтепухом с перегородками", coeff: 0.5, assembly: 150, assemblyTierKey: "syntheticFluff", materialLogisticsCoeff: 0.8 },
    { name: "Комбинированная подушка", coeff: 0.8, assembly: 200, assemblyTierKey: "combo", materialLogisticsCoeff: 1 },
    { name: "Комбинированная подушка с перегородками", coeff: 1, assembly: 200, assemblyTierKey: "combo", materialLogisticsCoeff: 1 },
    { name: "Подушка на фанере", coeff: 1, assembly: 100, materialLogisticsCoeff: 2 },
  ],
  options: {
    leatheretteCoeff: 0.4,
    tiesCoeff: 0.05,
    velcroCoeff: 0.1,
    hiddenZipCoeff: 0.2,
    decorStitchCoeff: 0.3,
    pipingCoeff: 1,
    hardware: 20,
    spunbondPrice: 30,
    syntheticFluffPrice: 11000,
    buttonPrice: 20,
    defaultFabricPrice: 600,
    fabricAreaFactor: 0.85,
    cashlessCoeff: 1.05,
    materialLogisticsBase: 1000,
  },
  rentalRates: [
    { days: 1, price: 420, bulkPrice: 400 },
    { days: 2, price: 600, bulkPrice: 560 },
    { days: 3, price: 800, bulkPrice: 740 },
    { days: 4, price: 900, bulkPrice: 840 },
    { days: 5, price: 1000, bulkPrice: 920 },
    { days: 6, price: 1100, bulkPrice: 1000 },
    { days: 7, price: 1200, bulkPrice: 1100 },
  ],
  margins: [
    { max: 4, add: 1400 },
    { max: 7, add: 1300 },
    { max: 9, add: 1200 },
    { max: 19, add: 1100 },
    { max: 39, add: 1050 },
    { max: 99, add: 1000 },
    { max: 999, add: 900 },
  ],
};

const defaultCompany = {
  companyName: "Индивидуальный Предприниматель Андреев Никита Алексеевич",
  companyPhone: "+7 (993) 992-05-15",
  companyEmail: "info-misterpufik@yandex.ru",
  companySite: "misterpufik.ru",
  companyAddress: "197349, Санкт-Петербург, проспект Сизова, д. 34/18, кв. 452",
  companyDetails: "Индивидуальный Предприниматель Андреев Никита Алексеевич\nЮридический адрес: 197349, Санкт-Петербург, проспект Сизова, д. 34/18, кв. 452\nИНН: 781432056933\nОГРНИП: 312784734000451\nРасчетный счет: 40802810570010078905\nБИК: 044525092\nКор. счет: 30101810645250000092\nБанк: МОСКОВСКИЙ ФИЛИАЛ АО КБ «МОДУЛЬБАНК»",
  signerName: "Андреев Никита Алексеевич",
  signerTitle: "ИП",
  stampDataUrl: "",
  signatureDataUrl: "",
};

const defaultPlExpenses = [
  { name: "Аренда склада", amount: 16500 },
  { name: "ЗП Менеджера", amount: 80000 },
  { name: "Хостинг и домен", amount: 1000 },
];

const defaultRentalDrivers = ["Борис", "Филипп", "Алексей"];

const settingFields = [
  ["hardware", "Фурнитура, ₽"],
  ["spunbondPrice", "Цена спандбонда, ₽"],
  ["syntheticFluffPrice", "Цена синтепуха, ₽"],
  ["buttonPrice", "Пуговицы, ₽/шт"],
  ["defaultFabricPrice", "Цена ткани по умолчанию, ₽/м²"],
  ["fabricAreaFactor", "Коэффициент площади ткани"],
  ["cashlessCoeff", "Коэффициент безнала"],
];

const optionCoeffFields = [
  ["leatheretteCoeff", "Кожзам"],
  ["tiesCoeff", "Завязки"],
  ["velcroCoeff", "Липучки"],
  ["hiddenZipCoeff", "Потайная молния"],
  ["decorStitchCoeff", "Декоративная отстрочка"],
  ["pipingCoeff", "Канты"],
];

let settings = normalizeSettings(load("pillowCalcSettings", defaultSettings));
let company = normalizeCompany(load("pillowCalcCompany", defaultCompany));
company.signerTitle = "ИП";
let order = load("pillowCalcOrder", []);
let history = load("pillowCalcHistory", []);
let rentalRows = load("pillowCalcRentalRows", []);
let rentalOrder = load("pillowCalcRentalOrder", []);
let beanbagRows = load("pillowCalcBeanbagRows", []);
let rentalDrivers = normalizeRentalDrivers(load("pillowCalcRentalDrivers", defaultRentalDrivers));
let plExpenses = load("pillowCalcPlExpenses", defaultPlExpenses);
let rentalWebhook = load("pillowCalcRentalWebhook", "");
let historyTypeFilter = "all";
let selectedPlMonth = "";
let editingIndex = null;
let editingRentalRowIndex = null;
let editingRentalOrderLineIndex = null;
let isFinalized = false;
let databaseSaveTimer = null;
let suppressDatabaseSave = false;
let csrfToken = "";
const openHistoryDetails = new Set();

const storageKeys = [
  "pillowCalcSettings",
  "pillowCalcCompany",
  "pillowCalcOrder",
  "pillowCalcHistory",
  "pillowCalcRentalRows",
  "pillowCalcRentalOrder",
  "pillowCalcBeanbagRows",
  "pillowCalcRentalDrivers",
  "pillowCalcPlExpenses",
  "pillowCalcRentalWebhook",
];

const els = {
  form: document.querySelector("#calcForm"),
  quantity: document.querySelector("#quantity"),
  length: document.querySelector("#length"),
  width: document.querySelector("#width"),
  height: document.querySelector("#height"),
  foamDensity: document.querySelector("#foamDensity"),
  foamDensityField: document.querySelector("#foamDensityField"),
  pillowType: document.querySelector("#pillowType"),
  customOrder: document.querySelector("#customOrder"),
  customOrderFields: document.querySelector("#customOrderFields"),
  customSewingCost: document.querySelector("#customSewingCost"),
  customMaterial1Cost: document.querySelector("#customMaterial1Cost"),
  customMaterial2Cost: document.querySelector("#customMaterial2Cost"),
  customOtherCost: document.querySelector("#customOtherCost"),
  customTotalCost: document.querySelector("#customTotalCost"),
  customProfit: document.querySelector("#customProfit"),
  customSalePrice: document.querySelector("#customSalePrice"),
  paymentType: document.querySelector("#paymentType"),
  fabricPrice: document.querySelector("#fabricPrice"),
  fabricName: document.querySelector("#fabricName"),
  buttonsCountField: document.querySelector("#buttonsCountField"),
  buttonsCount: document.querySelector("#buttonsCount"),
  materialLogistics: document.querySelector("#materialLogistics"),
  coverOnly: document.querySelector("#coverOnly"),
  leatherette: document.querySelector("#leatherette"),
  ties: document.querySelector("#ties"),
  velcro: document.querySelector("#velcro"),
  hiddenZip: document.querySelector("#hiddenZip"),
  decorStitch: document.querySelector("#decorStitch"),
  piping: document.querySelector("#piping"),
  liveCost: document.querySelector("#liveCost"),
  livePrice: document.querySelector("#livePrice"),
  liveProfit: document.querySelector("#liveProfit"),
  breakdown: document.querySelector("#breakdown"),
  positionTitle: document.querySelector("#positionTitle"),
  orderTitle: document.querySelector("#orderTitle"),
  clientName: document.querySelector("#clientName"),
  clientRequisites: document.querySelector("#clientRequisites"),
  clientRequisitesFile: document.querySelector("#clientRequisitesFile"),
  productionTerm: document.querySelector("#productionTerm"),
  deliveryAmount: document.querySelector("#deliveryAmount"),
  addItemButton: document.querySelector("#addItemButton"),
  orderBody: document.querySelector("#orderBody"),
  itemsTotal: document.querySelector("#itemsTotal"),
  deliveryTotal: document.querySelector("#deliveryTotal"),
  orderTotal: document.querySelector("#orderTotal"),
  profitTotal: document.querySelector("#profitTotal"),
  headerTotal: document.querySelector("#headerTotal"),
  clearForm: document.querySelector("#clearForm"),
  clearOrder: document.querySelector("#clearOrder"),
  finalizeOrder: document.querySelector("#finalizeOrder"),
  saveManualCalc: document.querySelector("#saveManualCalc"),
  createProposal: document.querySelector("#createProposal"),
  beeButton: document.querySelector("#beeButton"),
  beeModal: document.querySelector("#beeModal"),
  beeClose: document.querySelector("#beeClose"),
  tiersList: document.querySelector("#tiersList"),
  typesList: document.querySelector("#typesList"),
  materialLogisticsList: document.querySelector("#materialLogisticsList"),
  marginList: document.querySelector("#marginList"),
  rentalRatesList: document.querySelector("#rentalRatesList"),
  generalSettings: document.querySelector("#generalSettings"),
  optionCoeffList: document.querySelector("#optionCoeffList"),
  saveSettings: document.querySelector("#saveSettings"),
  resetSettings: document.querySelector("#resetSettings"),
  addTier: document.querySelector("#addTier"),
  addType: document.querySelector("#addType"),
  companyName: document.querySelector("#companyName"),
  companyPhone: document.querySelector("#companyPhone"),
  companyEmail: document.querySelector("#companyEmail"),
  companySite: document.querySelector("#companySite"),
  companyAddress: document.querySelector("#companyAddress"),
  companyDetails: document.querySelector("#companyDetails"),
  signerName: document.querySelector("#signerName"),
  signerTitle: document.querySelector("#signerTitle"),
  stampFile: document.querySelector("#stampFile"),
  stampPreview: document.querySelector("#stampPreview"),
  saveCompany: document.querySelector("#saveCompany"),
  companyCard: document.querySelector("#companyCard"),
  historyBody: document.querySelector("#historyBody"),
  historyTypeFilter: document.querySelector("#historyTypeFilter"),
  clearHistory: document.querySelector("#clearHistory"),
  crmBody: document.querySelector("#crmBody"),
  crmTotalOrders: document.querySelector("#crmTotalOrders"),
  crmDoneOrders: document.querySelector("#crmDoneOrders"),
  crmPaidOrders: document.querySelector("#crmPaidOrders"),
  crmTotalProfit: document.querySelector("#crmTotalProfit"),
  crmPaidProfit: document.querySelector("#crmPaidProfit"),
  rentalForm: document.querySelector("#rentalForm"),
  rentalStatus: document.querySelector("#rentalStatus"),
  rentalDate: document.querySelector("#rentalDate"),
  rentalClient: document.querySelector("#rentalClient"),
  rentalPhone: document.querySelector("#rentalPhone"),
  rentalDriver: document.querySelector("#rentalDriver"),
  rentalDriverOther: document.querySelector("#rentalDriverOther"),
  rentalDriverOtherField: document.querySelector(".rental-driver-other"),
  newRentalDriver: document.querySelector("#newRentalDriver"),
  addRentalDriver: document.querySelector("#addRentalDriver"),
  rentalDriverList: document.querySelector("#rentalDriverList"),
  rentalStart: document.querySelector("#rentalStart"),
  rentalStartHour: document.querySelector("#rentalStartHour"),
  rentalStartMinute: document.querySelector("#rentalStartMinute"),
  rentalEnd: document.querySelector("#rentalEnd"),
  rentalEndHour: document.querySelector("#rentalEndHour"),
  rentalEndMinute: document.querySelector("#rentalEndMinute"),
  rentalStatusSelect: document.querySelector("#rentalStatusSelect"),
  rentalPickup: document.querySelector("#rentalPickup"),
  rentalDeliveryAmount: document.querySelector("#rentalDeliveryAmount"),
  rentalMountingAmount: document.querySelector("#rentalMountingAmount"),
  rentalPaymentTo: document.querySelector("#rentalPaymentTo"),
  rentalComment: document.querySelector("#rentalComment"),
  addRentalColorLine: document.querySelector("#addRentalColorLine"),
  rentalColorLines: document.querySelector("#rentalColorLines"),
  rentalWebhookUrl: document.querySelector("#rentalWebhookUrl"),
  saveRentalWebhook: document.querySelector("#saveRentalWebhook"),
  rentalOrderBody: document.querySelector("#rentalOrderBody"),
  rentalOrderQuantity: document.querySelector("#rentalOrderQuantity"),
  rentalOrderColorSummary: document.querySelector("#rentalOrderColorSummary"),
  rentalOrderDelivery: document.querySelector("#rentalOrderDelivery"),
  rentalOrderMounting: document.querySelector("#rentalOrderMounting"),
  rentalOrderTotal: document.querySelector("#rentalOrderTotal"),
  rentalOrderProfit: document.querySelector("#rentalOrderProfit"),
  clearRentalOrder: document.querySelector("#clearRentalOrder"),
  sendRentalOrder: document.querySelector("#sendRentalOrder"),
  rentalBody: document.querySelector("#rentalBody"),
  clearRentalRows: document.querySelector("#clearRentalRows"),
  rentalLiveDays: document.querySelector("#rentalLiveDays"),
  rentalLiveSubtotal: document.querySelector("#rentalLiveSubtotal"),
  rentalLiveDelivery: document.querySelector("#rentalLiveDelivery"),
  rentalLiveProfit: document.querySelector("#rentalLiveProfit"),
  rentalLiveTotal: document.querySelector("#rentalLiveTotal"),
  rentalLivePaymentTo: document.querySelector("#rentalLivePaymentTo"),
  rentalPriceTable: document.querySelector("#rentalPriceTable"),
  beanbagDate: document.querySelector("#beanbagDate"),
  beanbagWhat: document.querySelector("#beanbagWhat"),
  beanbagAmount: document.querySelector("#beanbagAmount"),
  beanbagDelivery: document.querySelector("#beanbagDelivery"),
  beanbagMounting: document.querySelector("#beanbagMounting"),
  beanbagPickup: document.querySelector("#beanbagPickup"),
  beanbagPaymentTo: document.querySelector("#beanbagPaymentTo"),
  beanbagPayment: document.querySelector("#beanbagPayment"),
  beanbagDeliveryPaidBy: document.querySelector("#beanbagDeliveryPaidBy"),
  beanbagCost: document.querySelector("#beanbagCost"),
  beanbagDima: document.querySelector("#beanbagDima"),
  beanbagNikita: document.querySelector("#beanbagNikita"),
  beanbagProfit: document.querySelector("#beanbagProfit"),
  saveBeanbagOrder: document.querySelector("#saveBeanbagOrder"),
  clearBeanbagRows: document.querySelector("#clearBeanbagRows"),
  beanbagBody: document.querySelector("#beanbagBody"),
  beanbagStatus: document.querySelector("#beanbagStatus"),
  plPeriodTitle: document.querySelector("#plPeriodTitle"),
  plMonthTabs: document.querySelector("#plMonthTabs"),
  plRevenueTotal: document.querySelector("#plRevenueTotal"),
  plGrossProfit: document.querySelector("#plGrossProfit"),
  plExpensesTotal: document.querySelector("#plExpensesTotal"),
  plNetProfit: document.querySelector("#plNetProfit"),
  plMargin: document.querySelector("#plMargin"),
  plReportBody: document.querySelector("#plReportBody"),
  plExpensesList: document.querySelector("#plExpensesList"),
  newPlExpenseName: document.querySelector("#newPlExpenseName"),
  newPlExpenseAmount: document.querySelector("#newPlExpenseAmount"),
  addPlExpense: document.querySelector("#addPlExpense"),
  savePlExpenses: document.querySelector("#savePlExpenses"),
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) return clone(fallback);
  try {
    return JSON.parse(saved);
  } catch (_error) {
    return saved;
  }
}

function normalizeSettings(value) {
  const merged = {
    ...clone(defaultSettings),
    ...value,
    options: { ...clone(defaultSettings.options), ...(value?.options || {}) },
  };
  merged.rentalRates = (value?.rentalRates?.length ? value.rentalRates : defaultSettings.rentalRates)
    .map((rate, index) => {
      const fallback = defaultSettings.rentalRates[index] || defaultSettings.rentalRates.at(-1);
      return {
        days: Math.max(1, number(rate.days, fallback.days)),
        price: Math.max(0, number(rate.price, fallback.price)),
        bulkPrice: Math.max(0, number(rate.bulkPrice, fallback.bulkPrice)),
      };
    })
    .sort((a, b) => a.days - b.days);
  const defaultTypes = defaultSettings.types;
  const fallbackValues = [1000, 1000, 800, 800, 800, 1000, 1000, 2000];
  const base = Math.max(1, number(merged.options.materialLogisticsBase, defaultSettings.options.materialLogisticsBase));
  merged.options.materialLogisticsBase = base;
  merged.types = (value?.types?.length ? value.types : defaultTypes).map((type, index) => {
    const defaultType = defaultTypes.find((item) => item.name === type.name) || defaultTypes[index] || {};
    const legacyAmount = number(type.materialLogistics, fallbackValues[index] ?? base);
    const coeff = number(
      type.materialLogisticsCoeff,
      number(defaultType.materialLogisticsCoeff, legacyAmount / base)
    );
    return {
      ...defaultType,
      ...type,
      assemblyTierKey: type.assemblyTierKey || defaultType.assemblyTierKey,
      materialLogisticsCoeff: Math.max(0, coeff),
    };
  });
  return merged;
}

function normalizeCompany(value) {
  const merged = { ...clone(defaultCompany), ...value };
  if (!merged.companyName || merged.companyName === "Название компании") {
    return clone(defaultCompany);
  }
  merged.signerTitle = "ИП";
  return merged;
}

function normalizeRentalDrivers(value) {
  const source = Array.isArray(value) ? value : [];
  return [...defaultRentalDrivers, ...source].reduce((drivers, name) => {
    const driver = String(name || "").trim();
    if (driver && !drivers.some((item) => item.toLowerCase() === driver.toLowerCase())) {
      drivers.push(driver);
    }
    return drivers;
  }, []);
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  if (!suppressDatabaseSave && storageKeys.includes(key)) scheduleDatabaseSave();
}

function apiPath(path) {
  return path.replace(/^\/+/, "");
}

async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const response = await fetch(apiPath("/api/csrf"));
  const result = await response.json();
  if (!response.ok || !result.csrfToken) throw new Error(result.error || "Не удалось получить CSRF-токен");
  csrfToken = result.csrfToken;
  return csrfToken;
}

async function crmPost(path, payload) {
  const token = await ensureCsrfToken();
  const response = await fetch(apiPath(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": token,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok === false) throw new Error(result.error || "Сервер вернул ошибку");
  return result;
}

function currentDatabaseState() {
  return {
    pillowCalcSettings: settings,
    pillowCalcCompany: company,
    pillowCalcOrder: order,
    pillowCalcHistory: history,
    pillowCalcRentalRows: rentalRows,
    pillowCalcRentalOrder: rentalOrder,
    pillowCalcBeanbagRows: beanbagRows,
    pillowCalcRentalDrivers: rentalDrivers,
    pillowCalcPlExpenses: plExpenses,
    pillowCalcRentalWebhook: rentalWebhook,
  };
}

function stateHas(state, key) {
  return Object.prototype.hasOwnProperty.call(state, key);
}

function applyDatabaseState(state) {
  if (!state || typeof state !== "object") return;
  suppressDatabaseSave = true;
  try {
    if (stateHas(state, "pillowCalcSettings")) settings = normalizeSettings(state.pillowCalcSettings);
    if (stateHas(state, "pillowCalcCompany")) {
      company = normalizeCompany(state.pillowCalcCompany);
      company.signerTitle = "ИП";
    }
    if (stateHas(state, "pillowCalcOrder")) order = Array.isArray(state.pillowCalcOrder) ? state.pillowCalcOrder : [];
    if (stateHas(state, "pillowCalcHistory")) history = Array.isArray(state.pillowCalcHistory) ? state.pillowCalcHistory : [];
    if (stateHas(state, "pillowCalcRentalRows")) rentalRows = Array.isArray(state.pillowCalcRentalRows) ? state.pillowCalcRentalRows : [];
    if (stateHas(state, "pillowCalcRentalOrder")) rentalOrder = Array.isArray(state.pillowCalcRentalOrder) ? state.pillowCalcRentalOrder : [];
    if (stateHas(state, "pillowCalcBeanbagRows")) beanbagRows = Array.isArray(state.pillowCalcBeanbagRows) ? state.pillowCalcBeanbagRows : [];
    if (stateHas(state, "pillowCalcRentalDrivers")) rentalDrivers = normalizeRentalDrivers(state.pillowCalcRentalDrivers);
    if (stateHas(state, "pillowCalcPlExpenses")) plExpenses = Array.isArray(state.pillowCalcPlExpenses) ? state.pillowCalcPlExpenses : clone(defaultPlExpenses);
    if (stateHas(state, "pillowCalcRentalWebhook")) rentalWebhook = String(state.pillowCalcRentalWebhook || "");

    Object.entries(currentDatabaseState()).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  } finally {
    suppressDatabaseSave = false;
  }
}

async function saveDatabaseState(reason = "browser-save") {
  try {
    await fetch(apiPath("/api/state"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, state: currentDatabaseState() }),
    });
  } catch (error) {
    console.warn("Database save skipped:", error);
  }
}

function scheduleDatabaseSave() {
  window.clearTimeout(databaseSaveTimer);
  databaseSaveTimer = window.setTimeout(() => saveDatabaseState(), 500);
}

async function syncDatabaseState() {
  try {
    const response = await fetch(apiPath("/api/state"));
    if (!response.ok) return;
    const result = await response.json();
    const state = result.state || {};
    if (Object.keys(state).length) {
      applyDatabaseState(state);
      renderAll();
      return;
    }
    await saveDatabaseState("initial-browser-state");
  } catch (error) {
    console.warn("Database sync skipped:", error);
  }
}

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function todayRu() {
  return new Intl.DateTimeFormat("ru-RU").format(new Date());
}

function parseDate(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return new Date(`${value.slice(0, 10)}T00:00:00`);
  const ruMatch = String(value).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (ruMatch) return new Date(Number(ruMatch[3]), Number(ruMatch[2]) - 1, Number(ruMatch[1]));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function displayDate(value) {
  const parsed = parseDate(value);
  if (!parsed) return value || "";
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${parsed.getFullYear()}`;
}

function inputDateValue(value) {
  const parsed = parseDate(value);
  if (!parsed) return "";
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${parsed.getFullYear()}-${month}-${day}`;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthName(key) {
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function completedRentalStatus(status) {
  return ["оплачен"].includes(String(status || "").trim().toLowerCase());
}

function statusDone(status) {
  return ["выполнен", "оплачен"].includes(String(status || "").trim().toLowerCase());
}

function statusPaid(status) {
  return String(status || "").trim().toLowerCase() === "оплачен";
}

function orderDone(item) {
  return Boolean(item?.done) || statusDone(item?.status);
}

function orderPaid(item) {
  return Boolean(item?.paid) || statusPaid(item?.status);
}

function statusFromChecks(done, paid, fallback = "Согласование") {
  if (paid) return "Оплачен";
  if (done) return "Выполнен";
  return statusDone(fallback) ? "Подтвержден" : fallback || "Согласование";
}

const orderPrefixes = {
  pillow: "P",
  rental: "A",
  beanbag: "K",
};

const orderStatusOptions = ["Согласование", "Подтвержден", "Выполнен", "Оплачен", "Отменен"];

function orderNumberValue(value) {
  const match = String(value || "").match(/(\d+)$/);
  return match ? Number(match[1]) : NaN;
}

function prefixedOrderNumber(kind, value, fallbackIndex = 0) {
  const prefix = orderPrefixes[kind] || "";
  const numberValue = orderNumberValue(value);
  if (Number.isFinite(numberValue)) return `${prefix}${numberValue}`;
  return fallbackIndex >= 0 ? `${prefix}${fallbackIndex + 1}` : "";
}

function nextOrderNumber(kind = "pillow") {
  const sources = kind === "rental" ? rentalRows : kind === "beanbag" ? beanbagRows : history;
  const usedNumbers = sources
    .map((item) => item.number)
    .map(orderNumberValue)
    .filter(Number.isFinite);
  return `${orderPrefixes[kind] || ""}${(usedNumbers.length ? Math.max(...usedNumbers) : 0) + 1}`;
}

function pillowStatus(item) {
  if (item.status) return item.status;
  if (item.paid) return "Оплачен";
  if (item.done) return "Выполнен";
  return "Согласование";
}

function statusSelect(kind, sourceIndex, value) {
  const current = value || "Согласование";
  return `
    <select class="table-input" data-history-status-kind="${kind}" data-history-status-index="${sourceIndex}">
      ${orderStatusOptions.map((status) => `<option value="${status}" ${status === current ? "selected" : ""}>${status}</option>`).join("")}
    </select>
  `;
}

function setHistoryOrderStatus(kind, index, status) {
  if (kind === "rental") {
    if (!rentalRows[index]) return;
    rentalRows[index].status = status;
    rentalRows[index].done = statusDone(status);
    rentalRows[index].paid = statusPaid(status);
    save("pillowCalcRentalRows", rentalRows);
    renderRentalRows();
  } else if (kind === "beanbag") {
    if (!beanbagRows[index]) return;
    beanbagRows[index].status = status;
    beanbagRows[index].payment = status === "Оплачен" ? "Оплачен" : beanbagRows[index].payment || "";
    save("pillowCalcBeanbagRows", beanbagRows);
    renderBeanbagRows();
  } else {
    if (!history[index]) return;
    history[index].status = status;
    history[index].done = statusDone(status);
    history[index].paid = statusPaid(status);
    save("pillowCalcHistory", history);
  }
  renderHistory();
  renderCrm();
  renderPl();
}

function currentInput() {
  const customTotalCost = Math.max(0, number(els.customTotalCost?.value));
  const customProfit = Math.max(0, number(els.customProfit?.value));
  const customSalePrice = Math.max(0, number(els.customSalePrice?.value, customTotalCost + customProfit));
  return {
    customOrder: Boolean(els.customOrder?.checked),
    quantity: Math.max(1, number(els.quantity.value, 1)),
    length: Math.max(0, number(els.length.value)),
    width: Math.max(0, number(els.width.value)),
    height: Math.max(0, number(els.height.value)),
    foamDensity: Math.max(1, number(els.foamDensity.value, 25)),
    type: els.pillowType.value,
    paymentType: els.paymentType.value,
    fabricPrice: Math.max(0, number(els.fabricPrice.value, settings.options.defaultFabricPrice)),
    fabricName: els.fabricName.value.trim(),
    buttonsCount: Math.max(0, number(els.buttonsCount.value)),
    materialLogistics: Math.max(0, number(els.materialLogistics.value, defaultMaterialLogistics(els.pillowType.value))),
    customSewingCost: Math.max(0, number(els.customSewingCost?.value)),
    customMaterial1Cost: Math.max(0, number(els.customMaterial1Cost?.value)),
    customMaterial2Cost: Math.max(0, number(els.customMaterial2Cost?.value)),
    customOtherCost: Math.max(0, number(els.customOtherCost?.value)),
    customTotalCost,
    customProfit,
    customSalePrice,
    coverOnly: els.coverOnly.checked,
    leatherette: els.leatherette.checked,
    ties: els.ties.checked,
    velcro: els.velcro.checked,
    hiddenZip: els.hiddenZip.checked,
    decorStitch: els.decorStitch.checked,
    piping: els.piping.checked,
  };
}

function orderMeta() {
  return {
    title: els.orderTitle.value.trim() || "Заказ подушек",
    clientName: els.clientName.value.trim(),
    clientRequisites: els.clientRequisites?.value.trim() || "",
    productionTerm: els.productionTerm.value.trim(),
    deliveryAmount: Math.max(0, number(els.deliveryAmount.value)),
  };
}

function getType(name) {
  return settings.types.find((type) => type.name === name) || settings.types[0];
}

function defaultMaterialLogistics(typeName) {
  const type = getType(typeName);
  const index = Math.max(0, settings.types.indexOf(type));
  const fallbackValues = [1000, 1000, 800, 800, 800, 1000, 1000, 2000];
  const base = Math.max(0, number(settings.options.materialLogisticsBase, defaultSettings.options.materialLogisticsBase));
  const coeff = number(type?.materialLogisticsCoeff, number(type?.materialLogistics, fallbackValues[index] ?? base) / Math.max(1, base));
  return Math.max(0, base * coeff);
}

function baseSewingPrice(sideSum) {
  const sorted = [...settings.sewingTiers].sort((a, b) => a.max - b.max);
  return (sorted.find((item) => sideSum <= item.max) || sorted.at(-1) || { price: 0 }).price;
}

function orderMarkup(quantity) {
  const sorted = [...settings.margins].sort((a, b) => a.max - b.max);
  return (sorted.find((item) => quantity <= item.max) || sorted.at(-1) || { add: 0 }).add;
}

function assemblyPrice(type, quantity) {
  const tiers = defaultSettings.assemblyTiers[type.assemblyTierKey] || [];
  const sorted = [...tiers].sort((a, b) => a.max - b.max);
  return (sorted.find((item) => quantity <= item.max) || sorted.at(-1) || { price: type.assembly || 0 }).price;
}

function usesFoam(typeName) {
  return ["Поролоновая подушка", "Поролоновая подушка с синтепоном", "Подушка на фанере"].includes(typeName);
}

function usesComboFoam(typeName) {
  return ["Комбинированная подушка", "Комбинированная подушка с перегородками"].includes(typeName);
}

function usesSpunbond(typeName) {
  return [
    "Подушка с пуговицами",
    "Подушки с Синтепухом",
    "Подушки с синтепухом с перегородками",
    "Комбинированная подушка",
    "Комбинированная подушка с перегородками",
  ].includes(typeName);
}

function usesFluff(typeName) {
  return ["Подушка с пуговицами", "Подушки с Синтепухом", "Подушки с синтепухом с перегородками"].includes(typeName);
}

function usesComboFluff(typeName) {
  return ["Комбинированная подушка", "Комбинированная подушка с перегородками"].includes(typeName);
}

function calculate(input) {
  if (input.customOrder) {
    const sewing = Math.max(0, number(input.customSewingCost));
    const material1 = Math.max(0, number(input.customMaterial1Cost));
    const material2 = Math.max(0, number(input.customMaterial2Cost));
    const other = Math.max(0, number(input.customOtherCost));
    const fallbackCost = sewing + material1 + material2 + other;
    const enteredTotalCost = Number(input.customTotalCost);
    const totalCost = enteredTotalCost > 0 ? enteredTotalCost : fallbackCost;
    const profit = Math.max(0, number(input.customProfit));
    const enteredSalePrice = Number(input.customSalePrice);
    const totalPrice = enteredSalePrice > 0 ? enteredSalePrice : totalCost + profit;
    return {
      sideSum: 0,
      volume: 0,
      area: 0,
      fabricArea: 0,
      baseSewing: sewing,
      coeff: 1,
      sewing,
      assembly: 0,
      hardware: other,
      foam: 0,
      spunbond: 0,
      syntheticFluff: 0,
      buttons: 0,
      fabric: material1 + material2,
      unitCost: totalCost,
      quantityCost: totalCost,
      markup: profit,
      preVatPrice: totalPrice,
      vatRate: 0,
      vatAmount: 0,
      paymentCoeff: 1,
      totalCost,
      totalPrice,
    };
  }
  const type = getType(input.type);
  const volume = input.length * input.width * input.height;
  const area = 2 * (input.length * input.width + input.length * input.height + input.width * input.height) * 0.0001;
  const fabricArea = area * settings.options.fabricAreaFactor;
  const sideSum = input.length + input.width + input.height;
  const baseSewing = baseSewingPrice(sideSum);
  const optionCoeff =
    type.coeff +
    (input.leatherette ? settings.options.leatheretteCoeff : 0) +
    (input.ties ? settings.options.tiesCoeff : 0) +
    (input.velcro ? settings.options.velcroCoeff : 0) +
    (input.hiddenZip ? settings.options.hiddenZipCoeff : 0) +
    (input.decorStitch ? settings.options.decorStitchCoeff : 0) +
    (input.piping ? settings.options.pipingCoeff : 0);
  const sewing = baseSewing * (1 + optionCoeff);
  const assembly = input.coverOnly ? 0 : assemblyPrice(type, input.quantity);
  const hardware = settings.options.hardware;
  const foam = input.coverOnly ? 0 : usesFoam(type.name) ? volume * 0.0173 * input.foamDensity / 25 : usesComboFoam(type.name) ? volume * 0.0092 * input.foamDensity / 25 : 0;
  const spunbond = usesSpunbond(type.name) ? area * settings.options.spunbondPrice : 0;
  const syntheticFluff = input.coverOnly ? 0 : usesFluff(type.name) ? volume * settings.options.syntheticFluffPrice / 1000000 : usesComboFluff(type.name) ? volume * settings.options.syntheticFluffPrice / 1000000 / 2 : 0;
  const buttons = type.name === "Подушка с пуговицами" ? input.buttonsCount * settings.options.buttonPrice : 0;
  const fabric = input.fabricPrice * fabricArea;
  const unitCost = sewing + assembly + hardware + foam + spunbond + syntheticFluff + buttons + fabric;
  const quantityCost = unitCost * input.quantity;
  const markup = orderMarkup(input.quantity) * input.quantity;
  const preVatPrice = quantityCost + markup;
  const vatRate = input.paymentType === "cashless" ? settings.options.cashlessCoeff - 1 : 0;
  const vatAmount = preVatPrice * vatRate;
  const paymentCoeff = 1 + vatRate;
  const totalPrice = preVatPrice + vatAmount;

  return {
    sideSum,
    volume,
    area,
    fabricArea,
    baseSewing,
    coeff: 1 + optionCoeff,
    sewing,
    assembly,
    hardware,
    foam,
    spunbond,
    syntheticFluff,
    buttons,
    fabric,
    unitCost,
    quantityCost,
    markup,
    preVatPrice,
    vatRate,
    vatAmount,
    paymentCoeff,
    totalCost: quantityCost,
    totalPrice,
  };
}

function manualNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function vatFromGross(gross, rate) {
  const value = Math.max(0, number(gross));
  const vatRate = Math.max(0, number(rate));
  return vatRate > 0 ? value * vatRate / (1 + vatRate) : 0;
}

function applyManualOverrides(item, line) {
  const manual = item.manual || {};
  const quantity = Math.max(1, number(item.input.quantity, 1));
  const sewingPrice = manualNumber(manual.sewingPrice, line.result.sewing);
  const sewingTotal = manualNumber(manual.sewingTotal, sewingPrice * quantity);
  const assemblyPrice = manualNumber(manual.assemblyPrice, line.result.assembly);
  const assemblyTotal = manualNumber(manual.assemblyTotal, assemblyPrice * quantity);
  const baseComponentCost = (line.result.sewing + line.result.assembly) * quantity;
  const finalCostBase = line.finalCost - baseComponentCost + sewingTotal + assemblyTotal;
  const totalFromUnit = Number.isFinite(Number(manual.unitPrice)) ? Math.max(0, Number(manual.unitPrice)) * quantity : null;
  const finalPrice = manualNumber(manual.finalPrice, totalFromUnit ?? line.finalPrice);
  const manualVat = manualNumber(manual.finalVat, vatFromGross(finalPrice, item.result.vatRate));
  const finalProfit = manualNumber(manual.finalProfit, finalPrice - finalCostBase);
  const finalCost = Math.max(0, finalPrice - finalProfit);
  return {
    ...line,
    sewingPrice,
    sewingTotal,
    assemblyPrice,
    assemblyTotal,
    finalVat: manualVat,
    finalPrice,
    finalCost,
    finalProfit,
    manual: {
      sewingPrice,
      sewingTotal,
      assemblyPrice,
      assemblyTotal,
      finalVat: manualVat,
      unitPrice: quantity > 0 ? finalPrice / quantity : 0,
      finalProfit,
      finalPrice,
    },
  };
}

function finalizedOrderLines() {
  const materialLogistics = materialLogisticsSummary();
  const totalQuantity = order.reduce((sum, item) => sum + Math.max(1, number(item.input.quantity, 1)), 0);
  return order.map((item) => ({
    ...item,
    result: calculate(item.input),
  })).map((item) => {
    const quantity = Math.max(1, number(item.input.quantity, 1));
    const logisticsShare = totalQuantity > 0 ? materialLogistics.net * quantity / totalQuantity : 0;
    const logisticsVat = logisticsShare * item.result.vatRate;
    const finalPrice = item.result.totalPrice + logisticsShare + logisticsVat;
    const finalCost = item.result.totalCost + logisticsShare;
    const line = {
      ...item,
      deliveryShare: 0,
      deliveryVat: 0,
      materialLogisticsShare: logisticsShare,
      materialLogisticsVat: logisticsVat,
      finalVat: item.result.vatAmount + logisticsVat,
      finalPrice,
      finalCost,
      finalProfit: finalPrice - finalCost,
    };
    return applyManualOverrides(item, line);
  });
}

function orderPayload(number = nextOrderNumber()) {
  const meta = orderMeta();
  const lines = finalizedOrderLines().map((item, index) => ({
    index: index + 1,
    type: item.input.customOrder ? "Кастомный заказ" : item.input.type,
    positionName: item.positionName || positionLabel(index),
    fabricName: item.input.fabricName || "",
    size: item.input.customOrder ? "" : `${item.input.length} x ${item.input.width} x ${item.input.height} см`,
    quantity: item.input.quantity,
    unitPrice: item.finalPrice / item.input.quantity,
    sewingPrice: item.sewingPrice,
    sewingTotal: item.sewingTotal,
    assemblyPrice: item.assemblyPrice,
    assemblyTotal: item.assemblyTotal,
    vatAmount: item.finalVat,
    vatRate: item.result.vatRate,
    costTotal: item.finalCost,
    profit: item.finalProfit,
    totalPrice: item.finalPrice,
  }));
  const delivery = deliverySummary();
  return {
    number,
    date: todayRu(),
    title: meta.title,
    clientName: meta.clientName,
    clientRequisites: meta.clientRequisites,
    productionTerm: meta.productionTerm,
    deliveryAmount: meta.deliveryAmount,
    deliveryGrossAmount: delivery.gross,
    deliveryVat: delivery.vat,
    totalVat: lines.reduce((sum, item) => sum + item.vatAmount, 0) + delivery.vat,
    total: lines.reduce((sum, item) => sum + item.totalPrice, 0) + delivery.gross,
    lines,
    company,
  };
}

function materialLogisticsSummary() {
  const net = isFinalized
    ? order.reduce((sum, item) => sum + (item.input.customOrder ? 0 : Math.max(0, number(item.input.materialLogistics, defaultMaterialLogistics(item.input.type)))), 0)
    : 0;
  return { net };
}

function deliverySummary() {
  const net = isFinalized ? orderMeta().deliveryAmount : 0;
  const needsVat = order.some((item) => item.input.paymentType === "cashless");
  const vatRate = needsVat ? settings.options.cashlessCoeff - 1 : 0;
  const vat = net * vatRate;
  return { net, vatRate, vat, gross: net + vat };
}

function renderTypeOptions() {
  const current = els.pillowType.value;
  els.pillowType.innerHTML = settings.types
    .map((type) => `<option value="${escapeHtml(type.name)}">${escapeHtml(type.name)}</option>`)
    .join("");
  if (settings.types.some((type) => type.name === current)) els.pillowType.value = current;
}

function renderLive() {
  renderPositionTitle();
  renderCustomOrderVisibility();
  renderFoamDensityVisibility();
  renderButtonsVisibility();
  const input = currentInput();
  const result = calculate(input);
  els.liveCost.textContent = `Себестоимость: ${money(result.totalCost)}`;
  els.livePrice.textContent = `Цена: ${money(result.totalPrice)}`;
  els.liveProfit.textContent = `Прибыль: ${money(result.totalPrice - result.totalCost)}`;
  if (input.customOrder) {
    els.breakdown.innerHTML = [
      ["Стоимость пошива", money(input.customSewingCost)],
      ["Стоимость материала 1", money(input.customMaterial1Cost)],
      ["Стоимость материала 2", money(input.customMaterial2Cost)],
      ["Другие расходы", money(input.customOtherCost)],
      ["Итого себестоимость", money(result.totalCost)],
      ["Прибыль", money(result.totalPrice - result.totalCost)],
      ["Цена реализации", money(result.totalPrice)],
    ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    return;
  }
  els.breakdown.innerHTML = [
    ["Сумма сторон", `${result.sideSum.toFixed(1)} см`],
    ["Базовый пошив", money(result.baseSewing)],
    ["Коэффициент", result.coeff.toFixed(2)],
    ["Пошив", money(result.sewing)],
    ["Сборка", money(result.assembly)],
    ["Фурнитура", money(result.hardware)],
    ["Поролон", money(result.foam)],
    ["Спандбонд", money(result.spunbond)],
    ["Синтепух", money(result.syntheticFluff)],
    ["Ткань", input.fabricName ? `${escapeHtml(input.fabricName)} · ${money(result.fabric)}` : money(result.fabric)],
    ["Пуговицы", money(result.buttons)],
    ["Логистика материала", money(input.materialLogistics)],
    ["Наценка", money(result.markup)],
    ["НДС, 5%", money(result.vatAmount)],
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
}

function nextPositionNumber() {
  return editingIndex === null ? order.length + 1 : editingIndex + 1;
}

function positionLabel(index) {
  return `Позиция ${index + 1}`;
}

function renderPositionTitle() {
  if (!els.positionTitle) return;
  els.positionTitle.textContent = editingIndex === null ? `Позиция ${order.length + 1}` : `Позиция ${editingIndex + 1}`;
}

function renderFoamDensityVisibility() {
  if (!els.foamDensityField) return;
  if (els.customOrder?.checked) {
    els.foamDensityField.classList.add("calc-hidden");
    return;
  }
  const typeName = els.pillowType.value;
  const shouldShow = usesFoam(typeName) || usesComboFoam(typeName);
  els.foamDensityField.classList.toggle("calc-hidden", !shouldShow);
}

function renderButtonsVisibility() {
  if (!els.buttonsCountField) return;
  if (els.customOrder?.checked) {
    els.buttonsCountField.classList.add("calc-hidden");
    return;
  }
  const shouldShow = els.pillowType.value === "Подушка с пуговицами";
  els.buttonsCountField.classList.toggle("calc-hidden", !shouldShow);
  if (!shouldShow) els.buttonsCount.value = 0;
}

function renderCustomOrderVisibility() {
  const isCustom = Boolean(els.customOrder?.checked);
  document.querySelectorAll("#calcForm .auto-calc-field").forEach((field) => {
    field.classList.toggle("calc-hidden", isCustom);
  });
  els.customOrderFields?.classList.toggle("calc-hidden", !isCustom);
}

function syncCustomOrderInputs(changedInput) {
  if (!els.customOrder?.checked || !changedInput?.id) return;
  const costPartIds = ["customSewingCost", "customMaterial1Cost", "customMaterial2Cost", "customOtherCost"];
  if (costPartIds.includes(changedInput.id)) {
    const totalCost = costPartIds.reduce((sum, id) => sum + Math.max(0, number(els[id]?.value)), 0);
    if (els.customTotalCost) els.customTotalCost.value = Math.round(totalCost);
  }
  if ([...costPartIds, "customTotalCost", "customProfit"].includes(changedInput.id)) {
    const totalCost = Math.max(0, number(els.customTotalCost?.value));
    const profit = Math.max(0, number(els.customProfit?.value));
    if (els.customSalePrice) els.customSalePrice.value = Math.round(totalCost + profit);
  }
}

function openBeeModal() {
  if (!els.beeModal) return;
  els.beeModal.classList.add("is-open");
  els.beeModal.setAttribute("aria-hidden", "false");
}

function closeBeeModal() {
  if (!els.beeModal) return;
  els.beeModal.classList.remove("is-open");
  els.beeModal.setAttribute("aria-hidden", "true");
}

function renderOrder() {
  const lines = finalizedOrderLines();
  if (!lines.length) {
    els.orderBody.innerHTML = `<tr class="empty-row"><td colspan="12">Позиции пока не добавлены</td></tr>`;
  } else {
    const rows = lines.map((item, index) => {
      const isCustom = Boolean(item.input.customOrder);
      const typeLabel = isCustom ? "Кастомный заказ" : item.input.type;
      const size = isCustom ? "" : `${item.input.length} x ${item.input.width} x ${item.input.height} см`;
      const fabricText = item.input.fabricName ? `<br><span class="muted-cell">Ткань: ${escapeHtml(item.input.fabricName)}</span>` : "";
      return `
        <tr data-other-unit-cost="${(item.finalCost - item.sewingTotal - item.assemblyTotal) / Math.max(1, number(item.input.quantity, 1))}">
          <td><input class="table-input" type="text" value="${escapeHtml(item.positionName || positionLabel(index))}" data-order-edit="${index}" data-field="positionName"><br><span class="muted-cell">${escapeHtml(typeLabel)}</span>${fabricText}</td>
          <td>
            ${isCustom ? `<span class="muted-cell">Ручной расчёт</span>` : `<div class="size-inputs">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.length}" data-order-edit="${index}" data-field="length" aria-label="Длина">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.width}" data-order-edit="${index}" data-field="width" aria-label="Ширина">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.height}" data-order-edit="${index}" data-field="height" aria-label="Высота">
            </div>
            <span class="muted-cell">${size}</span>`}
          </td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="1" step="1" value="${item.input.quantity}" data-order-edit="${index}" data-field="quantity"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.sewingPrice)}" data-order-edit="${index}" data-field="sewingPrice"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.sewingTotal)}" data-order-edit="${index}" data-field="sewingTotal"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.assemblyPrice)}" data-order-edit="${index}" data-field="assemblyPrice"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.assemblyTotal)}" data-order-edit="${index}" data-field="assemblyTotal"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.finalVat)}" data-order-edit="${index}" data-field="finalVat"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.finalPrice / item.input.quantity)}" data-order-edit="${index}" data-field="unitPrice"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.finalProfit)}" data-order-edit="${index}" data-field="finalProfit"></td>
          <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(item.finalPrice)}" data-order-edit="${index}" data-field="finalPrice"></td>
          <td>
            <div class="row-actions">
              <button class="icon-btn" type="button" data-edit="${index}" title="Редактировать">✎</button>
              <button class="icon-btn" type="button" data-remove="${index}" title="Удалить">×</button>
            </div>
          </td>
        </tr>
      `;
    });
    const delivery = deliverySummary();
    if (delivery.gross > 0) {
      rows.push(`
        <tr>
          <td><strong>Доставка</strong></td>
          <td></td>
          <td class="numeric">1</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td class="numeric">${money(delivery.vat)}</td>
          <td class="numeric">${money(delivery.gross)}</td>
          <td class="numeric">${money(0)}</td>
          <td class="numeric">${money(delivery.gross)}</td>
          <td></td>
        </tr>
      `);
    }
    els.orderBody.innerHTML = rows.join("");
  }
  const itemsTotal = lines.reduce((sum, item) => sum + item.finalPrice, 0);
  const delivery = deliverySummary();
  const total = itemsTotal + delivery.gross;
  const profit = lines.reduce((sum, item) => sum + item.finalProfit, 0);
  els.itemsTotal.textContent = money(itemsTotal);
  els.deliveryTotal.textContent = money(delivery.gross);
  els.orderTotal.textContent = money(total);
  els.profitTotal.textContent = money(profit);
  if (els.headerTotal) els.headerTotal.textContent = money(total);
}

function renderSettings() {
  els.tiersList.innerHTML = settings.sewingTiers.map((tier, index) => `
    <div class="editor-row">
      <label>До суммы сторон, см<input type="number" min="1" step="1" value="${tier.max}" data-tier="${index}" data-field="max"></label>
      <label>Стоимость, ₽<input type="number" min="0" step="1" value="${tier.price}" data-tier="${index}" data-field="price"></label>
      <button class="icon-btn" type="button" data-remove-tier="${index}" title="Удалить">×</button>
    </div>
  `).join("");

  els.typesList.innerHTML = settings.types.map((type, index) => `
    <div class="editor-row type-row">
      <label>Тип<input type="text" value="${escapeHtml(type.name)}" data-type="${index}" data-field="name"></label>
      <label>Коэфф.<input type="number" step="0.01" value="${type.coeff}" data-type="${index}" data-field="coeff"></label>
      <label>Сборка<input type="number" min="0" step="1" value="${type.assembly}" data-type="${index}" data-field="assembly"></label>
      <button class="icon-btn" type="button" data-remove-type="${index}" title="Удалить">×</button>
    </div>
  `).join("");

  els.generalSettings.innerHTML = settingFields.map(([key, label]) => `
    <label>${label}<input type="number" step="0.01" value="${settings.options[key]}" data-option="${key}"></label>
  `).join("");

  els.materialLogisticsList.innerHTML = `
    <div class="editor-row logistics-base-row">
      <label>База логистики, ₽<input type="number" min="0" step="1" value="${settings.options.materialLogisticsBase}" data-option="materialLogisticsBase"></label>
      <span></span>
      <span></span>
    </div>
    ${settings.types.map((type, index) => {
      const amount = Math.max(0, number(settings.options.materialLogisticsBase) * number(type.materialLogisticsCoeff, 1));
      return `
        <div class="editor-row logistics-row">
          <span class="readonly-label">${escapeHtml(type.name)}</span>
          <label>Коэфф.<input type="number" min="0" step="0.01" value="${number(type.materialLogisticsCoeff, 1)}" data-logistics="${index}"></label>
          <span class="amount-preview">${money(amount)}</span>
        </div>
      `;
    }).join("")}
  `;

  els.optionCoeffList.innerHTML = optionCoeffFields.map(([key, label]) => `
    <label>${label}<input type="number" step="0.01" value="${settings.options[key]}" data-option="${key}"></label>
  `).join("");

  els.marginList.innerHTML = settings.margins.map((tier, index) => `
    <div class="editor-row margin-row">
      <label>До количества<input type="number" min="1" step="1" value="${tier.max}" data-margin="${index}" data-field="max"></label>
      <label>Наценка за штуку, ₽<input type="number" min="0" step="1" value="${tier.add}" data-margin="${index}" data-field="add"></label>
      <span></span>
    </div>
  `).join("");

  if (els.rentalRatesList) {
    els.rentalRatesList.innerHTML = settings.rentalRates.map((rate, index) => `
      <div class="editor-row rental-rate-row">
        <label>Суток<input type="number" min="1" step="1" value="${rate.days}" data-rental-rate="${index}" data-field="days"></label>
        <label>До 39 шт, ₽<input type="number" min="0" step="1" value="${rate.price}" data-rental-rate="${index}" data-field="price"></label>
        <label>От 40 шт, ₽<input type="number" min="0" step="1" value="${rate.bulkPrice}" data-rental-rate="${index}" data-field="bulkPrice"></label>
      </div>
    `).join("");
  }
}

function renderCompany() {
  Object.keys(defaultCompany).forEach((key) => {
    if (els[key] && !key.endsWith("DataUrl")) els[key].value = company[key] || "";
  });
  els.stampPreview.src = company.stampDataUrl || "assets/signature_stamp.png";
}

function readCompanyFromForm() {
  ["companyName", "companyPhone", "companyEmail", "companySite", "companyAddress", "companyDetails", "signerName", "signerTitle"].forEach((key) => {
    company[key] = els[key].value;
  });
  save("pillowCalcCompany", company);
  return company;
}

function renderHistory() {
  const rows = combinedOrders().filter((item) => historyTypeFilter === "all" || item.orderType === historyTypeFilter);
  if (!rows.length) {
    els.historyBody.innerHTML = `<tr class="empty-row"><td colspan="10">Заказов пока нет</td></tr>`;
    renderCrm();
    renderPl();
    return;
  }
  els.historyBody.innerHTML = rows.map((entry) => {
    const item = entry.source;
    const isPillow = entry.kind === "pillow";
    const sourceIndex = entry.sourceIndex;
    return `
    <tr class="history-main-row" ${isPillow ? `data-toggle-history="${sourceIndex}"` : ""}>
      <td>${escapeHtml(displayDate(item.date))}</td>
      <td>${escapeHtml(item.number || "-")}</td>
      <td>${escapeHtml(entry.orderType)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td class="numeric">${item.quantity}</td>
      <td>${statusSelect(entry.kind, sourceIndex, item.status)}</td>
      <td class="numeric">${money(item.total)}</td>
      <td class="numeric">${money(item.profit || 0)}</td>
      <td class="doc-links">
        ${isPillow && item.docxUrl ? `<a class="link-btn doc-word" href="${item.docxUrl}" download data-history-link>КП</a>` : ""}
        ${isPillow && item.pdfUrl ? `<a class="link-btn doc-pdf" href="${item.pdfUrl}" download data-history-link>КП</a>` : ""}
        ${isPillow && item.oksanaDocxUrl ? `<a class="link-btn doc-word" href="${item.oksanaDocxUrl}" download data-history-link>Пошив</a>` : ""}
        ${isPillow && item.oksanaPdfUrl ? `<a class="link-btn doc-pdf" href="${item.oksanaPdfUrl}" download data-history-link>Пошив</a>` : ""}
      </td>
      <td class="numeric">
        ${isPillow ? `<button class="icon-btn" type="button" data-open-history-order="${sourceIndex}" title="Открыть в калькуляторе">✎</button>` : ""}
        ${entry.kind === "rental" ? `<button class="icon-btn" type="button" data-open-history-rental="${sourceIndex}" title="Редактировать аренду">✎</button>` : ""}
        <button class="icon-btn" type="button" data-remove-history="${sourceIndex}" data-remove-kind="${entry.kind}" title="Удалить заказ">×</button>
      </td>
    </tr>
    ${isPillow ? `
    <tr class="history-detail-row" data-history-detail="${sourceIndex}" ${openHistoryDetails.has(sourceIndex) ? "" : "hidden"}>
      <td colspan="10">${renderHistoryDetails(item, sourceIndex)}</td>
    </tr>
    ` : ""}
  `;
  }).join("");
  renderCrm();
  renderPl();
}

function combinedOrders() {
  const pillow = history.map((item, sourceIndex) => ({
    kind: "pillow",
    sourceIndex,
    orderType: item.orderType || "Подушки",
    source: {
      ...item,
      number: prefixedOrderNumber("pillow", item.number, sourceIndex),
      status: pillowStatus(item),
      title: item.title || "Заказ подушек",
      quantity: item.quantity || item.positionsCount || 0,
      total: number(item.total),
      profit: number(item.profit),
    },
  }));
  const rentals = rentalRows.map((row, sourceIndex) => ({
    kind: "rental",
    sourceIndex,
    orderType: "Аренда",
    source: {
      ...row,
      number: prefixedOrderNumber("rental", row.number, sourceIndex),
      title: row.item || "Аренда",
      date: row.date || "",
      quantity: row.quantity || 0,
      vatAmount: 0,
      total: number(row.amount),
      profit: number(row.profit, row.subtotal || row.amount),
      status: row.status || "Согласование",
      done: orderDone(row),
      paid: orderPaid(row),
    },
  }));
  const beanbags = beanbagRows.map((row, sourceIndex) => ({
    kind: "beanbag",
    sourceIndex,
    orderType: "Кресла мешки",
    source: {
      ...row,
      number: prefixedOrderNumber("beanbag", row.number, sourceIndex),
      title: row.whatOrdered || "Кресла мешки",
      date: row.date || "",
      quantity: row.quantity || 1,
      vatAmount: 0,
      total: number(row.amount),
      profit: number(row.profit),
      status: row.status || row.payment || "Согласование",
      done: statusDone(row.status || row.payment),
      paid: statusPaid(row.status || row.payment),
    },
  }));
  return [...pillow, ...rentals, ...beanbags].sort((a, b) => {
    const dateA = parseDate(a.source.date)?.getTime() || 0;
    const dateB = parseDate(b.source.date)?.getTime() || 0;
    return dateB - dateA;
  });
}

function renderHistoryDetails(item, historyIndex) {
  const snapshot = Array.isArray(item.orderSnapshot) ? item.orderSnapshot : [];
  if (!snapshot.length) {
    return `<div class="history-detail-empty">Для старых заказов полный расчет не сохранен. Откройте заказ в калькуляторе и сформируйте заново.</div>`;
  }
  const rows = (item.payload?.lines || []).map((line, lineIndex) => `
    <tr data-history-line="${lineIndex}">
      <td>${escapeHtml(line.positionName || `Позиция ${lineIndex + 1}`)}<br><span class="muted-cell">${escapeHtml(line.type || "")}${line.fabricName ? ` · Ткань: ${escapeHtml(line.fabricName)}` : ""}</span></td>
      <td>${escapeHtml(line.size || "")}</td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="1" step="1" value="${line.quantity || 1}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="quantity"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.sewingPrice || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="sewingPrice"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.sewingTotal || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="sewingTotal"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.assemblyPrice || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="assemblyPrice"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.assemblyTotal || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="assemblyTotal"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round((line.totalPrice || 0) / Math.max(1, number(line.quantity, 1)))}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="unitPrice"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.profit || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="profit"></td>
      <td class="numeric"><input class="table-input numeric-input" type="number" min="0" step="1" value="${Math.round(line.totalPrice || 0)}" data-history-edit="${historyIndex}" data-line="${lineIndex}" data-field="totalPrice"></td>
    </tr>
  `).join("");
  return `
    <div class="history-detail">
      <div class="table-wrap">
        <table class="history-calc-table">
          <thead>
            <tr>
              <th>Позиция</th><th>Размер</th><th>Кол-во</th><th>Пошив за 1 шт</th><th>Пошив итог</th><th>Сборка за 1 шт</th><th>Сборка итог</th><th>Цена</th><th>Прибыль</th><th>Итого</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="history-detail-actions">
        <button class="ghost" type="button" data-open-history-order="${historyIndex}">Открыть в калькуляторе</button>
        <button class="primary" type="button" data-save-history-order="${historyIndex}">Сохранить и обновить документы</button>
      </div>
      ${renderElbaDocuments(item, historyIndex)}
    </div>
  `;
}

function elbaOrderPayload(item, historyIndex) {
  return {
    kind: "pillow",
    sourceIndex: historyIndex,
    orderType: item.orderType || "Подушки",
    number: item.number || prefixedOrderNumber("pillow", item.number, historyIndex),
    date: item.date,
    title: item.title,
    clientName: item.payload?.clientName || item.meta?.clientName || "",
    clientRequisites: item.payload?.clientRequisites || item.meta?.clientRequisites || "",
    deliveryAmount: item.payload?.deliveryAmount || 0,
    deliveryGrossAmount: item.payload?.deliveryGrossAmount || 0,
    lines: item.payload?.lines || [],
    total: item.total,
  };
}

function renderElbaDocuments(item, historyIndex) {
  const bill = item.elbaDocuments?.bill || {};
  const status = bill.status || "Не создан";
  const documentId = bill.elba_document_id || bill.elbaDocumentId || "";
  const error = bill.error_message || bill.errorMessage || "";
  const pdfUrl = bill.pdfUrl || "";
  return `
    <div class="elba-box" data-elba-box="${historyIndex}">
      <div class="section-title compact-title">
        <div>
          <span class="rental-item-label">Документы Эльба</span>
          <h3>Счёт по заказу</h3>
        </div>
        <div class="elba-actions">
          <button class="primary" type="button" data-elba-create-bill="${historyIndex}" ${documentId ? "disabled" : ""}>Выставить счёт</button>
          <button class="ghost" type="button" data-elba-refresh-bill="${historyIndex}" ${documentId ? "" : "disabled"}>Обновить статус</button>
          ${pdfUrl ? `<a class="link-btn doc-pdf" href="${pdfUrl}" download data-history-link>Скачать счёт</a>` : ""}
        </div>
      </div>
      <div class="elba-grid">
        <div><span>Статус счёта</span><strong>${escapeHtml(status)}</strong></div>
        <div><span>ID в Эльбе</span><strong>${escapeHtml(documentId || "-")}</strong></div>
      </div>
      ${error ? `<div class="elba-error">${escapeHtml(error)}</div>` : ""}
    </div>
  `;
}

function applyElbaResult(historyIndex, result) {
  const item = history[historyIndex];
  if (!item) return;
  openHistoryDetails.add(historyIndex);
  item.elbaDocuments = item.elbaDocuments || {};
  if (result.document) item.elbaDocuments.bill = result.document;
  if (result.pdfUrl) {
    item.elbaDocuments.bill = { ...(item.elbaDocuments.bill || {}), pdfUrl: result.pdfUrl };
  }
  save("pillowCalcHistory", history);
  renderHistory();
}

async function handleElbaAction(historyIndex, action, button) {
  const item = history[historyIndex];
  if (!item) return;
  const labels = {
    create: "Выставляю...",
    refresh: "Обновляю...",
    pdf: "Скачиваю...",
  };
  const previousText = button?.textContent || "";
  if (button) {
    button.disabled = true;
    button.textContent = labels[action] || "Работаю...";
  }
  try {
    const order = elbaOrderPayload(item, historyIndex);
    const path = action === "refresh" ? "/api/elba/bills/status" : action === "pdf" ? "/api/elba/bills/pdf" : "/api/elba/bills";
    const result = await crmPost(path, { order });
    applyElbaResult(historyIndex, result);
    if (result.pdfUrl) {
      const link = document.createElement("a");
      link.href = result.pdfUrl;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    openHistoryDetails.add(historyIndex);
    item.elbaDocuments = item.elbaDocuments || {};
    item.elbaDocuments.bill = { ...(item.elbaDocuments.bill || {}), errorMessage: error.message };
    save("pillowCalcHistory", history);
    renderHistory();
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

function loadHistoryOrder(index) {
  const item = history[index];
  if (!item || !Array.isArray(item.orderSnapshot)) {
    alert("У этого заказа нет сохраненного расчета для открытия.");
    return;
  }
  order = clone(item.orderSnapshot);
  const meta = item.meta || {};
  els.orderTitle.value = meta.title || item.title || "";
  els.clientName.value = meta.clientName || item.payload?.clientName || "";
  if (els.clientRequisites) els.clientRequisites.value = meta.clientRequisites || item.payload?.clientRequisites || "";
  els.productionTerm.value = meta.productionTerm || item.payload?.productionTerm || "";
  els.deliveryAmount.value = number(meta.deliveryAmount, item.payload?.deliveryAmount || 0);
  editingIndex = null;
  isFinalized = true;
  save("pillowCalcOrder", order);
  renderOrder();
  resetForm();
  document.querySelector('[data-tab="calculator"]').click();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateHistoryLineTotals(input) {
  const row = input.closest("tr");
  if (!row) return;
  const quantityInput = row.querySelector('[data-field="quantity"]');
  const sewingPriceInput = row.querySelector('[data-field="sewingPrice"]');
  const sewingTotalInput = row.querySelector('[data-field="sewingTotal"]');
  const assemblyPriceInput = row.querySelector('[data-field="assemblyPrice"]');
  const assemblyTotalInput = row.querySelector('[data-field="assemblyTotal"]');
  const vatInput = row.querySelector('[data-field="vatAmount"]');
  const unitInput = row.querySelector('[data-field="unitPrice"]');
  const profitInput = row.querySelector('[data-field="profit"]');
  const totalInput = row.querySelector('[data-field="totalPrice"]');
  const historyIndex = Number(input.dataset.historyEdit);
  const lineIndex = Number(input.dataset.line);
  const item = history[historyIndex];
  const sourceLine = item?.payload?.lines?.[lineIndex] || {};
  const quantity = Math.max(1, number(quantityInput?.value, 1));

  if (input.dataset.field === "sewingPrice" || input.dataset.field === "quantity") {
    sewingTotalInput.value = Math.round(Math.max(0, number(sewingPriceInput.value)) * quantity);
  }
  if (input.dataset.field === "sewingTotal") {
    sewingPriceInput.value = Math.round(Math.max(0, number(sewingTotalInput.value)) / quantity);
  }
  if (input.dataset.field === "assemblyPrice" || input.dataset.field === "quantity") {
    assemblyTotalInput.value = Math.round(Math.max(0, number(assemblyPriceInput.value)) * quantity);
  }
  if (input.dataset.field === "assemblyTotal") {
    assemblyPriceInput.value = Math.round(Math.max(0, number(assemblyTotalInput.value)) / quantity);
  }
  if (input.dataset.field === "unitPrice" || input.dataset.field === "quantity") {
    totalInput.value = Math.round(Math.max(0, number(unitInput.value)) * quantity);
  }
  if (input.dataset.field === "totalPrice") {
    unitInput.value = Math.round(Math.max(0, number(totalInput.value)) / quantity);
  }
  if (vatInput && ["unitPrice", "quantity", "totalPrice"].includes(input.dataset.field)) {
    vatInput.value = Math.round(vatFromGross(number(totalInput.value), sourceLine.vatRate));
  }
  if (["sewingPrice", "sewingTotal", "assemblyPrice", "assemblyTotal", "unitPrice", "quantity", "totalPrice"].includes(input.dataset.field)) {
    const costTotal = Math.max(0, number(sourceLine.costTotal));
    profitInput.value = Math.max(0, Math.round(number(totalInput.value) - costTotal));
  }
}

function readHistoryDetailInputs(historyIndex) {
  const item = history[historyIndex];
  if (!item?.payload?.lines) return false;
  document.querySelectorAll(`[data-history-edit="${historyIndex}"]`).forEach((input) => {
    const line = item.payload.lines[Number(input.dataset.line)];
    if (!line) return;
    const field = input.dataset.field;
    if (field === "unitPrice") return;
    line[field] = Math.max(field === "quantity" ? 1 : 0, number(input.value, line[field]));
  });
  item.payload.lines.forEach((line, index) => {
    line.vatAmount = vatFromGross(number(line.totalPrice), line.vatRate);
    const snapshot = item.orderSnapshot?.[index];
    if (snapshot) {
      snapshot.input.quantity = Math.max(1, number(line.quantity, snapshot.input.quantity));
      snapshot.manual = {
        ...(snapshot.manual || {}),
        sewingPrice: line.sewingPrice,
        sewingTotal: line.sewingTotal,
        assemblyPrice: line.assemblyPrice,
        assemblyTotal: line.assemblyTotal,
        finalVat: line.vatAmount,
        unitPrice: line.totalPrice / Math.max(1, number(line.quantity, 1)),
        finalProfit: line.profit,
        finalPrice: line.totalPrice,
      };
    }
  });
  item.quantity = item.payload.lines.reduce((sum, line) => sum + number(line.quantity), 0);
  item.positionsCount = item.payload.lines.length;
  item.vatAmount = item.payload.lines.reduce((sum, line) => sum + number(line.vatAmount), 0) + number(item.payload.deliveryVat);
  item.total = item.payload.lines.reduce((sum, line) => sum + number(line.totalPrice), 0) + number(item.payload.deliveryGrossAmount);
  item.profit = item.payload.lines.reduce((sum, line) => sum + number(line.profit), 0);
  item.payload.totalVat = item.vatAmount;
  item.payload.total = item.total;
  return true;
}

async function saveHistoryOrder(index) {
  if (!readHistoryDetailInputs(index)) return;
  const item = history[index];
  const button = document.querySelector(`[data-save-history-order="${index}"]`);
  if (button) {
    button.disabled = true;
    button.textContent = "Сохраняю...";
  }
  try {
    const response = await fetch(apiPath("/api/proposal"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item.payload),
    });
    if (!response.ok) throw new Error(await response.text());
    const docs = await response.json();
    item.docxUrl = docs.docxUrl;
    item.pdfUrl = docs.pdfUrl;
    item.oksanaDocxUrl = docs.oksanaDocxUrl;
    item.oksanaPdfUrl = docs.oksanaPdfUrl;
    delete item.oksanaXlsxUrl;
    save("pillowCalcHistory", history);
    renderHistory();
  } catch (error) {
    alert(`Не получилось обновить документы: ${error.message}`);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Сохранить и обновить документы";
    }
  }
}

function renderCrm() {
  if (!els.crmBody) return;
  const rows = combinedOrders();
  const totalOrders = rows.length;
  const doneOrders = rows.filter((entry) => entry.source.done).length;
  const paidOrders = rows.filter((entry) => entry.source.paid).length;
  const totalProfit = rows.reduce((sum, entry) => sum + number(entry.source.profit), 0);
  const paidProfit = rows.reduce((sum, entry) => sum + (entry.source.paid ? number(entry.source.profit) : 0), 0);

  els.crmTotalOrders.textContent = totalOrders;
  els.crmDoneOrders.textContent = doneOrders;
  els.crmPaidOrders.textContent = paidOrders;
  els.crmTotalProfit.textContent = money(totalProfit);
  els.crmPaidProfit.textContent = money(paidProfit);

  if (!rows.length) {
    els.crmBody.innerHTML = `<tr class="empty-row"><td colspan="7">Заказы пока не сформированы</td></tr>`;
    return;
  }

  els.crmBody.innerHTML = rows.map((entry) => {
    const item = entry.source;
    const canEdit = entry.kind === "pillow" || entry.kind === "rental";
    return `
    <tr>
      <td>${escapeHtml(displayDate(item.date))}</td>
      <td>${escapeHtml(item.number || "-")}</td>
      <td>${escapeHtml(entry.orderType)}</td>
      <td class="numeric">${item.positionsCount || item.linesCount || item.quantity || 0}</td>
      <td class="numeric">${money(item.profit || 0)}</td>
      <td class="numeric"><input class="status-check" type="checkbox" data-crm-status="done" data-crm-kind="${entry.kind}" data-crm-index="${entry.sourceIndex}" ${item.done ? "checked" : ""} ${canEdit ? "" : "disabled"} /></td>
      <td class="numeric"><input class="status-check" type="checkbox" data-crm-status="paid" data-crm-kind="${entry.kind}" data-crm-index="${entry.sourceIndex}" ${item.paid ? "checked" : ""} ${canEdit ? "" : "disabled"} /></td>
    </tr>
  `;
  }).join("");
}

function plMonths() {
  const now = new Date();
  const baseYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear();
  const months = new Set();
  for (let month = 6; month < 12; month += 1) {
    months.add(monthKey(new Date(baseYear, month, 1)));
  }
  history.forEach((item) => {
    const date = parseDate(item.date);
    if (item.done && item.paid && date) months.add(monthKey(date));
  });
  rentalRows.forEach((row) => {
    const date = parseDate(row.date);
    if (orderPaid(row) && date) months.add(monthKey(date));
  });
  beanbagRows.forEach((row) => {
    const date = parseDate(row.date);
    if (date) months.add(monthKey(date));
  });
  return [...months].sort();
}

function plDataForMonth(key) {
  const completedOrders = history.filter((item) => {
    const date = parseDate(item.date);
    return item.done && item.paid && date && monthKey(date) === key;
  });
  const completedRentals = rentalRows.filter((row) => {
    const date = parseDate(row.date);
    return orderPaid(row) && date && monthKey(date) === key;
  });
  const beanbagOrders = beanbagRows.filter((row) => {
    const date = parseDate(row.date);
    return date && monthKey(date) === key;
  });
  const orderRevenue = completedOrders.reduce((sum, item) => sum + number(item.total), 0);
  const orderProfit = completedOrders.reduce((sum, item) => sum + number(item.profit), 0);
  const orderCost = Math.max(0, orderRevenue - orderProfit);
  const rentalRevenue = completedRentals.reduce((sum, row) => sum + number(row.amount), 0);
  const rentalProfit = completedRentals.reduce((sum, row) => sum + number(row.profit, row.subtotal || row.amount), 0);
  const rentalCost = Math.max(0, rentalRevenue - rentalProfit);
  const beanbagRevenue = beanbagOrders.reduce((sum, row) => sum + number(row.amount), 0);
  const beanbagProfit = beanbagOrders.reduce((sum, row) => sum + number(row.profit), 0);
  const beanbagCost = beanbagOrders.reduce((sum, row) => sum + number(row.cost), 0);
  const expenses = plExpenses.reduce((sum, item) => sum + Math.max(0, number(item.amount)), 0);
  const revenue = orderRevenue + rentalRevenue + beanbagRevenue;
  const grossProfit = orderProfit + rentalProfit + beanbagProfit;
  const netProfit = grossProfit - expenses;
  const margin = revenue > 0 ? netProfit / revenue * 100 : 0;
  return {
    completedOrders,
    completedRentals,
    beanbagOrders,
    orderRevenue,
    orderCost,
    orderProfit,
    rentalRevenue,
    rentalCost,
    rentalProfit,
    beanbagRevenue,
    beanbagCost,
    beanbagProfit,
    revenue,
    expenses,
    grossProfit,
    netProfit,
    margin,
  };
}

function renderPlExpenses() {
  if (!els.plExpensesList) return;
  const savedExpenses = Array.isArray(plExpenses) ? plExpenses : [];
  const savedByName = new Map(savedExpenses.map((item) => [item.name, item]));
  const fixedExpenses = defaultPlExpenses.map((item) => ({
    ...item,
    amount: number(savedByName.get(item.name)?.amount, item.amount),
    fixed: true,
  }));
  const customExpenses = savedExpenses
    .filter((item) => item.name && !defaultPlExpenses.some((fixed) => fixed.name === item.name) && item.name !== "Другое")
    .map((item) => ({ name: item.name, amount: Math.max(0, number(item.amount)), fixed: false }));
  plExpenses = [...fixedExpenses, ...customExpenses];
  els.plExpensesList.innerHTML = plExpenses.map((item, index) => `
    <div class="pl-expense-row">
      <label>За что
        <input type="text" value="${escapeHtml(item.name)}" data-pl-expense-name="${index}" ${item.fixed ? "readonly" : ""} />
      </label>
      <label>Сумма, ₽
        <input type="number" min="0" step="1" value="${Math.max(0, number(item.amount))}" data-pl-expense-amount="${index}" />
      </label>
      <button class="icon-btn" type="button" data-remove-pl-expense="${index}" title="Удалить расход" ${item.fixed ? "disabled" : ""}>×</button>
    </div>
  `).join("");
}

function renderPl() {
  if (!els.plMonthTabs) return;
  const months = plMonths();
  if (!months.includes(selectedPlMonth)) selectedPlMonth = months[0] || monthKey(new Date());
  const data = plDataForMonth(selectedPlMonth);

  els.plPeriodTitle.textContent = monthName(selectedPlMonth);
  els.plMonthTabs.innerHTML = months.map((key) => `
    <button class="month-tab ${key === selectedPlMonth ? "is-active" : ""}" type="button" data-pl-month="${key}">
      ${monthName(key)}
    </button>
  `).join("");
  els.plRevenueTotal.textContent = money(data.revenue);
  els.plGrossProfit.textContent = money(data.grossProfit);
  els.plExpensesTotal.textContent = money(data.expenses);
  els.plNetProfit.textContent = money(data.netProfit);
  els.plMargin.textContent = `${data.margin.toFixed(1)}%`;
  els.plReportBody.innerHTML = `
    <tr><th colspan="2">Доходы</th></tr>
    <tr><td>Заказы выполненные и оплаченные</td><td class="numeric">${money(data.orderRevenue)}</td></tr>
    <tr><td>Аренда выполненная</td><td class="numeric">${money(data.rentalRevenue)}</td></tr>
    <tr><td>Кресла мешки</td><td class="numeric">${money(data.beanbagRevenue)}</td></tr>
    <tr class="pl-total-row"><td>Итого выручка</td><td class="numeric">${money(data.revenue)}</td></tr>
    <tr><th colspan="2">Себестоимость</th></tr>
    <tr><td>Себестоимость заказов</td><td class="numeric">${money(data.orderCost)}</td></tr>
    <tr><td>Себестоимость аренды</td><td class="numeric">${money(data.rentalCost)}</td></tr>
    <tr><td>Себестоимость кресел мешков</td><td class="numeric">${money(data.beanbagCost)}</td></tr>
    <tr class="pl-total-row"><td>Валовая прибыль</td><td class="numeric">${money(data.grossProfit)}</td></tr>
    <tr><th colspan="2">Постоянные расходы</th></tr>
    ${plExpenses.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td class="numeric">${money(number(item.amount))}</td></tr>`).join("")}
    <tr class="pl-total-row"><td>Итого расходы</td><td class="numeric">${money(data.expenses)}</td></tr>
    <tr class="pl-result-row"><td>Чистая прибыль</td><td class="numeric">${money(data.netProfit)}</td></tr>
    <tr class="pl-result-row"><td>Рентабельность</td><td class="numeric">${data.margin.toFixed(1)}%</td></tr>
  `;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function timeValue(hour, minute) {
  if (!hour && !minute) return "";
  return `${String(hour || "00").padStart(2, "0")}:${String(minute || "00").padStart(2, "0")}`;
}

function fillTimeSelects() {
  const hourOptions = `<option value=""></option>${Array.from({ length: 24 }, (_, hour) => {
    const value = String(hour).padStart(2, "0");
    return `<option value="${value}">${value}</option>`;
  }).join("")}`;
  const minuteOptions = `<option value=""></option>${["00", "15", "30", "45"].map((minute) => `<option value="${minute}">${minute}</option>`).join("")}`;
  [els.rentalStartHour, els.rentalEndHour].forEach((select) => {
    if (select) select.innerHTML = hourOptions;
  });
  [els.rentalStartMinute, els.rentalEndMinute].forEach((select) => {
    if (select) select.innerHTML = minuteOptions;
  });
}

function renderRentalDrivers(selected = "") {
  if (!els.rentalDriver) return;
  const shouldUseOther = selected && !rentalDrivers.some((driver) => driver === selected);
  const options = [
    `<option value=""></option>`,
    ...rentalDrivers.map((driver) => `<option value="${escapeHtml(driver)}" ${driver === selected ? "selected" : ""}>${escapeHtml(driver)}</option>`),
    `<option value="__other" ${shouldUseOther ? "selected" : ""}>Другой</option>`,
  ];
  els.rentalDriver.innerHTML = options.join("");
  if (els.rentalDriverOther) els.rentalDriverOther.value = shouldUseOther ? selected : "";
  updateRentalDriverOther();
  renderRentalDriverList();
}

function renderRentalDriverList() {
  if (!els.rentalDriverList) return;
  els.rentalDriverList.innerHTML = rentalDrivers
    .map((driver) => `<span class="driver-chip">${escapeHtml(driver)}</span>`)
    .join("");
}

function updateRentalDriverOther() {
  const isOther = els.rentalDriver?.value === "__other";
  els.rentalDriverOtherField?.classList.toggle("is-hidden", !isOther);
  if (!isOther && els.rentalDriverOther) els.rentalDriverOther.value = "";
}

function rentalDriverValue() {
  if (els.rentalDriver?.value === "__other") return els.rentalDriverOther?.value.trim() || "";
  return els.rentalDriver?.value.trim() || "";
}

function dateTimeFromParts(date, time) {
  if (!date) return null;
  const [hour = "00", minute = "00"] = String(time || "00:00").split(":");
  const parsed = new Date(`${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function rentalDays(startDate, startTime, endDate, endTime) {
  const start = dateTimeFromParts(startDate, startTime);
  const end = dateTimeFromParts(endDate, endTime);
  if (!start || !end || end <= start) return 1;
  return Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
}

function rentalRateFor(days, quantity) {
  const sorted = [...settings.rentalRates].sort((a, b) => a.days - b.days);
  const rate = sorted.find((item) => days <= item.days) || sorted.at(-1) || { price: 0, bulkPrice: 0 };
  return quantity >= 40 ? rate.bulkPrice : rate.price;
}

function rentalCalculation(values = {}) {
  const startDate = values.startDate ?? els.rentalStart?.value ?? "";
  const startTime = values.startTime ?? timeValue(els.rentalStartHour?.value, els.rentalStartMinute?.value);
  const endDate = values.endDate ?? els.rentalEnd?.value ?? "";
  const endTime = values.endTime ?? timeValue(els.rentalEndHour?.value, els.rentalEndMinute?.value);
  const quantity = Math.max(1, number(values.quantity ?? rentalQuantity(readRentalColorLines()), 1));
  const days = rentalDays(startDate, startTime, endDate, endTime);
  const unitPrice = rentalRateFor(days, quantity);
  const subtotal = unitPrice * quantity;
  const pickup = values.pickup ?? els.rentalPickup?.value ?? "Нет";
  const delivery = pickup === "Да" ? 0 : Math.max(0, number(values.deliveryAmount ?? els.rentalDeliveryAmount?.value));
  const mounting = Math.max(0, number(values.mountingAmount ?? els.rentalMountingAmount?.value));
  const profit = subtotal;
  const total = subtotal + delivery + mounting;
  return {
    days,
    unitPrice,
    subtotal,
    delivery,
    mounting,
    profit,
    dimaProfit: profit / 2,
    nikitaProfit: profit / 2,
    total,
    cost: Math.max(0, total - profit),
  };
}

function renderRentalLive() {
  if (!els.rentalLiveTotal) return;
  const calc = rentalCalculation();
  els.rentalLiveDays.textContent = String(calc.days);
  els.rentalLiveSubtotal.textContent = money(calc.subtotal);
  els.rentalLiveDelivery.textContent = money(calc.delivery + calc.mounting);
  els.rentalLiveProfit.textContent = money(calc.profit);
  els.rentalLiveTotal.textContent = money(calc.total);
  els.rentalLivePaymentTo.textContent = els.rentalPaymentTo?.value || "Диме";
}

function renderRentalPriceTable() {
  if (!els.rentalPriceTable) return;
  els.rentalPriceTable.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Срок</th><th>До 39 шт</th><th>От 40 шт</th></tr></thead>
        <tbody>
          ${settings.rentalRates.map((rate) => `
            <tr>
              <td>Груша ${rate.days} сутки</td>
              <td class="numeric">${money(rate.price)}</td>
              <td class="numeric">${money(rate.bulkPrice)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function addRentalDriver() {
  const driver = els.newRentalDriver?.value.trim();
  if (!driver) return;
  if (!rentalDrivers.some((item) => item.toLowerCase() === driver.toLowerCase())) {
    rentalDrivers.push(driver);
    rentalDrivers = normalizeRentalDrivers(rentalDrivers);
    save("pillowCalcRentalDrivers", rentalDrivers);
  }
  if (els.newRentalDriver) els.newRentalDriver.value = "";
  renderRentalDrivers(driver);
  els.rentalStatus.textContent = "Водитель добавлен";
}

const rentalColors = ["красный", "синий", "желтый", "фуксия", "оранжевый", "зеленый", "черный", "белый", "серый"];

function defaultRentalColorLine() {
  return { quantity: 1, color: rentalColors[0] };
}

function rentalColorOptions(selected = rentalColors[0]) {
  return rentalColors
    .map((color) => `<option value="${escapeHtml(color)}" ${color === selected ? "selected" : ""}>${escapeHtml(color)}</option>`)
    .join("");
}

function renderRentalColorLines(lines = [defaultRentalColorLine()]) {
  if (!els.rentalColorLines) return;
  els.rentalColorLines.innerHTML = lines.map((line, index) => `
    <div class="rental-color-row">
      <label>Количество<input type="number" min="1" step="1" value="${Math.max(1, number(line.quantity, 1))}" data-rental-color-quantity="${index}" /></label>
      <label>Цвет<select data-rental-color="${index}">${rentalColorOptions(line.color)}</select></label>
      <button class="icon-btn" type="button" data-remove-rental-color="${index}" title="Удалить строку">×</button>
    </div>
  `).join("");
}

function readRentalColorLines() {
  if (!els.rentalColorLines) return [defaultRentalColorLine()];
  return [...els.rentalColorLines.querySelectorAll(".rental-color-row")]
    .map((row) => {
      const quantity = Math.max(1, number(row.querySelector("[data-rental-color-quantity]")?.value, 1));
      const color = row.querySelector("[data-rental-color]")?.value || rentalColors[0];
      return { quantity, color };
    })
    .filter((line) => line.quantity > 0 && line.color);
}

function colorSummary(lines) {
  const totals = {};
  lines.forEach((line) => {
    totals[line.color] = (totals[line.color] || 0) + Math.max(1, number(line.quantity, 1));
  });
  return Object.entries(totals)
    .map(([color, quantity]) => `${color}: ${quantity}`)
    .join(", ");
}

function rentalQuantity(lines) {
  return lines.reduce((sum, line) => sum + Math.max(1, number(line.quantity, 1)), 0);
}

function rentalPeriodText(row) {
  const start = [displayDate(row.startDate), row.startTime].filter(Boolean).join(" ");
  const end = [displayDate(row.endDate), row.endTime].filter(Boolean).join(" ");
  if (start && end) return `${start} → ${end}`;
  return start || end || "-";
}

function setTimeSelects(time, hourSelect, minuteSelect) {
  const [hour = "", minute = ""] = String(time || "").split(":");
  if (hourSelect) hourSelect.value = hour;
  if (minuteSelect) minuteSelect.value = minute;
}

function normalizeRentalEditLine(line, fallback = {}) {
  const colors = Array.isArray(line.colors) && line.colors.length
    ? line.colors
    : Array.isArray(fallback.colors) && fallback.colors.length
      ? fallback.colors
      : [defaultRentalColorLine()];
  const quantity = Math.max(1, number(line.quantity, fallback.quantity || rentalQuantity(colors)));
  return {
    ...fallback,
    ...line,
    colors,
    colorSummary: line.colorSummary || colorSummary(colors),
    quantity,
    date: line.date || fallback.date || todayIso(),
    item: line.item || fallback.item || "Кресло Груша",
    driver: line.driver || fallback.driver || "",
    pickup: line.pickup || fallback.pickup || "Нет",
    paymentTo: line.paymentTo || fallback.paymentTo || "Диме",
    status: line.status || fallback.status || "Согласование",
    deliveryAmount: number(line.deliveryAmount, fallback.deliveryAmount || 0),
    mountingAmount: number(line.mountingAmount, fallback.mountingAmount || 0),
    amount: number(line.amount, fallback.amount || 0),
    subtotal: number(line.subtotal, fallback.subtotal || 0),
    unitPrice: number(line.unitPrice, fallback.unitPrice || 0),
    days: number(line.days, fallback.days || 1),
    profit: number(line.profit, fallback.profit || line.subtotal || line.amount || 0),
  };
}

function loadRentalHistoryOrder(index) {
  const source = rentalRows[index];
  if (!source) return;
  const sourceWithNumber = { ...source, number: prefixedOrderNumber("rental", source.number, index) };
  const lines = Array.isArray(sourceWithNumber.lines) && sourceWithNumber.lines.length
    ? sourceWithNumber.lines.map((line) => normalizeRentalEditLine(line, sourceWithNumber))
    : [normalizeRentalEditLine(sourceWithNumber)];
  rentalOrder = lines;
  editingRentalRowIndex = index;
  editingRentalOrderLineIndex = 0;
  save("pillowCalcRentalOrder", rentalOrder);

  const first = lines[0] || {};
  els.rentalDate.value = inputDateValue(first.date || source.date) || todayIso();
  els.rentalClient.value = first.client || source.client || "";
  els.rentalPhone.value = first.phone || source.phone || "";
  renderRentalDrivers(first.driver || source.driver || "");
  els.rentalStart.value = inputDateValue(first.startDate || source.startDate);
  els.rentalEnd.value = inputDateValue(first.endDate || source.endDate);
  setTimeSelects(first.startTime || source.startTime, els.rentalStartHour, els.rentalStartMinute);
  setTimeSelects(first.endTime || source.endTime, els.rentalEndHour, els.rentalEndMinute);
  if (els.rentalPickup) els.rentalPickup.value = first.pickup || source.pickup || "Нет";
  if (els.rentalDeliveryAmount) els.rentalDeliveryAmount.value = number(first.deliveryAmount, source.deliveryAmount || 0);
  if (els.rentalMountingAmount) els.rentalMountingAmount.value = number(first.mountingAmount, source.mountingAmount || 0);
  if (els.rentalPaymentTo) els.rentalPaymentTo.value = first.paymentTo || source.paymentTo || "Диме";
  if (els.rentalStatusSelect) els.rentalStatusSelect.value = first.status || source.status || "Согласование";
  if (els.rentalComment) els.rentalComment.value = first.comment || source.comment || "";
  renderRentalColorLines(first.colors || source.colors || [defaultRentalColorLine()]);
  renderRentalLive();
  renderRentalOrder();
  document.querySelector('[data-tab="rental"]').click();
  els.rentalStatus.textContent = "Заказ аренды открыт для редактирования";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function rentalFormPayload() {
  const colors = readRentalColorLines();
  const startTime = timeValue(els.rentalStartHour.value, els.rentalStartMinute.value);
  const endTime = timeValue(els.rentalEndHour.value, els.rentalEndMinute.value);
  const calculation = rentalCalculation({
    quantity: rentalQuantity(colors),
    startDate: els.rentalStart.value,
    startTime,
    endDate: els.rentalEnd.value,
    endTime,
    pickup: els.rentalPickup.value,
    deliveryAmount: els.rentalDeliveryAmount.value,
    mountingAmount: els.rentalMountingAmount.value,
  });
  return {
    orderType: "Аренда",
    date: els.rentalDate.value || todayIso(),
    client: els.rentalClient.value.trim(),
    phone: els.rentalPhone.value.trim(),
    driver: rentalDriverValue(),
    item: "Кресло Груша",
    colors,
    colorSummary: colorSummary(colors),
    quantity: rentalQuantity(colors),
    amount: calculation.total,
    subtotal: calculation.subtotal,
    unitPrice: calculation.unitPrice,
    days: calculation.days,
    deliveryAmount: calculation.delivery,
    mountingAmount: calculation.mounting,
    profit: calculation.profit,
    dimaProfit: calculation.dimaProfit,
    nikitaProfit: calculation.nikitaProfit,
    cost: calculation.cost,
    pickup: els.rentalPickup.value,
    paymentTo: els.rentalPaymentTo.value,
    startDate: els.rentalStart.value,
    startTime,
    endDate: els.rentalEnd.value,
    endTime,
    status: els.rentalStatusSelect.value,
    done: statusDone(els.rentalStatusSelect.value),
    paid: statusPaid(els.rentalStatusSelect.value),
    comment: els.rentalComment.value.trim(),
    webhookUrl: els.rentalWebhookUrl.value.trim(),
  };
}

function upsertRentalOrderLine(payload) {
  if (editingRentalOrderLineIndex !== null && rentalOrder[editingRentalOrderLineIndex]) {
    const previous = rentalOrder[editingRentalOrderLineIndex];
    rentalOrder[editingRentalOrderLineIndex] = {
      ...payload,
      number: previous.number,
      createdAt: previous.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    editingRentalOrderLineIndex = null;
    return "Позиция аренды обновлена";
  }
  rentalOrder.push({ ...payload, createdAt: new Date().toISOString() });
  return "Позиция добавлена";
}

function rentalOrderPayload(webhookUrl) {
  const lines = rentalOrder.map((row, index) => ({
    index: index + 1,
    number: row.number,
    date: row.date,
    client: row.client,
    phone: row.phone,
    driver: row.driver,
    item: row.item,
    quantity: row.quantity,
    amount: row.amount,
    subtotal: row.subtotal,
    unitPrice: row.unitPrice,
    days: row.days,
    deliveryAmount: row.deliveryAmount,
    mountingAmount: row.mountingAmount,
    profit: row.profit,
    dimaProfit: row.dimaProfit,
    nikitaProfit: row.nikitaProfit,
    cost: row.cost,
    pickup: row.pickup,
    paymentTo: row.paymentTo,
    startDate: row.startDate,
    startTime: row.startTime,
    endDate: row.endDate,
    endTime: row.endTime,
    status: row.status,
    done: orderDone(row),
    paid: orderPaid(row),
    comment: row.comment,
    colors: row.colors,
    colorSummary: row.colorSummary,
  }));
  const allColors = lines.flatMap((line) => line.colors || []);
  return {
    orderType: "Аренда",
    number: lines[0]?.number || nextOrderNumber("rental"),
    date: lines[0]?.date || todayIso(),
    client: lines[0]?.client || "",
    phone: lines[0]?.phone || "",
    driver: lines[0]?.driver || "",
    item: lines.map((line) => line.item).filter(Boolean).join("; "),
    quantity: lines.reduce((sum, line) => sum + number(line.quantity), 0),
    amount: lines.reduce((sum, line) => sum + number(line.amount), 0),
    subtotal: lines.reduce((sum, line) => sum + number(line.subtotal), 0),
    deliveryAmount: lines.reduce((sum, line) => sum + number(line.deliveryAmount), 0),
    mountingAmount: lines.reduce((sum, line) => sum + number(line.mountingAmount), 0),
    profit: lines.reduce((sum, line) => sum + number(line.profit), 0),
    dimaProfit: lines.reduce((sum, line) => sum + number(line.dimaProfit), 0),
    nikitaProfit: lines.reduce((sum, line) => sum + number(line.nikitaProfit), 0),
    cost: lines.reduce((sum, line) => sum + number(line.cost), 0),
    pickup: lines[0]?.pickup || "Нет",
    paymentTo: lines[0]?.paymentTo || "Диме",
    startDate: lines[0]?.startDate || "",
    startTime: lines[0]?.startTime || "",
    endDate: lines[0]?.endDate || "",
    endTime: lines[0]?.endTime || "",
    status: lines[0]?.status || "Согласование",
    done: lines.some((line) => orderDone(line)),
    paid: lines.some((line) => orderPaid(line)),
    comment: lines.map((line) => line.comment).filter(Boolean).join("; "),
    colors: allColors,
    colorSummary: colorSummary(allColors),
    lines,
    webhookUrl,
  };
}

function displayRentalPayloadDates(payload) {
  const formatLine = (line) => ({
    ...line,
    date: displayDate(line.date),
    startDate: displayDate(line.startDate),
    endDate: displayDate(line.endDate),
  });
  return {
    ...payload,
    date: displayDate(payload.date),
    startDate: displayDate(payload.startDate),
    endDate: displayDate(payload.endDate),
    lines: (payload.lines || []).map(formatLine),
  };
}

function resetRentalForm(payload = {}) {
  const webhookUrl = payload.webhookUrl || els.rentalWebhookUrl.value;
  els.rentalForm.reset();
  els.rentalDate.value = todayIso();
  if (els.rentalStartHour) els.rentalStartHour.value = "";
  if (els.rentalStartMinute) els.rentalStartMinute.value = "";
  if (els.rentalEndHour) els.rentalEndHour.value = "";
  if (els.rentalEndMinute) els.rentalEndMinute.value = "";
  els.rentalWebhookUrl.value = webhookUrl;
  if (els.rentalPickup) els.rentalPickup.value = "Нет";
  if (els.rentalDeliveryAmount) els.rentalDeliveryAmount.value = 0;
  if (els.rentalMountingAmount) els.rentalMountingAmount.value = 0;
  if (els.rentalPaymentTo) els.rentalPaymentTo.value = "Диме";
  renderRentalDrivers();
  renderRentalColorLines();
  renderRentalLive();
}

function renderRentalOrder() {
  if (!els.rentalOrderBody) return;
  if (!rentalOrder.length) {
    els.rentalOrderBody.innerHTML = `<tr class="empty-row"><td colspan="12">Позиции аренды пока не добавлены</td></tr>`;
  } else {
    els.rentalOrderBody.innerHTML = rentalOrder.map((row, index) => `
      <tr>
        <td>${escapeHtml(displayDate(row.date))}</td>
        <td>${escapeHtml(row.client || "-")}</td>
        <td><strong>${escapeHtml(row.item)}</strong><br><span class="muted-cell">${number(row.days, 1)} сут. · ${money(row.unitPrice || 0)} / шт</span></td>
        <td>${escapeHtml(rentalPeriodText(row))}</td>
        <td>${escapeHtml(row.driver || "-")}</td>
        <td>${escapeHtml(row.colorSummary || "-")}</td>
        <td class="numeric">${row.quantity}</td>
        <td class="numeric">${money(row.deliveryAmount || 0)}</td>
        <td class="numeric">${money(row.mountingAmount || 0)}</td>
        <td class="numeric">${money(row.amount || 0)}</td>
        <td class="numeric">${money(row.profit || 0)}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" type="button" data-remove-rental-order="${index}" title="Удалить">×</button>
          </div>
        </td>
      </tr>
    `).join("");
  }
  const allColors = rentalOrder.flatMap((row) => row.colors || []);
  els.rentalOrderQuantity.textContent = rentalOrder.reduce((sum, row) => sum + number(row.quantity), 0);
  els.rentalOrderColorSummary.textContent = allColors.length ? colorSummary(allColors) : "-";
  if (els.rentalOrderDelivery) els.rentalOrderDelivery.textContent = money(rentalOrder.reduce((sum, row) => sum + number(row.deliveryAmount), 0));
  if (els.rentalOrderMounting) els.rentalOrderMounting.textContent = money(rentalOrder.reduce((sum, row) => sum + number(row.mountingAmount), 0));
  if (els.rentalOrderTotal) els.rentalOrderTotal.textContent = money(rentalOrder.reduce((sum, row) => sum + number(row.amount), 0));
  if (els.rentalOrderProfit) els.rentalOrderProfit.textContent = money(rentalOrder.reduce((sum, row) => sum + number(row.profit), 0));
}

function renderRentalRows() {
  if (els.rentalWebhookUrl) els.rentalWebhookUrl.value = rentalWebhook;
  if (els.rentalDate && !els.rentalDate.value) els.rentalDate.value = todayIso();
  if (els.rentalColorLines && !els.rentalColorLines.children.length) renderRentalColorLines();
  if (!els.rentalBody) return;

  if (!rentalRows.length) {
    els.rentalBody.innerHTML = `<tr class="empty-row"><td colspan="11">Заказы аренды пока не отправлялись</td></tr>`;
    return;
  }

  els.rentalBody.innerHTML = rentalRows.map((row, index) => `
    <tr>
      <td>${escapeHtml(displayDate(row.date))}</td>
      <td>${escapeHtml(row.client || "-")}</td>
      <td>${escapeHtml(row.item)}</td>
      <td>${escapeHtml(row.driver || "-")}</td>
      <td>${escapeHtml(row.colorSummary || "-")}</td>
      <td class="numeric">${row.quantity}</td>
      <td class="numeric">${money(row.amount || 0)}</td>
      <td>${escapeHtml(row.status || "-")}</td>
      <td class="numeric"><input class="status-check" type="checkbox" data-rental-row-status="done" data-rental-row-index="${index}" ${orderDone(row) ? "checked" : ""} /></td>
      <td class="numeric"><input class="status-check" type="checkbox" data-rental-row-status="paid" data-rental-row-index="${index}" ${orderPaid(row) ? "checked" : ""} /></td>
      <td class="numeric"><button class="icon-btn" type="button" data-copy-rental-row="${index}" title="Копировать заказ">⧉</button></td>
    </tr>
  `).join("");
}

function copyRentalRow(index) {
  const source = rentalRows[index];
  if (!source) return;
  loadRentalHistoryOrder(index);
  editingRentalRowIndex = null;
  editingRentalOrderLineIndex = null;
  els.rentalStatus.textContent = "Заказ скопирован как новый";
}

function setRentalRowChecks(index, field, checked) {
  const row = rentalRows[index];
  if (!row) return;
  if (field === "paid") {
    row.paid = checked;
    if (checked) row.done = true;
  } else {
    row.done = checked;
    if (!checked) row.paid = false;
  }
  row.status = statusFromChecks(row.done, row.paid, row.status);
  if (Array.isArray(row.lines)) {
    row.lines = row.lines.map((line) => ({
      ...line,
      done: row.done,
      paid: row.paid,
      status: row.status,
    }));
  }
  save("pillowCalcRentalRows", rentalRows);
  renderRentalRows();
  renderHistory();
  renderCrm();
  renderPl();
}

function submitRental(event) {
  event.preventDefault();
  const payload = rentalFormPayload();
  const message = upsertRentalOrderLine(payload);
  save("pillowCalcRentalOrder", rentalOrder);
  if (payload.webhookUrl) {
    rentalWebhook = payload.webhookUrl;
    save("pillowCalcRentalWebhook", rentalWebhook);
  }
  els.rentalStatus.textContent = message;
  resetRentalForm(payload);
  renderRentalOrder();
}

function hasRentalDraft() {
  const colors = readRentalColorLines();
  return Boolean(
    els.rentalClient.value.trim() ||
    els.rentalPhone.value.trim() ||
    rentalDriverValue() ||
    els.rentalStart.value ||
    els.rentalEnd.value ||
  els.rentalComment.value.trim() ||
    number(els.rentalDeliveryAmount?.value) > 0 ||
    number(els.rentalMountingAmount?.value) > 0 ||
    (els.rentalPickup?.value || "Нет") !== "Нет" ||
    (els.rentalPaymentTo?.value || "Диме") !== "Диме" ||
    colors.some((line) => number(line.quantity) > 1 || line.color !== rentalColors[0])
  );
}

function addRentalDraftToOrder() {
  if (!hasRentalDraft()) return false;
  const payload = rentalFormPayload();
  upsertRentalOrderLine(payload);
  save("pillowCalcRentalOrder", rentalOrder);
  if (payload.webhookUrl) {
    rentalWebhook = payload.webhookUrl;
    save("pillowCalcRentalWebhook", rentalWebhook);
  }
  resetRentalForm(payload);
  renderRentalOrder();
  return true;
}

async function sendRentalOrder() {
  const webhookUrl = els.rentalWebhookUrl.value.trim() || rentalWebhook || "";
  if (!webhookUrl) {
    alert("Сначала вставьте webhook Google Apps Script.");
    return;
  }
  addRentalDraftToOrder();
  if (!rentalOrder.length) {
    alert("Сначала заполните заказ аренды.");
    return;
  }
  const payload = displayRentalPayloadDates(rentalOrderPayload(webhookUrl));

  els.rentalStatus.textContent = "Сохраняю...";
  els.sendRentalOrder.disabled = true;
  try {
    const response = await fetch(apiPath("/api/rental"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Google Таблица не приняла данные");
    }

    const savedPayload = { ...payload, sentAt: new Date().toISOString() };
    if (editingRentalRowIndex !== null && rentalRows[editingRentalRowIndex]) {
      savedPayload.sentAt = rentalRows[editingRentalRowIndex].sentAt || savedPayload.sentAt;
      savedPayload.updatedAt = new Date().toISOString();
      rentalRows[editingRentalRowIndex] = savedPayload;
    } else {
      rentalRows.unshift(savedPayload);
    }
    editingRentalRowIndex = null;
    editingRentalOrderLineIndex = null;
    rentalRows = rentalRows.slice(0, 50);
    save("pillowCalcRentalRows", rentalRows);
    rentalOrder = [];
    save("pillowCalcRentalOrder", rentalOrder);
    rentalWebhook = payload.webhookUrl;
    save("pillowCalcRentalWebhook", rentalWebhook);
    els.rentalStatus.textContent = "Отправлено";
    resetRentalForm(payload);
    renderRentalOrder();
    renderRentalRows();
    renderHistory();
    renderPl();
  } catch (error) {
    els.rentalStatus.textContent = "Ошибка отправки";
    alert(`Не получилось отправить в Google Таблицу: ${error.message}`);
  } finally {
    els.sendRentalOrder.disabled = false;
  }
}

function beanbagCalculation() {
  const amount = Math.max(0, number(els.beanbagAmount?.value));
  const delivery = Math.max(0, number(els.beanbagDelivery?.value));
  const mounting = Math.max(0, number(els.beanbagMounting?.value));
  const cost = delivery + mounting;
  const profit = Math.max(0, amount - cost);
  return {
    amount,
    delivery,
    mounting,
    cost,
    profit,
    dimaProfit: profit / 2,
    nikitaProfit: profit / 2,
  };
}

function renderBeanbagLive() {
  if (!els.beanbagCost) return;
  const calc = beanbagCalculation();
  els.beanbagCost.textContent = money(calc.cost);
  els.beanbagDima.textContent = money(calc.dimaProfit);
  els.beanbagNikita.textContent = money(calc.nikitaProfit);
  els.beanbagProfit.textContent = money(calc.profit);
}

function beanbagPayload() {
  const calc = beanbagCalculation();
  return {
    orderType: "Кресла мешки",
    number: nextOrderNumber("beanbag"),
    date: displayDate(els.beanbagDate.value || todayIso()),
    whatOrdered: els.beanbagWhat.value.trim(),
    item: els.beanbagWhat.value.trim(),
    amount: calc.amount,
    total: calc.amount,
    cost: calc.cost,
    dimaProfit: calc.dimaProfit,
    nikitaProfit: calc.nikitaProfit,
    profit: calc.profit,
    filler: "",
    paymentTo: els.beanbagPaymentTo.value,
    result: "",
    nikitaBalance: "",
    payment: els.beanbagPayment.value.trim(),
    deliveryAmount: calc.delivery,
    mountingAmount: calc.mounting,
    pickup: els.beanbagPickup.value,
    deliveryPaidBy: els.beanbagDeliveryPaidBy.value.trim(),
    status: els.beanbagPayment.value.trim() || "Согласование",
    quantity: 1,
    webhookUrl: els.rentalWebhookUrl?.value.trim() || rentalWebhook || "",
  };
}

function resetBeanbagForm() {
  if (!els.beanbagDate) return;
  els.beanbagDate.value = todayIso();
  els.beanbagWhat.value = "";
  els.beanbagAmount.value = 0;
  els.beanbagDelivery.value = 0;
  els.beanbagMounting.value = 0;
  els.beanbagPickup.value = "Нет";
  els.beanbagPaymentTo.value = "Диме";
  els.beanbagPayment.value = "";
  els.beanbagDeliveryPaidBy.value = "";
  renderBeanbagLive();
}

function renderBeanbagRows() {
  if (!els.beanbagBody) return;
  if (!els.beanbagDate.value) els.beanbagDate.value = todayIso();
  renderBeanbagLive();
  if (!beanbagRows.length) {
    els.beanbagBody.innerHTML = `<tr class="empty-row"><td colspan="12">Заказов по креслам-мешкам пока нет</td></tr>`;
    return;
  }
  els.beanbagBody.innerHTML = beanbagRows.map((row, index) => `
    <tr>
      <td>${escapeHtml(displayDate(row.date))}</td>
      <td>${escapeHtml(row.whatOrdered || "-")}</td>
      <td class="numeric">${money(row.amount || 0)}</td>
      <td class="numeric">${money(row.cost || 0)}</td>
      <td class="numeric">${money(row.dimaProfit || 0)}</td>
      <td class="numeric">${money(row.nikitaProfit || 0)}</td>
      <td class="numeric">${money(row.profit || 0)}</td>
      <td>${escapeHtml(row.paymentTo || "-")}</td>
      <td>${escapeHtml(row.payment || "-")}</td>
      <td class="numeric">${money(row.deliveryAmount || 0)}</td>
      <td>${escapeHtml(row.deliveryPaidBy || "-")}</td>
      <td class="numeric"><button class="icon-btn" type="button" data-copy-beanbag-row="${index}" title="Копировать заказ">⧉</button></td>
    </tr>
  `).join("");
}

function copyBeanbagRow(index) {
  const row = beanbagRows[index];
  if (!row) return;
  els.beanbagDate.value = inputDateValue(row.date) || todayIso();
  els.beanbagWhat.value = row.whatOrdered || row.item || "";
  els.beanbagAmount.value = number(row.amount);
  els.beanbagDelivery.value = number(row.deliveryAmount);
  els.beanbagMounting.value = number(row.mountingAmount);
  els.beanbagPickup.value = row.pickup || "Нет";
  els.beanbagPaymentTo.value = row.paymentTo || "Диме";
  els.beanbagPayment.value = "";
  els.beanbagDeliveryPaidBy.value = row.deliveryPaidBy || "";
  els.beanbagStatus.textContent = "Заказ скопирован как новый";
  renderBeanbagLive();
  document.querySelector('[data-tab="beanbags"]').click();
}

async function saveBeanbagOrder() {
  const payload = beanbagPayload();
  if (!payload.whatOrdered) {
    alert("Заполните, что заказали.");
    return;
  }
  if (!payload.webhookUrl) {
    alert("Сначала вставьте webhook Google Apps Script во вкладке Аренда.");
    return;
  }
  els.saveBeanbagOrder.disabled = true;
  els.beanbagStatus.textContent = "Сохраняю...";
  try {
    const response = await fetch(apiPath("/api/rental"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Google Таблица не приняла данные");
    }
    beanbagRows.unshift({ ...payload, sentAt: new Date().toISOString() });
    beanbagRows = beanbagRows.slice(0, 100);
    save("pillowCalcBeanbagRows", beanbagRows);
    rentalWebhook = payload.webhookUrl;
    save("pillowCalcRentalWebhook", rentalWebhook);
    els.beanbagStatus.textContent = "Отправлено";
    resetBeanbagForm();
    renderBeanbagRows();
    renderHistory();
    renderCrm();
    renderPl();
  } catch (error) {
    els.beanbagStatus.textContent = "Ошибка отправки";
    alert(`Не получилось отправить в Google Таблицу: ${error.message}`);
  } finally {
    els.saveBeanbagOrder.disabled = false;
  }
}

function readSettingsFromEditors() {
  document.querySelectorAll("[data-tier]").forEach((input) => {
    settings.sewingTiers[input.dataset.tier][input.dataset.field] = number(input.value);
  });
  document.querySelectorAll("[data-type]").forEach((input) => {
    const field = input.dataset.field;
    settings.types[input.dataset.type][field] = field === "name" ? input.value.trim() : number(input.value);
  });
  document.querySelectorAll("[data-option]").forEach((input) => {
    settings.options[input.dataset.option] = number(input.value);
  });
  document.querySelectorAll("[data-logistics]").forEach((input) => {
    settings.types[input.dataset.logistics].materialLogisticsCoeff = Math.max(0, number(input.value));
  });
  document.querySelectorAll("[data-margin]").forEach((input) => {
    settings.margins[input.dataset.margin][input.dataset.field] = number(input.value);
  });
  document.querySelectorAll("[data-rental-rate]").forEach((input) => {
    settings.rentalRates[input.dataset.rentalRate][input.dataset.field] = number(input.value);
  });
  settings.types = settings.types.filter((type) => type.name);
  settings.rentalRates = settings.rentalRates
    .map((rate) => ({
      days: Math.max(1, number(rate.days, 1)),
      price: Math.max(0, number(rate.price)),
      bulkPrice: Math.max(0, number(rate.bulkPrice)),
    }))
    .sort((a, b) => a.days - b.days);
}

function setFormInput(input) {
  if (els.customOrder) els.customOrder.checked = Boolean(input.customOrder);
  els.quantity.value = input.quantity;
  els.length.value = input.length;
  els.width.value = input.width;
  els.height.value = input.height;
  els.foamDensity.value = input.foamDensity;
  els.pillowType.value = input.type;
  els.paymentType.value = input.paymentType;
  els.fabricPrice.value = input.fabricPrice;
  els.fabricName.value = input.fabricName || "";
  els.buttonsCount.value = input.buttonsCount;
  els.materialLogistics.value = number(input.materialLogistics, defaultMaterialLogistics(input.type));
  if (els.customSewingCost) els.customSewingCost.value = number(input.customSewingCost);
  if (els.customMaterial1Cost) els.customMaterial1Cost.value = number(input.customMaterial1Cost);
  if (els.customMaterial2Cost) els.customMaterial2Cost.value = number(input.customMaterial2Cost);
  if (els.customOtherCost) els.customOtherCost.value = number(input.customOtherCost);
  if (els.customTotalCost) els.customTotalCost.value = number(input.customTotalCost);
  if (els.customProfit) els.customProfit.value = number(input.customProfit);
  if (els.customSalePrice) els.customSalePrice.value = number(input.customSalePrice);
  els.coverOnly.checked = input.coverOnly;
  els.leatherette.checked = input.leatherette;
  els.ties.checked = input.ties;
  els.velcro.checked = input.velcro;
  els.hiddenZip.checked = input.hiddenZip;
  els.decorStitch.checked = input.decorStitch;
  els.piping.checked = input.piping;
  renderLive();
}

function resetForm() {
  els.form.reset();
  editingIndex = null;
  els.addItemButton.textContent = "Добавить в заказ";
  setFormInput({
    quantity: 1,
    length: 49,
    width: 49,
    height: 5,
    foamDensity: 25,
    type: settings.types[0]?.name || "",
    paymentType: "cashless",
    fabricPrice: settings.options.defaultFabricPrice,
    fabricName: "",
    buttonsCount: 0,
    materialLogistics: defaultMaterialLogistics(settings.types[0]?.name || ""),
    customOrder: false,
    customSewingCost: 0,
    customMaterial1Cost: 0,
    customMaterial2Cost: 0,
    customOtherCost: 0,
    customTotalCost: 0,
    customProfit: 0,
    customSalePrice: 0,
    coverOnly: false,
    leatherette: false,
    ties: false,
    velcro: false,
    hiddenZip: false,
    decorStitch: false,
    piping: false,
  });
  renderPositionTitle();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function syncOrderEditTotals(input) {
  const row = input.closest("tr");
  if (!row) return;
  const quantityInput = row.querySelector('[data-field="quantity"]');
  const sewingPriceInput = row.querySelector('[data-field="sewingPrice"]');
  const sewingTotalInput = row.querySelector('[data-field="sewingTotal"]');
  const assemblyPriceInput = row.querySelector('[data-field="assemblyPrice"]');
  const assemblyTotalInput = row.querySelector('[data-field="assemblyTotal"]');
  const vatInput = row.querySelector('[data-field="finalVat"]');
  const unitInput = row.querySelector('[data-field="unitPrice"]');
  const totalInput = row.querySelector('[data-field="finalPrice"]');
  const profitInput = row.querySelector('[data-field="finalProfit"]');
  const quantity = Math.max(1, number(quantityInput?.value, 1));
  const index = Number(input.dataset.orderEdit);
  const vatRate = order[index]?.result?.vatRate || calculate(order[index]?.input || currentInput()).vatRate;

  if (input.dataset.field === "sewingPrice" || input.dataset.field === "quantity") {
    sewingTotalInput.value = Math.round(Math.max(0, number(sewingPriceInput.value)) * quantity);
  }
  if (input.dataset.field === "sewingTotal") {
    sewingPriceInput.value = Math.round(Math.max(0, number(sewingTotalInput.value)) / quantity);
  }
  if (input.dataset.field === "assemblyPrice" || input.dataset.field === "quantity") {
    assemblyTotalInput.value = Math.round(Math.max(0, number(assemblyPriceInput.value)) * quantity);
  }
  if (input.dataset.field === "assemblyTotal") {
    assemblyPriceInput.value = Math.round(Math.max(0, number(assemblyTotalInput.value)) / quantity);
  }
  if (input.dataset.field === "unitPrice" || input.dataset.field === "quantity") {
    totalInput.value = Math.round(Math.max(0, number(unitInput.value)) * quantity);
  }
  if (input.dataset.field === "finalPrice") {
    unitInput.value = Math.round(Math.max(0, number(totalInput.value)) / quantity);
  }
  if (["unitPrice", "quantity", "finalPrice"].includes(input.dataset.field)) {
    vatInput.value = Math.round(vatFromGross(number(totalInput.value), vatRate));
  }
  if (["sewingPrice", "sewingTotal", "assemblyPrice", "assemblyTotal", "unitPrice", "quantity", "finalPrice"].includes(input.dataset.field)) {
    const lineCost =
      Math.max(0, number(row.dataset.otherUnitCost)) * quantity +
      Math.max(0, number(sewingTotalInput.value)) +
      Math.max(0, number(assemblyTotalInput.value));
    profitInput.value = Math.max(0, Math.round(number(totalInput.value) - lineCost));
  }
}

function updateDraftTotalsFromTable() {
  const rows = [...els.orderBody.querySelectorAll("tr[data-other-unit-cost]")];
  if (!rows.length) return;
  const itemsTotal = rows.reduce((sum, row) => sum + Math.max(0, number(row.querySelector('[data-field="finalPrice"]')?.value)), 0);
  const profit = rows.reduce((sum, row) => sum + Math.max(0, number(row.querySelector('[data-field="finalProfit"]')?.value)), 0);
  const delivery = deliverySummary();
  const total = itemsTotal + delivery.gross;
  els.itemsTotal.textContent = money(itemsTotal);
  els.deliveryTotal.textContent = money(delivery.gross);
  els.orderTotal.textContent = money(total);
  els.profitTotal.textContent = money(profit);
  if (els.headerTotal) els.headerTotal.textContent = money(total);
}

function refreshOrderRowCosts() {
  const lines = finalizedOrderLines();
  lines.forEach((line, index) => {
    const row = els.orderBody.querySelector(`tr [data-order-edit="${index}"]`)?.closest("tr");
    if (!row) return;
    const quantity = Math.max(1, number(line.input.quantity, 1));
    row.dataset.otherUnitCost = String((line.finalCost - line.sewingTotal - line.assemblyTotal) / quantity);
  });
}

function saveManualCalculation(options = {}) {
  if (!order.length) return false;
  const edits = document.querySelectorAll("[data-order-edit]");
  if (!edits.length) return false;

  edits.forEach((input) => {
    const index = Number(input.dataset.orderEdit);
    const field = input.dataset.field;
    if (!order[index]) return;

    if (field === "positionName") {
      order[index].positionName = input.value.trim() || positionLabel(index);
      return;
    }

    if (["quantity", "length", "width", "height"].includes(field)) {
      const minimum = field === "quantity" ? 1 : 0;
      order[index].input[field] = Math.max(minimum, number(input.value, order[index].input[field]));
      return;
    }

    order[index].manual = order[index].manual || {};
    order[index].manual[field] = Math.max(0, number(input.value));
  });

  order = order.map((item) => ({
    ...item,
    result: calculate(item.input),
  }));
  isFinalized = true;
  save("pillowCalcOrder", order);
  if (options.skipRender) refreshOrderRowCosts();
  if (!options.skipRender) renderOrder();
  if (!options.silent && els.saveManualCalc) {
    const previousText = els.saveManualCalc.textContent;
    els.saveManualCalc.textContent = "Сохранено";
    window.setTimeout(() => {
      els.saveManualCalc.textContent = previousText;
    }, 1200);
  }
  return true;
}

async function createProposal() {
  if (!order.length) {
    alert("Сначала добавьте позиции в заказ.");
    return;
  }
  saveManualCalculation({ silent: true });
  isFinalized = true;
  renderOrder();
  const number = nextOrderNumber();
  const payload = orderPayload(number);

  els.createProposal.disabled = true;
  els.createProposal.textContent = "Формирую...";
  try {
    const response = await fetch(apiPath("/api/proposal"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(await response.text());
    const docs = await response.json();
    const historyItem = {
      number,
      date: payload.date,
      orderType: "Подушки",
      title: payload.title,
      quantity: order.reduce((sum, item) => sum + item.input.quantity, 0),
      positionsCount: payload.lines.length,
      vatAmount: payload.totalVat,
      total: payload.total,
      profit: payload.lines.reduce((sum, item) => sum + item.profit, 0),
      status: "Согласование",
      done: false,
      paid: false,
      docxUrl: docs.docxUrl,
      pdfUrl: docs.pdfUrl,
      oksanaDocxUrl: docs.oksanaDocxUrl,
      oksanaPdfUrl: docs.oksanaPdfUrl,
      payload,
      orderSnapshot: clone(order),
      meta: orderMeta(),
      isFinalized: true,
    };
    history.unshift(historyItem);
    save("pillowCalcHistory", history);
    renderHistory();
    document.querySelector('[data-tab="history"]').click();
  } catch (error) {
    alert("Не получилось сформировать КП. Откройте сайт через локальный сервер: http://127.0.0.1:4173");
    console.error(error);
  } finally {
    els.createProposal.disabled = false;
    els.createProposal.textContent = "Оформить заказ";
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("is-active");
  });
});

els.form.addEventListener("input", (event) => {
  syncCustomOrderInputs(event.target);
  renderLive();
});
els.form.addEventListener("change", (event) => {
  syncCustomOrderInputs(event.target);
  renderLive();
});
els.pillowType.addEventListener("change", () => {
  els.materialLogistics.value = defaultMaterialLogistics(els.pillowType.value);
  renderLive();
});
["input", "change"].forEach((eventName) => {
  [els.deliveryAmount, els.orderTitle, els.clientName, els.clientRequisites, els.productionTerm].filter(Boolean).forEach((input) => {
    input.addEventListener(eventName, () => {
      isFinalized = false;
      renderOrder();
    });
  });
});

els.clientRequisitesFile?.addEventListener("change", async () => {
  const file = els.clientRequisitesFile.files?.[0];
  if (!file) return;
  const text = await file.text();
  els.clientRequisites.value = [els.clientRequisites.value.trim(), text.trim()].filter(Boolean).join("\n");
  els.clientRequisitesFile.value = "";
  isFinalized = false;
});

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = currentInput();
  const item = {
    input,
    result: calculate(input),
    positionName: editingIndex === null ? `Позиция ${nextPositionNumber()}` : (order[editingIndex]?.positionName || `Позиция ${editingIndex + 1}`),
    createdAt: new Date().toISOString(),
  };
  if (editingIndex === null) {
    order.push(item);
  } else {
    order[editingIndex] = item;
  }
  isFinalized = false;
  save("pillowCalcOrder", order);
  resetForm();
  renderOrder();
  renderPositionTitle();
});

els.clearForm.addEventListener("click", resetForm);
els.clearOrder.addEventListener("click", () => {
  order = [];
  editingIndex = null;
  isFinalized = false;
  save("pillowCalcOrder", order);
  renderOrder();
  resetForm();
  renderPositionTitle();
});

els.finalizeOrder.addEventListener("click", () => {
  isFinalized = true;
  renderOrder();
});

els.saveManualCalc.addEventListener("click", () => {
  saveManualCalculation();
});

els.createProposal.addEventListener("click", createProposal);

els.beeButton.addEventListener("click", openBeeModal);
els.beeClose.addEventListener("click", closeBeeModal);
els.beeModal.addEventListener("click", (event) => {
  if (event.target === els.beeModal) closeBeeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBeeModal();
});

els.orderBody.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  const edit = event.target.closest("[data-edit]");
  if (remove) {
    order.splice(Number(remove.dataset.remove), 1);
    save("pillowCalcOrder", order);
    isFinalized = false;
    renderOrder();
    renderPositionTitle();
  }
  if (edit) {
    editingIndex = Number(edit.dataset.edit);
    setFormInput(order[editingIndex].input);
    els.addItemButton.textContent = "Сохранить позицию";
    renderPositionTitle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

els.orderBody.addEventListener("input", (event) => {
  const input = event.target.closest("[data-order-edit]");
  if (!input) return;
  syncOrderEditTotals(input);
  saveManualCalculation({ silent: true, skipRender: true });
  syncOrderEditTotals(input);
  updateDraftTotalsFromTable();
});

els.orderBody.addEventListener("change", (event) => {
  const input = event.target.closest("[data-order-edit]");
  if (!input) return;
  syncOrderEditTotals(input);
  saveManualCalculation({ silent: true });
});

els.addTier.addEventListener("click", () => {
  readSettingsFromEditors();
  settings.sewingTiers.push({ max: 450, price: 1150 });
  renderSettings();
});

els.addType.addEventListener("click", () => {
  readSettingsFromEditors();
  settings.types.push({ name: "Новый тип", coeff: 0, assembly: 0, materialLogisticsCoeff: 1 });
  renderSettings();
});

els.tiersList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-tier]");
  if (!button) return;
  settings.sewingTiers.splice(Number(button.dataset.removeTier), 1);
  renderSettings();
});

els.typesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-type]");
  if (!button) return;
  settings.types.splice(Number(button.dataset.removeType), 1);
  renderSettings();
});

els.saveSettings.addEventListener("click", () => {
  readSettingsFromEditors();
  save("pillowCalcSettings", settings);
  renderTypeOptions();
  renderSettings();
  renderRentalPriceTable();
  renderRentalLive();
  resetForm();
});

els.resetSettings.addEventListener("click", () => {
  settings = clone(defaultSettings);
  save("pillowCalcSettings", settings);
  renderTypeOptions();
  renderSettings();
  renderRentalPriceTable();
  renderRentalLive();
  resetForm();
});

els.saveCompany.addEventListener("click", () => {
  readCompanyFromForm();
  alert("Реквизиты сохранены.");
});

els.companyCard.addEventListener("click", async () => {
  const payload = { company: readCompanyFromForm() };
  els.companyCard.disabled = true;
  els.companyCard.textContent = "Формирую...";
  try {
    const response = await fetch(apiPath("/api/company-card"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.pdfUrl) throw new Error(result.error || "Сервер не сформировал PDF");
    const link = document.createElement("a");
    link.href = result.pdfUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert(`Не получилось сформировать карточку компании: ${error.message}`);
  } finally {
    els.companyCard.disabled = false;
    els.companyCard.textContent = "Карточка компании";
  }
});

els.stampFile.addEventListener("change", async () => {
  if (!els.stampFile.files[0]) return;
  company.stampDataUrl = await fileToDataUrl(els.stampFile.files[0]);
  els.stampPreview.src = company.stampDataUrl;
  save("pillowCalcCompany", company);
});

els.clearHistory.addEventListener("click", () => {
  history = [];
  rentalRows = [];
  beanbagRows = [];
  save("pillowCalcHistory", history);
  save("pillowCalcRentalRows", rentalRows);
  save("pillowCalcBeanbagRows", beanbagRows);
  renderHistory();
  renderRentalRows();
  renderBeanbagRows();
});

els.historyTypeFilter.addEventListener("change", () => {
  historyTypeFilter = els.historyTypeFilter.value;
  renderHistory();
});

els.historyBody.addEventListener("click", (event) => {
  if (event.target.closest("[data-history-link]")) return;
  if (event.target.closest("[data-history-status-kind]")) return;
  const removeButton = event.target.closest("[data-remove-history]");
  const openButton = event.target.closest("[data-open-history-order]");
  const openRentalButton = event.target.closest("[data-open-history-rental]");
  const saveButton = event.target.closest("[data-save-history-order]");
  const elbaCreateButton = event.target.closest("[data-elba-create-bill]");
  const elbaRefreshButton = event.target.closest("[data-elba-refresh-bill]");
  const row = event.target.closest("[data-toggle-history]");

  if (elbaCreateButton) {
    handleElbaAction(Number(elbaCreateButton.dataset.elbaCreateBill), "create", elbaCreateButton);
    return;
  }
  if (elbaRefreshButton) {
    handleElbaAction(Number(elbaRefreshButton.dataset.elbaRefreshBill), "refresh", elbaRefreshButton);
    return;
  }
  if (removeButton) {
    const index = Number(removeButton.dataset.removeHistory);
    const kind = removeButton.dataset.removeKind || "pillow";
    if (kind === "rental") {
      rentalRows.splice(index, 1);
      save("pillowCalcRentalRows", rentalRows);
      renderRentalRows();
    } else if (kind === "beanbag") {
      beanbagRows.splice(index, 1);
      save("pillowCalcBeanbagRows", beanbagRows);
      renderBeanbagRows();
    } else {
      history.splice(index, 1);
      save("pillowCalcHistory", history);
    }
    renderHistory();
    return;
  }
  if (openButton) {
    loadHistoryOrder(Number(openButton.dataset.openHistoryOrder));
    return;
  }
  if (openRentalButton) {
    loadRentalHistoryOrder(Number(openRentalButton.dataset.openHistoryRental));
    return;
  }
  if (saveButton) {
    saveHistoryOrder(Number(saveButton.dataset.saveHistoryOrder));
    return;
  }
  if (row) {
    const detail = els.historyBody.querySelector(`[data-history-detail="${row.dataset.toggleHistory}"]`);
    const index = Number(row.dataset.toggleHistory);
    if (detail) {
      detail.hidden = !detail.hidden;
      if (detail.hidden) openHistoryDetails.delete(index);
      else openHistoryDetails.add(index);
    }
  }
});

els.historyBody.addEventListener("change", (event) => {
  const select = event.target.closest("[data-history-status-kind]");
  if (!select) return;
  setHistoryOrderStatus(select.dataset.historyStatusKind, Number(select.dataset.historyStatusIndex), select.value);
});

els.historyBody.addEventListener("input", (event) => {
  const input = event.target.closest("[data-history-edit]");
  if (!input) return;
  updateHistoryLineTotals(input);
});

els.crmBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-crm-status]");
  if (!checkbox) return;
  const index = Number(checkbox.dataset.crmIndex);
  const status = checkbox.dataset.crmStatus;
  if (checkbox.dataset.crmKind === "rental") {
    setRentalRowChecks(index, status, checkbox.checked);
    return;
  }
  if (!history[index]) return;
  history[index][status] = checkbox.checked;
  history[index].status = statusFromChecks(history[index].done, history[index].paid, history[index].status);
  save("pillowCalcHistory", history);
  renderCrm();
  renderPl();
});

els.rentalBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-rental-row-status]");
  if (!checkbox) return;
  setRentalRowChecks(Number(checkbox.dataset.rentalRowIndex), checkbox.dataset.rentalRowStatus, checkbox.checked);
});

els.rentalBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-rental-row]");
  if (!button) return;
  copyRentalRow(Number(button.dataset.copyRentalRow));
});

els.rentalForm.addEventListener("submit", submitRental);

els.rentalDriver.addEventListener("change", updateRentalDriverOther);

els.addRentalDriver.addEventListener("click", addRentalDriver);

els.newRentalDriver.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addRentalDriver();
});

els.addRentalColorLine.addEventListener("click", () => {
  const lines = readRentalColorLines();
  lines.push(defaultRentalColorLine());
  renderRentalColorLines(lines);
});

els.rentalColorLines.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-rental-color]");
  if (!button) return;
  const lines = readRentalColorLines();
  lines.splice(Number(button.dataset.removeRentalColor), 1);
  renderRentalColorLines(lines.length ? lines : [defaultRentalColorLine()]);
  renderRentalLive();
});

els.rentalColorLines.addEventListener("input", renderRentalLive);
els.rentalColorLines.addEventListener("change", renderRentalLive);

[
  els.rentalStart,
  els.rentalStartHour,
  els.rentalStartMinute,
  els.rentalEnd,
  els.rentalEndHour,
  els.rentalEndMinute,
  els.rentalPickup,
  els.rentalDeliveryAmount,
  els.rentalMountingAmount,
  els.rentalPaymentTo,
].forEach((input) => {
  input?.addEventListener("input", renderRentalLive);
  input?.addEventListener("change", renderRentalLive);
});

els.rentalOrderBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-rental-order]");
  if (!button) return;
  rentalOrder.splice(Number(button.dataset.removeRentalOrder), 1);
  save("pillowCalcRentalOrder", rentalOrder);
  renderRentalOrder();
});

els.clearRentalOrder.addEventListener("click", () => {
  rentalOrder = [];
  editingRentalRowIndex = null;
  editingRentalOrderLineIndex = null;
  save("pillowCalcRentalOrder", rentalOrder);
  renderRentalOrder();
});

els.sendRentalOrder.addEventListener("click", sendRentalOrder);

els.saveRentalWebhook.addEventListener("click", () => {
  rentalWebhook = els.rentalWebhookUrl.value.trim();
  save("pillowCalcRentalWebhook", rentalWebhook);
  els.rentalStatus.textContent = "Webhook сохранён";
});

els.clearRentalRows.addEventListener("click", () => {
  rentalRows = [];
  editingRentalRowIndex = null;
  editingRentalOrderLineIndex = null;
  save("pillowCalcRentalRows", rentalRows);
  renderRentalRows();
  renderHistory();
  renderPl();
});

[els.beanbagAmount, els.beanbagDelivery, els.beanbagMounting].forEach((input) => {
  input?.addEventListener("input", renderBeanbagLive);
});

els.saveBeanbagOrder?.addEventListener("click", saveBeanbagOrder);

els.beanbagBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy-beanbag-row]");
  if (!button) return;
  copyBeanbagRow(Number(button.dataset.copyBeanbagRow));
});

els.clearBeanbagRows?.addEventListener("click", () => {
  beanbagRows = [];
  save("pillowCalcBeanbagRows", beanbagRows);
  renderBeanbagRows();
  renderHistory();
  renderCrm();
  renderPl();
});

els.plMonthTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pl-month]");
  if (!button) return;
  selectedPlMonth = button.dataset.plMonth;
  renderPl();
});

function readPlExpensesFromForm() {
  document.querySelectorAll("[data-pl-expense-name]").forEach((input) => {
    const index = Number(input.dataset.plExpenseName);
    if (!plExpenses[index]) return;
    plExpenses[index].name = input.value.trim();
  });
  document.querySelectorAll("[data-pl-expense-amount]").forEach((input) => {
    const index = Number(input.dataset.plExpenseAmount);
    if (!plExpenses[index]) return;
    plExpenses[index].amount = Math.max(0, number(input.value));
  });
  plExpenses = plExpenses.filter((item) => item.fixed || item.name);
}

els.plExpensesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-pl-expense]");
  if (!button) return;
  readPlExpensesFromForm();
  plExpenses.splice(Number(button.dataset.removePlExpense), 1);
  save("pillowCalcPlExpenses", plExpenses);
  renderPlExpenses();
  renderPl();
});

els.addPlExpense.addEventListener("click", () => {
  readPlExpensesFromForm();
  const name = els.newPlExpenseName.value.trim();
  const amount = Math.max(0, number(els.newPlExpenseAmount.value));
  if (!name) {
    alert("Напишите, за что расход.");
    return;
  }
  plExpenses.push({ name, amount, fixed: false });
  save("pillowCalcPlExpenses", plExpenses);
  els.newPlExpenseName.value = "";
  els.newPlExpenseAmount.value = 0;
  renderPlExpenses();
  renderPl();
});

els.savePlExpenses.addEventListener("click", () => {
  readPlExpensesFromForm();
  save("pillowCalcPlExpenses", plExpenses);
  renderPlExpenses();
  renderPl();
});

function renderAll() {
  renderTypeOptions();
  renderSettings();
  renderCompany();
  fillTimeSelects();
  renderRentalDrivers();
  resetForm();
  renderRentalPriceTable();
  renderRentalLive();
  resetBeanbagForm();
  renderPlExpenses();
  renderOrder();
  renderHistory();
  renderRentalOrder();
  renderRentalRows();
  renderBeanbagRows();
  placeOptionsPanel();
}

function placeOptionsPanel() {
  const optionsPanel = document.querySelector(".options-panel");
  const workspace = document.querySelector("#calculator .workspace");
  const fabricField = document.querySelector(".calc-fabric-name-field");
  if (!optionsPanel || !workspace || !fabricField) return;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  if (isMobile && optionsPanel.parentElement !== fabricField.parentElement) {
    fabricField.after(optionsPanel);
  } else if (!isMobile && optionsPanel.parentElement !== workspace) {
    workspace.append(optionsPanel);
  }
}

window.addEventListener("resize", placeOptionsPanel);

renderAll();
syncDatabaseState();

