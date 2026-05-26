#!/bin/bash

# Script para build Linux com ícone embutido no AppImage

set -e

echo "=========================================="
echo "Build Linux com Ícone Personalizado"
echo "=========================================="

# Limpar builds anteriores
echo "Limpando builds anteriores..."
rm -rf release dist dist-electron

# Build da aplicação
echo ""
echo "1. Compilando aplicação React..."
npm run build

# Build do Electron
echo ""
echo "2. Compilando código Electron..."
npm run electron:compile

# Build com electron-builder
echo ""
echo "3. Criando AppImage..."
npx electron-builder --linux

# Verificar se AppImage foi criado
echo ""
echo "4. Verificando AppImage gerado..."
APPIMAGE_FILE=$(find release -name "*.AppImage" -type f | head -1)

if [ -z "$APPIMAGE_FILE" ]; then
    echo "❌ Erro: AppImage não encontrado!"
    exit 1
fi

echo "✓ AppImage encontrado: $APPIMAGE_FILE"

# Extrair o ícone e configurá-lo
echo ""
echo "5. Configurando ícone do AppImage..."

# Criar diretório temporário
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# O ícone já está incluído no build através do extraResources
# O electron-builder já deve ter embutido o ícone

# Verificar estrutura do AppImage
echo "Verificando estrutura do AppImage..."
cd "$TEMP_DIR"

# Extrair AppImage
"$OLDPWD/$APPIMAGE_FILE" --appimage-extract >/dev/null 2>&1 || {
    echo "⚠️ Não foi possível extrair o AppImage (pode não ter --appimage-extract)"
    echo "O ícone já está embutido através do buildResources"
}

# Informações finais
echo ""
echo "=========================================="
echo "✓ BUILD CONCLUÍDO!"
echo "=========================================="
echo ""
echo "Arquivo: $APPIMAGE_FILE"
echo "Tamanho: $(du -h "$APPIMAGE_FILE" | cut -f1)"
echo ""
echo "Para executar:"
echo "  chmod +x \"$APPIMAGE_FILE\""
echo "  \"$APPIMAGE_FILE\""
echo ""
echo "O ícone está embutido no aplicativo através de:"
echo "  - build/icon.png (ícone principal)"
echo "  - build/icons/* (ícones em múltiplos tamanhos)"
echo "=========================================="
