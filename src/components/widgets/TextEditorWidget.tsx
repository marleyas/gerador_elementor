import type { ElementorWidget } from '../../types/elementor';

interface TextEditorWidgetProps {
  widget: ElementorWidget;
  isEditing: boolean;
  onUpdate: (settings: Partial<ElementorWidget['settings']>) => void;
}

export function TextEditorWidget({ widget, isEditing, onUpdate }: TextEditorWidgetProps) {
  const { editor, align = 'left' } = widget.settings;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-left';

  if (isEditing) {
    return (
      <div className="space-y-3 p-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Conteúdo</label>
          <textarea
            value={editor || ''}
            onChange={(e) => onUpdate({ editor: e.target.value })}
            className="w-full min-h-[120px] resize-y"
            placeholder="Digite o conteúdo..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Alinhamento</label>
          <select
            value={align}
            onChange={(e) => onUpdate({ align: e.target.value as 'left' | 'center' | 'right' })}
            className="w-full"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-slate-300 leading-relaxed ${alignClass}`}>
      {editor ? (
        <div dangerouslySetInnerHTML={{ __html: editor.replace(/\n/g, '<br/>') }} />
      ) : (
        <span className="text-slate-500 italic">Digite seu conteúdo...</span>
      )}
    </div>
  );
}
