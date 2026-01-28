// QMK Keycode to display label mapping
const KEYCODES = {
  // Letters
  'KC_A': 'A', 'KC_B': 'B', 'KC_C': 'C', 'KC_D': 'D', 'KC_E': 'E',
  'KC_F': 'F', 'KC_G': 'G', 'KC_H': 'H', 'KC_I': 'I', 'KC_J': 'J',
  'KC_K': 'K', 'KC_L': 'L', 'KC_M': 'M', 'KC_N': 'N', 'KC_O': 'O',
  'KC_P': 'P', 'KC_Q': 'Q', 'KC_R': 'R', 'KC_S': 'S', 'KC_T': 'T',
  'KC_U': 'U', 'KC_V': 'V', 'KC_W': 'W', 'KC_X': 'X', 'KC_Y': 'Y',
  'KC_Z': 'Z',

  // Numbers
  'KC_1': '1', 'KC_2': '2', 'KC_3': '3', 'KC_4': '4', 'KC_5': '5',
  'KC_6': '6', 'KC_7': '7', 'KC_8': '8', 'KC_9': '9', 'KC_0': '0',

  // Keypad numbers
  'KC_KP_1': 'KP1', 'KC_KP_2': 'KP2', 'KC_KP_3': 'KP3',
  'KC_KP_4': 'KP4', 'KC_KP_5': 'KP5', 'KC_KP_6': 'KP6',
  'KC_KP_7': 'KP7', 'KC_KP_8': 'KP8', 'KC_KP_9': 'KP9',
  'KC_KP_0': 'KP0',
  'KC_KP_DOT': 'KP.', 'KC_KP_SLASH': 'KP/', 'KC_KP_ASTERISK': 'KP*',
  'KC_KP_MINUS': 'KP-', 'KC_KP_PLUS': 'KP+', 'KC_KP_ENTER': 'KPEnt',
  'KC_KP_EQUAL': 'KP=',

  // Function keys
  'KC_F1': 'F1', 'KC_F2': 'F2', 'KC_F3': 'F3', 'KC_F4': 'F4',
  'KC_F5': 'F5', 'KC_F6': 'F6', 'KC_F7': 'F7', 'KC_F8': 'F8',
  'KC_F9': 'F9', 'KC_F10': 'F10', 'KC_F11': 'F11', 'KC_F12': 'F12',

  // Modifiers
  'KC_LCTRL': 'Ctrl', 'KC_LSHIFT': 'Shift', 'KC_LALT': 'Alt', 'KC_LGUI': 'Cmd',
  'KC_RCTRL': 'Ctrl', 'KC_RSHIFT': 'Shift', 'KC_RALT': 'Alt', 'KC_RGUI': 'Cmd',

  // Special keys
  'KC_ENTER': 'Enter', 'KC_ESCAPE': 'Esc', 'KC_BSPACE': 'Bksp',
  'KC_TAB': 'Tab', 'KC_SPACE': 'Space', 'KC_DELETE': 'Del',
  'KC_CAPSLOCK': 'Caps', 'KC_CAPS': 'Caps',

  // Punctuation
  'KC_MINUS': '-', 'KC_EQUAL': '=', 'KC_LBRACKET': '[', 'KC_RBRACKET': ']',
  'KC_BSLASH': '\\', 'KC_SCOLON': ';', 'KC_QUOTE': "'", 'KC_GRAVE': '`',
  'KC_COMMA': ',', 'KC_DOT': '.', 'KC_SLASH': '/',

  // Navigation
  'KC_HOME': 'Home', 'KC_END': 'End', 'KC_PGUP': 'PgUp', 'KC_PGDOWN': 'PgDn',
  'KC_LEFT': '←', 'KC_RIGHT': '→', 'KC_UP': '↑', 'KC_DOWN': '↓',
  'KC_INSERT': 'Ins', 'KC_PSCREEN': 'PrtSc', 'KC_PAUSE': 'Pause',
  'KC_SCROLLLOCK': 'ScrLk', 'KC_NUMLOCK': 'NumLk',

  // Media
  'KC_MUTE': 'Mute', 'KC_VOLU': 'Vol+', 'KC_VOLD': 'Vol-',
  'KC_MNXT': 'Next', 'KC_MPRV': 'Prev', 'KC_MPLY': 'Play', 'KC_MSTP': 'Stop',

  // Mouse
  'KC_WH_U': 'WhlUp', 'KC_WH_D': 'WhlDn', 'KC_WH_L': 'WhlL', 'KC_WH_R': 'WhlR',
  'KC_MS_U': 'MsUp', 'KC_MS_D': 'MsDn', 'KC_MS_L': 'MsL', 'KC_MS_R': 'MsR',
  'KC_BTN1': 'Btn1', 'KC_BTN2': 'Btn2', 'KC_BTN3': 'Btn3',

  // Special
  'KC_NO': '', 'KC_TRNS': '▽', 'KC_TRANSPARENT': '▽',

  // RGB
  'RM_TOGG': 'RGB', 'RM_NEXT': 'RGB+', 'RM_PREV': 'RGB-',
  'RM_HUEU': 'Hue+', 'RM_HUED': 'Hue-',
  'RM_SATU': 'Sat+', 'RM_SATD': 'Sat-',
  'RM_VALU': 'Bri+', 'RM_VALD': 'Bri-',

  // QMK special
  'QK_CAPS_WORD_TOGGLE': 'CapsWd',
  'QK_BOOT': 'Boot', 'QK_CLEAR_EEPROM': 'EECLR',
};

