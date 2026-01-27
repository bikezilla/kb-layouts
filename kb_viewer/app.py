"""Main Textual application for keyboard layout viewer."""

from pathlib import Path

from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Container, Vertical
from textual.widgets import Footer, Header, Static

from .models.keyboard_config import ELORA_CONFIG, CORNE_CONFIG, KeyboardConfig
from .models.layout import KeyboardLayout
from .widgets.keyboard import SplitKeyboard


KEYBOARDS = [ELORA_CONFIG, CORNE_CONFIG]


class LayoutViewerApp(App):
    """Textual app for viewing keyboard layouts."""

    TITLE = "Keyboard Layout Viewer"

    CSS = """
    Screen {
        align: center middle;
    }

    #main-container {
        width: 100%;
        height: auto;
        align: center middle;
    }

    #status-bar {
        dock: top;
        height: 3;
        width: 100%;
        content-align: center middle;
        text-align: center;
        background: $surface;
        border-bottom: solid $primary;
        padding: 0 2;
    }

    #keyboard-container {
        width: 100%;
        height: auto;
        align: center middle;
        padding: 1 2;
    }

    #legend {
        dock: bottom;
        height: 3;
        width: 100%;
        content-align: center middle;
        text-align: center;
        background: $surface;
        border-top: solid $primary;
    }

    .legend-item {
        margin: 0 1;
    }
    """

    BINDINGS = [
        Binding("1", "layer(0)", "Layer 1", show=False),
        Binding("2", "layer(1)", "Layer 2", show=False),
        Binding("3", "layer(2)", "Layer 3", show=False),
        Binding("4", "layer(3)", "Layer 4", show=False),
        Binding("5", "layer(4)", "Layer 5", show=False),
        Binding("6", "layer(5)", "Layer 6", show=False),
        Binding("7", "layer(6)", "Layer 7", show=False),
        Binding("8", "layer(7)", "Layer 8", show=False),
        Binding("left", "prev_layer", "Prev Layer"),
        Binding("right", "next_layer", "Next Layer"),
        Binding("e", "keyboard('elora')", "Elora"),
        Binding("c", "keyboard('corne')", "Corne"),
        Binding("up", "prev_keyboard", "Prev KB"),
        Binding("down", "next_keyboard", "Next KB"),
        Binding("q", "quit", "Quit"),
    ]

    def __init__(self, base_path: Path | None = None) -> None:
        super().__init__()
        self._base_path = base_path or Path.cwd()
        self._keyboard_idx = 0
        self._current_config: KeyboardConfig = KEYBOARDS[0]
        self._layout: KeyboardLayout | None = None
        self._current_layer = 0

    def compose(self) -> ComposeResult:
        """Create the app layout."""
        yield Header()

        with Vertical(id="main-container"):
            yield Static(id="status-bar")

            with Container(id="keyboard-container"):
                # Load initial layout
                self._layout = KeyboardLayout.load(self._current_config, self._base_path)
                yield SplitKeyboard(self._layout, id="keyboard")

            yield Static(
                "[green]Mod-tap[/] | [cyan]Layer-tap[/] | [red]Macro[/] | "
                "[yellow]Modifier[/] | [dim]Transparent[/]",
                id="legend"
            )

        yield Footer()

    def on_mount(self) -> None:
        """Initialize the display on mount."""
        self._update_status()

    def _update_status(self) -> None:
        """Update the status bar."""
        status = self.query_one("#status-bar", Static)
        kb_name = self._current_config.name
        layer_num = self._current_layer + 1
        max_layers = self._layout.num_layers if self._layout else 1
        status.update(
            f"[bold]{kb_name}[/bold] | "
            f"Layer [bold]{layer_num}[/bold]/{max_layers} | "
            f"[dim]1-8: layers | \u2190\u2192: nav | e/c: keyboard | q: quit[/dim]"
        )

    def _set_layer(self, layer: int) -> None:
        """Set the current layer."""
        if self._layout is None:
            return
        max_layer = self._layout.num_layers - 1
        self._current_layer = max(0, min(layer, max_layer))
        keyboard = self.query_one("#keyboard", SplitKeyboard)
        keyboard.layer = self._current_layer
        self._update_status()

    def _set_keyboard(self, config: KeyboardConfig) -> None:
        """Switch to a different keyboard."""
        self._current_config = config
        self._layout = KeyboardLayout.load(config, self._base_path)

        # Reset layer if out of range
        if self._current_layer >= self._layout.num_layers:
            self._current_layer = 0

        keyboard = self.query_one("#keyboard", SplitKeyboard)
        keyboard.set_layout(self._layout)
        keyboard.layer = self._current_layer
        self._update_status()

    def action_layer(self, layer: int) -> None:
        """Jump to specific layer (0-indexed)."""
        self._set_layer(layer)

    def action_prev_layer(self) -> None:
        """Go to previous layer."""
        self._set_layer(self._current_layer - 1)

    def action_next_layer(self) -> None:
        """Go to next layer."""
        self._set_layer(self._current_layer + 1)

    def action_keyboard(self, name: str) -> None:
        """Switch to named keyboard."""
        name_lower = name.lower()
        for idx, config in enumerate(KEYBOARDS):
            if config.name.lower() == name_lower:
                self._keyboard_idx = idx
                self._set_keyboard(config)
                return

    def action_prev_keyboard(self) -> None:
        """Cycle to previous keyboard."""
        self._keyboard_idx = (self._keyboard_idx - 1) % len(KEYBOARDS)
        self._set_keyboard(KEYBOARDS[self._keyboard_idx])

    def action_next_keyboard(self) -> None:
        """Cycle to next keyboard."""
        self._keyboard_idx = (self._keyboard_idx + 1) % len(KEYBOARDS)
        self._set_keyboard(KEYBOARDS[self._keyboard_idx])
