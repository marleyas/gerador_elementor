export interface ElementorSettings {
  layout?: 'full_width' | 'boxed';
  background_color?: string;
  background_image?: {
    url: string;
    id?: string;
    size?: string;
  };
  [key: string]: unknown;
}

export interface ElementorWidget {
  id: string;
  elType: 'widget';
  widgetType: 'heading' | 'text-editor' | 'button' | 'image';
  settings: {
    title?: string;
    editor?: string;
    text?: string;
    link?: { url?: string };
    image?: {
      url?: string;
      id?: string;
      size?: string;
      alt?: string;
    };
    selected_icon?: {
      value?: string;
      library?: string;
    };
    align?: 'left' | 'center' | 'right';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    html_tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    [key: string]: unknown;
  };
  elements: [];
  isInner: boolean;
}

export interface ElementorColumn {
  id: string;
  elType: 'column';
  settings: {
    _column_size: number;
    background_color?: string;
    [key: string]: unknown;
  };
  elements: ElementorWidget[];
  isInner: boolean;
}

export interface ElementorSection {
  id: string;
  elType: 'section';
  settings: ElementorSettings;
  elements: ElementorColumn[];
  isInner: boolean;
}

export interface ElementorContent {
  content: ElementorSection[];
  page_settings: unknown[];
  version: string;
  title: string;
  type: string;
}

export type LayoutType = '100' | '50-50' | '33-33-33' | '25-75' | '75-25' | '33-66' | '66-33';

export interface ColumnLayout {
  name: string;
  sizes: number[];
  icon: string;
}

export const COLUMN_LAYOUTS: Record<LayoutType, ColumnLayout> = {
  '100': { name: '1 Coluna', sizes: [100], icon: '□' },
  '50-50': { name: '2 Colunas (50/50)', sizes: [50, 50], icon: '▪▪' },
  '33-33-33': { name: '3 Colunas (33/33/33)', sizes: [33.333, 33.333, 33.334], icon: '▪▪▪' },
  '25-75': { name: '2 Colunas (25/75)', sizes: [25, 75], icon: '▫▪' },
  '75-25': { name: '2 Colunas (75/25)', sizes: [75, 25], icon: '▪▫' },
  '33-66': { name: '2 Colunas (33/66)', sizes: [33.333, 66.667], icon: '▫▪' },
  '66-33': { name: '2 Colunas (66/33)', sizes: [66.667, 33.333], icon: '▪▫' },
};

export type WidgetType = 'heading' | 'text-editor' | 'button' | 'image';

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  icon: string;
  description: string;
  defaultSettings: ElementorWidget['settings'];
}

export const WIDGET_DEFINITIONS: WidgetDefinition[] = [
  {
    type: 'heading',
    name: 'Título',
    icon: 'Heading',
    description: 'Adicione um título H1-H6',
    defaultSettings: {
      title: 'Digite seu título aqui',
      html_tag: 'h2',
      align: 'left',
    },
  },
  {
    type: 'text-editor',
    name: 'Texto',
    icon: 'Type',
    description: 'Editor de texto rico',
    defaultSettings: {
      editor: 'Digite seu conteúdo aqui...',
      align: 'left',
    },
  },
  {
    type: 'button',
    name: 'Botão',
    icon: 'MousePointerClick',
    description: 'Botão clicável com link',
    defaultSettings: {
      text: 'Clique aqui',
      link: { url: '#' },
      align: 'left',
      size: 'md',
    },
  },
  {
    type: 'image',
    name: 'Imagem',
    icon: 'Image',
    description: 'Adicione uma imagem',
    defaultSettings: {
      image: { url: '', size: 'full' },
      align: 'center',
    },
  },
];
