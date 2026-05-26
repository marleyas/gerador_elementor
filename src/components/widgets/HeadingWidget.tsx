import type { ElementorWidget } from '../../types/elementor';

interface HeadingWidgetProps {
  widget: ElementorWidget;
  isEditing: boolean;
  onUpdate: (settings: Partial<ElementorWidget['settings']>) => void;
}

export function HeadingWidget({ widget, isEditing, onUpdate }: HeadingWidgetProps) {
  const { title, html_tag = 'h2', align = 'left' } = widget.settings;
  const Tag = html_tag;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-left';

  if (isEditing) {
    return (
      <div className="space-y-3 p-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Texto do Título</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full"
            placeholder="Digite o título..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tag HTML</label>
            <select
              value={html_tag}
              onChange={(e) => onUpdate({ html_tag: e.target.value as ElementorWidget['settings']['html_tag'] })}
              className="w-full"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
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

  const sizeClass = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
  }[html_tag];

  return (
    <Tag className={`${sizeClass} ${alignClass} text-slate-100 leading-tight`}>
      {title || 'Título'}
    </Tag>
  );
}
