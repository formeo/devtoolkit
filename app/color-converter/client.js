'use client';
import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { inputClass, labelClass } from '../../components/styles';

export default function Client() {
  const [hex, setHex] = useState('#22d3ee');
  const [rgb, setRgb] = useState({ r: 34, g: 211, b: 238 });
  const [hsl, setHsl] = useState({ h: 188, s: 84, l: 53 });

  const hexToRgb = (h) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; case b: h = ((r - g) / d + 4) / 6; break; }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const updateFromHex = (h) => {
    setHex(h);
    const r = hexToRgb(h);
    if (r) { setRgb(r); setHsl(rgbToHsl(r.r, r.g, r.b)); }
  };

  return (
    <ToolLayout title="Color Converter" description="Convert between HEX, RGB, and HSL color formats with live preview.">
      <div className="flex gap-5 mb-5 flex-wrap items-center">
        <div className="w-24 h-24 rounded-xl border-2 border-dark-600 flex-shrink-0" style={{ background: hex }} />
        <div className="flex-1 min-w-[200px]">
          <label className={labelClass}>HEX</label>
          <input className={inputClass} value={hex} onChange={e => updateFromHex(e.target.value)} />
          <label className={`${labelClass} mt-3`}>RGB</label>
          <div className="font-mono text-sm text-dark-100">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          <label className={`${labelClass} mt-3`}>HSL</label>
          <div className="font-mono text-sm text-dark-100">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        </div>
      </div>
      <label className={labelClass}>Quick Palette</label>
      <div className="flex gap-2 flex-wrap">
        {['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f1f5f9', '#0f172a'].map(c => (
          <div key={c} onClick={() => updateFromHex(c)}
            className="w-9 h-9 rounded-lg cursor-pointer transition-all hover:scale-110"
            style={{ background: c, border: hex === c ? '2px solid #fff' : '2px solid #334155' }} />
        ))}
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About Color Conversion</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>HEX, RGB, and HSL are three common ways to represent colors in web development. HEX codes like #22d3ee are used in CSS, design tools, and brand guidelines. RGB (Red, Green, Blue) defines colors by mixing light channels from 0-255. HSL (Hue, Saturation, Lightness) is more intuitive for adjusting brightness and vibrancy.</p>
          <p>This converter instantly translates between all three formats with a live preview. Useful for CSS development, Tailwind color customization, Figma-to-code workflows, and accessibility contrast checks. All conversions happen locally in your browser.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
