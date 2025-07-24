# 🧱 Strategy Graph Builder — Phase Roadmap

This document outlines all key development phases for building the Strategy Graph Builder inspired by Tradetron + Houdini's node-based workflow.

---

## ✅ Phase 1: Static Graph Layout & Core Node Types

### 🎯 Goal: Prove visual structure works

- [x] Render static node graph using React Flow
- [x] Create `ConditionNode` with hardcoded data
- [x] Add `LogicOperatorNode` (AND)
- [x] Style basic layout with input/output handles
- [x] Editable `ConditionNode` (OHLC + offset + operator + value)

---

## 🔁 Phase 2: Dynamic Node Management

### 🎯 Goal: Let user build freely

- [ ] Add UI to dynamically **add/remove nodes**
- [ ] Toggle logic operator (`AND` ⇄ `OR`)
- [ ] Connect nodes interactively (drag wires)
- [ ] Support **nested logic groups** with parent-child wrapping
- [ ] Add `ConditionGroupNode` structure (visual logic wrapper)

---

## 📡 Phase 3: Live Data Integration & Logic Evaluation

### 🎯 Goal: Wire to real-time data

- [ ] Connect each `ConditionNode` to **live ticks**
- [ ] Use `useLiveTicks()` and update based on symbol/field
- [ ] Evaluate individual condition node truth
- [ ] Compute full tree result (true/false)
- [ ] Show final result visually (✅ / ❌)

---

## 💾 Phase 4: Persistence & DSL Export

### 🎯 Goal: Make strategies saveable & portable

- [ ] Export graph structure as JSON or DSL
- [ ] Import logic from stored DSL
- [ ] Save to local/session/backend
- [ ] Implement undo/redo support

---

## 🔗 Phase 5: Strategy UI Integration

### 🎯 Goal: Connect builder into full Algomin strategy flow

- [ ] Embed `StrategyGraphBuilder` inside `StrategyBuilderPanel`
- [ ] Replace or toggle existing `ConditionBuilder`
- [ ] Allow full workflow: symbol select → graph logic → order execution

---

## 🧠 Bonus Phases

- [ ] Subnet/Reusable blocks (`SubgraphNode`)
- [ ] Drag-n-drop node palette
- [ ] Custom indicators (MACD, Supertrend) as nodes
- [ ] Flow validation (e.g. input/output matching)

---

Keep this file as your north star as we build your modular, visual strategy engine.
