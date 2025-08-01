
# ✅ Condition Builder Completion Plan

## 🧠 User's Question
> Before we start with AI, would it be wise to test what has been done so far?
> For example, we have successfully created ChooseBlock.  
> Now the steps remaining here before we actually test it are:
>
> 1. Ensure proper details on the PreviewBlock
> 2. When user clicks Submit, how does all user creation get translated to a JSON or any other format ready for submission
>
> After testing this much then we have space for:
> 1. Exhaust the dropdown list
> 2. Create nested blocks for +Group
> 3. Add AI where possible
>
> This sums up the Condition Builder.
> How do we process?

---

## ✅ Phase 1: Finalize & Test Current Condition Builder

### 🧩 Step 1: Fix PreviewBlock Content
- Pull correct `keyword`, `contextParams`, and `label`
- Format:
  ```
  Indicator: EMA
  Params: period = 9, candle = 15min
  ```

➡️ Update `ChooseBlock` to build and pass this to `PreviewBlock`.

### 🧩 Step 2: Submit → Generate Final JSON
On clicking Submit, return this structure:
```json
{
  "type": "AND",
  "conditions": [
    { "indicator": "EMA", "period": 9, "candle": "15min" },
    { "indicator": "RSI", "value": 30, "operator": "<" }
  ]
}
```
➡️ Write transformer function: `chooseBlocksToConditionGroup()`

### 🧪 Testing Checklist (MVP)
| Feature                         | Done? |
|----------------------------------|-------|
| Add +Condition                   | ✅   |
| Fill keyword + contextParams    | ⬜️    |
| See correct summary in block    | ⬜️    |
| Submit → get full JSON object   | ⬜️    |
| Handle delete / remove blocks   | ✅   |

---

## 🚀 Phase 2: Expand Features After Testing

| Feature        | Description                        |
|----------------|------------------------------------|
| Dropdown exhaust | Test all keyword types and params |
| +Group nesting | Render children with AND/OR logic  |
| AI integration | Smart input, suggestions, parsing  |

---

## 🔧 Immediate Next Actions (Tomorrow)
1. Update `ChooseBlock` to generate rich preview content
2. Wire Submit button to print complete final JSON
3. Test add/remove/modify interactions
