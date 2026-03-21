const STORAGE_KEY = "password-generator-pro-settings";
const THEME_KEY = "password-generator-pro-theme";
const DEFAULT_LENGTH_MIN = 8;
const LENGTH_MAX = 64;
const COUNT_MIN = 1;
const COUNT_MAX = 10;

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "!@#$%^&*()[]{}=<>?/.,_-+",
};

const SIMILAR_CHARS = new Set(["O", "0", "I", "l", "1", "|"]);

const els = {
  result: document.getElementById("result"),
  charCount: document.getElementById("charCount"),
  copyFeedback: document.getElementById("copyFeedback"),
  profileBadge: document.getElementById("profileBadge"),
  complexityBadge: document.getElementById("complexityBadge"),
  batchBadge: document.getElementById("batchBadge"),
  strengthText: document.getElementById("strengthText"),
  strengthFill: document.getElementById("strengthFill"),
  strengthTip: document.getElementById("strengthTip"),
  errorMessage: document.getElementById("errorMessage"),
  lengthRange: document.getElementById("passLength"),
  lengthNumber: document.getElementById("passLengthNumber"),
  lengthValue: document.getElementById("lengthValue"),
  lengthHint: document.getElementById("lengthHint"),
  passwordCount: document.getElementById("passwordCount"),
  upperCase: document.getElementById("upperCase"),
  lowerCase: document.getElementById("lowerCase"),
  number: document.getElementById("number"),
  symbol: document.getElementById("symbol"),
  avoidSimilar: document.getElementById("avoidSimilar"),
  btnGenerate: document.getElementById("btnGenerate"),
  btnRegenerate: document.getElementById("btnRegenerate"),
  btnCopy: document.getElementById("btnCopy"),
  btnCopyAll: document.getElementById("btnCopyAll"),
  btnDownload: document.getElementById("btnDownload"),
  btnClear: document.getElementById("btnClear"),
  btnUseFirst: document.getElementById("btnUseFirst"),
  toggleVisibility: document.getElementById("toggleVisibility"),
  themeToggle: document.getElementById("themeToggle"),
  generatedList: document.getElementById("generatedList"),
  listSummary: document.getElementById("listSummary"),
  presetButtons: [...document.querySelectorAll("[data-preset]")],
};

let generatedPasswords = [];
let feedbackTimer;
let activePreset = "";

function getCurrentLengthMin() {
  return Number(els.lengthRange.min) || DEFAULT_LENGTH_MIN;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function secureRandomIndex(max) {
  if (max <= 0) {
    return 0;
  }

  const values = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % max;
}

function randomCharFrom(pool) {
  return pool[secureRandomIndex(pool.length)];
}

function shuffle(array) {
  const cloned = [...array];

  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const randomIndex = secureRandomIndex(i + 1);
    [cloned[i], cloned[randomIndex]] = [cloned[randomIndex], cloned[i]];
  }

  return cloned;
}

function sanitizePool(pool, avoidSimilar) {
  if (!avoidSimilar) {
    return pool;
  }

  return [...pool].filter((char) => !SIMILAR_CHARS.has(char)).join("");
}

function getSettings() {
  return {
    length: clamp(Number(els.lengthNumber.value), getCurrentLengthMin(), LENGTH_MAX),
    count: clamp(Number(els.passwordCount.value), COUNT_MIN, COUNT_MAX),
    upper: els.upperCase.checked,
    lower: els.lowerCase.checked,
    number: els.number.checked,
    symbol: els.symbol.checked,
    avoidSimilar: els.avoidSimilar.checked,
  };
}

function buildPools(settings) {
  return [
    settings.lower && { key: "lower", pool: sanitizePool(CHAR_SETS.lower, settings.avoidSimilar) },
    settings.upper && { key: "upper", pool: sanitizePool(CHAR_SETS.upper, settings.avoidSimilar) },
    settings.number && { key: "number", pool: sanitizePool(CHAR_SETS.number, settings.avoidSimilar) },
    settings.symbol && { key: "symbol", pool: sanitizePool(CHAR_SETS.symbol, settings.avoidSimilar) },
  ]
    .filter(Boolean)
    .filter((entry) => entry.pool.length > 0);
}

