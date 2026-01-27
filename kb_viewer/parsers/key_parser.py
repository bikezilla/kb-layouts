"""Parser for QMK keycodes to human-readable format."""

import re
from dataclasses import dataclass
from enum import Enum, auto


class KeyType(Enum):
    """Types of keys for color coding."""
    ALPHA = auto()       # Regular alphanumeric keys
    MOD_TAP = auto()     # Mod-tap keys (e.g., LCTL_T)
    LAYER_TAP = auto()   # Layer-tap keys (e.g., LT1)
    MACRO = auto()       # Macro keys (M0, M1, etc.)
    TRANSPARENT = auto() # Transparent keys (KC_TRNS)
    MODIFIER = auto()    # Pure modifier keys
    SPECIAL = auto()     # Special function keys
    EMPTY = auto()       # Empty/no key (-1, KC_NO)


@dataclass
class ParsedKey:
    """Parsed key information."""
    display: str
    key_type: KeyType
    raw: str


# Mapping of shifted keys to their symbols
SHIFTED_SYMBOLS = {
    "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
    "6": "^", "7": "&", "8": "*", "9": "(", "0": ")",
    "MINUS": "_", "EQUAL": "=", "LBRACKET": "{", "RBRACKET": "}",
    "BSLASH": "|", "SCOLON": ":", "QUOTE": '"', "GRAVE": "~",
    "COMMA": "<", "DOT": ">", "SLASH": "?",
}

# Short names for modifiers
MOD_SHORT = {
    "LCTL": "Ctl", "RCTL": "Ctl",
    "LSFT": "Sft", "RSFT": "Sft",
    "LALT": "Alt", "RALT": "Alt",
    "LGUI": "Gui", "RGUI": "Gui",
}

# Human-readable key names
KEY_NAMES = {
    "SPACE": "Spc", "BSPACE": "Bsp", "DELETE": "Del", "ENTER": "Ent",
    "TAB": "Tab", "ESCAPE": "Esc", "CAPSLOCK": "Cap",
    "LEFT": "\u2190", "RIGHT": "\u2192", "UP": "\u2191", "DOWN": "\u2193",
    "HOME": "Hom", "END": "End", "PGUP": "PgU", "PGDOWN": "PgD",
    "LSHIFT": "LSf", "RSHIFT": "RSf",
    "LCTRL": "LCl", "RCTRL": "RCl",
    "LALT": "LAl", "RALT": "RAl",
    "LGUI": "LGi", "RGUI": "RGi",
    "GRAVE": "`", "MINUS": "-", "EQUAL": "=",
    "LBRACKET": "[", "RBRACKET": "]", "BSLASH": "\\",
    "SCOLON": ";", "QUOTE": "'", "COMMA": ",", "DOT": ".", "SLASH": "/",
    "MUTE": "Mut", "VOLU": "V+", "VOLD": "V-",
    "WH_U": "WU", "WH_D": "WD",
    "KP_0": "0", "KP_1": "1", "KP_2": "2", "KP_3": "3", "KP_4": "4",
    "KP_5": "5", "KP_6": "6", "KP_7": "7", "KP_8": "8", "KP_9": "9",
    "KP_DOT": ".", "KP_PLUS": "+", "KP_MINUS": "-",
    "KP_ASTERISK": "*", "KP_SLASH": "/", "KP_EQUAL": "=", "KP_ENTER": "Ent",
    "NO": "", "TRNS": "___",
}


def _strip_kc(keycode: str) -> str:
    """Remove KC_ prefix from keycode."""
    if keycode.startswith("KC_"):
        return keycode[3:]
    return keycode


def _get_key_display(keycode: str) -> str:
    """Get display name for a basic keycode."""
    key = _strip_kc(keycode)

    # Check if it's a named key
    if key in KEY_NAMES:
        return KEY_NAMES[key]

    # Single letter or number
    if len(key) == 1:
        return key

    # Function keys
    if re.match(r"^F\d+$", key):
        return key

    return key[:3]


