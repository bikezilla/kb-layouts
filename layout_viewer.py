#!/usr/bin/env python3
"""Entry point for the keyboard layout TUI viewer."""

from pathlib import Path

from kb_viewer.app import LayoutViewerApp


def main() -> None:
    """Run the layout viewer application."""
    # Use the script's directory as base path for .vil files
    base_path = Path(__file__).parent
    app = LayoutViewerApp(base_path=base_path)
    app.run()


if __name__ == "__main__":
    main()
