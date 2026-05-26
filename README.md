# Gerador JSON Elementor

Aplicação desktop multiplataforma (Windows, Linux, macOS) para criar layouts Elementor visualmente e exportar JSON compatível com WordPress.

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Electron](https://img.shields.io/badge/Electron-42.2.0-47848F)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6)

## Sumário

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
- [Instalação](#instalação)
  - [Windows](#windows)
  - [Linux](#linux)
  - [macOS](#macos)
- [Desenvolvimento](#desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso](#uso)
- [Exportação JSON](#exportação-json)
- [Solução de Problemas](#solução-de-problemas)
- [Licença](#licença)

---

## Visão Geral

O **Gerador JSON Elementor** é uma ferramenta visual que permite criar layouts compatíveis com o plugin Elementor do WordPress sem precisar codificar manualmente. Com interface intuitiva baseada em drag-and-drop, você pode:

- Criar seções e colunas
- Adicionar widgets (títulos, textos, botões, imagens)
- Editar propriedades em tempo real
- Exportar JSON pronto para importação no Elementor

---

## Recursos

### Layout
- ✅ Seções com layout full-width ou boxed
- ✅ Colunas com diferentes proporções (100%, 50/50%, 33/33/33%, etc.)
- ✅ Arrastar e soltar intuitivo
- ✅ Reordenação de elementos

### Widgets Disponíveis
| Widget | Descrição |
|--------|-----------|
| **Título** | Headings H1-H6 com alinhamento |
| **Texto** | Editor de texto rico |
| **Botão** | Botão clicável com link e tamanhos variados |
| **Imagem** | Exibição de imagens com alt text |

### Importação/Exportação
- 📤 Exportar JSON compatível com Elementor
- 📥 Importar JSON existente
- 📋 Copiar JSON para clipboard
- 💾 Download automático de arquivo `.json`

---

## Instalação

### Windows

#### Opção 1: Instalador (Recomendado)

1. Baixe o instalador `Gerador JSON Elementor Setup 1.0.0.exe` da [página de releases](#)
2. Execute o arquivo `.exe`
3. Siga o assistente de instalação
4. O atalho será criado na área de trabalho e menu iniciar

#### Opção 2: Versão Portátil

1. Baixe `Gerador JSON Elementor 1.0.0.exe` (portátil)
2. Execute diretamente, sem necessidade de instalação

**Requisitos Windows:**
- Windows 10 ou superior (64-bit)
- 4GB RAM mínimo
- 200MB espaço em disco

---

### Linux

#### AppImage (Recomendado - Todas as distribuições)

1. Baixe o arquivo `Gerador JSON Elementor-1.0.0.AppImage`
2. Torne executável:
   ```bash
   chmod +x "Gerador JSON Elementor-1.0.0.AppImage"
   ```
3. Execute:
   ```bash
   ./"Gerador JSON Elementor-1.0.0.AppImage"
   ```

**Integração com o sistema (opcional):**
```bash
# Mover para pasta de aplicativos
mkdir -p ~/.local/bin
cp "Gerador JSON Elementor-1.0.0.AppImage" ~/.local/bin/

# Criar atalho no menu
mkdir -p ~/.local/share/applications
cat > ~/.local/share/applications/gerador-elementor.desktop << EOF
[Desktop Entry]
Name=Gerador JSON Elementor
Exec=$HOME/.local/bin/Gerador JSON Elementor-1.0.0.AppImage
Icon=application-x-executable
Type=Application
Categories=Development;
EOF
```

**Requisitos Linux:**
- Kernel 4.0+
- glibc 2.28+
- 4GB RAM mínimo
- 200MB espaço em disco

---

### macOS

#### DMG (Apple Silicon Intel)

1. Baixe `Gerador JSON Elementor-1.0.0.dmg`
2. Abra o arquivo DMG
3. Arraste o ícone para a pasta Applications
4. Ejete o DMG

#### ZIP (Portátil)

1. Baixe `Gerador JSON Elementor-1.0.0-mac.zip`
2. Extraia o arquivo
3. Mova para Applications:
   ```bash
   mv "Gerador JSON Elementor.app" /Applications/
   ```

**Nota de Segurança:**
Ao abrir pela primeira vez, o macOS pode bloquear por não ser de um desenvolvedor identificado. Para resolver:
1. Vá em **Preferências do Sistema > Segurança e Privacidade**
2. Clique em **Abrir mesmo assim**

**Requisitos macOS:**
- macOS 10.15 (Catalina) ou superior
- 4GB RAM mínimo
- 200MB espaço em disco
- Suporte a x64 e ARM64 (Apple Silicon)

---

## Desenvolvimento

### Pré-requisitos

- Node.js 18+ e npm
- Git

### Clone e Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/gerador-json-elementor.git
cd gerador-json-elementor

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento Vite |
| `npm run build` | Compila aplicação React para produção |
| `npm run electron:dev` | Executa Electron em modo desenvolvimento |
| `npm run electron:build` | Compila Electron para plataforma atual |
| `npm run electron:build:win` | Build para Windows |
| `npm run electron:build:linux` | Build para Linux |
| `npm run electron:build:mac` | Build para macOS |
| `npm run electron:build:all` | Build para todas as plataformas |

### Estrutura de Builds

Após executar os comandos de build, os arquivos estarão em:

```
release/
├── linux-unpacked/          # Linux (descompactado)
├── Gerador JSON Elementor-1.0.0.AppImage    # Linux AppImage
├── win-unpacked/            # Windows (descompactado)
├── Gerador JSON Elementor Setup 1.0.0.exe   # Windows instalador
├── Gerador JSON Elementor 1.0.0.exe         # Windows portátil
├── mac/                     # macOS (descompactado)
├── Gerador JSON Elementor-1.0.0.dmg         # macOS instalador
└── Gerador JSON Elementor-1.0.0-mac.zip     # macOS portátil
```

---

## Estrutura do Projeto

```
gerador-json-elementor/
├── build/                      # Recursos de build (ícones, entitlements)
│   ├── icon.png
│   ├── icon.ico
│   └── entitlements.mac.plist
├── electron/                   # Código Electron
│   ├── main.ts                 # Entry point principal
│   └── preload.ts              # Preload script
├── src/                        # Código fonte React
│   ├── components/             # Componentes React
│   │   ├── widgets/            # Widgets (heading, text, button, image)
│   │   ├── Canvas.tsx
│   │   ├── Column.tsx
│   │   ├── Section.tsx
│   │   ├── Sidebar.tsx
│   │   └── PropertyPanel.tsx
│   ├── types/                  # Definições TypeScript
│   │   └── elementor.ts
│   ├── utils/                  # Utilitários
│   │   ├── cn.ts
│   │   ├── export-import.ts
│   │   └── id-generator.ts
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── dist/                       # Build React (gerado)
├── dist-electron/              # Build Electron (gerado)
├── release/                    # Pacotes finais (gerado)
├── index.html
├── package.json
├── tsconfig.json               # Config TypeScript React
├── tsconfig.electron.json      # Config TypeScript Electron
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Uso

### 1. Criando uma Página

1. **Inicie o aplicativo**
2. **Adicione uma seção**: Clique em "Nova Seção" na barra lateral
3. **Escolha um layout**: Selecione o tipo de coluna desejado (1 coluna, 2 colunas, etc.)
4. **Adicione widgets**: Clique em "Adicionar Widget" e escolha o tipo
5. **Edite o conteúdo**: Clique no widget para editar no painel direito

### 2. Editando Elementos

- **Seção**: Clique na borda da seção para editar propriedades (layout, cor de fundo)
- **Coluna**: Clique na coluna para editar largura e cor
- **Widget**: Clique no widget para editar conteúdo

### 3. Reorganizando

- Use as setas nos cantos superiores para mover elementos
- Ícone de lixeira para excluir

### 4. Visualização

- Clique em **Preview** para ver como ficará no Elementor
- Clique em **JSON** para ver o código gerado

---

## Exportação JSON

O JSON gerado segue a estrutura oficial do Elementor:

```json
{
  "content": [
    {
      "id": "61ca47dc",
      "elType": "section",
      "settings": {
        "layout": "full_width"
      },
      "elements": [
        {
          "id": "17431cc6",
          "elType": "column",
          "settings": {
            "_column_size": 100
          },
          "elements": [
            {
              "id": "592502fa",
              "elType": "widget",
              "widgetType": "heading",
              "settings": {
                "title": "Meu Título",
                "html_tag": "h2"
              }
            }
          ]
        }
      ]
    }
  ],
  "page_settings": [],
  "version": "0.4",
  "title": "Minha Página",
  "type": "page"
}
```

### Importando no Elementor

1. No WordPress, vá em **Elementor > Ferramentas > Importar/Exportar**
2. Clique em **Importar**
3. Selecione o arquivo JSON gerado
4. Pronto! O layout será recriado no Elementor

---

## Solução de Problemas

### Windows

**Problema:** "Windows protegeu seu PC"
- **Solução:** Clique em "Mais informações" > "Executar mesmo assim"

**Problema:** Tela branca ao abrir
- **Solução:** Pressione `Ctrl + Shift + I` para abrir DevTools e ver erros

### Linux

**Problema:** AppImage não executa
- **Solução:** Verifique permissões:
  ```bash
  chmod +x nome-do-arquivo.AppImage
  ```

**Problema:** Erro de bibliotecas
- **Solução:** Instale FUSE:
  ```bash
  # Ubuntu/Debian
  sudo apt install libfuse2
  
  # Fedora
  sudo dnf install fuse-libs
  ```

### macOS

**Problema:** "Não foi possível abrir..."
- **Solução:** Acesse **Preferências > Segurança e Privacidade > Geral** > Clique em **Abrir mesmo assim**

**Problema:** App danificado
- **Solução:** Execute no Terminal:
  ```bash
  xattr -cr /Applications/Gerador\ JSON\ Elementor.app
  ```

---

## Tecnologias Utilizadas

- [Electron](https://www.electronjs.org/) - Framework desktop
- [React](https://react.dev/) - Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Vite](https://vitejs.dev/) - Build tool
- [Lucide React](https://lucide.dev/) - Ícones

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## Licença

Este projeto está licenciado sob a licença MIT.

---

## Suporte

Para dúvidas ou problemas:
- Abra uma [issue](#)
- Email: marleyas@gmail.com

---

**Desenvolvido por:** Marley Adriano <marleyas@gmail.com> com o apoio do Claudinho
