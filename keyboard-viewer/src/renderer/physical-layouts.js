// Physical keyboard layouts defining key positions
// Units are in key units (1u = standard key width)
// x, y positions and w, h dimensions

const KEY_UNIT = 54; // pixels per key unit
const KEY_GAP = 4;   // gap between keys

// Column stagger offsets for ergonomic keyboards (like Lily58/Elora)
// Positive values move the column down
const COLUMN_STAGGER = {
  pinky: 0.4,      // Pinky columns (outer)
  ring: 0.2,       // Ring finger
  middle: 0,       // Middle finger (baseline)
  index: 0.15,     // Index finger
  inner: 0.35      // Inner column
};

// Elora keyboard physical layout
// Split ergonomic with number row and thumb clusters
const ELORA_LAYOUT = {
  name: 'Elora',
  width: 18,
  height: 7,
  splitGap: 3,

  keys: {
    left: [
      // Row 0: Number row (left) - layout[layer][0]
      // Keys go from innermost to outermost in layout: [-1, 5, 4, 3, 2, 1, =]
      { row: 0, col: 6, x: 0, y: 0 + COLUMN_STAGGER.pinky },      // KC_KP_EQUAL
      { row: 0, col: 5, x: 1, y: 0 + COLUMN_STAGGER.ring },       // 1
      { row: 0, col: 4, x: 2, y: 0 + COLUMN_STAGGER.middle },     // 2
      { row: 0, col: 3, x: 3, y: 0 + COLUMN_STAGGER.middle },     // 3
      { row: 0, col: 2, x: 4, y: 0 + COLUMN_STAGGER.index },      // 4
      { row: 0, col: 1, x: 5, y: 0 + COLUMN_STAGGER.inner },      // 5

      // Row 1: QWERT row - layout[layer][1]
      { row: 1, col: 6, x: 0, y: 1 + COLUMN_STAGGER.pinky },      // CAPSLOCK
      { row: 1, col: 5, x: 1, y: 1 + COLUMN_STAGGER.ring },       // Q
      { row: 1, col: 4, x: 2, y: 1 + COLUMN_STAGGER.middle },     // W
      { row: 1, col: 3, x: 3, y: 1 + COLUMN_STAGGER.middle },     // E
      { row: 1, col: 2, x: 4, y: 1 + COLUMN_STAGGER.index },      // R
      { row: 1, col: 1, x: 5, y: 1 + COLUMN_STAGGER.inner },      // T

      // Row 2: Home row ASDFG - layout[layer][2]
      { row: 2, col: 6, x: 0, y: 2 + COLUMN_STAGGER.pinky },      // GRAVE
      { row: 2, col: 5, x: 1, y: 2 + COLUMN_STAGGER.ring, homeRow: true },   // A (Ctrl)
      { row: 2, col: 4, x: 2, y: 2 + COLUMN_STAGGER.middle, homeRow: true }, // S (Alt)
      { row: 2, col: 3, x: 3, y: 2 + COLUMN_STAGGER.middle, homeRow: true }, // D (Gui)
      { row: 2, col: 2, x: 4, y: 2 + COLUMN_STAGGER.index, homeRow: true },  // F (Shift)
      { row: 2, col: 1, x: 5, y: 2 + COLUMN_STAGGER.inner },      // G

      // Row 3: Bottom row ZXCVB - layout[layer][3]
      { row: 3, col: 6, x: 0, y: 3 + COLUMN_STAGGER.pinky },      // ESC
      { row: 3, col: 5, x: 1, y: 3 + COLUMN_STAGGER.ring },       // Z
      { row: 3, col: 4, x: 2, y: 3 + COLUMN_STAGGER.middle },     // X
      { row: 3, col: 3, x: 3, y: 3 + COLUMN_STAGGER.middle },     // C
      { row: 3, col: 2, x: 4, y: 3 + COLUMN_STAGGER.index },      // V
      { row: 3, col: 1, x: 5, y: 3 + COLUMN_STAGGER.inner },      // B
      { row: 3, col: 0, x: 6, y: 3.5 },                           // M2 (inner extra)

      // Row 4: Thumb cluster - layout[layer][4]
      // [KC_LSHIFT, LT1(KC_BSPACE), LT3(KC_DELETE), M1, KC_NO, LT2(KC_TAB), -1]
      { row: 4, col: 5, x: 2.5, y: 4.5 },    // Tab (LT2)
      { row: 4, col: 3, x: 3.6, y: 4.9 },    // M1
      { row: 4, col: 2, x: 4.7, y: 5.1 },    // Delete (LT3)
      { row: 4, col: 1, x: 5.8, y: 5.0 },    // Backspace (LT1)
      { row: 4, col: 0, x: 6.9, y: 4.7 },    // Shift

      // Row 5: Encoder - layout[layer][5]
      { row: 5, col: 0, x: 0.3, y: 4.8, w: 1.2, h: 1.2, encoder: true },  // Encoder
    ],

    right: [
      // Row 6: Number row (right) - layout[layer][6]
      // [-1, 6, 7, 8, 9, 0, -]
      { row: 6, col: 1, x: 0, y: 0 + COLUMN_STAGGER.inner },      // 6
      { row: 6, col: 2, x: 1, y: 0 + COLUMN_STAGGER.index },      // 7
      { row: 6, col: 3, x: 2, y: 0 + COLUMN_STAGGER.middle },     // 8
      { row: 6, col: 4, x: 3, y: 0 + COLUMN_STAGGER.middle },     // 9
      { row: 6, col: 5, x: 4, y: 0 + COLUMN_STAGGER.ring },       // 0
      { row: 6, col: 6, x: 5, y: 0 + COLUMN_STAGGER.pinky },      // -

      // Row 7: YUIOP row - layout[layer][7]
      { row: 7, col: 1, x: 0, y: 1 + COLUMN_STAGGER.inner },      // Y
      { row: 7, col: 2, x: 1, y: 1 + COLUMN_STAGGER.index },      // U
      { row: 7, col: 3, x: 2, y: 1 + COLUMN_STAGGER.middle },     // I
      { row: 7, col: 4, x: 3, y: 1 + COLUMN_STAGGER.middle },     // O
      { row: 7, col: 5, x: 4, y: 1 + COLUMN_STAGGER.ring },       // P
      { row: 7, col: 6, x: 5, y: 1 + COLUMN_STAGGER.pinky },      // ]

      // Row 8: Home row HJKL - layout[layer][8]
      { row: 8, col: 1, x: 0, y: 2 + COLUMN_STAGGER.inner },      // H
      { row: 8, col: 2, x: 1, y: 2 + COLUMN_STAGGER.index, homeRow: true },  // J (Shift)
      { row: 8, col: 3, x: 2, y: 2 + COLUMN_STAGGER.middle, homeRow: true }, // K (Gui)
      { row: 8, col: 4, x: 3, y: 2 + COLUMN_STAGGER.middle, homeRow: true }, // L (Alt)
      { row: 8, col: 5, x: 4, y: 2 + COLUMN_STAGGER.ring, homeRow: true },   // ' (Ctrl)
      { row: 8, col: 6, x: 5, y: 2 + COLUMN_STAGGER.pinky },      // [

      // Row 9: Bottom row NM - layout[layer][9]
      { row: 9, col: 0, x: -1, y: 3.5 },                          // CapsLock (inner extra)
      { row: 9, col: 1, x: 0, y: 3 + COLUMN_STAGGER.inner },      // N
      { row: 9, col: 2, x: 1, y: 3 + COLUMN_STAGGER.index },      // M
      { row: 9, col: 3, x: 2, y: 3 + COLUMN_STAGGER.middle },     // ,
      { row: 9, col: 4, x: 3, y: 3 + COLUMN_STAGGER.middle },     // .
      { row: 9, col: 5, x: 4, y: 3 + COLUMN_STAGGER.ring },       // /
      { row: 9, col: 6, x: 5, y: 3 + COLUMN_STAGGER.pinky },      // \

      // Row 10: Thumb cluster (right) - layout[layer][10]
      // [KC_RSHIFT, LT3(KC_SPACE), M0, QK_CAPS_WORD_TOGGLE, KC_NO, LT2(KC_ENTER), -1]
      { row: 10, col: 0, x: -1.9, y: 4.7 },   // Shift
      { row: 10, col: 1, x: -0.8, y: 5.0 },   // Space (LT3)
      { row: 10, col: 2, x: 0.3, y: 5.1 },    // M0
      { row: 10, col: 3, x: 1.4, y: 4.9 },    // CapsWord
      { row: 10, col: 5, x: 2.5, y: 4.5 },    // Enter (LT2)

      // Row 11: Encoder - layout[layer][11]
      { row: 11, col: 0, x: 4.5, y: 4.8, w: 1.2, h: 1.2, encoder: true },  // Encoder
    ]
  }
};

