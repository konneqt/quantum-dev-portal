#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$SCRIPT_DIR" 
APIS_DIR="$SCRIPT_DIR/apis"

# Detecta se deve usar yarn ou npm
if which yarn >/dev/null 2>&1; then
  PKG_MANAGER="yarn"
else
  PKG_MANAGER="npm run"
fi

apiFiles=($(find "$APIS_DIR" -maxdepth 1 -type f \( -name "*.yaml" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null))

if [ ${#apiFiles[@]} -eq 0 ]; then
  echo "No OpenAPI YAML or JSON files found in the '$APIS_DIR' directory."
  exit 1
fi

if ! command -v docusaurus &> /dev/null && [ ! -f "$ROOT_DIR/node_modules/.bin/docusaurus" ]; then
    echo "Docusaurus isn't installed. Installing required packages..."
    cd "$ROOT_DIR"
    npm install @docusaurus/core @docusaurus/preset-classic docusaurus-plugin-openapi-docs
fi

for apiFile in "${apiFiles[@]}"; do
  apiName=$(basename "$apiFile")
  apiName="${apiName%.*}"       

  if [ -d "$ROOT_DIR/.docusaurus" ]; then
    cd "$ROOT_DIR" && $PKG_MANAGER docusaurus -- clear
  fi

  cd "$ROOT_DIR" && $PKG_MANAGER docusaurus -- clean-api-docs $apiName || true
  cd "$ROOT_DIR" && $PKG_MANAGER docusaurus -- gen-api-docs $apiName
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to generate docs for $apiName"
  
  fi
done
