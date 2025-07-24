#!/usr/bin/env bash

# List of directories to ensure exist
DIRS=(
  "src/components"
  "src/features/ConditionBuilder/components"
  "src/features/ConditionBuilder/hooks"
  "src/features/ConditionBuilder/models"
  "src/features/ConditionBuilder/services"
  "src/features/Charts/components"
  "src/features/Charts/hooks"
  "src/features/DataPanels/components"
  "src/features/DataPanels/services"
  "src/features/Dashboard"
  "src/features/Orders"
  "src/features/Settings"
  "pages"
  "styles"
)

# Create directories if they don't exist
for dir in "${DIRS[@]}"; do
  mkdir -p "$dir"
  echo "Ensured: $dir"

done