# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository manages keyboard layouts for splitkb mechanical keyboards (Elora and Corne V4). It contains VIAL layout files (`.vil`) and tools for syncing/viewing layouts.

## Commands

**Sync Elora layout to Corne:**
```bash
python3 sync_elora_to_corne.py
```

**Run keyboard viewer (Electron app):**
```bash
cd keyboard-viewer && npm install && npm start
```

## Architecture

### Layout Files
- `elora.vil` - Primary layout for Elora keyboard (8 layers, 12 rows per layer)
- `corne-v4.vil` - Derived layout for Corne V4 (6 layers, 8 rows per layer)

These are JSON files using VIAL protocol 6. Each layer contains rows of QMK keycodes. The Elora is the primary keyboard; changes sync to Corne via the sync script.

### Layout Structure
- **Elora**: Rows 0-5 = left half, rows 6-11 = right half. Row 0/6 = number row, row 4/10 = thumb cluster
- **Corne**: Rows 0-3 = left half, rows 4-7 = right half. Row 3/7 = thumb cluster
- Keys within rows are ordered from index finger outward to pinky

### Sync Script (`sync_elora_to_corne.py`)
Maps Elora positions to Corne positions via `POSITION_MAP`. The Corne lacks the number row and some outer keys, so those are unmapped or set to transparent.

### Keyboard Viewer (`keyboard-viewer/`)
Electron app that renders keyboard layouts visually. The physical key positions for Elora and Corne are defined inline in `src/renderer/index.html`. The main process loads `.vil` files from the repository root via IPC.
