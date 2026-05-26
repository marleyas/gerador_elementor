import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, LayoutGrid } from 'lucide-react';
import type { ElementorColumn, WidgetType } from '../types/elementor';
import { WIDGET_DEFINITIONS } from '../types/elementor';
import { HeadingWidget, TextEditorWidget, ButtonWidget, ImageWidget } from './widgets';
import { cn } from '../utils/cn';

interface ColumnProps {
  column: ElementorColumn;
  isSelected: boolean;
  selectedWidgetId: string | null;
  onSelect: () => void;
  onSelectWidget: (widgetId: string) => void;
  onAddWidget: (type: WidgetType) => void;
  onUpdateWidget: (widgetId: string, settings: Record<string, unknown>) => void;
  onDelete: () => void;
  onDeleteWidget: (widgetId: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onMoveWidget: (widgetId: string, direction: 'up' | 'down') => void;
}

export function Column({
  column,
  isSelected,
  selectedWidgetId,
  onSelect,
  onSelectWidget,
  onAddWidget,
  onUpdateWidget,
  onDelete,
  onDeleteWidget,
  onMove,
  onMoveWidget,
}: ColumnProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const bgStyle: React.CSSProperties = {};
  if (column.settings.background_color) {
    bgStyle.backgroundColor = column.settings.background_color;
  }

  const renderWidget = (widget: ElementorColumn['elements'][0]) => {
    const isWidgetSelected = selectedWidgetId === widget.id;

    const WidgetComponent = {
      heading: HeadingWidget,
      'text-editor': TextEditorWidget,
      button: ButtonWidget,
      image: ImageWidget,
    }[widget.widgetType];

    if (!WidgetComponent) return null;

    return (
      <div
        key={widget.id}
        className={cn(
          'widget-wrapper relative rounded-lg mb-3 group/widget',
          isWidgetSelected ? 'selected' : ''
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelectWidget(widget.id);
        }}
      >
        {/* Widget Actions */}
        <div className="widget-actions absolute -right-2 -top-2 z-20 flex items-center gap-0.5 opacity-0 group-hover/widget:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveWidget(widget.id, 'up'); }}
            className="p-1 bg-slate-700 rounded hover:bg-slate-600"
            title="Mover para cima"
          >
            <ChevronUp className="w-3 h-3 text-slate-300" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveWidget(widget.id, 'down'); }}
            className="p-1 bg-slate-700 rounded hover:bg-slate-600"
            title="Mover para baixo"
          >
            <ChevronDown className="w-3 h-3 text-slate-300" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteWidget(widget.id); }}
            className="p-1 bg-slate-700 rounded hover:bg-red-500/50"
            title="Excluir widget"
          >
            <Trash2 className="w-3 h-3 text-slate-300" />
          </button>
        </div>

        {/* Widget Content */}
        <div className="p-3">
          <WidgetComponent
            widget={widget}
            isEditing={isWidgetSelected}
            onUpdate={(settings) => onUpdateWidget(widget.id, settings)}
          />
        </div>
      </div>
    );
  };

  const handleAddWidget = (type: WidgetType) => {
    onAddWidget(type);
    setShowAddMenu(false);
  };

  return (
    <div
      className={cn(
        'column-wrapper relative rounded-lg flex flex-col',
        isSelected ? 'selected' : ''
      )}
      style={bgStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Column Header */}
      <div className="column-actions flex items-center justify-between px-2 py-1.5 border-b border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <div className="flex items-center gap-1">
          <GripVertical className="w-3 h-3 text-slate-500" />
          <LayoutGrid className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-500">{Math.round(column.settings._column_size)}%</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
            className="p-1 rounded hover:bg-slate-700"
            title="Mover para esquerda"
          >
            <ChevronUp className="w-3 h-3 text-slate-400 rotate-270" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
            className="p-1 rounded hover:bg-slate-700"
            title="Mover para direita"
          >
            <ChevronDown className="w-3 h-3 text-slate-400 rotate-270" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
            title="Excluir coluna"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Widgets Container */}
      <div className="p-2 flex-1">
        {column.elements.map(renderWidget)}

        {/* Add Widget Area */}
        <div className="relative mt-2">
          {!showAddMenu ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu(true);
              }}
              className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-lg text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Widget
            </button>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 z-30">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700">
                <span className="text-xs font-medium text-slate-300">Escolha um widget:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Cancelar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {WIDGET_DEFINITIONS.map((widget) => (
                  <button
                    key={widget.type}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddWidget(widget.type);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-700 hover:text-amber-400 rounded transition-colors"
                  >
                    <span className="w-4 h-4 flex items-center justify-center text-slate-500">
                      {widget.icon === 'Heading' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12h12M6 4v16M18 4v16M4 6h4m8 0h4M4 18h4m8 0h4"/></svg>}
                      {widget.icon === 'Type' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>}
                      {widget.icon === 'MousePointerClick' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 9l1.5-3l3-1.5l-9-3z"/></svg>}
                      {widget.icon === 'Image' && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
                    </span>
                    {widget.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
