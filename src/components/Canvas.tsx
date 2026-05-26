import { useRef } from 'react';
import type { ElementorSection } from '../types/elementor';
import { Section } from './Section';

interface CanvasProps {
  sections: ElementorSection[];
  selectedSectionId: string | null;
  selectedColumnId: string | null;
  selectedWidgetId: string | null;
  isPreview: boolean;
  onSelectSection: (id: string | null) => void;
  onSelectColumn: (id: string | null) => void;
  onSelectWidget: (id: string | null) => void;
  onUpdateSection: (section: ElementorSection) => void;
  onDeleteSection: (id: string) => void;
  onMoveSection: (id: string, direction: 'up' | 'down') => void;
}

export function Canvas({
  sections,
  selectedSectionId,
  selectedColumnId,
  selectedWidgetId,
  isPreview,
  onSelectSection,
  onSelectColumn,
  onSelectWidget,
  onUpdateSection,
  onDeleteSection,
  onMoveSection,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={canvasRef}
      className={`flex-1 overflow-y-auto canvas-area ${isPreview ? 'preview-mode' : ''}`}
      onClick={() => {
        if (!isPreview) {
          onSelectSection(null);
          onSelectColumn(null);
          onSelectWidget(null);
        }
      }}
    >
      <div className={`min-h-full py-8 ${
        sections.length === 0 ? 'flex items-center justify-center' : ''
      }`}>
        {sections.length === 0 ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700">
              <svg
                className="w-10 h-10 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">Canvas vazio</h2>
            <p className="text-slate-500 mb-6 max-w-sm">
              Comece criando uma nova seção clicando no botão "Nova Seção" na barra lateral
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 group">
            {sections.map((section, index) => (
              <Section
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                selectedColumnId={selectedColumnId}
                selectedWidgetId={selectedWidgetId}
                onSelect={() => {
                  onSelectSection(section.id);
                  onSelectColumn(null);
                  onSelectWidget(null);
                }}
                onSelectColumn={(columnId) => {
                  onSelectSection(section.id);
                  onSelectColumn(columnId);
                  onSelectWidget(null);
                }}
                onSelectWidget={(widgetId) => {
                  onSelectWidget(widgetId);
                }}
                onUpdate={onUpdateSection}
                onDelete={() => onDeleteSection(section.id)}
                onMoveUp={() => onMoveSection(section.id, 'up')}
                onMoveDown={() => onMoveSection(section.id, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < sections.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
