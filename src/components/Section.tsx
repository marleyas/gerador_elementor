import { ChevronUp, ChevronDown, Trash2, Settings, GripVertical } from 'lucide-react';
import type { ElementorSection, ElementorWidget, LayoutType, WidgetType } from '../types/elementor';
import { COLUMN_LAYOUTS, WIDGET_DEFINITIONS } from '../types/elementor';
import { generateElementId } from '../utils/id-generator';
import { Column } from './Column';
import { cn } from '../utils/cn';

interface SectionProps {
  section: ElementorSection;
  isSelected: boolean;
  selectedColumnId: string | null;
  selectedWidgetId: string | null;
  onSelect: () => void;
  onSelectColumn: (columnId: string) => void;
  onSelectWidget: (widgetId: string) => void;
  onUpdate: (section: ElementorSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function Section({
  section,
  isSelected,
  selectedColumnId,
  selectedWidgetId,
  onSelect,
  onSelectColumn,
  onSelectWidget,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SectionProps) {
  const addColumn = (layoutType: LayoutType) => {
    const layout = COLUMN_LAYOUTS[layoutType];
    const newColumns = layout.sizes.map((size) => ({
      id: generateElementId(),
      elType: 'column' as const,
      settings: { _column_size: size },
      elements: [],
      isInner: false,
    }));

    onUpdate({
      ...section,
      elements: [...section.elements, ...newColumns],
    });
  };

  const addWidgetToColumn = (columnId: string, widgetType: WidgetType) => {
    const widgetDef = WIDGET_DEFINITIONS.find((w) => w.type === widgetType);
    if (!widgetDef) return;

    const newWidget: ElementorWidget = {
      id: generateElementId(),
      elType: 'widget',
      widgetType,
      settings: { ...widgetDef.defaultSettings },
      elements: [],
      isInner: false,
    };

    const updatedColumns = section.elements.map((col) => {
      if (col.id === columnId) {
        return { ...col, elements: [...col.elements, newWidget] };
      }
      return col;
    });

    onUpdate({ ...section, elements: updatedColumns });
  };

  const updateWidget = (columnId: string, widgetId: string, settings: Record<string, unknown>) => {
    const updatedColumns = section.elements.map((col) => {
      if (col.id === columnId) {
        const updatedWidgets = col.elements.map((widget) => {
          if (widget.id === widgetId) {
            return { ...widget, settings: { ...widget.settings, ...settings } };
          }
          return widget;
        });
        return { ...col, elements: updatedWidgets };
      }
      return col;
    });
    onUpdate({ ...section, elements: updatedColumns });
  };

  const deleteColumn = (columnId: string) => {
    onUpdate({
      ...section,
      elements: section.elements.filter((col) => col.id !== columnId),
    });
  };

  const deleteWidget = (columnId: string, widgetId: string) => {
    const updatedColumns = section.elements.map((col) => {
      if (col.id === columnId) {
        return { ...col, elements: col.elements.filter((w) => w.id !== widgetId) };
      }
      return col;
    });
    onUpdate({ ...section, elements: updatedColumns });
  };

  const moveColumn = (columnId: string, direction: 'up' | 'down') => {
    const index = section.elements.findIndex((col) => col.id === columnId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= section.elements.length) return;

    const newColumns = [...section.elements];
    [newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]];
    onUpdate({ ...section, elements: newColumns });
  };

  const moveWidget = (columnId: string, widgetId: string, direction: 'up' | 'down') => {
    const column = section.elements.find((col) => col.id === columnId);
    if (!column) return;

    const index = column.elements.findIndex((w) => w.id === widgetId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= column.elements.length) return;

    const newWidgets = [...column.elements];
    [newWidgets[index], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[index]];

    const updatedColumns = section.elements.map((col) => {
      if (col.id === columnId) {
        return { ...col, elements: newWidgets };
      }
      return col;
    });

    onUpdate({ ...section, elements: updatedColumns });
  };

  const bgStyle: React.CSSProperties = {};
  if (section.settings.background_color) {
    bgStyle.backgroundColor = section.settings.background_color;
  }

  return (
    <div
      className={cn(
        'section-wrapper relative rounded-xl mb-6',
        isSelected ? 'selected' : 'border border-slate-800'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Section Actions Bar */}
      <div className="section-actions absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-slate-800/90 border-b border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1">
          <GripVertical className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300">Seção</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={!canMoveUp}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover para cima"
          >
            <ChevronUp className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={!canMoveDown}
            className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover para baixo"
          >
            <ChevronDown className="w-4 h-4 text-slate-300" />
          </button>
          <div className="w-px h-4 bg-slate-600 mx-1" />
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={cn(
              "p-1 rounded",
              isSelected ? "bg-amber-500/20 text-amber-400" : "hover:bg-slate-700 text-slate-400"
            )}
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
            title="Excluir seção"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section Content */}
      <div
        className="pt-12 pb-6 px-6 min-h-[140px]"
        style={bgStyle}
      >
        {section.elements.length === 0 ? (
          <div className="empty-state rounded-lg p-8 text-center">
            <p className="text-slate-500 text-sm mb-4">Seção vazia. Adicione colunas:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(COLUMN_LAYOUTS).map(([key, layout]) => (
                <button
                  key={key}
                  onClick={(e) => { e.stopPropagation(); addColumn(key as LayoutType); }}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  {layout.icon} {layout.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-3">
            {section.elements.map((column) => (
              <div
                key={column.id}
                className="px-3"
                style={{ width: `${column.settings._column_size}%` }}
              >
                <Column
                  column={column}
                  isSelected={selectedColumnId === column.id}
                  selectedWidgetId={selectedWidgetId}
                  onSelect={() => onSelectColumn(column.id)}
                  onSelectWidget={onSelectWidget}
                  onAddWidget={(type) => addWidgetToColumn(column.id, type)}
                  onUpdateWidget={(widgetId, settings) => updateWidget(column.id, widgetId, settings)}
                  onDelete={() => deleteColumn(column.id)}
                  onDeleteWidget={(widgetId) => deleteWidget(column.id, widgetId)}
                  onMove={(direction) => moveColumn(column.id, direction)}
                  onMoveWidget={(widgetId, direction) => moveWidget(column.id, widgetId, direction)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Column Area (when section has columns) */}
      {section.elements.length > 0 && (
        <div className="add-button px-6 pb-4">
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-500">Adicionar colunas:</span>
            {Object.entries(COLUMN_LAYOUTS).map(([key, layout]) => (
              <button
                key={key}
                onClick={(e) => { e.stopPropagation(); addColumn(key as LayoutType); }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                title={layout.name}
              >
                {layout.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
