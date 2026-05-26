import { useState } from 'react';
import {
  LayoutGrid,
  Type,
  Heading,
  Image,
  MousePointerClick,
  Plus,
  Layers,
  ChevronDown,
  ChevronRight,
  FileJson,
} from 'lucide-react';
import { COLUMN_LAYOUTS, WIDGET_DEFINITIONS } from '../types/elementor';
import type { LayoutType, WidgetType } from '../types/elementor';

interface SidebarProps {
  onAddSection: () => void;
  onAddColumnToSelected: (layout: LayoutType) => void;
  onAddWidgetToSelected: (type: WidgetType) => void;
  hasSelectedSection: boolean;
  hasSelectedColumn: boolean;
}

type Tab = 'sections' | 'widgets';

export function Sidebar({
  onAddSection,
  onAddColumnToSelected,
  onAddWidgetToSelected,
  hasSelectedSection,
  hasSelectedColumn,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('widgets');
  const [expandedLayouts, setExpandedLayouts] = useState(true);
  const [expandedWidgets, setExpandedWidgets] = useState(true);

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <FileJson className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm">Elementor JSON</h1>
            <p className="text-xs text-slate-500">Gerador Visual</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('widgets')}
          className={`flex-1 px-4 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'widgets'
              ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Widgets
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 px-4 py-3 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'sections'
              ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Estrutura
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'widgets' && (
          <div className="space-y-4">
            {/* Add Section Button */}
            <button
              onClick={onAddSection}
              className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-medium text-sm transition-all hover:shadow-lg hover:shadow-amber-500/20"
            >
              <Plus className="w-5 h-5" />
              Nova Seção
            </button>

            {/* Layouts */}
            <div>
              <button
                onClick={() => setExpandedLayouts(!expandedLayouts)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 hover:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Layouts de Coluna
                </span>
                {expandedLayouts ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedLayouts && (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(COLUMN_LAYOUTS).map(([key, layout]) => (
                    <button
                      key={key}
                      onClick={() =>
                        hasSelectedSection
                          ? onAddColumnToSelected(key as LayoutType)
                          : onAddSection()
                      }
                      disabled={!hasSelectedSection}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        hasSelectedSection
                          ? 'bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-750'
                          : 'bg-slate-800/50 border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                      title={
                        hasSelectedSection
                          ? layout.name
                          : 'Selecione uma seção primeiro'
                      }
                    >
                      <div className="flex gap-0.5 mb-2">
                        {layout.sizes.map((size, i) => (
                          <div
                            key={i}
                            className="h-6 bg-slate-600 rounded-sm"
                            style={{ width: `${size}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-300">{layout.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Widgets */}
            <div>
              <button
                onClick={() => setExpandedWidgets(!expandedWidgets)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 hover:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Widgets
                </span>
                {expandedWidgets ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedWidgets && (
                <div className="space-y-2">
                  {WIDGET_DEFINITIONS.map((widget) => (
                    <button
                      key={widget.type}
                      onClick={() =>
                        hasSelectedColumn
                          ? onAddWidgetToSelected(widget.type)
                          : undefined
                      }
                      disabled={!hasSelectedColumn}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        hasSelectedColumn
                          ? 'bg-slate-800 border-slate-700 hover:border-amber-500/50 hover:bg-slate-750 group'
                          : 'bg-slate-800/50 border-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                      title={
                        hasSelectedColumn
                          ? widget.description
                          : 'Selecione uma coluna primeiro'
                      }
                    >
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                        {widget.icon === 'Heading' && (
                          <Heading className="w-5 h-5 text-slate-400" />
                        )}
                        {widget.icon === 'Type' && (
                          <Type className="w-5 h-5 text-slate-400" />
                        )}
                        {widget.icon === 'MousePointerClick' && (
                          <MousePointerClick className="w-5 h-5 text-slate-400" />
                        )}
                        {widget.icon === 'Image' && (
                          <Image className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {widget.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {widget.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                Como usar
              </h3>
              <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                <li>Clique em "Nova Seção" para criar uma seção</li>
                <li>Adicione colunas à seção</li>
                <li>Selecione uma coluna e adicione widgets</li>
                <li>Edite o conteúdo clicando nos widgets</li>
                <li>Exporte o JSON quando terminar</li>
              </ol>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                Estrutura Elementor
              </h3>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500/30 rounded" />
                  <span>Seção (Section)</span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <div className="w-3 h-3 bg-blue-500/30 rounded" />
                  <span>Coluna (Column)</span>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <div className="w-3 h-3 bg-emerald-500/30 rounded" />
                  <span>Widget</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500 text-center">
        Clique em elementos para editar
      </div>
    </div>
  );
}
