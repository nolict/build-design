export const rgbToHex = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g, (_match, r, g, b, a) => {
    const toHex = (n: string) => parseInt(n).toString(16).padStart(2, '0');
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    if (a !== undefined && parseFloat(a) < 1) {
      const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
      return `${hex}${alpha}`.toUpperCase();
    }
    return hex;
  });
};
