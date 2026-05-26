import type { ElementorContent, ElementorSection } from '../types/elementor';

export function exportToJson(content: ElementorSection[], title: string = 'Página Elementor'): string {
  const elementorData: ElementorContent = {
    content,
    page_settings: [],
    version: '0.4',
    title,
    type: 'page',
  };

  return JSON.stringify(elementorData, null, 2);
}

export function downloadJson(jsonString: string, filename: string = 'elementor-export.json'): void {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJson(jsonString: string): ElementorContent | null {
  try {
    const parsed = JSON.parse(jsonString);

    if (parsed.content && Array.isArray(parsed.content)) {
      return parsed as ElementorContent;
    }

    if (Array.isArray(parsed)) {
      return {
        content: parsed as ElementorSection[],
        page_settings: [],
        version: '0.4',
        title: 'Página Importada',
        type: 'page',
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}