// Corne V4 keyboard physical layout
// Split ergonomic without number row, 3x6 + 3 thumb
const CORNE_LAYOUT = {
  name: 'Corne V4',
  width: 14,
  height: 5,
  splitGap: 3,

  keys: {
    left: [
      // Row 0: QWERT row - layout[layer][0]
      { row: 0, col: 0, x: 0, y: 0 + COLUMN_STAGGER.pinky },      // Caps
      { row: 0, col: 1, x: 1, y: 0 + COLUMN_STAGGER.ring },       // Q
      { row: 0, col: 2, x: 2, y: 0 + COLUMN_STAGGER.middle },     // W
      { row: 0, col: 3, x: 3, y: 0 + COLUMN_STAGGER.middle },     // E
      { row: 0, col: 4, x: 4, y: 0 + COLUMN_STAGGER.index },      // R
      { row: 0, col: 5, x: 5, y: 0 + COLUMN_STAGGER.inner },      // T

      // Row 1: Home row ASDFG - layout[layer][1]
      { row: 1, col: 0, x: 0, y: 1 + COLUMN_STAGGER.pinky },      // Grave
      { row: 1, col: 1, x: 1, y: 1 + COLUMN_STAGGER.ring, homeRow: true },   // A (Ctrl)
      { row: 1, col: 2, x: 2, y: 1 + COLUMN_STAGGER.middle, homeRow: true }, // S (Alt)
      { row: 1, col: 3, x: 3, y: 1 + COLUMN_STAGGER.middle, homeRow: true }, // D (Gui)
      { row: 1, col: 4, x: 4, y: 1 + COLUMN_STAGGER.index, homeRow: true },  // F (Shift)
      { row: 1, col: 5, x: 5, y: 1 + COLUMN_STAGGER.inner },      // G

      // Row 2: Bottom row ZXCVB - layout[layer][2]
      { row: 2, col: 0, x: 0, y: 2 + COLUMN_STAGGER.pinky },      // Esc
      { row: 2, col: 1, x: 1, y: 2 + COLUMN_STAGGER.ring },       // Z
      { row: 2, col: 2, x: 2, y: 2 + COLUMN_STAGGER.middle },     // X
      { row: 2, col: 3, x: 3, y: 2 + COLUMN_STAGGER.middle },     // C
      { row: 2, col: 4, x: 4, y: 2 + COLUMN_STAGGER.index },      // V
      { row: 2, col: 5, x: 5, y: 2 + COLUMN_STAGGER.inner },      // B

      // Row 3: Thumb cluster - layout[layer][3]
      // [-1, -1, -1, LT3(KC_DELETE), LT1(KC_BSPACE), LT2(KC_TAB), -1]
      { row: 3, col: 3, x: 3.2, y: 3.5 },     // Delete (LT3)
      { row: 3, col: 4, x: 4.3, y: 3.8 },     // Backspace (LT1)
      { row: 3, col: 5, x: 5.4, y: 3.9 },     // Tab (LT2)
    ],

    right: [
      // Row 4: YUIOP row - layout[layer][4]
      { row: 4, col: 5, x: 0, y: 0 + COLUMN_STAGGER.inner },      // Y
      { row: 4, col: 4, x: 1, y: 0 + COLUMN_STAGGER.index },      // U
      { row: 4, col: 3, x: 2, y: 0 + COLUMN_STAGGER.middle },     // I
      { row: 4, col: 2, x: 3, y: 0 + COLUMN_STAGGER.middle },     // O
      { row: 4, col: 1, x: 4, y: 0 + COLUMN_STAGGER.ring },       // P
      { row: 4, col: 0, x: 5, y: 0 + COLUMN_STAGGER.pinky },      // ]

      // Row 5: Home row HJKL - layout[layer][5]
      { row: 5, col: 5, x: 0, y: 1 + COLUMN_STAGGER.inner },      // H
      { row: 5, col: 4, x: 1, y: 1 + COLUMN_STAGGER.index, homeRow: true },  // J (Shift)
      { row: 5, col: 3, x: 2, y: 1 + COLUMN_STAGGER.middle, homeRow: true }, // K (Gui)
      { row: 5, col: 2, x: 3, y: 1 + COLUMN_STAGGER.middle, homeRow: true }, // L (Alt)
      { row: 5, col: 1, x: 4, y: 1 + COLUMN_STAGGER.ring, homeRow: true },   // ' (Ctrl)
      { row: 5, col: 0, x: 5, y: 1 + COLUMN_STAGGER.pinky },      // [

      // Row 6: Bottom row NM - layout[layer][6]
      { row: 6, col: 5, x: 0, y: 2 + COLUMN_STAGGER.inner },      // N
      { row: 6, col: 4, x: 1, y: 2 + COLUMN_STAGGER.index },      // M
      { row: 6, col: 3, x: 2, y: 2 + COLUMN_STAGGER.middle },     // ,
      { row: 6, col: 2, x: 3, y: 2 + COLUMN_STAGGER.middle },     // .
      { row: 6, col: 1, x: 4, y: 2 + COLUMN_STAGGER.ring },       // /
      { row: 6, col: 0, x: 5, y: 2 + COLUMN_STAGGER.pinky },      // \

      // Row 7: Thumb cluster (right) - layout[layer][7]
      // [-1, -1, -1, M0, LT2(KC_SPACE), RSFT_T(KC_ENTER), -1]
      { row: 7, col: 5, x: -0.4, y: 3.9 },    // Enter (Shift)
      { row: 7, col: 4, x: 0.7, y: 3.8 },     // Space (LT2)
      { row: 7, col: 3, x: 1.8, y: 3.5 },     // M0
    ]
  }
};

// Get physical layout by keyboard name
function getPhysicalLayout(keyboardName) {
  switch (keyboardName.toLowerCase()) {
    case 'elora':
      return ELORA_LAYOUT;
    case 'corne':
    case 'corne-v4':
    case 'crkbd':
      return CORNE_LAYOUT;
    default:
      return null;
  }
}

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ELORA_LAYOUT, CORNE_LAYOUT, getPhysicalLayout, KEY_UNIT, KEY_GAP, COLUMN_STAGGER };
}
