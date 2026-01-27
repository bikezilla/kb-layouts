"""Key widget for displaying individual keys."""

from textual.widget import Widget
from textual.reactive import reactive

from ..parsers.key_parser import ParsedKey, KeyType, parse_key


class KeyWidget(Widget):
    """Widget representing a single key on the keyboard."""

    DEFAULT_CSS = """
    KeyWidget {
        width: 7;
        height: 3;
        content-align: center middle;
        text-align: center;
        border: solid $primary;
        margin: 0 0;
    }

    KeyWidget.alpha {
        border: solid $primary;
    }

    KeyWidget.mod-tap {
        border: solid $success;
        color: $success;
    }

    KeyWidget.layer-tap {
        border: solid $accent;
        color: $accent;
    }

    KeyWidget.macro {
        border: solid $error;
        color: $error;
    }

    KeyWidget.transparent {
        border: dashed $surface;
        color: $text-muted;
    }

    KeyWidget.modifier {
        border: solid $warning;
        color: $warning;
    }

    KeyWidget.special {
        border: solid $secondary;
        color: $secondary;
    }

    KeyWidget.empty {
        border: none;
        background: transparent;
    }
    """

    keycode: reactive[str | int] = reactive("")

    def __init__(self, keycode: str | int = "", **kwargs) -> None:
        super().__init__(**kwargs)
        self.keycode = keycode
        self._parsed: ParsedKey | None = None

    def watch_keycode(self, value: str | int) -> None:
        """Update display when keycode changes."""
        self._parsed = parse_key(value)
        self._update_classes()

    def _update_classes(self) -> None:
        """Update CSS classes based on key type."""
        # Remove all type classes
        for cls in ("alpha", "mod-tap", "layer-tap", "macro",
                    "transparent", "modifier", "special", "empty"):
            self.remove_class(cls)

        if self._parsed is None:
            return

        # Map key type to CSS class
        type_to_class = {
            KeyType.ALPHA: "alpha",
            KeyType.MOD_TAP: "mod-tap",
            KeyType.LAYER_TAP: "layer-tap",
            KeyType.MACRO: "macro",
            KeyType.TRANSPARENT: "transparent",
            KeyType.MODIFIER: "modifier",
            KeyType.SPECIAL: "special",
            KeyType.EMPTY: "empty",
        }

        css_class = type_to_class.get(self._parsed.key_type, "alpha")
        self.add_class(css_class)

    def render(self) -> str:
        """Render the key display text."""
        if self._parsed is None:
            self._parsed = parse_key(self.keycode)
            self._update_classes()
        return self._parsed.display
