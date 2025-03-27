#!/bin/bash
echo 'Rebuilding docs'

# Detecta se deve usar yarn ou npm
if which yarn > /dev/null 2>&1; then
  PKG_MANAGER="yarn"
else
  PKG_MANAGER="npm run"
fi

echo "Using package manager: $PKG_MANAGER"

# Lista todos os arquivos YAML no diretório "apis"
apiFiles=($(find apis -maxdepth 1 -type f \( -name "*.yaml" -o -name "*.yml" -o -name "*.json" \) 2>/dev/null))

# Verifica se existem arquivos antes de continuar
if [ ! -f "${apiFiles[0]}" ]; then
  echo "No OpenAPI YAML or JSON files found in the 'apis/' directory."
  exit 1
fi

# Itera sobre os arquivos para gerar os docs
for apiFile in "${apiFiles[@]}"; do
  apiName=$(basename "$apiFile")
  apiName="${apiName%.*}" # Remove extensão (.yaml, .json, etc.)
  pluginId="${apiName}"

  # Depuração: Verifica os valores
  echo "Processing file: $apiFile"
  echo "Plugin ID: $pluginId"

  # Limpa os docs (sem o plugin ID)
  $PKG_MANAGER docusaurus clean-api-docs $apiName --plugin-id $pluginId

  # Executa a geração de docs com o plugin correto
  $PKG_MANAGER docusaurus gen-api-docs $apiName --plugin-id $pluginId
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to generate docs for $pluginId"
    exit 1
  else
    echo "Docs successfully generated for $pluginId"
  fi
done