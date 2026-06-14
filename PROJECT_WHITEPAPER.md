# Libertrian — Project Whitepaper & Handover Log

> **⚠️ READ THIS BEFORE TOUCHING ANYTHING.**
> This is a living handover document. Read the Quick Status first, then scan the Log summaries. Only dig into Technical Details if you need to understand *how* something was built. After your changes, append a new signed entry to the Log at the bottom.

---

## Quick Status (Read This First)

| Item | Status |
|---|---|
| App runs with | `npm run tauri dev` (from `/Users/andy/Documents/Libertrian`) |
| Frontend | React 19 + TypeScript + Tailwind CSS v4 + Vite v7 |
| Backend | Tauri v2 (Rust) — `src-tauri/src/lib.rs` |
| Biometric login | ✅ Working — auto-prompts Touch ID on screen load |
| Market Terminal | ✅ Working — real interactive TradingView Lightweight Charts |
| Capital Flow UI | ✅ Working — custom SVG donut + line + bar charts on right panel |
| Dark mode | ✅ Working |
| Real market data | ❌ Not yet — all data is mocked |
| Persistence | ❌ Not yet — data resets on restart |

---

## Project Goal

Personal financial terminal for Andy. Tracks crypto portfolio (BTC, SUI, ETH, SOL), simulates recovery curves after market crash events, and provides an AI analyst chat. Protected by a biometric (Touch ID) login gateway. Aesthetic inspiration: Futu Moomoo desktop terminal — dark glass, vivid glows, premium feel.

---

## Architecture at a Glance

```
src/
  App.tsx              — Full frontend UI (single component, ~1400 lines)
  TradingChart.tsx     — TradingView Lightweight Charts wrapper component
  index.css            — Global styles + @keyframes shake animation

src-tauri/
  src/lib.rs           — All Rust Tauri commands (biometrics, portfolio data, AI)
  Cargo.toml           — Rust deps (apple-localauthentication = "0.3.5")
  build.rs             — Linker fix: -Wl,-rpath,/usr/lib/swift (macOS Swift dylib)
  tauri.conf.json      — Window: 1280×800, Overlay title bar, id: com.libertrian.app
```

**Key npm packages:** `lightweight-charts`, `lucide-react`, `@tauri-apps/api`

---

## Open Issues

1. **No real market data** — `stockData` dict in `App.tsx` is hardcoded mock values
2. **No persistence** — orders/settings reset on app restart (needs `tauri-plugin-store`)
3. **Chart data is mock** — `TradingChart.tsx` generates random OHLCV, needs real exchange API
4. **Touch ID failure color** — red shake works but could be more dramatic

---

## Next Steps Queue

1. Connect Binance/Coinbase WebSocket API in Rust backend → feed real OHLCV to chart
2. Add `tauri-plugin-store` for persistent orders and settings
3. TradingView chart: add volume histogram below candlesticks
4. Research alternative charting libs (prompt written — see last log entry)

---
---

# 📋 Developer Handover Log

Each entry = **Summary** (quick read) + **Technical Details** (deep dive if needed).

---

## Entry 1 — Platform Migration + Login Gateway

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 1.5 Pro | **Effort:** High

### Summary
Migrated the app from GPUI (Rust-only) to Tauri v2 + React. Built the secure biometric login screen with Touch ID integration.

### Technical Details
- Scaffolded new Tauri v2 project, configured `tauri.conf.json` (1280×800, Overlay titlebar, `com.libertrian.app`)
- Set up React 19 + TypeScript + Tailwind CSS v4 + Vite v7 frontend
- Added `apple-localauthentication = "0.3.5"` to `Cargo.toml`
- Added `cargo:rustc-link-arg=-Wl,-rpath,/usr/lib/swift` to `build.rs` to prevent macOS Swift dylib loader crash at runtime on debug builds
- Built glassmorphic login card: password field with show/hide toggle, fingerprint button with amber scanning / emerald success / rose failure states
- Implemented `authenticate_biometrics` Rust command using `LAPolicy::DeviceOwnerAuthentication` (not `WithBiometrics` — the biometrics-only policy fails on unsigned dev builds)
- Added dark/light mode toggle synced via `document.documentElement.classList`
- Built all 5 main tabs: Banking, Market Terminal, Crypto Portfolio, AI Analyst, Settings
- Settings tab has a "Lock Terminal Session" button that resets login state for testing

