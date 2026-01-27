// Keyboard configurations
const KEYBOARDS = {
  elora: {
    name: 'Elora',
    leftRows: [0, 1, 2, 3, 4, 5],
    rightRows: [6, 7, 8, 9, 10, 11],
    layers: 8
  },
  corne: {
    name: 'Corne',
    leftRows: [0, 1, 2, 3],
    rightRows: [4, 5, 6, 7],
    layers: 6
  }
};

// Shifted symbols mapping
const SHIFTED_SYMBOLS = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  'MINUS': '_', 'EQUAL': '+', 'LBRACKET': '{', 'RBRACKET': '}',
  'BSLASH': '|', 'SCOLON': ':', 'QUOTE': '"', 'GRAVE': '~',
  'COMMA': '<', 'DOT': '>', 'SLASH': '?'
};

// Modifier short names
const MOD_SHORT = {
  'LCTL': 'Ctl', 'RCTL': 'Ctl',
  'LSFT': 'Sft', 'RSFT': 'Sft',
  'LALT': 'Alt', 'RALT': 'Alt',
  'LGUI': 'Gui', 'RGUI': 'Gui'
};

// Key display names
const KEY_NAMES = {
  'SPACE': 'Spc', 'BSPACE': 'Bsp', 'DELETE': 'Del', 'ENTER': 'Ent',
  'TAB': 'Tab', 'ESCAPE': 'Esc', 'CAPSLOCK': 'Cap',
  'LEFT': '←', 'RIGHT': '→', 'UP': '↑', 'DOWN': '↓',
  'HOME': 'Hom', 'END': 'End', 'PGUP': 'PgU', 'PGDOWN': 'PgD',
  'LSHIFT': 'LSft', 'RSHIFT': 'RSft',
  'LCTRL': 'LCtl', 'RCTRL': 'RCtl',
  'LALT': 'LAlt', 'RALT': 'RAlt',
  'LGUI': 'LGui', 'RGUI': 'RGui',
  'GRAVE': '`', 'MINUS': '-', 'EQUAL': '=',
  'LBRACKET': '[', 'RBRACKET': ']', 'BSLASH': '\\',
  'SCOLON': ';', 'QUOTE': "'", 'COMMA': ',', 'DOT': '.', 'SLASH': '/',
  'MUTE': 'Mut', 'VOLU': 'V+', 'VOLD': 'V-',
  'WH_U': 'WU', 'WH_D': 'WD',
  'KP_0': '0', 'KP_1': '1', 'KP_2': '2', 'KP_3': '3', 'KP_4': '4',
  'KP_5': '5', 'KP_6': '6', 'KP_7': '7', 'KP_8': '8', 'KP_9': '9',
  'KP_DOT': '.', 'KP_PLUS': '+', 'KP_MINUS': '-',
  'KP_ASTERISK': '*', 'KP_SLASH': '/', 'KP_EQUAL': '=', 'KP_ENTER': 'Ent',
  'NO': '', 'TRNS': '···'
};

function stripKC(keycode) {
  return keycode.startsWith('KC_') ? keycode.slice(3) : keycode;
}

function getKeyDisplay(keycode) {
  const key = stripKC(keycode);
  if (KEY_NAMES[key]) return KEY_NAMES[key];
  if (key.length === 1) return key;
  if (/^F\d+$/.test(key)) return key;
  return key.slice(0, 3);
}

function parseKey(keycode) {
  // Empty/placeholder
  if (keycode === -1 || keycode === '-1') {
    return { main: '', mod: '', type: 'empty' };
  }

  if (typeof keycode === 'number') {
    keycode = `KC_${keycode}`;
  }

  // Transparent
  if (keycode === 'KC_TRNS') {
    return { main: '···', mod: '', type: 'transparent' };
  }

  // No key
  if (keycode === 'KC_NO') {
    return { main: '', mod: '', type: 'empty' };
  }

  // Macro keys
  if (/^M\d+$/.test(keycode)) {
    return { main: keycode, mod: '', type: 'macro' };
  }

  // Mod-tap: LCTL_T(KC_A)
  const modTapMatch = keycode.match(/^(L|R)(CTL|SFT|ALT|GUI)_T\((.+)\)$/);
  if (modTapMatch) {
    const [, side, mod, innerKey] = modTapMatch;
    const modName = MOD_SHORT[`${side}${mod}`] || mod.slice(0, 3);
    return { main: getKeyDisplay(innerKey), mod: modName, type: 'mod-tap' };
  }

  // Layer-tap: LT1(KC_SPACE)
  const ltMatch = keycode.match(/^LT(\d+)\((.+)\)$/);
  if (ltMatch) {
    const [, layer, innerKey] = ltMatch;
    return { main: getKeyDisplay(innerKey), mod: `L${layer}`, type: 'layer-tap' };
  }

  // Shifted keys: LSFT(KC_1)
  const shiftMatch = keycode.match(/^LSFT\(KC_(.+)\)$/);
  if (shiftMatch) {
    const key = shiftMatch[1];
    if (SHIFTED_SYMBOLS[key]) {
      return { main: SHIFTED_SYMBOLS[key], mod: '', type: 'alpha' };
    }
    return { main: `S-${getKeyDisplay(`KC_${key}`)}`, mod: '', type: 'alpha' };
  }

  // GUI combinations
  const guiMatch = keycode.match(/^LGUI\((.+)\)$/);
  if (guiMatch) {
    return { main: `⌘${getKeyDisplay(guiMatch[1])}`, mod: '', type: 'special' };
  }

  // LSA (Left Shift + Alt)
  const lsaMatch = keycode.match(/^LSA\(KC_(.+)\)$/);
  if (lsaMatch) {
    return { main: `SA-${lsaMatch[1]}`, mod: '', type: 'special' };
  }

  // Default layer
  const dfMatch = keycode.match(/^DF\((\d+)\)$/);
  if (dfMatch) {
    return { main: `DF${dfMatch[1]}`, mod: '', type: 'special' };
  }

  // RGB controls
  if (keycode.startsWith('RM_')) {
    return { main: keycode.slice(3, 6), mod: '', type: 'special' };
  }

  // Caps word
  if (keycode === 'QK_CAPS_WORD_TOGGLE') {
    return { main: 'CpW', mod: '', type: 'special' };
  }

  // Pure modifiers
  if (['KC_LSHIFT', 'KC_RSHIFT', 'KC_LCTRL', 'KC_RCTRL', 'KC_LALT', 'KC_RALT', 'KC_LGUI', 'KC_RGUI'].includes(keycode)) {
    return { main: getKeyDisplay(stripKC(keycode)), mod: '', type: 'modifier' };
  }

  // Basic keycodes
  return { main: getKeyDisplay(keycode), mod: '', type: 'alpha' };
}

