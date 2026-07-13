// Small display formatters shared across screens.
const WAY_DECIMALS = 18;

// Wei (bigint-like string) -> human WAY with sensible precision.
export function formatWay(weiStr, decimals = WAY_DECIMALS) {
  if (!weiStr) return '0';
  const neg = weiStr.startsWith('-');
  const s = neg ? weiStr.slice(1) : weiStr;
  // s is integer string of wei
  let whole = s.length > decimals ? s.slice(0, s.length - decimals) : '0';
  let frac = s.length > decimals ? s.slice(s.length - decimals) : s.padStart(decimals, '0');
  frac = frac.replace(/0+$/, ''); // trim trailing zeros
  let out = whole;
  if (frac) out += '.' + frac;
  // trim to 4 significant fractional digits for display
  if (out.includes('.')) {
    const [w, f] = out.split('.');
    out = w + '.' + f.slice(0, 4);
  }
  return (neg ? '-' : '') + out;
}

// Relative time from epoch ms.
export function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24);
  if (d < 30) return d + 'd ago';
  const mo = Math.floor(d / 30);
  if (mo < 12) return mo + 'mo ago';
  return Math.floor(mo / 12) + 'y ago';
}

// Shorten an address for display.
export function shortAddr(a, head = 10, tail = 8) {
  if (!a) return '';
  return a.slice(0, head) + '…' + a.slice(-tail);
}
