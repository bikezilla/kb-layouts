"""Keyboard layout data model."""

import json
from dataclasses import dataclass
from pathlib import Path

from .keyboard_config import KeyboardConfig


@dataclass
class KeyboardLayout:
    """Represents a complete keyboard layout from a .vil file."""
    config: KeyboardConfig
    layers: list[list[list[str | int]]]  # [layer][row][col]

    @classmethod
    def load(cls, config: KeyboardConfig, base_path: Path | None = None) -> "KeyboardLayout":
        """Load a keyboard layout from a .vil file."""
        if base_path is None:
            base_path = Path.cwd()

        file_path = base_path / config.file_path
        with open(file_path) as f:
            data = json.load(f)

        return cls(config=config, layers=data["layout"])

    def get_layer(self, layer_num: int) -> list[list[str | int]]:
        """Get all rows for a specific layer."""
        if 0 <= layer_num < len(self.layers):
            return self.layers[layer_num]
        return self.layers[0]

    def get_left_half(self, layer_num: int) -> list[list[str | int]]:
        """Get left half rows for a layer."""
        layer = self.get_layer(layer_num)
        return [layer[i] for i in self.config.left_rows if i < len(layer)]

    def get_right_half(self, layer_num: int) -> list[list[str | int]]:
        """Get right half rows for a layer, with columns reversed for display."""
        layer = self.get_layer(layer_num)
        rows = [layer[i] for i in self.config.right_rows if i < len(layer)]
        # Reverse columns for correct visual layout
        return [list(reversed(row)) for row in rows]

    @property
    def num_layers(self) -> int:
        """Return actual number of layers in layout."""
        return len(self.layers)
