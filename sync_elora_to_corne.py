#!/usr/bin/env python3
"""
Sync Elora keyboard layout to Corne V4.

The Elora has more keys than the Corne (number row, extra columns), so this
script maps the common keys and handles the differences.

Layout structure:
- Elora: 12 rows per layer (0-5 left, 6-11 right), 8 layers
- Corne: 8 rows per layer (0-3 left, 4-7 right), 6 layers

Key ordering within rows (both keyboards):
- Left side: keys ordered from index finger outward to pinky
- Right side: keys ordered from index finger outward to pinky
"""

import json
import sys
from pathlib import Path

# Mapping from Corne position to Elora position
# Format: (corne_row, corne_col) -> (elora_row, elora_col) or None for no mapping
#
# Elora rows:     0=numbers, 1=top-alpha, 2=home, 3=bottom, 4=thumb, 5=encoder (left)
#                 6=numbers, 7=top-alpha, 8=home, 9=bottom, 10=thumb, 11=encoder (right)
# Corne rows:     0=top-alpha, 1=home, 2=bottom, 3=thumb (left)
#                 4=top-alpha, 5=home, 6=bottom, 7=thumb (right)
#
# Key columns (Elora): 0=-1/outer, 1-5=main keys (index to pinky), 6=outer
# Key columns (Corne): 0=outer, 1-5=main keys (pinky to index), 6=extra

POSITION_MAP = {
    # Left top alpha row (Corne row 0 -> Elora row 1)
    # Corne: [outer, Q, W, E, R, T, extra]
    # Elora: [-1, T, R, E, W, Q, outer]
    (0, 0): (1, 6),   # outer -> capslock position
    (0, 1): (1, 5),   # Q
    (0, 2): (1, 4),   # W
    (0, 3): (1, 3),   # E
    (0, 4): (1, 2),   # R
    (0, 5): (1, 1),   # T
    (0, 6): None,     # extra (no equivalent)

    # Left home row (Corne row 1 -> Elora row 2)
    (1, 0): (2, 6),   # outer -> grave position
    (1, 1): (2, 5),   # A
    (1, 2): (2, 4),   # S
    (1, 3): (2, 3),   # D
    (1, 4): (2, 2),   # F
    (1, 5): (2, 1),   # G
    (1, 6): None,     # extra

    # Left bottom row (Corne row 2 -> Elora row 3)
    (2, 0): (3, 6),   # outer -> escape position
    (2, 1): (3, 5),   # Z
    (2, 2): (3, 4),   # X
    (2, 3): (3, 3),   # C
    (2, 4): (3, 2),   # V
    (2, 5): (3, 1),   # B
    (2, 6): -1,       # -1 placeholder

    # Left thumb row (Corne row 3 -> Elora row 4)
    # Corne: [-1, -1, -1, key, key, key, -1]
    # Elora: [key, key, key, key, key, key, -1]
    (3, 0): -1,
    (3, 1): -1,
    (3, 2): -1,
    (3, 3): (4, 2),   # inner thumb
    (3, 4): (4, 1),   # middle thumb (backspace on Elora)
    (3, 5): (4, 5),   # outer thumb (tab->space area)
    (3, 6): -1,

    # Right top alpha row (Corne row 4 -> Elora row 7)
    # Corne: [outer, P, O, I, U, Y, extra]
    # Elora: [-1, Y, U, I, O, P, outer]
    (4, 0): (7, 6),   # outer -> bracket position
    (4, 1): (7, 5),   # P
    (4, 2): (7, 4),   # O
    (4, 3): (7, 3),   # I
    (4, 4): (7, 2),   # U
    (4, 5): (7, 1),   # Y
    (4, 6): None,     # extra

    # Right home row (Corne row 5 -> Elora row 8)
    (5, 0): (8, 6),   # outer -> bracket position
    (5, 1): (8, 5),   # ; (quote on Elora)
    (5, 2): (8, 4),   # L
    (5, 3): (8, 3),   # K
    (5, 4): (8, 2),   # J
    (5, 5): (8, 1),   # H
    (5, 6): None,     # extra

    # Right bottom row (Corne row 6 -> Elora row 9)
    (6, 0): (9, 6),   # outer -> backslash position
    (6, 1): (9, 5),   # /
    (6, 2): (9, 4),   # .
    (6, 3): (9, 3),   # ,
    (6, 4): (9, 2),   # M
    (6, 5): (9, 1),   # N
    (6, 6): -1,       # -1 placeholder

    # Right thumb row (Corne row 7 -> Elora row 10)
    (7, 0): -1,
    (7, 1): -1,
    (7, 2): -1,
    (7, 3): (10, 2),  # inner thumb -> M0 (spotlight)
    (7, 4): (10, 1),  # middle thumb (space on Elora)
    (7, 5): (10, 5),  # outer thumb (enter on Elora)
    (7, 6): -1,
}


