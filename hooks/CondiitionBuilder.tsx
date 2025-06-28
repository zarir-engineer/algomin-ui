// A minimal React Condition Builder UI example
import React, { useState } from "react";

const operators = [">", "<", ">=", "<=", "==", "crosses above", "crosses below"];
const keywords = ["Time", "RSI", "Price", "EMA"];

export default function ConditionBuilder() {
  const [conditions, setConditions] = useState([{ keyword: "", operator: "", value: "" }]);

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { keyword: "", operator: "", value: "" }]);
  };

  const removeCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Condition Builder</h2>
      {conditions.map((cond, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <select
            value={cond.keyword}
            onChange={(e) => updateCondition(index, "keyword", e.target.value)}
            className="border rounded p-1"
          >
            <option value="">Select Keyword</option>
            {keywords.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={cond.operator}
            onChange={(e) => updateCondition(index, "operator", e.target.value)}
            className="border rounded p-1"
          >
            <option value="">Operator</option>
            {operators.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Value"
            value={cond.value}
            onChange={(e) => updateCondition(index, "value", e.target.value)}
            className="border rounded p-1"
          />

          <button
            onClick={() => removeCondition(index)}
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addCondition}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add Condition
      </button>

      <pre className="mt-4 bg-gray-100 p-2 rounded">
        {JSON.stringify(conditions, null, 2)}
      </pre>
    </div>
  );
}
