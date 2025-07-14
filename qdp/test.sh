#!/bin/bash

# Crie o diretório docs se não existir
mkdir -p docs

# Use um único arquivo para teste
API_FILE="/home/coimbra/Documents/konneqt/quantum-dev-portal/qdp/cli/apis/Pet-Store.yaml"
API_NAME="Pet-Store"

echo "Gerando documentação para $API_NAME"

# Limpe o cache
npm run docusaurus -- clear

# Use a sintaxe correta para o plugin-id
npm run docusaurus -- gen-api-docs "$API_NAME" --plugin-id="$API_NAME"

# Verifique se os arquivos foram gerados
if [ -d "docs/$API_NAME" ]; then
  echo "Documentação gerada com sucesso em docs/$API_NAME"
  ls -la "docs/$API_NAME"
else
  echo "ERRO: Documentação não foi gerada em docs/$API_NAME"
fi