function validateSettings(settings) {
  const currentLengthMin = getCurrentLengthMin();

  if (!settings.upper && !settings.lower && !settings.number && !settings.symbol) {
    return "Seleciona pelo menos um tipo de caractere.";
  }

  if (settings.length < currentLengthMin || settings.length > LENGTH_MAX) {
    return `Escolhe um comprimento entre ${currentLengthMin} e ${LENGTH_MAX}.`;
  }

  if (settings.count < COUNT_MIN || settings.count > COUNT_MAX) {
    return `Escolhe uma quantidade entre ${COUNT_MIN} e ${COUNT_MAX}.`;
  }

  const pools = buildPools(settings);

  if (pools.length === 0) {
    return "As opcoes atuais removeram todos os caracteres disponiveis.";
  }

  if (settings.length < pools.length) {
    return "O comprimento deve ser pelo menos igual ao numero de tipos selecionados.";
  }

  return "";
}

function generatePassword(settings) {
  const pools = buildPools(settings);
  const guaranteedChars = pools.map((entry) => randomCharFrom(entry.pool));
  const mergedPool = pools.map((entry) => entry.pool).join("");
  const chars = [...guaranteedChars];

  while (chars.length < settings.length) {
    chars.push(randomCharFrom(mergedPool));
  }

  return shuffle(chars).join("");
}

function hasSequentialPattern(password) {
  const normalized = password.toLowerCase();
  const sequences = [
    "0123456789",
    "9876543210",
    "abcdefghijklmnopqrstuvwxyz",
    "zyxwvutsrqponmlkjihgfedcba",
  ];

  return sequences.some((sequence) => {
    for (let index = 0; index <= sequence.length - 4; index += 1) {
      if (normalized.includes(sequence.slice(index, index + 4))) {
        return true;
      }
    }

    return false;
  });
}

function evaluateStrength(password, settings) {
  if (!password) {
    return {
      label: "Sem avaliar",
      width: "0%",
      color: "transparent",
      tip: "Gera uma senha para veres sugestoes de melhoria.",
    };
  }

  let score = 0;
  const selectedTypes = [settings.lower, settings.upper, settings.number, settings.symbol].filter(Boolean).length;

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 24) score += 1;
  if (selectedTypes >= 3) score += 1;
  if (selectedTypes === 4) score += 1;
  if (!hasSequentialPattern(password)) score += 1;
  if (new Set(password).size >= Math.min(password.length, 10)) score += 1;

  if (password.length < 10) {
    score = Math.min(score, 1);
  }

  const tipParts = [];

  if (password.length < 16) tipParts.push("Aumenta o comprimento para 16+ caracteres.");
  if (selectedTypes < 3) tipParts.push("Mistura mais tipos de caracteres.");
  if (hasSequentialPattern(password)) tipParts.push("Evita sequencias previsiveis como 1234 ou abcd.");
  if (!tipParts.length) tipParts.push("Boa combinacao. Mantem esta senha unica e ativa 2FA.");

  if (score <= 2) {
    return { label: "Fraca", width: "25%", color: "#ff6b6b", tip: tipParts.join(" ") };
  }

  if (score <= 4) {
    return { label: "Media", width: "50%", color: "#f59e0b", tip: tipParts.join(" ") };
  }

  if (score <= 6) {
    return { label: "Forte", width: "75%", color: "#84cc16", tip: tipParts.join(" ") };
  }

  return { label: "Muito forte", width: "100%", color: "#22c55e", tip: tipParts.join(" ") };
}

function updateStrength(password) {
  const strength = evaluateStrength(password, getSettings());
  els.strengthText.textContent = strength.label;
  els.strengthFill.style.width = strength.width;
  els.strengthFill.style.background = strength.color;
  els.strengthTip.textContent = strength.tip;
}

function getProfileLabel(settings) {
  if (settings.number && !settings.upper && !settings.lower && !settings.symbol) {
    return "PIN";
  }

  if (settings.avoidSimilar && !settings.symbol) {
    return "Legivel";
  }

  if (settings.length >= 24 && settings.upper && settings.lower && settings.number && settings.symbol) {
    return "Blindado";
  }

  if (settings.length >= 16) {
    return "Equilibrado+";
  }

  return "Equilibrado";
}

