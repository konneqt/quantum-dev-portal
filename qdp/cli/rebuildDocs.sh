#!/bin/bash
# Detecta se deve usar yarn ou npm
if which yarn >/dev/null 2>&1; then
  PKG_MANAGER="yarn"
else
  PKG_MANAGER="npm run"
fi

# Lista todos os arquivos no diretório "apis"
apiFiles=($(find /home/coimbra/Documents/konneqt/quantum-dev-portal/qdp/cli/apis -maxdepth 2 -type f \( -name "*.yaml" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null))

# Verifica se existem arquivos antes de continuar
if [ ! -f "${apiFiles[0]}" ]; then
  echo "No OpenAPI YAML or JSON files found in the 'apis/' directory."
  exit 1
fi

# Itera sobre os arquivos para gerar os docs
for apiFile in "${apiFiles[@]}"; do
  apiName=$(basename "$apiFile")
  apiName="${apiName%.*}"       # Remove extensão (.yaml, .json, etc.)
  
  echo "Processing file: $apiFile"
  echo "API Name: $apiName"

  $PKG_MANAGER docusaurus -- clear

  # Usa apenas o nome da API, sem especificar plugin-id
  echo "Cleaning API docs for $apiName"
  $PKG_MANAGER docusaurus -- clean-api-docs $apiName

  echo "Generating API docs for $apiName"
  $PKG_MANAGER docusaurus -- gen-api-docs $apiName
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to generate docs for $apiName"
  else
    echo "Docs successfully generated for $apiName"
  fi
done