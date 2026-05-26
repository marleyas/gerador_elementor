import { X, Trash2, ChevronUp } from 'lucide-react';
import type { ElementorSection, ElementorColumn, ElementorWidget } from '../types/elementor';
import { HeadingWidget, TextEditorWidget, ButtonWidget, ImageWidget } from './widgets';

interface PropertyPanelProps {
  selectedSection: ElementorSection | null;
  selectedColumn: ElementorColumn | null;
  selectedWidget: ElementorWidget | null;
  onUpdateSection: (section: ElementorSection) => void;
  onUpdateColumn: (column: ElementorColumn) => void;
  onUpdateWidget: (widget: ElementorWidget) => void;
  onDeleteSection: () => void;
  onDeleteColumn: () => void;
  onDeleteWidget: () => void;
  onClose: () => void;
}

export function PropertyPanel({
  selectedSection,
  selectedColumn,
  selectedWidget,
  onUpdateSection,
  onUpdateColumn,
  onUpdateWidget,
  onDeleteSection,
  onDeleteColumn,
  onDeleteWidget,
  onClose,
}: PropertyPanelProps) {
  const renderSectionProperties = () => {
    if (!selectedSection) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Propriedades da Seção</h3>
          <button onClick={onDeleteSection} className="btn-danger py-1 px-2 text-xs">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Layout</label>
          <select
            value={selectedSection.settings.layout || 'full_width'}
            onChange={(e) =>
              onUpdateSection({
                ...selectedSection,
                settings: { ...selectedSection.settings, layout: e.target.value as 'full_width' | 'boxed' },
              })
            }
            className="w-full"
          >
            <option value="full_width">Largura Total</option>
            <option value="boxed">Contido (Boxed)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Cor de Fundo</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedSection.settings.background_color || '#ffffff'}
              onChange={(e) =>
                onUpdateSection({
                  ...selectedSection,
                  settings: { ...selectedSection.settings, background_color: e.target.value },
                })
              }
              className="w-12"
            />
            <input
              type="text"
              value={selectedSection.settings.background_color || ''}
              onChange={(e) =>
                onUpdateSection({
                  ...selectedSection,
                  settings: { ...selectedSection.settings, background_color: e.target.value },
                })
              }
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Padding Vertical</label>
          <select
            value={(selectedSection.settings.padding as string) || 'medium'}
            onChange={(e) =>
              onUpdateSection({
                ...selectedSection,
                settings: { ...selectedSection.settings, padding: e.target.value },
              })
            }
            className="w-full"
          >
            <option value="none">Nenhum</option>
            <option value="small">Pequeno</option>
            <option value="medium">Médio</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>
    );
  };

  const renderColumnProperties = () => {
    if (!selectedColumn) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Propriedades da Coluna</h3>
          <button onClick={onDeleteColumn} className="btn-danger py-1 px-2 text-xs">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Largura (%)</label>
          <input
            type="number"
            min="10"
            max="100"
            value={Math.round(selectedColumn.settings._column_size)}
            onChange={(e) =>
              onUpdateColumn({
                ...selectedColumn,
                settings: { ...selectedColumn.settings, _column_size: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Cor de Fundo</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedColumn.settings.background_color || '#ffffff'}
              onChange={(e) =>
                onUpdateColumn({
                  ...selectedColumn,
                  settings: { ...selectedColumn.settings, background_color: e.target.value },
                })
              }
              className="w-12"
            />
            <input
              type="text"
              value={selectedColumn.settings.background_color || ''}
              onChange={(e) =>
                onUpdateColumn({
                  ...selectedColumn,
                  settings: { ...selectedColumn.settings, background_color: e.target.value },
                })
              }
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderWidgetProperties = () => {
    if (!selectedWidget) return null;

    const handleUpdate = (settings: Partial<ElementorWidget['settings']>) => {
      onUpdateWidget({
        ...selectedWidget,
        settings: { ...selectedWidget.settings, ...settings },
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            Editar {selectedWidget.widgetType === 'heading' && 'Título'}
            {selectedWidget.widgetType === 'text-editor' && 'Texto'}
            {selectedWidget.widgetType === 'button' && 'Botão'}
            {selectedWidget.widgetType === 'image' && 'Imagem'}
          </h3>
          <button onClick={onDeleteWidget} className="btn-danger py-1 px-2 text-xs">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700">
          {selectedWidget.widgetType === 'heading' && (
            <HeadingWidget
              widget={selectedWidget}
              isEditing={true}
              onUpdate={handleUpdate}
            />
          )}
          {selectedWidget.widgetType === 'text-editor' && (
            <TextEditorWidget
              widget={selectedWidget}
              isEditing={true}
              onUpdate={handleUpdate}
            />
          )}
          {selectedWidget.widgetType === 'button' && (
            <ButtonWidget
              widget={selectedWidget}
              isEditing={true}
              onUpdate={handleUpdate}
            />
          )}
          {selectedWidget.widgetType === 'image' && (
            <ImageWidget
              widget={selectedWidget}
              isEditing={true}
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    );
  };

  const hasSelection = selectedSection || selectedColumn || selectedWidget;

  if (!hasSelection) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChevronUp className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-slate-300 font-medium mb-2">Nenhum elemento selecionado</h3>
            <p className="text-sm text-slate-500">
              Clique em uma seção, coluna ou widget para editar suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Propriedades
        </span>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedWidget && renderWidgetProperties()}
        {selectedColumn && !selectedWidget && renderColumnProperties()}
        {selectedSection && !selectedColumn && !selectedWidget && renderSectionProperties()}
      </div>
    </div>
  );
}
