#!/bin/bash

# Script de instalação para Linux
# Este script instala o AppImage e configura o ícone no sistema

set -e

APPIMAGE_NAME="Gerador JSON Elementor-1.0.0.AppImage"
APP_NAME="gerador-json-elementor"
DESKTOP_FILE="gerador-elementor.desktop"
ICON_NAME="gerador-elementor"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_banner() {
    echo "=========================================="
    echo "  Instalador Gerador JSON Elementor"
    echo "=========================================="
    echo ""
}

show_help() {
    show_banner
    echo "Uso: ./install-linux.sh [OPÇÕES]"
    echo ""
    echo "Opções:"
    echo "  --install        Instala o aplicativo no sistema"
    echo "  --uninstall      Remove o aplicativo do sistema"
    echo "  --icon-only      Apenas extrai e instala o ícone"
    echo "  --help           Mostra esta ajuda"
    echo ""
    echo "Sem opções: executa o AppImage diretamente"
    echo ""
}

install_app() {
    show_banner
    echo "${GREEN}Instalando Gerador JSON Elementor...${NC}"
    echo ""

    # Criar diretórios
    echo "1. Criando diretórios..."
    mkdir -p "$HOME/.local/bin"
    mkdir -p "$HOME/.local/share/applications"
    mkdir -p "$HOME/.local/share/icons/hicolor"

    # Copiar AppImage
    echo "2. Copiando AppImage..."
    if [ ! -f "$APPIMAGE_NAME" ]; then
        echo "${RED}❌ Erro: Arquivo $APPIMAGE_NAME não encontrado!${NC}"
        echo "Certifique-se de executar este script no diretório release/"
        exit 1
    fi

    cp "$APPIMAGE_NAME" "$HOME/.local/bin/$APP_NAME.AppImage"
    chmod +x "$HOME/.local/bin/$APP_NAME.AppImage"

    # Extrair ícones do AppImage
    echo "3. Extraindo ícones..."
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT

    cd "$TEMP_DIR"
    "$HOME/.local/bin/$APP_NAME.AppImage" --appimage-extract >/dev/null 2>&1 || {
        echo "${YELLOW}⚠️ Não foi possível extrair ícones automaticamente${NC}"
        echo "Usando ícones do build/icons..."
        # Fallback: usar ícones da pasta build/icons se disponíveis
        if [ -d "../../build/icons" ]; then
            for size in 16 22 24 32 48 64 128 256 512; do
                if [ -f "../../build/icons/${size}x${size}.png" ]; then
                    mkdir -p "$HOME/.local/share/icons/hicolor/${size}x${size}/apps"
                    cp "../../build/icons/${size}x${size}.png" "$HOME/.local/share/icons/hicolor/${size}x${size}/apps/$ICON_NAME.png"
                fi
            done
        fi
    }

    # Copiar ícones extraídos
    if [ -d "squashfs-root/resources/icons" ]; then
        for icon_file in squashfs-root/resources/icons/*.png; do
            if [ -f "$icon_file" ]; then
                size=$(basename "$icon_file" .png)
                mkdir -p "$HOME/.local/share/icons/hicolor/$size/apps"
                cp "$icon_file" "$HOME/.local/share/icons/hicolor/$size/apps/$ICON_NAME.png"
            fi
        done
    fi

    cd - > /dev/null

    # Criar arquivo .desktop
    echo "4. Criando entrada no menu..."
    cat > "$HOME/.local/share/applications/$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Gerador JSON Elementor
Comment=Gerador visual de JSON para Elementor WordPress
Exec=$HOME/.local/bin/$APP_NAME.AppImage
Icon=$ICON_NAME
Type=Application
Categories=Development;WebDevelopment;
StartupNotify=true
StartupWMClass=Gerador JSON Elementor
Terminal=false
MimeType=application/json;
X-AppImage-Integrate=true
EOF

    # Atualizar cache de ícones
    echo "5. Atualizando cache de ícones..."
    if command -v gtk-update-icon-cache >/dev/null 2>&1; then
        gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" 2>/dev/null || true
    fi
    if command -v update-icon-caches >/dev/null 2>&1; then
        update-icon-caches "$HOME/.local/share/icons/hicolor" 2>/dev/null || true
    fi

    # Atualizar banco de dados de aplicativos
    echo "6. Atualizando banco de dados..."
    if command -v update-desktop-database >/dev/null 2>&1; then
        update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
    fi

    echo ""
    echo "${GREEN}✓ Instalação concluída!${NC}"
    echo ""
    echo "O aplicativo foi instalado em:"
    echo "  - Executável: $HOME/.local/bin/$APP_NAME.AppImage"
    echo "  - Menu: Aplicativos > Desenvolvimento > Gerador JSON Elementor"
    echo ""
    echo "Para desinstalar, execute:"
    echo "  ./install-linux.sh --uninstall"
    echo ""
}

uninstall_app() {
    show_banner
    echo "${YELLOW}Removendo Gerador JSON Elementor...${NC}"
    echo ""

    # Remover AppImage
    echo "1. Removendo executável..."
    rm -f "$HOME/.local/bin/$APP_NAME.AppImage"

    # Remover ícones
    echo "2. Removendo ícones..."
    for size in 16 22 24 32 48 64 128 256 512; do
        rm -f "$HOME/.local/share/icons/hicolor/${size}x${size}/apps/$ICON_NAME.png"
    done

    # Remover arquivo .desktop
    echo "3. Removendo entrada do menu..."
    rm -f "$HOME/.local/share/applications/$DESKTOP_FILE"

    # Atualizar caches
    echo "4. Atualizando caches..."
    if command -v gtk-update-icon-cache >/dev/null 2>&1; then
        gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" 2>/dev/null || true
    fi
    if command -v update-desktop-database >/dev/null 2>&1; then
        update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
    fi

    echo ""
    echo "${GREEN}✓ Desinstalação concluída!${NC}"
    echo ""
}

# Verificar argumentos
case "${1:-}" in
    --install)
        install_app
        ;;
    --uninstall)
        uninstall_app
        ;;
    --help|-h)
        show_help
        exit 0
        ;;
    "")
        # Sem argumentos: apenas mostra instruções
        show_banner
        echo "Este é um script de instalação. Opções disponíveis:"
        echo ""
        echo "  ./install-linux.sh --install     # Instala no sistema"
        echo "  ./install-linux.sh --uninstall   # Remove do sistema"
        echo "  ./install-linux.sh --help        # Mostra ajuda"
        echo ""
        echo "Ou execute o AppImage diretamente:"
        echo "  chmod +x \"$APPIMAGE_NAME\""
        echo "  ./\"$APPIMAGE_NAME\""
        echo ""
        ;;
    *)
        echo "${RED}Opção desconhecida: $1${NC}"
        echo "Use --help para ver as opções disponíveis"
        exit 1
        ;;
esac
