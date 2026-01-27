"""Keyboard configuration definitions for Elora and Corne."""

from dataclasses import dataclass


@dataclass
class KeyboardConfig:
    """Configuration for a specific keyboard model."""
    name: str
    file_path: str
    num_layers: int
    rows_per_half: int
    left_rows: tuple[int, ...]  # Row indices for left half
    right_rows: tuple[int, ...]  # Row indices for right half
    cols_per_row: int


ELORA_CONFIG = KeyboardConfig(
    name="Elora",
    file_path="elora.vil",
    num_layers=8,
    rows_per_half=6,
    left_rows=(0, 1, 2, 3, 4, 5),
    right_rows=(6, 7, 8, 9, 10, 11),
    cols_per_row=7,
)

CORNE_CONFIG = KeyboardConfig(
    name="Corne",
    file_path="corne-v4.vil",
    num_layers=6,
    rows_per_half=4,
    left_rows=(0, 1, 2, 3),
    right_rows=(4, 5, 6, 7),
    cols_per_row=7,
)
