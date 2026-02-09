'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, inputClass, btnPrimary, btnSecondary, labelClass, selectClass } from '../../components/styles';

const PRESETS = {
  text: { label: 'Text / URL', placeholder: 'https://devtoolkit.site', template: (v) => v },
  wifi: { label: 'Wi-Fi', placeholder: '', template: (v, opts) => `WIFI:T:${opts.encryption};S:${opts.ssid};P:${opts.wifiPass};;` },
  email: { label: 'Email', placeholder: '', template: (v, opts) => `mailto:${opts.email}?subject=${encodeURIComponent(opts.subject)}&body=${encodeURIComponent(opts.body)}` },
  phone: { label: 'Phone', placeholder: '+1234567890', template: (v) => `tel:${v}` },
};

export default function Client() {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('https://devtoolkit.site');
  const [wifiOpts, setWifiOpts] = useState({ ssid: 'MyNetwork', wifiPass: 'password123', encryption: 'WPA' });
  const [emailOpts, setEmailOpts] = useState({ email: 'hello@example.com', subject: 'Hello', body: '' });
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState('M');
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState('');

  const getContent = useCallback(() => {
    if (mode === 'wifi') return PRESETS.wifi.template(null, wifiOpts);
    if (mode === 'email') return PRESETS.email.template(null, emailOpts);
    if (mode === 'phone') return PRESETS.phone.template(text);
    return text;
  }, [mode, text, wifiOpts, emailOpts]);

  useEffect(() => {
    const content = getContent();
    if (!content) return;

    QRCode.toCanvas(canvasRef.current, content, {
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorLevel,
    }, (err) => {
      if (!err && canvasRef.current) {
        setDataUrl(canvasRef.current.toDataURL('image/png'));
      }
    });
  }, [getContent, size, fgColor, bgColor, errorLevel]);

  const downloadPNG = () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const downloadSVG = async () => {
    const content = getContent();
    const svg = await QRCode.toString(content, {
      type: 'svg',
      width: size,
      margin: 2,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorLevel,
    });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.svg';
    a.click();
  };

  return (
    <ToolLayout title="QR Code Generator" description="Generate QR codes for URLs, text, Wi-Fi networks, email, and phone numbers. Download as PNG or SVG.">
      <div className="flex gap-6 flex-wrap">
        {/* Left: Controls */}
        <div className="flex-1 min-w-[300px]">
          {/* Mode selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {Object.entries(PRESETS).map(([key, { label }]) => (
              <button key={key} onClick={() => setMode(key)}
                className={mode === key ? btnPrimary : btnSecondary}>
                {label}
              </button>
            ))}
          </div>

          {/* Input fields based on mode */}
          {mode === 'text' && (
            <div className="mb-4">
              <label className={labelClass}>URL or Text</label>
              <textarea className={textareaClass} value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="https://devtoolkit.site" />
            </div>
          )}

          {mode === 'phone' && (
            <div className="mb-4">
              <label className={labelClass}>Phone Number</label>
              <input className={inputClass} value={text} onChange={e => setText(e.target.value)} placeholder="+1234567890" />
            </div>
          )}

          {mode === 'wifi' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className={labelClass}>Network Name (SSID)</label>
                <input className={inputClass} value={wifiOpts.ssid} onChange={e => setWifiOpts(p => ({ ...p, ssid: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input className={inputClass} value={wifiOpts.wifiPass} onChange={e => setWifiOpts(p => ({ ...p, wifiPass: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Encryption</label>
                <select value={wifiOpts.encryption} onChange={e => setWifiOpts(p => ({ ...p, encryption: e.target.value }))} className={selectClass}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className={labelClass}>Email Address</label>
                <input className={inputClass} value={emailOpts.email} onChange={e => setEmailOpts(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Subject</label>
                <input className={inputClass} value={emailOpts.subject} onChange={e => setEmailOpts(p => ({ ...p, subject: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>Body (optional)</label>
                <textarea className={textareaClass} value={emailOpts.body} onChange={e => setEmailOpts(p => ({ ...p, body: e.target.value }))} rows={2} />
              </div>
            </div>
          )}

          {/* Customization */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-4 space-y-3">
            <div className="text-xs font-semibold text-dark-400 tracking-wider uppercase mb-2">Customize</div>
            <div className="flex gap-4 flex-wrap">
              <label className="text-dark-300 text-[13px] flex items-center gap-2">
                Size:
                <select value={size} onChange={e => setSize(Number(e.target.value))} className={selectClass}>
                  {[150, 200, 300, 400, 500, 800].map(s => <option key={s} value={s}>{s}×{s}</option>)}
                </select>
              </label>
              <label className="text-dark-300 text-[13px] flex items-center gap-2">
                Error:
                <select value={errorLevel} onChange={e => setErrorLevel(e.target.value)} className={selectClass}>
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </label>
            </div>
            <div className="flex gap-4 flex-wrap">
              <label className="text-dark-300 text-[13px] flex items-center gap-2">
                Foreground:
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-dark-600 cursor-pointer bg-transparent" />
                <span className="font-mono text-xs text-dark-400">{fgColor}</span>
              </label>
              <label className="text-dark-300 text-[13px] flex items-center gap-2">
                Background:
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-dark-600 cursor-pointer bg-transparent" />
                <span className="font-mono text-xs text-dark-400">{bgColor}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: QR Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-black/20">
            <canvas ref={canvasRef} />
          </div>
          <div className="flex gap-3">
            <button onClick={downloadPNG} className={btnPrimary}>Download PNG</button>
            <button onClick={downloadSVG} className={btnSecondary}>Download SVG</button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
