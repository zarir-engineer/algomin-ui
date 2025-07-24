
# 🎯 Focus Areas That Need Work

These are the high-impact changes needed to improve maintainability, scalability, and developer experience in `algomin-ui`.

---

## 1. ❌ State Management

- **Right now**: Scattered `useState`, minimal `useSettings` context.
- **Goal**: Centralized, scalable state using something like `Zustand` or fully fleshed-out `React Context`.

---

## 2. ❌ Flat Directory Structure

- **Right now**: All components live in a flat `/components` folder.
- **Goal**: Organize code by features instead of type. Suggested structure:

```
/features/
  settings/
    SettingsModal.tsx
    settingsStore.ts (or context)
  chart/
    ChartPanel.tsx
    FallbackChart.tsx
  symbols/
    SymbolSelect.tsx
```

---

## 3. ⚠️ Minimal Custom Hook Abstraction

- **Right now**: Logic is embedded inside components.
- **Goal**: Extract into reusable hooks.
  - `useConditions()` → manage conditions array logic
  - `useDummyTicks()` → simulate ticks in a consistent place
  - `useMarketStatus()` → central logic for market open/closed

---

## 4. ❌ No Form Validation or Schema Enforcement

- **Right now**: Raw `<input>` with no validation.
- **Goal**: Use `react-hook-form` with `zod` or `yup`.
  - Adds live validation
  - Ensures type safety and better UX
  - Simplifies integration with backend APIs

---

## TL;DR for ADHD 🧠

Your house is built with Lego blocks 🧱 — solid and colorful — but they’re scattered. Let's:
- Add a **brain** (state manager),
- Use **drawers** (feature folders),
- Build **habits** (custom hooks),
- Set **boundaries** (form validation).

Each one makes the codebase easier to use, scale, and share. Let’s start with State Management?