// State
let layouts = {};
let currentKeyboard = 'elora';
let currentLayer = 0;
let isPinned = false;

// DOM elements
const leftHalf = document.getElementById('left-half');
const rightHalf = document.getElementById('right-half');
const layerButtons = document.getElementById('layer-buttons');
const eloraBtn = document.getElementById('elora-btn');
const corneBtn = document.getElementById('corne-btn');
const pinBtn = document.getElementById('pin-btn');

function createKeyElement(keycode) {
  const parsed = parseKey(keycode);
  const key = document.createElement('div');
  key.className = `key ${parsed.type}`;

  if (parsed.main) {
    const mainSpan = document.createElement('span');
    mainSpan.className = 'main';
    mainSpan.textContent = parsed.main;
    key.appendChild(mainSpan);
  }

  if (parsed.mod) {
    const modSpan = document.createElement('span');
    modSpan.className = 'mod';
    modSpan.textContent = parsed.mod;
    key.appendChild(modSpan);
  }

  key.title = typeof keycode === 'string' ? keycode : '';
  return key;
}

function renderKeyboard() {
  const config = KEYBOARDS[currentKeyboard];
  const layout = layouts[currentKeyboard]?.layout;

  if (!layout || !layout[currentLayer]) return;

  const layer = layout[currentLayer];

  // Clear existing
  leftHalf.innerHTML = '';
  rightHalf.innerHTML = '';

  // Left half
  for (const rowIdx of config.leftRows) {
    if (!layer[rowIdx]) continue;
    const row = document.createElement('div');
    row.className = 'row';
    for (const keycode of layer[rowIdx]) {
      row.appendChild(createKeyElement(keycode));
    }
    leftHalf.appendChild(row);
  }

  // Right half (reversed columns)
  for (const rowIdx of config.rightRows) {
    if (!layer[rowIdx]) continue;
    const row = document.createElement('div');
    row.className = 'row';
    const keys = [...layer[rowIdx]].reverse();
    for (const keycode of keys) {
      row.appendChild(createKeyElement(keycode));
    }
    rightHalf.appendChild(row);
  }
}

function renderLayerButtons() {
  const config = KEYBOARDS[currentKeyboard];
  layerButtons.innerHTML = '';

  for (let i = 0; i < config.layers; i++) {
    const btn = document.createElement('button');
    btn.className = `layer-btn ${i === currentLayer ? 'active' : ''}`;
    btn.textContent = i;
    btn.onclick = () => {
      currentLayer = i;
      updateLayerButtons();
      renderKeyboard();
    };
    layerButtons.appendChild(btn);
  }
}

function updateLayerButtons() {
  document.querySelectorAll('.layer-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentLayer);
  });
}

function setKeyboard(kb) {
  currentKeyboard = kb;
  const config = KEYBOARDS[kb];

  // Clamp layer
  if (currentLayer >= config.layers) {
    currentLayer = 0;
  }

  eloraBtn.classList.toggle('active', kb === 'elora');
  corneBtn.classList.toggle('active', kb === 'corne');

  renderLayerButtons();
  renderKeyboard();
}

// Event listeners
eloraBtn.onclick = () => setKeyboard('elora');
corneBtn.onclick = () => setKeyboard('corne');

pinBtn.onclick = async () => {
  isPinned = await window.api.toggleAlwaysOnTop();
  pinBtn.classList.toggle('active', isPinned);
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const config = KEYBOARDS[currentKeyboard];

  // Number keys 1-8 for layers
  if (e.key >= '1' && e.key <= '8') {
    const layer = parseInt(e.key) - 1;
    if (layer < config.layers) {
      currentLayer = layer;
      updateLayerButtons();
      renderKeyboard();
    }
    return;
  }

  // Arrow keys
  if (e.key === 'ArrowLeft') {
    currentLayer = Math.max(0, currentLayer - 1);
    updateLayerButtons();
    renderKeyboard();
  } else if (e.key === 'ArrowRight') {
    currentLayer = Math.min(config.layers - 1, currentLayer + 1);
    updateLayerButtons();
    renderKeyboard();
  }

  // E/C for keyboard
  if (e.key === 'e') setKeyboard('elora');
  if (e.key === 'c') setKeyboard('corne');
});

// Initialize
async function init() {
  layouts = await window.api.loadLayouts();
  renderLayerButtons();
  renderKeyboard();
}

init();