---

## Entry 2 — Biometric Auto-Prompt Fix + Async Command

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 1.5 Pro | **Effort:** High

### Summary
Fixed two bugs: (1) Touch ID wasn't auto-triggering on page load. (2) UI was freezing while Touch ID dialog was open.

### Technical Details
- **Bug 1 — Timer cancellation:** React 18+ Strict Mode mounts components twice (mount → unmount → remount). The first mount set `hasAutoPrompted.current = true` and scheduled the 500ms timer. The unmount cancelled the timer but left the ref as `true`. The second mount saw `true` and skipped scheduling. **Fix:** Reset `hasAutoPrompted.current = false` in the `useEffect` cleanup function so the second mount schedules a fresh timer.
- **Bug 2 — UI freeze:** `authenticate_biometrics` was a synchronous `fn`. Tauri runs sync commands on the main thread, which is also the webview thread. While macOS showed the Touch ID dialog, the entire React UI froze — state updates (amber glow, spinner) couldn't paint. **Fix:** Changed to `async fn`. Tauri runs async commands on a background thread pool, leaving the webview alive.
- Changed auto-prompt delay from 500ms to 800ms for better UX feel
- Added `animate-shake` keyframes to `index.css`; entire login card shakes + border turns rose on biometric failure

---

## Entry 3 — Futu Moomoo-Style Right Panel + Whitepaper

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Claude Sonnet 4.6 (Thinking) | **Effort:** High

### Summary
Replaced the static right panel in the Market tab with a fully dynamic, Futu Moomoo-style statistics panel. Created this whitepaper.

