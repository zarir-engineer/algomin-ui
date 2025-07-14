# 📘 Strategy Summary

This document describes a nested condition logic structure for the strategy builder panel in Algomin UI.

## ✅ Logic Evaluation

- Conditions are grouped using **AND/OR** logic.
- Nested groups are supported for complex strategies.
- Each condition includes:
  - A trading symbol
  - An operator (>, <, >=, <=, ==, !=)
  - A target value

## 🧠 Evaluation Behavior

- Every condition compares a live price (LTP) to the user-specified value.
- Conditions are structured in groups like:

```text
Group (AND/OR)
├── Condition: SYMBOL_X > 100
├── Group (OR)
│   ├── Condition: SYMBOL_Y < 200
│   └── Condition: SYMBOL_Z == 150
```

## 🧪 Strategy Result

- Minimum rules required: `minRules = 1`
- If all required conditions are met:
  - UI shows ✅ “All conditions met”
- If not:
  - UI shows ❌ “Not met”

## 🛠️ File Integration

This logic is driven by:
- `ConditionBuilder.tsx` – for recursive nested input
- `StrategyBuilderPanel.tsx` – for live evaluation and rendering
- `LivePriceSubscriber.tsx` – for streaming LTPs

## 💡 Sample Usage in Code

```tsx
const [rootGroup, setRootGroup] = useState<ConditionGroup>({
  type: 'group',
  logic: 'AND',
  conditions: [],
});
```

This enables strategies like:

> If **AAPL > 200** AND (**NIFTY < 19000** OR **BANKNIFTY > 44000**)