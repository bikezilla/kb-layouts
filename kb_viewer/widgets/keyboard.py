"""Keyboard visualization widgets."""

from textual.app import ComposeResult
from textual.containers import Horizontal, Vertical
from textual.widget import Widget
from textual.reactive import reactive

from .key import KeyWidget
from ..models.layout import KeyboardLayout


class KeyboardHalf(Widget):
    """Widget representing one half of a split keyboard."""

    DEFAULT_CSS = """
    KeyboardHalf {
        width: auto;
        height: auto;
    }

    KeyboardHalf .key-row {
        height: auto;
        width: auto;
    }
    """

    def __init__(self, keys: list[list[str | int]] | None = None, **kwargs) -> None:
        super().__init__(**kwargs)
        self._keys = keys or []

    def compose(self) -> ComposeResult:
        """Create the grid of keys."""
        for row in self._keys:
            with Horizontal(classes="key-row"):
                for keycode in row:
                    yield KeyWidget(keycode)

    def update_keys(self, keys: list[list[str | int]]) -> None:
        """Update all keys in this half."""
        self._keys = keys
        key_widgets = list(self.query(KeyWidget))
        key_idx = 0
        for row in keys:
            for keycode in row:
                if key_idx < len(key_widgets):
                    key_widgets[key_idx].keycode = keycode
                key_idx += 1


class SplitKeyboard(Widget):
    """Widget displaying a full split keyboard layout."""

    DEFAULT_CSS = """
    SplitKeyboard {
        width: 100%;
        height: auto;
        align: center middle;
    }

    SplitKeyboard > Horizontal {
        width: auto;
        height: auto;
        align: center middle;
    }

    SplitKeyboard .keyboard-gap {
        width: 4;
    }
    """

    layer: reactive[int] = reactive(0)

    def __init__(self, layout: KeyboardLayout, **kwargs) -> None:
        super().__init__(**kwargs)
        self._layout = layout
        self._left_half: KeyboardHalf | None = None
        self._right_half: KeyboardHalf | None = None

    def compose(self) -> ComposeResult:
        """Create the split keyboard layout."""
        left_keys = self._layout.get_left_half(self.layer)
        right_keys = self._layout.get_right_half(self.layer)

        with Horizontal():
            self._left_half = KeyboardHalf(left_keys, id="left-half")
            yield self._left_half
            yield Widget(classes="keyboard-gap")
            self._right_half = KeyboardHalf(right_keys, id="right-half")
            yield self._right_half

    def watch_layer(self, layer: int) -> None:
        """Update display when layer changes."""
        if self._left_half and self._right_half:
            self._left_half.update_keys(self._layout.get_left_half(layer))
            self._right_half.update_keys(self._layout.get_right_half(layer))

    def set_layout(self, layout: KeyboardLayout) -> None:
        """Switch to a different keyboard layout."""
        self._layout = layout
        # Clamp layer to valid range
        if self.layer >= layout.num_layers:
            self.layer = 0
        # Force refresh
        if self._left_half and self._right_half:
            self._left_half.update_keys(layout.get_left_half(self.layer))
            self._right_half.update_keys(layout.get_right_half(self.layer))
