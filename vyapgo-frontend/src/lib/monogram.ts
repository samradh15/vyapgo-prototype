// Simple monogram generator (SVG as data URL). No Firebase Storage needed.

export function initialsFromName(name?: string) {
    if (!name) return 'VG';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map(p => (p[0] || '').toUpperCase()).join('') || 'VG';
  }
  
  function gradientFromSeed(seed = 0) {
    const palettes: [string, string][] = [
      ['#f97316', '#f59e0b'], // orange → amber
      ['#f59e0b', '#10b981'], // amber → emerald
      ['#06b6d4', '#6366f1'], // cyan → indigo
      ['#ec4899', '#f97316'], // pink → orange
    ];
    return palettes[Math.abs(seed) % palettes.length];
  }
  
  export function monogramSvgDataUrl(name?: string, seed = 0) {
    const initials = initialsFromName(name);
    const [c1, c2] = gradientFromSeed(seed);
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
          </linearGradient>
        </defs>
        <rect width='160' height='160' rx='28' fill='url(#g)'/>
        <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle'
              font-family='Inter, ui-sans-serif, system-ui' font-weight='800' font-size='64' fill='white'>${initials}</text>
      </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }