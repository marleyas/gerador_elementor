import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Download,
  Upload,
  Eye,
  EyeOff,
  FileJson,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Code,
} from 'lucide-react';
import type { ElementorSection, ElementorColumn, ElementorWidget } from './types/elementor';
import { generateElementId } from './utils/id-generator';
import { exportToJson, downloadJson, importFromJson, copyToClipboard } from './utils/export-import';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';

export default function App() {
  // State
  const [sections, setSections] = useState<ElementorSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageTitle, setPageTitle] = useState('Minha Página Elementor');

  // Derived state
  const selectedSection = useMemo(() =>
    sections.find((s) => s.id === selectedSectionId) || null,
    [sections, selectedSectionId]
  );

  const selectedColumn = useMemo(() => {
    if (!selectedSection) return null;
    return selectedSection.elements.find((c) => c.id === selectedColumnId) || null;
  }, [selectedSection, selectedColumnId]);

  const selectedWidget = useMemo(() => {
    if (!selectedColumn) return null;
    return selectedColumn.elements.find((w) => w.id === selectedWidgetId) || null;
  }, [selectedColumn, selectedWidgetId]);

  // Actions
  const addSection = useCallback(() => {
    const newSection: ElementorSection = {
      id: generateElementId(),
      elType: 'section',
      settings: { layout: 'full_width' },
      elements: [],
      isInner: false,
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.id);
    setSelectedColumnId(null);
    setSelectedWidgetId(null);
  }, []);

  const updateSection = useCallback((updatedSection: ElementorSection) => {
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
      setSelectedColumnId(null);
      setSelectedWidgetId(null);
    }
  }, [selectedSectionId]);

  const moveSection = useCallback((id: string, direction: 'up' | 'down') => {
    setSections((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newSections = [...prev];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
      return newSections;
    });
  }, []);

  const updateColumn = useCallback((updatedColumn: ElementorColumn) => {
    if (!selectedSection) return;

    const updatedSection = {
      ...selectedSection,
      elements: selectedSection.elements.map((c) =>
        c.id === updatedColumn.id ? updatedColumn : c
      ),
    };
    updateSection(updatedSection);
  }, [selectedSection, updateSection]);

  const deleteColumn = useCallback(() => {
    if (!selectedSection || !selectedColumnId) return;

    const updatedSection = {
      ...selectedSection,
      elements: selectedSection.elements.filter((c) => c.id !== selectedColumnId),
    };
    updateSection(updatedSection);
    setSelectedColumnId(null);
    setSelectedWidgetId(null);
  }, [selectedSection, selectedColumnId, updateSection]);

  const updateWidget = useCallback((updatedWidget: ElementorWidget) => {
    if (!selectedSection || !selectedColumn) return;

    const updatedColumn = {
      ...selectedColumn,
      elements: selectedColumn.elements.map((w) =>
        w.id === updatedWidget.id ? updatedWidget : w
      ),
    };
    updateColumn(updatedColumn);
  }, [selectedSection, selectedColumn, updateColumn]);

  const deleteWidget = useCallback(() => {
    if (!selectedSection || !selectedColumn || !selectedWidgetId) return;

    const updatedColumn = {
      ...selectedColumn,
      elements: selectedColumn.elements.filter((w) => w.id !== selectedWidgetId),
    };
    updateColumn(updatedColumn);
    setSelectedWidgetId(null);
  }, [selectedSection, selectedColumn, selectedWidgetId, updateColumn]);

  const handleExport = useCallback(() => {
    const json = exportToJson(sections, pageTitle);
    downloadJson(json, `elementor-${pageTitle.toLowerCase().replace(/\s+/g, '-')}.json`);
  }, [sections, pageTitle]);

  const handleCopyJson = useCallback(async () => {
    const json = exportToJson(sections, pageTitle);
    const success = await copyToClipboard(json);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [sections, pageTitle]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const data = importFromJson(content);
      if (data) {
        setSections(data.content);
        setPageTitle(data.title || 'Página Importada');
        setSelectedSectionId(null);
        setSelectedColumnId(null);
        setSelectedWidgetId(null);
      } else {
        alert('Erro ao importar arquivo JSON. Verifique o formato.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, []);

  const clearAll = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
      setSections([]);
      setSelectedSectionId(null);
      setSelectedColumnId(null);
      setSelectedWidgetId(null);
    }
  }, []);

  const jsonPreview = useMemo(() =>
    exportToJson(sections, pageTitle),
    [sections, pageTitle]
  );

  // IPC handlers para comandos do menu Electron
  useEffect(() => {
    // Verificar se está rodando no Electron
    const isElectron = typeof window !== 'undefined' &&
      window.process && (window.process as any).versions && (window.process as any).versions.electron;

    if (isElectron) {
      try {
        const { ipcRenderer } = require('electron');

        // Handler para Nova Página (Ctrl+N)
        const onNewPage = () => {
          clearAll();
        };

        // Handler para Importar JSON (Ctrl+O) - recebe conteúdo do arquivo
        const onImportFile = (_event: any, fileContent: string) => {
          const data = importFromJson(fileContent);
          if (data) {
            setSections(data.content);
            setPageTitle(data.title || 'Página Importada');
            setSelectedSectionId(null);
            setSelectedColumnId(null);
            setSelectedWidgetId(null);
          } else {
            alert('Erro ao importar arquivo JSON. Verifique o formato.');
          }
        };

        // Handler para Exportar JSON (Ctrl+S)
        const onExportMenu = () => {
          handleExport();
        };

        // Registrar listeners
        ipcRenderer.on('menu-new-page', onNewPage);
        ipcRenderer.on('menu-import-file', onImportFile);
        ipcRenderer.on('menu-export', onExportMenu);

        // Cleanup
        return () => {
          ipcRenderer.removeListener('menu-new-page', onNewPage);
          ipcRenderer.removeListener('menu-import-file', onImportFile);
          ipcRenderer.removeListener('menu-export', onExportMenu);
        };
      } catch (error) {
        console.log('Electron IPC não disponível no modo desenvolvimento');
      }
    }
  }, [clearAll, handleExport]);

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <FileJson className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm">Gerador JSON Elementor</h1>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-700 mx-2" />

          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-300 focus:outline-none focus:ring-0 w-48"
            placeholder="Título da página..."
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`btn-secondary text-xs ${isPreview ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : ''}`}
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? 'Editar' : 'Preview'}
          </button>

          <button
            onClick={() => setShowJsonPanel(!showJsonPanel)}
            className={`btn-secondary text-xs ${showJsonPanel ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : ''}`}
          >
            <Code className="w-4 h-4" />
            JSON
          </button>

          <div className="h-6 w-px bg-slate-700 mx-2" />

          <label className="btn-secondary text-xs cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar
            <input
              id="import-json-input"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button onClick={handleExport} className="btn-primary text-xs">
            <Download className="w-4 h-4" />
            Exportar JSON
          </button>

          <button
            onClick={clearAll}
            className="btn-danger text-xs"
            title="Limpar tudo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onAddSection={addSection}
          onAddColumnToSelected={(_layout) => {
            // Handled by Section component
          }}
          onAddWidgetToSelected={(_type) => {
            // Handled by Column component
          }}
          hasSelectedSection={!!selectedSectionId}
          hasSelectedColumn={!!selectedColumnId}
        />

        {/* Canvas */}
        <Canvas
          sections={sections}
          selectedSectionId={selectedSectionId}
          selectedColumnId={selectedColumnId}
          selectedWidgetId={selectedWidgetId}
          isPreview={isPreview}
          onSelectSection={setSelectedSectionId}
          onSelectColumn={setSelectedColumnId}
          onSelectWidget={setSelectedWidgetId}
          onUpdateSection={updateSection}
          onDeleteSection={deleteSection}
          onMoveSection={moveSection}
        />

        {/* JSON Panel */}
        {showJsonPanel && (
          <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                JSON Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="btn-secondary text-xs py-1 px-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copiar
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowJsonPanel(false)}
                  className="p-1 hover:bg-slate-800 rounded"
                >
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="json-preview text-slate-300">
                {jsonPreview}
              </pre>
            </div>
          </div>
        )}

        {/* Property Panel */}
        {!showJsonPanel && (
          <PropertyPanel
            selectedSection={selectedSection}
            selectedColumn={selectedColumn}
            selectedWidget={selectedWidget}
            onUpdateSection={updateSection}
            onUpdateColumn={updateColumn}
            onUpdateWidget={updateWidget}
            onDeleteSection={deleteColumn}
            onDeleteColumn={deleteColumn}
            onDeleteWidget={deleteWidget}
            onClose={() => {
              setSelectedWidgetId(null);
              setSelectedColumnId(null);
              setSelectedSectionId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