def parse_key(keycode: str | int) -> ParsedKey:
    """Parse a keycode into display format and type."""
    # Handle empty/placeholder keys
    if keycode == -1 or keycode == "-1":
        return ParsedKey("", KeyType.EMPTY, str(keycode))

    if isinstance(keycode, int):
        keycode = f"KC_{keycode}"

    raw = keycode

    # Transparent
    if keycode == "KC_TRNS":
        return ParsedKey("___", KeyType.TRANSPARENT, raw)

    # No key
    if keycode == "KC_NO":
        return ParsedKey("", KeyType.EMPTY, raw)

    # Macro keys (M0, M1, etc.)
    if re.match(r"^M\d+$", keycode):
        return ParsedKey(keycode, KeyType.MACRO, raw)

    # Mod-tap: LCTL_T(KC_A) -> A\nCtl (two lines)
    mod_tap_match = re.match(r"^(L|R)(CTL|SFT|ALT|GUI)_T\((.+)\)$", keycode)
    if mod_tap_match:
        side, mod, inner_key = mod_tap_match.groups()
        mod_name = MOD_SHORT.get(f"{side}{mod}", mod[:3])
        key_display = _get_key_display(inner_key)
        return ParsedKey(f"{key_display}\n{mod_name}", KeyType.MOD_TAP, raw)

    # Layer-tap: LT1(KC_SPACE) -> Spc\nL1 (two lines)
    lt_match = re.match(r"^LT(\d+)\((.+)\)$", keycode)
    if lt_match:
        layer, inner_key = lt_match.groups()
        key_display = _get_key_display(inner_key)
        return ParsedKey(f"{key_display}\nL{layer}", KeyType.LAYER_TAP, raw)

    # Shifted keys: LSFT(KC_1) -> !
    shift_match = re.match(r"^LSFT\(KC_(.+)\)$", keycode)
    if shift_match:
        key = shift_match.group(1)
        if key in SHIFTED_SYMBOLS:
            return ParsedKey(SHIFTED_SYMBOLS[key], KeyType.ALPHA, raw)
        return ParsedKey(f"S-{_get_key_display(f'KC_{key}')}", KeyType.ALPHA, raw)

    # GUI combinations: LGUI(KC_SPACE) -> G-Spc
    gui_match = re.match(r"^LGUI\((.+)\)$", keycode)
    if gui_match:
        inner_key = gui_match.group(1)
        key_display = _get_key_display(inner_key)
        return ParsedKey(f"G-{key_display}", KeyType.SPECIAL, raw)

    # LSA (Left Shift + Alt): LSA(KC_2)
    lsa_match = re.match(r"^LSA\(KC_(.+)\)$", keycode)
    if lsa_match:
        key = lsa_match.group(1)
        return ParsedKey(f"SA-{key}", KeyType.SPECIAL, raw)

    # Default layer: DF(0) -> DF0
    df_match = re.match(r"^DF\((\d+)\)$", keycode)
    if df_match:
        layer = df_match.group(1)
        return ParsedKey(f"DF{layer}", KeyType.SPECIAL, raw)

    # RGB/lighting controls
    if keycode.startswith("RM_"):
        short_name = keycode[3:6]
        return ParsedKey(short_name, KeyType.SPECIAL, raw)

    # Caps word toggle
    if keycode == "QK_CAPS_WORD_TOGGLE":
        return ParsedKey("CpW", KeyType.SPECIAL, raw)

    # Pure modifiers
    if keycode in ("KC_LSHIFT", "KC_RSHIFT", "KC_LCTRL", "KC_RCTRL",
                   "KC_LALT", "KC_RALT", "KC_LGUI", "KC_RGUI"):
        return ParsedKey(_get_key_display(_strip_kc(keycode)), KeyType.MODIFIER, raw)

    # Basic keycodes
    display = _get_key_display(keycode)
    return ParsedKey(display, KeyType.ALPHA, raw)
