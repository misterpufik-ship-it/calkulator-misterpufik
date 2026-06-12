const defaultSettings = {
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
    { name: "Поролоновая подушка", coeff: 0, assembly: 100, materialLogisticsCoeff: 1 },
    { name: "Поролоновая подушка с синтепоном", coeff: 0.2, assembly: 200, materialLogisticsCoeff: 1 },
    { name: "Подушка с пуговицами", coeff: 1, assembly: 150, materialLogisticsCoeff: 0.8 },
    { name: "Подушки с Синтепухом", coeff: 0.2, assembly: 150, materialLogisticsCoeff: 0.8 },
    { name: "Подушки с синтепухом с перегородками", coeff: 0.5, assembly: 150, materialLogisticsCoeff: 0.8 },
    { name: "Комбинированная подушка", coeff: 0.8, assembly: 200, materialLogisticsCoeff: 1 },
    { name: "Комбинированная подушка с перегородками", coeff: 1, assembly: 200, materialLogisticsCoeff: 1 },
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
let rentalDrivers = normalizeRentalDrivers(load("pillowCalcRentalDrivers", defaultRentalDrivers));
let plExpenses = load("pillowCalcPlExpenses", defaultPlExpenses);
let selectedPlMonth = "";
let editingIndex = null;
let isFinalized = false;

const els = {
  form: document.querySelector("#calcForm"),
  quantity: document.querySelector("#quantity"),
  length: document.querySelector("#length"),
  width: document.querySelector("#width"),
  height: document.querySelector("#height"),
  foamDensity: document.querySelector("#foamDensity"),
  foamDensityField: document.querySelector("#foamDensityField"),
  pillowType: document.querySelector("#pillowType"),
  paymentType: document.querySelector("#paymentType"),
  fabricPrice: document.querySelector("#fabricPrice"),
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
  rentalComment: document.querySelector("#rentalComment"),
  addRentalColorLine: document.querySelector("#addRentalColorLine"),
  rentalColorLines: document.querySelector("#rentalColorLines"),
  rentalWebhookUrl: document.querySelector("#rentalWebhookUrl"),
  saveRentalWebhook: document.querySelector("#saveRentalWebhook"),
  rentalOrderBody: document.querySelector("#rentalOrderBody"),
  rentalOrderQuantity: document.querySelector("#rentalOrderQuantity"),
  rentalOrderColorSummary: document.querySelector("#rentalOrderColorSummary"),
  clearRentalOrder: document.querySelector("#clearRentalOrder"),
  sendRentalOrder: document.querySelector("#sendRentalOrder"),
  rentalBody: document.querySelector("#rentalBody"),
  clearRentalRows: document.querySelector("#clearRentalRows"),
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
  return saved ? JSON.parse(saved) : clone(fallback);
}

function normalizeSettings(value) {
  const merged = {
    ...clone(defaultSettings),
    ...value,
    options: { ...clone(defaultSettings.options), ...(value?.options || {}) },
  };
  const defaultTypes = defaultSettings.types;
  const fallbackValues = [1000, 1000, 800, 800, 800, 1000, 1000, 2000];
  const base = Math.max(1, number(merged.options.materialLogisticsBase, defaultSettings.options.materialLogisticsBase));
  merged.options.materialLogisticsBase = base;
  merged.types = (value?.types?.length ? value.types : defaultTypes).map((type, index) => {
    const defaultType = defaultTypes[index] || {};
    const legacyAmount = number(type.materialLogistics, fallbackValues[index] ?? base);
    const coeff = number(
      type.materialLogisticsCoeff,
      number(defaultType.materialLogisticsCoeff, legacyAmount / base)
    );
    return {
      ...defaultType,
      ...type,
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

function nextOrderNumber() {
  const usedNumbers = history
    .map((item) => item.number)
    .map((value) => Number(value))
    .filter(Number.isFinite);
  return String((usedNumbers.length ? Math.max(...usedNumbers) : 0) + 1);
}

function currentInput() {
  return {
    quantity: Math.max(1, number(els.quantity.value, 1)),
    length: Math.max(0, number(els.length.value)),
    width: Math.max(0, number(els.width.value)),
    height: Math.max(0, number(els.height.value)),
    foamDensity: Math.max(1, number(els.foamDensity.value, 25)),
    type: els.pillowType.value,
    paymentType: els.paymentType.value,
    fabricPrice: Math.max(0, number(els.fabricPrice.value, settings.options.defaultFabricPrice)),
    buttonsCount: Math.max(0, number(els.buttonsCount.value)),
    materialLogistics: Math.max(0, number(els.materialLogistics.value, defaultMaterialLogistics(els.pillowType.value))),
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
  const assembly = input.coverOnly ? 0 : type.assembly;
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

function applyManualOverrides(item, line) {
  const manual = item.manual || {};
  const quantity = Math.max(1, number(item.input.quantity, 1));
  const sewingPrice = manualNumber(manual.sewingPrice, line.result.sewing);
  const sewingTotal = manualNumber(manual.sewingTotal, sewingPrice * quantity);
  const assemblyPrice = manualNumber(manual.assemblyPrice, line.result.assembly);
  const assemblyTotal = manualNumber(manual.assemblyTotal, assemblyPrice * quantity);
  const baseComponentCost = (line.result.sewing + line.result.assembly) * quantity;
  const finalCostBase = line.finalCost - baseComponentCost + sewingTotal + assemblyTotal;
  const manualVat = manualNumber(manual.finalVat, line.finalVat);
  const totalFromUnit = Number.isFinite(Number(manual.unitPrice)) ? Math.max(0, Number(manual.unitPrice)) * quantity : null;
  const finalPrice = manualNumber(manual.finalPrice, totalFromUnit ?? line.finalPrice);
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

function materialLogisticsSummary() {
  const net = isFinalized
    ? order.reduce((sum, item) => sum + Math.max(0, number(item.input.materialLogistics, defaultMaterialLogistics(item.input.type))), 0)
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
  renderFoamDensityVisibility();
  renderButtonsVisibility();
  const input = currentInput();
  const result = calculate(input);
  els.liveCost.textContent = `Себестоимость: ${money(result.totalCost)}`;
  els.livePrice.textContent = `Цена: ${money(result.totalPrice)}`;
  els.liveProfit.textContent = `Прибыль: ${money(result.totalPrice - result.totalCost)}`;
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
    ["Ткань", money(result.fabric)],
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
  const typeName = els.pillowType.value;
  const shouldShow = usesFoam(typeName) || usesComboFoam(typeName);
  els.foamDensityField.classList.toggle("calc-hidden", !shouldShow);
}

function renderButtonsVisibility() {
  if (!els.buttonsCountField) return;
  const shouldShow = els.pillowType.value === "Подушка с пуговицами";
  els.buttonsCountField.classList.toggle("calc-hidden", !shouldShow);
  if (!shouldShow) els.buttonsCount.value = 0;
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
      const size = `${item.input.length} x ${item.input.width} x ${item.input.height} см`;
      return `
        <tr data-other-unit-cost="${(item.finalCost - item.sewingTotal - item.assemblyTotal) / Math.max(1, number(item.input.quantity, 1))}">
          <td><input class="table-input" type="text" value="${escapeHtml(item.positionName || positionLabel(index))}" data-order-edit="${index}" data-field="positionName"><br><span class="muted-cell">${escapeHtml(item.input.type)}</span></td>
          <td>
            <div class="size-inputs">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.length}" data-order-edit="${index}" data-field="length" aria-label="Длина">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.width}" data-order-edit="${index}" data-field="width" aria-label="Ширина">
              <input class="table-input" type="number" min="0" step="0.1" value="${item.input.height}" data-order-edit="${index}" data-field="height" aria-label="Высота">
            </div>
            <span class="muted-cell">${size}</span>
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
  els.headerTotal.textContent = money(total);
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
  if (!history.length) {
    els.historyBody.innerHTML = `<tr class="empty-row"><td colspan="9">Заказов пока нет</td></tr>`;
    renderCrm();
    renderPl();
    return;
  }
  els.historyBody.innerHTML = history.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.date)}</td>
      <td>${escapeHtml(item.number)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td class="numeric">${item.quantity}</td>
      <td class="numeric">${money(item.vatAmount || 0)}</td>
      <td class="numeric">${money(item.total)}</td>
      <td class="numeric">${money(item.profit || 0)}</td>
      <td>
        ${item.docxUrl ? `<a class="link-btn" href="${item.docxUrl}" download>Word</a>` : ""}
        ${item.pdfUrl ? `<a class="link-btn" href="${item.pdfUrl}" download>PDF</a>` : ""}
        ${item.oksanaDocxUrl ? `<a class="link-btn" href="${item.oksanaDocxUrl}" download>Оксана Word</a>` : ""}
        ${item.oksanaXlsxUrl ? `<a class="link-btn" href="${item.oksanaXlsxUrl}" download>Оксана Excel</a>` : ""}
      </td>
      <td class="numeric"><button class="icon-btn" type="button" data-remove-history="${index}" title="Удалить заказ">×</button></td>
    </tr>
  `).join("");
  renderCrm();
  renderPl();
}

function renderCrm() {
  if (!els.crmBody) return;
  const totalOrders = history.length;
  const doneOrders = history.filter((item) => item.done).length;
  const paidOrders = history.filter((item) => item.paid).length;
  const totalProfit = history.reduce((sum, item) => sum + number(item.profit), 0);
  const paidProfit = history.reduce((sum, item) => sum + (item.paid ? number(item.profit) : 0), 0);

  els.crmTotalOrders.textContent = totalOrders;
  els.crmDoneOrders.textContent = doneOrders;
  els.crmPaidOrders.textContent = paidOrders;
  els.crmTotalProfit.textContent = money(totalProfit);
  els.crmPaidProfit.textContent = money(paidProfit);

  if (!history.length) {
    els.crmBody.innerHTML = `<tr class="empty-row"><td colspan="7">Заказы пока не сформированы</td></tr>`;
    return;
  }

  els.crmBody.innerHTML = history.map((item, index) => `
    <tr>
      <td>${escapeHtml(item.date)}</td>
      <td>${escapeHtml(item.number)}</td>
      <td>${escapeHtml(item.title || "Заказ")}</td>
      <td class="numeric">${item.positionsCount || item.linesCount || item.quantity || 0}</td>
      <td class="numeric">${money(item.profit || 0)}</td>
      <td class="numeric"><input class="status-check" type="checkbox" data-crm-status="done" data-crm-index="${index}" ${item.done ? "checked" : ""} /></td>
      <td class="numeric"><input class="status-check" type="checkbox" data-crm-status="paid" data-crm-index="${index}" ${item.paid ? "checked" : ""} /></td>
    </tr>
  `).join("");
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
    if (completedRentalStatus(row.status) && date) months.add(monthKey(date));
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
    return completedRentalStatus(row.status) && date && monthKey(date) === key;
  });
  const orderRevenue = completedOrders.reduce((sum, item) => sum + number(item.total), 0);
  const orderProfit = completedOrders.reduce((sum, item) => sum + number(item.profit), 0);
  const orderCost = Math.max(0, orderRevenue - orderProfit);
  const rentalRevenue = completedRentals.reduce((sum, row) => sum + number(row.amount), 0);
  const expenses = plExpenses.reduce((sum, item) => sum + Math.max(0, number(item.amount)), 0);
  const revenue = orderRevenue + rentalRevenue;
  const grossProfit = orderProfit + rentalRevenue;
  const netProfit = grossProfit - expenses;
  const margin = revenue > 0 ? netProfit / revenue * 100 : 0;
  return {
    completedOrders,
    completedRentals,
    orderRevenue,
    orderCost,
    orderProfit,
    rentalRevenue,
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
    <tr class="pl-total-row"><td>Итого выручка</td><td class="numeric">${money(data.revenue)}</td></tr>
    <tr><th colspan="2">Себестоимость</th></tr>
    <tr><td>Себестоимость заказов</td><td class="numeric">${money(data.orderCost)}</td></tr>
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

function rentalFormPayload() {
  const colors = readRentalColorLines();
  return {
    date: els.rentalDate.value || todayIso(),
    client: els.rentalClient.value.trim(),
    phone: els.rentalPhone.value.trim(),
    driver: rentalDriverValue(),
    item: "Кресло Груша",
    colors,
    colorSummary: colorSummary(colors),
    quantity: rentalQuantity(colors),
    amount: 0,
    startDate: els.rentalStart.value,
    startTime: timeValue(els.rentalStartHour.value, els.rentalStartMinute.value),
    endDate: els.rentalEnd.value,
    endTime: timeValue(els.rentalEndHour.value, els.rentalEndMinute.value),
    status: els.rentalStatusSelect.value,
    comment: els.rentalComment.value.trim(),
    webhookUrl: els.rentalWebhookUrl.value.trim(),
  };
}

function rentalOrderPayload(webhookUrl) {
  const lines = rentalOrder.map((row, index) => ({
    index: index + 1,
    date: row.date,
    client: row.client,
    phone: row.phone,
    driver: row.driver,
    item: row.item,
    quantity: row.quantity,
    amount: row.amount,
    startDate: row.startDate,
    startTime: row.startTime,
    endDate: row.endDate,
    endTime: row.endTime,
    status: row.status,
    comment: row.comment,
    colors: row.colors,
    colorSummary: row.colorSummary,
  }));
  const allColors = lines.flatMap((line) => line.colors || []);
  return {
    date: lines[0]?.date || todayIso(),
    client: lines[0]?.client || "",
    phone: lines[0]?.phone || "",
    driver: lines[0]?.driver || "",
    item: lines.map((line) => line.item).filter(Boolean).join("; "),
    quantity: lines.reduce((sum, line) => sum + number(line.quantity), 0),
    amount: lines.reduce((sum, line) => sum + number(line.amount), 0),
    startDate: lines[0]?.startDate || "",
    startTime: lines[0]?.startTime || "",
    endDate: lines[0]?.endDate || "",
    endTime: lines[0]?.endTime || "",
    status: lines[0]?.status || "Согласование",
    comment: lines.map((line) => line.comment).filter(Boolean).join("; "),
    colors: allColors,
    colorSummary: colorSummary(allColors),
    lines,
    webhookUrl,
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
  renderRentalDrivers();
  renderRentalColorLines();
}

function renderRentalOrder() {
  if (!els.rentalOrderBody) return;
  if (!rentalOrder.length) {
    els.rentalOrderBody.innerHTML = `<tr class="empty-row"><td colspan="7">Позиции аренды пока не добавлены</td></tr>`;
  } else {
    els.rentalOrderBody.innerHTML = rentalOrder.map((row, index) => `
      <tr>
        <td>${escapeHtml(row.date)}</td>
        <td>${escapeHtml(row.client || "-")}</td>
        <td><strong>${escapeHtml(row.item)}</strong></td>
        <td>${escapeHtml(row.driver || "-")}</td>
        <td>${escapeHtml(row.colorSummary || "-")}</td>
        <td class="numeric">${row.quantity}</td>
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
}

function renderRentalRows() {
  const webhook = localStorage.getItem("pillowCalcRentalWebhook") || "";
  if (els.rentalWebhookUrl) els.rentalWebhookUrl.value = webhook;
  if (els.rentalDate && !els.rentalDate.value) els.rentalDate.value = todayIso();
  if (els.rentalColorLines && !els.rentalColorLines.children.length) renderRentalColorLines();
  if (!els.rentalBody) return;

  if (!rentalRows.length) {
    els.rentalBody.innerHTML = `<tr class="empty-row"><td colspan="7">Заказы аренды пока не отправлялись</td></tr>`;
    renderPl();
    return;
  }

  els.rentalBody.innerHTML = rentalRows.map((row) => `
    <tr>
      <td>${escapeHtml(row.date)}</td>
      <td>${escapeHtml(row.client || "-")}</td>
      <td>${escapeHtml(row.item)}</td>
      <td>${escapeHtml(row.driver || "-")}</td>
      <td>${escapeHtml(row.colorSummary || "-")}</td>
      <td class="numeric">${row.quantity}</td>
      <td>${escapeHtml(row.status || "-")}</td>
    </tr>
  `).join("");
  renderPl();
}

function submitRental(event) {
  event.preventDefault();
  const payload = rentalFormPayload();
  rentalOrder.push({ ...payload, createdAt: new Date().toISOString() });
  save("pillowCalcRentalOrder", rentalOrder);
  if (payload.webhookUrl) localStorage.setItem("pillowCalcRentalWebhook", payload.webhookUrl);
  els.rentalStatus.textContent = "Позиция добавлена";
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
    colors.some((line) => number(line.quantity) > 1 || line.color !== rentalColors[0])
  );
}

function addRentalDraftToOrder() {
  if (!hasRentalDraft()) return false;
  const payload = rentalFormPayload();
  rentalOrder.push({ ...payload, createdAt: new Date().toISOString() });
  save("pillowCalcRentalOrder", rentalOrder);
  if (payload.webhookUrl) localStorage.setItem("pillowCalcRentalWebhook", payload.webhookUrl);
  resetRentalForm(payload);
  renderRentalOrder();
  return true;
}

async function sendRentalOrder() {
  const webhookUrl = els.rentalWebhookUrl.value.trim() || localStorage.getItem("pillowCalcRentalWebhook") || "";
  if (!webhookUrl) {
    alert("Сначала вставьте webhook Google Apps Script.");
    return;
  }
  addRentalDraftToOrder();
  if (!rentalOrder.length) {
    alert("Сначала заполните заказ аренды.");
    return;
  }
  const payload = rentalOrderPayload(webhookUrl);

  els.rentalStatus.textContent = "Сохраняю...";
  els.sendRentalOrder.disabled = true;
  try {
    const response = await fetch("/api/rental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Google Таблица не приняла данные");
    }

    rentalRows.unshift({ ...payload, sentAt: new Date().toISOString() });
    rentalRows = rentalRows.slice(0, 50);
    save("pillowCalcRentalRows", rentalRows);
    rentalOrder = [];
    save("pillowCalcRentalOrder", rentalOrder);
    localStorage.setItem("pillowCalcRentalWebhook", payload.webhookUrl);
    els.rentalStatus.textContent = "Отправлено";
    resetRentalForm(payload);
    renderRentalOrder();
    renderRentalRows();
  } catch (error) {
    els.rentalStatus.textContent = "Ошибка отправки";
    alert(`Не получилось отправить в Google Таблицу: ${error.message}`);
  } finally {
    els.sendRentalOrder.disabled = false;
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
  settings.types = settings.types.filter((type) => type.name);
}

function setFormInput(input) {
  els.quantity.value = input.quantity;
  els.length.value = input.length;
  els.width.value = input.width;
  els.height.value = input.height;
  els.foamDensity.value = input.foamDensity;
  els.pillowType.value = input.type;
  els.paymentType.value = input.paymentType;
  els.fabricPrice.value = input.fabricPrice;
  els.buttonsCount.value = input.buttonsCount;
  els.materialLogistics.value = number(input.materialLogistics, defaultMaterialLogistics(input.type));
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
    buttonsCount: 0,
    materialLogistics: defaultMaterialLogistics(settings.types[0]?.name || ""),
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
  const unitInput = row.querySelector('[data-field="unitPrice"]');
  const totalInput = row.querySelector('[data-field="finalPrice"]');
  const profitInput = row.querySelector('[data-field="finalProfit"]');
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
  if (input.dataset.field === "finalPrice") {
    unitInput.value = Math.round(Math.max(0, number(totalInput.value)) / quantity);
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
  els.headerTotal.textContent = money(total);
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
  const meta = orderMeta();
  const number = nextOrderNumber();
  const lines = finalizedOrderLines().map((item, index) => ({
    index: index + 1,
    type: item.input.type,
    size: `${item.input.length} x ${item.input.width} x ${item.input.height} см`,
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
  const payload = {
    number,
    date: todayRu(),
    title: meta.title,
    clientName: meta.clientName,
    productionTerm: meta.productionTerm,
    deliveryAmount: meta.deliveryAmount,
    deliveryGrossAmount: delivery.gross,
    deliveryVat: delivery.vat,
    totalVat: lines.reduce((sum, item) => sum + item.vatAmount, 0) + delivery.vat,
    total: lines.reduce((sum, item) => sum + item.totalPrice, 0) + delivery.gross,
    lines,
    company,
  };

  els.createProposal.disabled = true;
  els.createProposal.textContent = "Формирую...";
  try {
    const response = await fetch("/api/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(await response.text());
    const docs = await response.json();
    const historyItem = {
      number,
      date: payload.date,
      title: meta.title,
      quantity: order.reduce((sum, item) => sum + item.input.quantity, 0),
      positionsCount: lines.length,
      vatAmount: payload.totalVat,
      total: payload.total,
      profit: lines.reduce((sum, item) => sum + item.profit, 0),
      done: false,
      paid: false,
      docxUrl: docs.docxUrl,
      pdfUrl: docs.pdfUrl,
      oksanaDocxUrl: docs.oksanaDocxUrl,
      oksanaXlsxUrl: docs.oksanaXlsxUrl,
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

els.form.addEventListener("input", renderLive);
els.pillowType.addEventListener("change", () => {
  els.materialLogistics.value = defaultMaterialLogistics(els.pillowType.value);
  renderLive();
});
["input", "change"].forEach((eventName) => {
  [els.deliveryAmount, els.orderTitle, els.clientName, els.productionTerm].forEach((input) => {
    input.addEventListener(eventName, () => {
      isFinalized = false;
      renderOrder();
    });
  });
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
  resetForm();
});

els.resetSettings.addEventListener("click", () => {
  settings = clone(defaultSettings);
  save("pillowCalcSettings", settings);
  renderTypeOptions();
  renderSettings();
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
    const response = await fetch("/api/company-card", {
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
  save("pillowCalcHistory", history);
  renderHistory();
});

els.historyBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-history]");
  if (!button) return;
  history.splice(Number(button.dataset.removeHistory), 1);
  save("pillowCalcHistory", history);
  renderHistory();
});

els.crmBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-crm-status]");
  if (!checkbox) return;
  const index = Number(checkbox.dataset.crmIndex);
  const status = checkbox.dataset.crmStatus;
  if (!history[index]) return;
  history[index][status] = checkbox.checked;
  save("pillowCalcHistory", history);
  renderCrm();
  renderPl();
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
  save("pillowCalcRentalOrder", rentalOrder);
  renderRentalOrder();
});

els.sendRentalOrder.addEventListener("click", sendRentalOrder);

els.saveRentalWebhook.addEventListener("click", () => {
  localStorage.setItem("pillowCalcRentalWebhook", els.rentalWebhookUrl.value.trim());
  els.rentalStatus.textContent = "Webhook сохранён";
});

els.clearRentalRows.addEventListener("click", () => {
  rentalRows = [];
  save("pillowCalcRentalRows", rentalRows);
  renderRentalRows();
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

renderTypeOptions();
renderSettings();
renderCompany();
fillTimeSelects();
renderRentalDrivers();
resetForm();
renderPlExpenses();
renderOrder();
renderHistory();
renderRentalOrder();
renderRentalRows();

