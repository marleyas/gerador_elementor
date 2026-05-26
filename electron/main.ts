import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determinar se estamos em desenvolvimento
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let aboutWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });

  // Carregar a aplicação
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Criar menu personalizado
  createApplicationMenu();
}

function createAboutWindow() {
  // Se já existe uma janela sobre, foca nela
  if (aboutWindow) {
    aboutWindow.focus();
    return;
  }

  aboutWindow = new BrowserWindow({
    width: 500,
    height: 400,
    minWidth: 400,
    minHeight: 350,
    maxWidth: 600,
    maxHeight: 500,
    parent: mainWindow || undefined,
    modal: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'Sobre - Gerador JSON Elementor',
    show: false,
  });

  // Conteúdo HTML da janela About
  const aboutContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sobre</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 30px;
          text-align: center;
        }
        .container {
          max-width: 420px;
        }
        .logo {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          font-size: 48px;
          font-weight: bold;
          color: #0f172a;
          box-shadow: 0 10px 40px rgba(245, 158, 11, 0.3);
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }
        .version {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 24px;
        }
        .description {
          font-size: 15px;
          line-height: 1.7;
          color: #cbd5e1;
          margin-bottom: 24px;
        }
        .author-box {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .author-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #f59e0b;
          margin-bottom: 8px;
        }
        .author-name {
          font-size: 18px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 4px;
        }
        .author-email {
          font-size: 13px;
          color: #94a3b8;
        }
        .tech-stack {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .tech-badge {
          background: rgba(148, 163, 184, 0.15);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          color: #94a3b8;
        }
        .copyright {
          font-size: 12px;
          color: #64748b;
        }
        .close-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #0f172a;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">E</div>
        <h1>Gerador JSON Elementor</h1>
        <div class="version">Versão 1.0.0</div>

        <p class="description">
          Uma ferramenta desktop multiplataforma para criar layouts Elementor visualmente e exportar JSON compatível com WordPress.
        </p>

        <div class="author-box">
          <div class="author-label">Ideia Original</div>
          <div class="author-name">Marcos Paulo</div>
          <div class="author-email">zetecbs@gmail.com</div>
        </div>
        <div class="author-box">
          <div class="author-label">Desenvolvedor</div>
          <div class="author-name">Marley Adriano</div>
          <div class="author-email">marleyas@gmail.com</div>
        </div>        

        <div class="tech-stack">
          <span class="tech-badge">Electron</span>
          <span class="tech-badge">React</span>
          <span class="tech-badge">TypeScript</span>
          <span class="tech-badge">Tailwind CSS</span>
        </div>

        <div class="copyright">© 2026 - Todos os direitos reservados</div>

        <button class="close-btn" onclick="window.close()">Fechar</button>
      </div>
    </body>
    </html>
  `;

  // Carregar o conteúdo HTML
  aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutContent)}`);

  aboutWindow.once('ready-to-show', () => {
    aboutWindow?.show();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

function createApplicationMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Nova Página',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // Envia evento para o renderer criar nova página
            mainWindow?.webContents.send('menu-new-page');
          }
        },
        { type: 'separator' },
        {
          label: 'Importar JSON',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (!mainWindow) return;

            const result = await dialog.showOpenDialog(mainWindow, {
              title: 'Importar JSON Elementor',
              defaultPath: app.getPath('documents'),
              filters: [
                { name: 'Arquivos JSON', extensions: ['json'] },
                { name: 'Todos os arquivos', extensions: ['*'] }
              ],
              properties: ['openFile']
            });

            if (!result.canceled && result.filePaths.length > 0) {
              const fs = require('fs');
              const filePath = result.filePaths[0];
              try {
                const content = fs.readFileSync(filePath, 'utf-8');
                mainWindow.webContents.send('menu-import-file', content);
              } catch (error) {
                dialog.showErrorBox('Erro ao importar', `Não foi possível ler o arquivo: ${error}`);
              }
            }
          }
        },
        {
          label: 'Exportar JSON',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu-export');
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectAll', label: 'Selecionar Tudo' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload', label: 'Recarregar' },
        { role: 'forceReload', label: 'Recarregar Forçado' },
        { role: 'toggleDevTools', label: 'Ferramentas de Desenvolvedor' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Resetar Zoom' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Diminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' }
      ]
    },
    {
      label: 'Janela',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Fechar' }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre...',
          click: () => {
            createAboutWindow();
          }
        },
        { type: 'separator' },
        {
          label: 'Documentação',
          click: async () => {
            // Abrir README.md local
            const readmePath = path.join(app.getAppPath(), '..', '..', 'README.md');
            const { shell } = require('electron');
            const result = await shell.openPath(readmePath);
            if (result !== '') {
              // Se falhar ao abrir, mostrar mensagem
              dialog.showMessageBox(mainWindow!, {
                type: 'info',
                title: 'Documentação',
                message: 'Arquivo README.md não encontrado',
                detail: 'O arquivo de documentação não está disponível no momento.',
                buttons: ['OK']
              });
            }
          }
        }
      ]
    }
  ];

  // Ajustes específicos para macOS
  if (process.platform === 'darwin') {
    // Adicionar menu do app no início para macOS
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'Sobre' },
        { type: 'separator' },
        { role: 'services', label: 'Serviços' },
        { type: 'separator' },
        { role: 'hide', label: 'Ocultar' },
        { role: 'hideOthers', label: 'Ocultar Outros' },
        { role: 'unhide', label: 'Mostrar Todos' },
        { type: 'separator' },
        { role: 'quit', label: 'Sair' }
      ]
    });

    // Menu de janela específico para macOS
    const windowMenu = template.find(item => item.label === 'Janela') as Electron.MenuItemConstructorOptions;
    if (windowMenu && windowMenu.submenu) {
      (windowMenu.submenu as Electron.MenuItemConstructorOptions[]).push(
        { type: 'separator' },
        { role: 'front', label: 'Trazer para Frente' }
      );
    }
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Criar janela quando o app estiver pronto
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers para operações de arquivo
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