def load_layout(path: Path) -> dict:
    """Load a VIAL layout file."""
    with open(path) as f:
        return json.load(f)


def save_layout(layout: dict, path: Path) -> None:
    """Save a VIAL layout file."""
    with open(path, 'w') as f:
        json.dump(layout, f, separators=(',', ': '))


def map_key(elora_layer: list, corne_row: int, corne_col: int) -> str | int:
    """Map a single key from Elora to Corne position."""
    mapping = POSITION_MAP.get((corne_row, corne_col))

    if mapping is None:
        # No mapping defined, keep Corne's original or use transparent
        return "KC_TRNS"
    elif mapping == -1:
        # Explicit -1 placeholder
        return -1
    else:
        elora_row, elora_col = mapping
        return elora_layer[elora_row][elora_col]


def sync_layer(elora_layer: list, corne_layer: list) -> list:
    """Sync a single layer from Elora to Corne format."""
    new_layer = []
    for row_idx in range(8):  # Corne has 8 rows per layer
        new_row = []
        for col_idx in range(7):  # 7 keys per row
            key = map_key(elora_layer, row_idx, col_idx)
            new_row.append(key)
        new_layer.append(new_row)
    return new_layer


def sync_layouts(elora: dict, corne: dict) -> dict:
    """Sync Elora layout to Corne, preserving Corne's structure."""
    result = corne.copy()

    # Sync key layers (Corne has 6 layers, Elora has 8)
    num_layers = min(len(elora['layout']), len(corne['layout']))
    new_layout = []

    for layer_idx in range(len(corne['layout'])):
        if layer_idx < len(elora['layout']):
            new_layer = sync_layer(elora['layout'][layer_idx], corne['layout'][layer_idx])
        else:
            # Keep Corne's original for extra layers
            new_layer = corne['layout'][layer_idx]
        new_layout.append(new_layer)

    result['layout'] = new_layout

    # Copy over macros from Elora
    result['macro'] = elora['macro'][:len(corne['macro'])]
    # Pad with empty macros if Elora has fewer
    while len(result['macro']) < len(corne['macro']):
        result['macro'].append([])

    # Copy tap dance settings
    result['tap_dance'] = elora['tap_dance'][:len(corne['tap_dance'])]
    while len(result['tap_dance']) < len(corne['tap_dance']):
        result['tap_dance'].append(["KC_NO", "KC_NO", "KC_NO", "KC_NO", 200])

    # Copy settings (timing, etc.)
    result['settings'] = elora['settings']

    # Sync encoder layouts (Corne has 6 encoder layers, Elora has 8)
    new_encoder_layout = []
    for layer_idx in range(len(corne['encoder_layout'])):
        if layer_idx < len(elora['encoder_layout']):
            # Match encoder count: Corne has 4, Elora has 4
            elora_encoders = elora['encoder_layout'][layer_idx]
            corne_encoder_count = len(corne['encoder_layout'][layer_idx])
            new_encoders = elora_encoders[:corne_encoder_count]
            # Pad if needed
            while len(new_encoders) < corne_encoder_count:
                new_encoders.append(["KC_TRNS", "KC_TRNS"])
            new_encoder_layout.append(new_encoders)
        else:
            new_encoder_layout.append(corne['encoder_layout'][layer_idx])

    result['encoder_layout'] = new_encoder_layout

    return result


def main():
    script_dir = Path(__file__).parent
    elora_path = script_dir / 'elora.vil'
    corne_path = script_dir / 'corne-v4.vil'
    output_path = script_dir / 'corne-v4.vil'

    # Allow override via command line
    if len(sys.argv) > 1:
        output_path = Path(sys.argv[1])

    print(f"Loading Elora layout from {elora_path}")
    elora = load_layout(elora_path)

    print(f"Loading Corne layout from {corne_path}")
    corne = load_layout(corne_path)

    print("Syncing layouts...")
    result = sync_layouts(elora, corne)

    print(f"Saving synced layout to {output_path}")
    save_layout(result, output_path)

    print("Done! Layout synced successfully.")
    print("\nNote: The following Elora features are not mapped to Corne:")
    print("  - Number row (Elora rows 0, 6)")
    print("  - Some outer keys and extra thumb keys")
    print("  - Layers 7-8 (Corne only has 6 layers)")


if __name__ == '__main__':
    main()