// Shifted key symbols
const SHIFTED_KEYS = {
  'KC_1': '!', 'KC_2': '@', 'KC_3': '#', 'KC_4': '$', 'KC_5': '%',
  'KC_6': '^', 'KC_7': '&', 'KC_8': '*', 'KC_9': '(', 'KC_0': ')',
  'KC_MINUS': '_', 'KC_EQUAL': '+', 'KC_LBRACKET': '{', 'KC_RBRACKET': '}',
  'KC_BSLASH': '|', 'KC_SCOLON': ':', 'KC_QUOTE': '"', 'KC_GRAVE': '~',
  'KC_COMMA': '<', 'KC_DOT': '>', 'KC_SLASH': '?',
};

// Parse a QMK keycode and return display info
function parseKeycode(keycode) {
  if (keycode === -1 || keycode === null || keycode === undefined) {
    return { label: '', type: 'hidden', raw: keycode };
  }

  if (typeof keycode === 'number') {
    return { label: '', type: 'hidden', raw: keycode };
  }

  const raw = keycode;
  let label = '';
  let type = 'normal';
  let modifier = '';
  let hold = '';

  // Macro keys
  if (keycode.match(/^M\d+$/)) {
    return { label: keycode, type: 'macro', raw };
  }

  // Layer tap: LT(layer)(keycode)
  const ltMatch = keycode.match(/^LT(\d+)\((.+)\)$/);
  if (ltMatch) {
    const layer = ltMatch[1];
    const innerKey = ltMatch[2];
    const innerInfo = parseKeycode(innerKey);
    return {
      label: innerInfo.label,
      type: 'layer',
      hold: `L${layer}`,
      raw
    };
  }

  // Mod-tap keys: LCTL_T(key), LSFT_T(key), etc.
  const modTapMatch = keycode.match(/^(L|R)?(CTL|SFT|ALT|GUI)_T\((.+)\)$/);
  if (modTapMatch) {
    const side = modTapMatch[1] || 'L';
    const mod = modTapMatch[2];
    const innerKey = modTapMatch[3];
    const innerInfo = parseKeycode(innerKey);

    const modMap = {
      'CTL': 'Ctrl',
      'SFT': 'Shift',
      'ALT': 'Alt',
      'GUI': 'Cmd'
    };

    return {
      label: innerInfo.label,
      type: 'mod',
      hold: modMap[mod],
      raw
    };
  }

  // Shift + key: LSFT(key) or RSFT(key)
  const shiftMatch = keycode.match(/^[LR]?SFT\((.+)\)$/);
  if (shiftMatch) {
    const innerKey = shiftMatch[1];
    if (SHIFTED_KEYS[innerKey]) {
      return { label: SHIFTED_KEYS[innerKey], type: 'normal', raw };
    }
    const innerInfo = parseKeycode(innerKey);
    return { label: `⇧${innerInfo.label}`, type: 'normal', raw };
  }

  // LGUI(key) - Command + key
  const guiMatch = keycode.match(/^LGUI\((.+)\)$/);
  if (guiMatch) {
    const innerKey = guiMatch[1];
    const innerInfo = parseKeycode(innerKey);
    return { label: `⌘${innerInfo.label}`, type: 'mod', raw };
  }

  // LSA(key) - Shift + Alt + key
  const lsaMatch = keycode.match(/^LSA\((.+)\)$/);
  if (lsaMatch) {
    const innerKey = lsaMatch[1];
    const innerInfo = parseKeycode(innerKey);
    return { label: `⇧⌥${innerInfo.label}`, type: 'mod', raw };
  }

  // DF(layer) - Default layer
  const dfMatch = keycode.match(/^DF\((\d+)\)$/);
  if (dfMatch) {
    return { label: `DF${dfMatch[1]}`, type: 'layer', raw };
  }

  // MO(layer) - Momentary layer
  const moMatch = keycode.match(/^MO\((\d+)\)$/);
  if (moMatch) {
    return { label: `MO${moMatch[1]}`, type: 'layer', raw };
  }

  // TG(layer) - Toggle layer
  const tgMatch = keycode.match(/^TG\((\d+)\)$/);
  if (tgMatch) {
    return { label: `TG${tgMatch[1]}`, type: 'layer', raw };
  }

  // TO(layer) - Turn on layer
  const toMatch = keycode.match(/^TO\((\d+)\)$/);
  if (toMatch) {
    return { label: `TO${toMatch[1]}`, type: 'layer', raw };
  }

  // Standard keycodes
  if (KEYCODES[keycode] !== undefined) {
    label = KEYCODES[keycode];
    if (keycode === 'KC_TRNS' || keycode === 'KC_TRANSPARENT') {
      type = 'transparent';
    } else if (keycode === 'KC_NO') {
      type = 'empty';
    } else if (keycode.includes('GUI') || keycode.includes('CTL') ||
               keycode.includes('ALT') || keycode.includes('SFT')) {
      type = 'mod';
    }
    return { label, type, raw };
  }

  // Fallback: clean up the keycode for display
  label = keycode
    .replace(/^KC_/, '')
    .replace(/_/g, ' ');

  return { label, type, raw };
}

// Get the type class for a key
function getKeyTypeClass(keyInfo) {
  const classes = ['key'];

  if (keyInfo.type) {
    classes.push(keyInfo.type);
  }

  if (keyInfo.hold) {
    if (keyInfo.hold.startsWith('L')) {
      classes.push('layer');
    } else {
      classes.push('mod');
    }
  }

  return classes.join(' ');
}

// Format key details for the info panel
function formatKeyDetails(keyInfo) {
  const details = [];

  details.push({ label: 'Raw', value: keyInfo.raw });

  if (keyInfo.label) {
    details.push({ label: 'Tap', value: keyInfo.label });
  }

  if (keyInfo.hold) {
    details.push({ label: 'Hold', value: keyInfo.hold });
  }

  if (keyInfo.type && keyInfo.type !== 'normal') {
    details.push({ label: 'Type', value: keyInfo.type });
  }

  return details;
}

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseKeycode, getKeyTypeClass, formatKeyDetails, KEYCODES, SHIFTED_KEYS };
}