function updateStatusStrip() {
  const settings = getSettings();
  const selectedTypes = [settings.lower, settings.upper, settings.number, settings.symbol].filter(Boolean).length;

  els.profileBadge.textContent = getProfileLabel(settings);
  els.complexityBadge.textContent = `${selectedTypes} tipo${selectedTypes === 1 ? "" : "s"}`;
  els.batchBadge.textContent = `${settings.count} senha${settings.count === 1 ? "" : "s"}`;
}

function updatePresetState() {
  els.presetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === activePreset);
  });
}

function updateResultState() {
  const currentPassword = generatedPasswords[0] || "";
  const hasPasswords = generatedPasswords.length > 0;

  els.result.value = currentPassword;
  els.charCount.textContent = `${currentPassword.length} caracteres`;
  els.listSummary.textContent = `${generatedPasswords.length} resultado${generatedPasswords.length === 1 ? "" : "s"}`;
  els.btnCopy.disabled = !currentPassword;
  els.btnCopyAll.disabled = !hasPasswords;
  els.btnDownload.disabled = !hasPasswords;
  els.btnUseFirst.disabled = !currentPassword;
  updateStrength(currentPassword);
  updateStatusStrip();
}

function renderList() {
  if (!generatedPasswords.length) {
    els.generatedList.innerHTML = '<p class="empty-state">Gera uma ou varias senhas para veres a lista aqui.</p>';
    updateResultState();
    return;
  }

  els.generatedList.innerHTML = generatedPasswords
    .map(
      (password, index) => `
        <div class="generated-item">
          <span class="generated-password">${password}</span>
          <button class="btn btn-secondary" type="button" data-password-index="${index}">
            Copiar
          </button>
        </div>
      `
    )
    .join("");

  updateResultState();
}

function showFeedback(message, isError = false) {
  clearTimeout(feedbackTimer);
  els.copyFeedback.textContent = message;
  els.copyFeedback.style.color = isError ? "var(--danger)" : "var(--accent)";

  feedbackTimer = window.setTimeout(() => {
    els.copyFeedback.textContent = "";
  }, 1800);
}

function setError(message) {
  els.errorMessage.textContent = message;
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getSettings()));
}

function syncLengthInputs(nextValue) {
  const safeValue = clamp(Number(nextValue), getCurrentLengthMin(), LENGTH_MAX);
  els.lengthRange.value = safeValue;
  els.lengthNumber.value = safeValue;
  els.lengthValue.textContent = safeValue;
  els.lengthHint.textContent =
    safeValue >= 16
      ? "Excelente zona para contas importantes."
      : `Entre ${getCurrentLengthMin()} e ${LENGTH_MAX} caracteres para equilibrar seguranca e usabilidade.`;
}

function syncCountInput(nextValue) {
  els.passwordCount.value = clamp(Number(nextValue), COUNT_MIN, COUNT_MAX);
}

function setLengthBounds(minValue) {
  els.lengthRange.min = minValue;
  els.lengthNumber.min = minValue;
}

function applyPreset(preset) {
  activePreset = preset;

  if (preset === "pin") {
    setLengthBounds(4);
    syncLengthInputs(6);
    syncCountInput(1);
    els.upperCase.checked = false;
    els.lowerCase.checked = false;
    els.number.checked = true;
    els.symbol.checked = false;
    els.avoidSimilar.checked = false;
    els.lengthHint.textContent = "Preset de PIN ativo: permite valores entre 4 e 64.";
  } else if (preset === "readable") {
    setLengthBounds(DEFAULT_LENGTH_MIN);
    syncLengthInputs(18);
    syncCountInput(1);
    els.upperCase.checked = true;
    els.lowerCase.checked = true;
    els.number.checked = true;
    els.symbol.checked = false;
    els.avoidSimilar.checked = true;
  } else if (preset === "secure") {
    setLengthBounds(DEFAULT_LENGTH_MIN);
    syncLengthInputs(24);
    syncCountInput(3);
    els.upperCase.checked = true;
    els.lowerCase.checked = true;
    els.number.checked = true;
    els.symbol.checked = true;
    els.avoidSimilar.checked = false;
  }

  persistSettings();
  updatePresetState();
  updateStatusStrip();
}

function resetLengthBounds() {
  if (getCurrentLengthMin() !== 4) {
    setLengthBounds(DEFAULT_LENGTH_MIN);
  }
}

