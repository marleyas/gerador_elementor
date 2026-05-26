import type { ElementorWidget } from '../../types/elementor';

interface ImageWidgetProps {
  widget: ElementorWidget;
  isEditing: boolean;
  onUpdate: (settings: Partial<ElementorWidget['settings']>) => void;
}

export function ImageWidget({ widget, isEditing, onUpdate }: ImageWidgetProps) {
  const { image, align = 'center' } = widget.settings;

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align] || 'text-center';

  if (isEditing) {
    return (
      <div className="space-y-3 p-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">URL da Imagem</label>
          <input
            type="text"
            value={image?.url || ''}
            onChange={(e) => onUpdate({ image: { ...image, url: e.target.value } })}
            className="w-full"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Texto Alternativo (ALT)</label>
          <input
            type="text"
            value={image?.alt || ''}
            onChange={(e) => onUpdate({ image: { ...image, alt: e.target.value } })}
            className="w-full"
            placeholder="Descrição da imagem..."
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
        {image?.url && (
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Pré-visualização:</p>
            <img
              src={image.url}
              alt={image?.alt || 'Preview'}
              className="max-h-32 mx-auto rounded object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (!image?.url) {
    return (
      <div className={`${alignClass} py-8`}>
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg text-slate-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Nenhuma imagem definida</span>
        </div>
      </div>
    );
  }

  return (
    <div className={alignClass}>
      <img
        src={image.url}
        alt={image?.alt || ''}
        className="max-w-full h-auto rounded-lg inline-block"
      />
    </div>
  );
}
