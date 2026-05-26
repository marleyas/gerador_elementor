import type { ElementorWidget } from '../../types/elementor';

interface ButtonWidgetProps {
  widget: ElementorWidget;
  isEditing: boolean;
  onUpdate: (settings: Partial<ElementorWidget['settings']>) => void;
}

export function ButtonWidget({ widget, isEditing, onUpdate }: ButtonWidgetProps) {
  const { text, link, align = 'left', size = 'md' } = widget.settings;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-left';

  const sizeClass = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  }[size];

  if (isEditing) {
    return (
      <div className="space-y-3 p-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Texto do Botão</label>
          <input
            type="text"
            value={text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full"
            placeholder="Texto do botão..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">URL do Link</label>
          <input
            type="text"
            value={link?.url || ''}
            onChange={(e) => onUpdate({ link: { url: e.target.value } })}
            className="w-full"
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tamanho</label>
            <select
              value={size}
              onChange={(e) => onUpdate({ size: e.target.value as ElementorWidget['settings']['size'] })}
              className="w-full"
            >
              <option value="sm">Pequeno</option>
              <option value="md">Médio</option>
              <option value="lg">Grande</option>
              <option value="xl">Extra Grande</option>
            </select>
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
      </div>
    );
  }

  return (
    <div className={alignClass}>
      <a
        href={link?.url || '#'}
        className={`inline-block bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 transition-colors ${sizeClass}`}
      >
        {text || 'Botão'}
      </a>
    </div>
  );
}