### Technical Details
- Added `stockData` dictionary at top of `App.tsx` (keyed by symbol: TSLA, COIN, KO, FIG, BABA, QQQ, JNJ, WMT) containing: price, chg, open/high/low/prevClose, volume, turnover, inflow, outflow, netInflow, L/M/S breakdowns, flowPoints array, flowMin/Max labels, histBars array
- Right panel is now wrapped in an IIFE (`(() => { ... })()`) that reads from `stockData[selectedStock]` — clicking any watchlist stock updates every value dynamically
- **Transaction Statistics donut chart:** Pure SVG. 6 `<circle>` elements with `strokeDasharray` / `strokeDashoffset` math to create pie segments. 3 emerald shades (#065f46, #10b981, #6ee7b7) for L/M/S inflow; 3 rose shades (#9f1239, #f43f5e, #fecdd3) for outflow. Net flow displayed in center.
- **Real-Time Capital Flow line chart:** Pure SVG. Normalizes `flowPoints[]` to SVG coordinate space, draws `<path>` for line stroke + filled area with `<linearGradient>` (green if netInflow ≥ 0, red if negative). Dashed grid lines. Time axis labels overlay.
- **Historical Capital Flow:** 5-bar chart from `histBars[]`, green/red fill per bar

---

## Entry 4 — TradingView Lightweight Charts Embed

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Claude Sonnet 4.6 (Thinking) | **Effort:** High

### Summary
Replaced the static mock SVG candlesticks in the Market tab center panel with a real, interactive TradingView Lightweight Charts component. Added BTC+SUI dual-series overlay mode.

### Technical Details
- Ran `npm install lightweight-charts` (~23MB in node_modules, ~200KB in final bundle after Vite tree-shaking)
- Created `src/TradingChart.tsx` — standalone React component
- Uses `createChart()` from `lightweight-charts`, mounts via `useRef` pointing at a `<div>` container
- `useEffect` with empty deps `[]` creates the chart once on mount; separate effects sync theme changes and data changes independently (avoids recreating chart on every re-render)
- Adds primary `CandlestickSeries` (emerald/rose) pinned to `priceScaleId: "right"`
- **BTC+SUI overlay toggle:** When enabled, adds a second `CandlestickSeries` (teal/orange) pinned to `priceScaleId: "left"`. Both left and right price scales are enabled so the two assets don't interfere with each other's scale. When toggled off, calls `chart.removeSeries(series2Ref.current)` to clean up.
- `ResizeObserver` watches container div and calls `chart.applyOptions({ width, height })` to keep chart fluid
- Timeframe selector (1D/1W/1M/3M/1Y) changes start timestamp and bar count; data is seeded mock OHLCV generated per symbol from `SYMBOL_PARAMS` dict
- Chart background, grid, text, crosshair, border colors all sync to `isDarkMode` prop via `chart.applyOptions()`
- **Chart data is still mock** — `generateCandles()` produces random walk OHLCV. Real data requires Rust backend fetching from Binance/Alpaca WebSocket

---

## Entry 5 — Collapsible Panels + Dark Mode Toggle in Sidebar

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Claude Sonnet 4.6 (Thinking) | **Effort:** High

### Summary
Market tab panels are now collapsible/resizable. Dark mode toggle moved from Settings tab to a persistent icon in the left sidebar.

### Technical Details
- **Dark Mode Toggle:** Moved from Settings tab to the left sidebar `<aside>`. Added `Sun` (amber) and `Moon` (indigo) icons from lucide-react. Displays sun when dark (to switch to light), moon when light (to switch to dark). Sits above the Profile badge, below the Settings nav icon. Has same tooltip-on-hover behavior as other nav items.
- **Watchlist Left Panel — 3-state collapsible:** Added `leftPanel` state (`"expanded" | "icon" | "hidden"`). `cyclePanel()` helper cycles the three states. Panel `width` is driven by inline style (280px / 48px / 0px) with CSS `transition-all duration-200` for smooth animation. Collapsed `"icon"` state renders a column of colored stock logo circles — clicking any still selects that stock. Hidden state removes it entirely and the center chart fills the space.
- **Ticker Right Panel — 3-state collapsible:** Same pattern as left panel. `rightPanel` state controls width (300px / 48px / 0px). The full stats panel IIFE is now conditionally rendered only when `rightPanel === "expanded"`. The icon strip shows a `TrendingUp` icon + the selected stock ticker label rotated 90°.
- **Ledger Bottom Panel — drag-to-resize:** Added a 5px drag handle bar between the chart and ledger. `handleLedgerDragStart` sets `isDraggingLedger.current`, captures `dragStartY` and `dragStartHeight`. A global `useEffect` registers `mousemove` and `mouseup` listeners on `window` to compute delta and clamp `ledgerHeight` between 80px and 500px. `document.body.style.cursor = "row-resize"` is set during drag and cleared on mouseup.

---

## Entry 6 — Persistent Toggle Access in Hidden Panel State

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 3.5 Flash | **Effort:** Low

### Summary
Adjusted the hidden state width of the Market tab side panels from 0px to 20px so that the panel toggle buttons remain visible and clickable when fully collapsed.

### Technical Details
- Updated the inline width calculations in `App.tsx` for the left and right panels under the `activeTab === 1` view.
- Changed the hidden width ternary resolution from `0` to `20` (i.e. `width: panel === "expanded" ? X : panel === "icon" ? 48 : 20`).
- This ensures the vertical toggle buttons (which are 20px wide or positioned inside the container edge) remain visible and accessible, preventing panels from becoming permanently locked in the hidden state without a way to expand them back.

---

## Entry 7 — Preferences Modal, Bottom Status Bar & Profile Menu

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 3.5 Flash | **Effort:** Medium

### Summary
Built the bottom index status bar, profile dropdown menu, and a fully functional macOS/Moomoo-style Preferences modal dashboard with sound presets, custom quote colors, global themes, and scaling settings.

### Technical Details
- **Bottom Status Bar:** Added index footer displaying sector choices (Layer 1, Layer 2, Memes, DePIN) with dynamic ticker arrays, local/UTC timezone clocks, glowing network connection dot, and manual refresh cache.
- **Profile Popover:** Connected profile badge to floating cards allowing username overrides, 11 global skin themes (ayu-light, Everforest, etc.), and Escape key dismissal.
- **macOS Preferences Modal:** Integrated glassmorphic dashboard frame with macOS traffic light controls, settings search filtering, hierarchical chevrons settings categories, and functional general preferences (Appearance Sync, Quote Colors Emerald/Rose Swaps, root document font-size scaling, sound alerts using pure Web Audio API oscillators, AI provider parameters, and databases Excel/MongoDB connections).
---

## Entry 8 — Profile Card Mascot Avatar, Centered Theme Modal & macOS Modal Resizing

**Date:** 2026-06-13
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 1.5 Pro | **Effort:** Medium

### Summary
Refactored the sidebar profile icon to use a custom orange mascot SVG, restructured the profile dropdown popover with icons and shortcuts, implemented a centered floating Theme selection popup modal with search filtering, expanded the Preferences settings modal viewport dimensions, and converted absolute pixel widths of side panels to relative `rem` units for stable layout scaling.

### Technical Details
- **Orange Mascot SVG:** Designed an inline SVG for the Longbridge mascot (orange head, white ears, cute eyes and patches) and replaced the glowing letters `NE` avatar in the sidebar and profile header.
- **Profile Popover menu:** Restructured list items with Moon (Appearance), Globe (Theme), Languages (Language), Settings (Setting), Send (Feedback), Info (About), LogOut (Log out) icons. Added a keyboard shortcut label (`⌘,`) for Settings. The Logout action locks the terminal session.
- **Centered Theme selection Modal:** Sits centered in the screen overlapping the TradingView charts. Integrates a search box filtering the themes list, checkmarks for active configurations, and custom pill badges indicating theme mode (`Light` / `Dark`). Dismissible via clicking outside, clicking selection, or pressing `Escape`.
- **macOS Preferences Modal Sizing:** Enlarged settings window modal to `w-[90vw] max-w-[1000px] h-[85vh] max-h-[720px]`. Combined related panels to simplify category list to: Account Preference (Account + Password), General (General + Sound), Quotes, Trade Preference, Chart Settings, and Developer (containing developer detail cards + AI and DB settings).
- **Proportional Scaling Stability:** Converted left panel, right panel, and sidebar inline widths from hardcoded pixels (`px`) to relative `rem` units (e.g. `280px` -> `17.5rem`). Modifying `document.documentElement.style.fontSize` now resizes the text and panels in perfect proportion, preventing text wrapping or panel layout shifts.

---

## Entry 9 — Multi-Agent Configuration, Ingestion Router Map & macOS Window Polishing

**Date:** 2026-06-14
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 3.5 Flash (Low) | **Effort:** Medium

### Summary
Completely removed Trade Preferences, restructured AI settings to support nested multi-agent configurations, designed high-fidelity hovered SVG traffic light controls, added a Genie-style minimize scale transition, implemented a multi-slot API Ingestion Coordinator Router panel with flowing streams, resolved all TypeScript local unused variable errors, and fixed a modal coordinate Y-axis offset bug.

### Technical Details
- **Nested Multi-Agent configurations:** Grouped AI Settings under individual agent leaf directories (`Sarah`, `Bilbo`, `Gemini`). Clicking an agent reveals sub-sections: `Agent Config` (guidelines, cron, and mock interactive preview panel) and `Model API` (provider choice and API key slot).
- **Apple-Accurate Control Controls:** Circular window lights (13px width) hover-reveal inline SVG symbols (cross `✕`, minus `−`, and zoom diagonal double-arrow) rather than standard text characters. They align cleanly using CSS flex centering.
- **Genie Minimize Scale Animation:** Minimizing settings transitions the modal viewport scale from `1` to `0.05` and translates it down to `(35vw, 35vh)` (towards the bottom-right restore badge). Reopening the badge smoothly scales the modal frame back up.
- **API Ingestion Coordinator Router:** Replaced simple DB configuration forms inside Developer settings with a premium Ingestion Coordinator. Categorizes API inputs (Market Data, Exchanges, Banks, Databases), lists current active API providers with connection badges, features a dynamic connection registration form, and renders a live flowing animated path map.
- **Strict Compilation & Drag Offset Fix:** Fixed a coordinate Y-axis jumping bug by correctly referencing `modalOffsetRef.current.y` (instead of previous dragOffset) during drag triggers. Removed all unused React imports (`FileSpreadsheet`, `SquareArrowOutUpRight`) and local states to achieve clean builds under `noUnusedLocals: true` parameters.

---

## Entry 10 — AI Agent Dashboard, Sidebar Pinning, Full-Height Sidebar Layout & Category Extensions

**Date:** 2026-06-14
**Developer:** Antigravity (AI)
**IDE:** Gemini Agent Sandbox
**Model:** Gemini 3.5 Flash (Medium) | **Effort:** High

### Summary
Redesigned the application layout to support a full-height left navigation sidebar, added an AI Agent Dashboard with sidebar-docking / 1-on-1 custom chat consoles, implemented a collapsible and resizable settings sidebar inside the preferences modal, added resizable map heights to the Ingestion Coordinator, enabled dynamic category registration in the status bar, and polished various UI components.

### Technical Details
- **Full-Height Left Sidebar:** Moved the index status bar (footer) into the right-hand layout container flex column so the navigation sidebar stretches to the bottom of the viewport. Lifted the mascot and theme buttons (10–15% padding adjustment) and added a short horizontal separator (`w-8`) directly above the avatar.
- **AI Agent Dashboard & Pinning:**
  - Upgraded the AI Analyst tab to show a horizontal scrollable row of deployed AI agents with active "Pin to Sidebar" bookmark toggles.
  - Implemented `pinnedAgentIds` and `activeAgentChatId` state values to mount dedicated 1-on-1 workspaces for pinned agents on the right, overriding the default active tab layout.
  - Added a "Danger Zone" in the Agent Config settings panel to permanently delete custom agents.
- **Preferences Modal Header Sync:** Configured the preferences header title bar to dynamically resolve and show the active section name (e.g., "Account Preferences", "Sarah Settings", "Ingestions Router") instead of defaulting to a static "Preferences".
- **Transparent Drag/Resize overlays:** Removed the green highlight overlay styling from settings window drag handles, making the resize zones fully transparent while keeping dragging/resizing functional.
- **Resizable Settings Sidebar & Collapse:**
  - Added a vertical col-resize drag handle on the right edge of the settings panel navigation sidebar, clamping width adjustments between `160px` and `350px`.
  - Added an expand/collapse toggle (`◀/▶`) button that shrinks the sidebar down to a 52px icon-only mode when collapsed.
- **Resizable Ingestion Coordinator Map:**
  - Integrated a row-resize drag handle at the bottom edge of the coordinator map.
  - Bound mouse dragging event listeners to update `mapHeight` (clamped between `160px` and `450px`).
  - Disabled CSS transition styling on the map height *only* during active dragging to ensure smooth resizing.
- **Real-Time SVG Flows & Extensions:**
  - Connected lines dynamically using custom coordinate bounding boxes. Muted gray lines are drawn when a category has 0 active connections; glowing green flow packet animations are activated only for active connections.
  - Status bar category filter has a narrower dropdown (`w-26`), darker border styling, and a `+ Add Category` button that dynamically appends to `sectorsList` state. Added TypeScript fallback indexing checks on `sectorData` to prevent runtime crashes.
