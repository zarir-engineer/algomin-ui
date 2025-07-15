# 🧠 Visual Condition Builder – Node-Based Workflow Design (Tradetron-Inspired)

This document captures the complete logic and UX breakdown for building a modular, node-based condition strategy builder, inspired by Tradetron and Houdini’s visual networks.

---

## 🔰 Canvas Structure (first_step.png)

- Every logic canvas begins with:
  - **Top-left:** `[ AND | OR ]` toggle (acts as LogicOperatorNode)
  - **Top-right control group**:
    - ➕ `+ Condition`
    - ➕ `+ Group`
    - ❌ `×` Close group

This entire wrapper is modeled as a `RootGroupNode`.

---

## 🔗 ConditionNode UI (second_step.png)

When a user clicks `+ Condition`, a **horizontal inline node** appears:

```
[ FIELD 1 ]   [ FIELD 2 ]   [ FIELD 3 ]
```

Each field behaves identically:
- Opens a **Context Search UI**
- Allows smart keyword typing
- Responds differently based on what’s typed

---

## 🧩 Modular Fields Behavior (third_step.png + ref-trade-chart.png)

### 📌 FIELD 1:
- Triggered by typing e.g., `position`
- Suggests: Technical, Position, StrategyInfo…
- Example resolved value:  
  `Position → CLOSE(Symbol, …, -1)`

### 📌 FIELD 2:
- Also uses the **same Context Search UI**
- Typing `>` will filter and show:  
  `>`, `<`, `==`, `!=`, `>=`, `<=`

### 📌 FIELD 3:
- Again, uses same context search UI
- Not a plain number input
- Can be:  
  - A position keyword (e.g., CLOSE -2)
  - A technical indicator
  - A constant value

📸 See `ref-trade-chart.png`  
- Candle 0 → current  
- Candle -1 → previous  
- Candle -2 → two candles back  
These correlate with values used in Field 1 and Field 3.

---

## ➕ Each Modular Field Includes:

- ⬅️ Top-left corner `+` → Clone this field
- ❌ Top-right corner `×` → Delete this field
- All three fields support context-aware autocomplete input

---

## ✅ Example Final Node (Visualized)

```
┌────────────────────────────────────────────────┐
│ [+]  [ CLOSE -1 ]   [ > ]   [ CLOSE -2 ]   [×] │
└────────────────────────────────────────────────┘
```

- Clicking any field launches same smart input UI
- Everything composable and reusable
- Powered by a single field resolver engine

---

## 🔁 Node Composition Flow

- Every `ConditionNode` lives inside a `RootGroupNode`
- Group holds:
  - Logic operator toggle (`AND` / `OR`)
  - List of nodes (`ConditionNode[]`, `GroupNode[]`)
- Each node has its own field-level lifecycle

---

Let’s use this as the core spec to implement the React Flow-based builder in algomin-ui.