function generatePasswords() {
  const settings = getSettings();
  const error = validateSettings(settings);

  if (error) {
    setError(error);
    generatedPasswords = [];
    renderList();
    return;
  }

  setError("");
  generatedPasswords = Array.from({ length: settings.count }, () => generatePassword(settings));
  renderList();
  persistSettings();
  els.result.classList.remove("pulse");
  void els.result.offsetWidth;
  els.result.classList.add("pulse");
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    showFeedback(successMessage);
  } catch {
    showFeedback("Nao foi possivel copiar.", true);
  }
}

function clearAll() {
  setLengthBounds(DEFAULT_LENGTH_MIN);
  syncLengthInputs(16);
  syncCountInput(1);
  els.upperCase.checked = true;
  els.lowerCase.checked = true;
  els.number.checked = true;
  els.symbol.checked = true;
  els.avoidSimilar.checked = false;
  generatedPasswords = [];
  activePreset = "";
  setError("");
  renderList();
  persistSettings();
  updatePresetState();
}

function downloadPasswords() {
  if (!generatedPasswords.length) {
    return;
  }

  const blob = new Blob([generatedPasswords.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "senhas-geradas.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadSavedSettings() {
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEY);

    if (!rawSettings) {
      setLengthBounds(DEFAULT_LENGTH_MIN);
      syncLengthInputs(16);
      syncCountInput(1);
      return;
    }

    const settings = JSON.parse(rawSettings);
    setLengthBounds(DEFAULT_LENGTH_MIN);
    syncLengthInputs(settings.length ?? 16);
    syncCountInput(settings.count ?? 1);
    els.upperCase.checked = settings.upper ?? true;
    els.lowerCase.checked = settings.lower ?? true;
    els.number.checked = settings.number ?? true;
    els.symbol.checked = settings.symbol ?? true;
    els.avoidSimilar.checked = settings.avoidSimilar ?? false;
  } catch {
    setLengthBounds(DEFAULT_LENGTH_MIN);
    syncLengthInputs(16);
    syncCountInput(1);
  }

  updateStatusStrip();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeToggle.innerHTML =
    theme === "light" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");
}

els.lengthRange.addEventListener("input", (event) => {
  syncLengthInputs(event.target.value);
  persistSettings();
  activePreset = "";
  updatePresetState();
  updateStatusStrip();
});

els.lengthNumber.addEventListener("input", (event) => {
  syncLengthInputs(event.target.value);
  persistSettings();
  activePreset = "";
  updatePresetState();
  updateStatusStrip();
});

els.passwordCount.addEventListener("input", (event) => {
  syncCountInput(event.target.value);
  persistSettings();
  activePreset = "";
  updatePresetState();
  updateStatusStrip();
});

[els.upperCase, els.lowerCase, els.number, els.symbol, els.avoidSimilar].forEach((input) => {
  input.addEventListener("change", () => {
    persistSettings();
    activePreset = "";
    updatePresetState();
    updateStatusStrip();
  });
});

els.btnGenerate.addEventListener("click", generatePasswords);
els.btnRegenerate.addEventListener("click", generatePasswords);
els.btnClear.addEventListener("click", clearAll);
els.btnCopy.addEventListener("click", () => generatedPasswords[0] && copyText(generatedPasswords[0], "Senha copiada!"));
els.btnCopyAll.addEventListener("click", () => generatedPasswords.length && copyText(generatedPasswords.join("\n"), "Todas as senhas foram copiadas!"));
els.btnDownload.addEventListener("click", downloadPasswords);
els.btnUseFirst.addEventListener("click", () => {
  if (generatedPasswords[0]) {
    copyText(generatedPasswords[0], "Senha pronta para usar!");
  }
});

els.toggleVisibility.addEventListener("click", () => {
  const isVisible = els.result.type === "text";
  els.result.type = isVisible ? "password" : "text";
  els.toggleVisibility.innerHTML = isVisible
    ? '<i class="fas fa-eye"></i>'
    : '<i class="fas fa-eye-slash"></i>';
});

els.themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

els.generatedList.addEventListener("click", (event) => {
  const target = event.target.closest("[data-password-index]");

  if (!target) {
    return;
  }

  const password = generatedPasswords[Number(target.dataset.passwordIndex)];

  if (password) {
    copyText(password, "Senha copiada!");
  }
});

els.presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset);
    setError("");
  });
});

loadTheme();
loadSavedSettings();
updatePresetState();
renderList();
