'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass } from '../../components/styles';

export default function Client() {
  // Tab: 'text' or 'file'
  const [tab, setTab] = useState('text');

  // Text mode state
  const [input, setInput] = useState('Hello, Developer! This is a Base64 encoding test.');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  // File mode state
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dataUri, setDataUri] = useState(true);
  const [copied, setCopied] = useState(false);

  // Decode mode state
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const [fileMode, setFileMode] = useState('encode'); // encode or decode

  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // Text mode encode/decode
  useEffect(() => {
    if (tab !== 'text') return;
    try {
      setOutput(mode === 'encode'
        ? btoa(unescape(encodeURIComponent(input)))
        : decodeURIComponent(escape(atob(input))));
    } catch { setOutput('Error: Invalid input'); }
  }, [input, mode, tab]);

  // File → Base64
  const processFile = useCallback((f) => {
    if (!f) return;
    setFile(f);
    setFileInfo({ name: f.name, size: f.size, type: f.type || 'application/octet-stream' });
    setCopied(false);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Full = reader.result; // data:mime;base64,XXXX
      const base64Raw = base64Full.split(',')[1] || '';
      setFileBase64(base64Raw);
    };
    reader.readAsDataURL(f);
  }, []);

  // Drag & drop handlers
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  // Copy to clipboard
  const copyOutput = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Get display output for file mode
  const getFileOutput = () => {
    if (!fileBase64) return '';
    if (dataUri) return `data:${fileInfo?.type || 'application/octet-stream'};base64,${fileBase64}`;
    return fileBase64;
  };

  // Decode Base64 → File download
  const downloadDecoded = () => {
    try {
      setDecodeError('');
      let raw = decodeInput.trim();
      let mime = 'application/octet-stream';
      let fileName = 'decoded-file';

      // Check if it's a data URI
      const dataUriMatch = raw.match(/^data:([^;]+);base64,(.+)$/s);
      if (dataUriMatch) {
        mime = dataUriMatch[1];
        raw = dataUriMatch[2];
      }

      // Clean whitespace/newlines from base64
      raw = raw.replace(/\s/g, '');

      const binary = atob(raw);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      // Try to guess extension from mime
      const extMap = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg', 'application/pdf': '.pdf', 'text/plain': '.txt', 'text/html': '.html', 'text/css': '.css', 'text/javascript': '.js', 'application/json': '.json', 'application/zip': '.zip', 'audio/mpeg': '.mp3', 'audio/wav': '.wav', 'video/mp4': '.mp4' };
      const ext = extMap[mime] || '';
      fileName += ext;

      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setDecodeError('Error: Invalid Base64 string — ' + e.message);
    }
  };

  const formatSize = (b) => {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} className={tab === id
      ? 'px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600/20 text-brand-400 border border-brand-500/30'
      : 'px-4 py-2 text-sm font-medium rounded-lg text-dark-400 border border-dark-700 hover:text-dark-200 transition-colors'
    }>{label}</button>
  );

  return (
    <ToolLayout title="Base64 Encoder / Decoder" description="Encode text or files to Base64 and back. Supports images, PDFs, and any binary file. All processing in your browser.">
      {/* Tab switcher */}
      <div className="flex gap-2 mb-5">
        {tabBtn('text', '📝 Text')}
        {tabBtn('file', '📁 File')}
      </div>

      {/* TEXT TAB */}
      {tab === 'text' && (
        <>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setMode('encode')} className={mode === 'encode' ? btnPrimary : btnSecondary}>Encode</button>
            <button onClick={() => setMode('decode')} className={mode === 'decode' ? btnPrimary : btnSecondary}>Decode</button>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <label className={labelClass}>Input</label>
              <textarea className={textareaClass} value={input} onChange={e => setInput(e.target.value)} rows={10} />
            </div>
            <div className="flex-1 min-w-[280px]">
              <label className={labelClass}>Output</label>
              <textarea className={textareaClass} value={output} readOnly rows={10} />
              {output && output !== 'Error: Invalid input' && (
                <button onClick={() => copyOutput(output)} className={`${btnSecondary} mt-2 text-xs`}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* FILE TAB */}
      {tab === 'file' && (
        <>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setFileMode('encode')} className={fileMode === 'encode' ? btnPrimary : btnSecondary}>File → Base64</button>
            <button onClick={() => setFileMode('decode')} className={fileMode === 'decode' ? btnPrimary : btnSecondary}>Base64 → File</button>
          </div>

          {fileMode === 'encode' && (
            <>
              {/* Drop zone */}
              <div
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-4 ${
                  dragging ? 'border-brand-400 bg-brand-400/5' : 'border-dark-600 hover:border-dark-500'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }}
                />
                <div className="text-3xl mb-2">{file ? '✓' : '📂'}</div>
                {file ? (
                  <div>
                    <div className="text-sm font-semibold text-dark-100">{fileInfo.name}</div>
                    <div className="text-xs text-dark-400 mt-1">{fileInfo.type} · {formatSize(fileInfo.size)} → Base64: {formatSize(Math.ceil(fileInfo.size * 4 / 3))}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-dark-300">Drop a file here or click to browse</div>
                    <div className="text-xs text-dark-500 mt-1">Images, PDFs, documents — any file type</div>
                  </div>
                )}
              </div>

              {fileBase64 && (
                <>
                  {/* Options */}
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-2 text-xs text-dark-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dataUri}
                        onChange={e => setDataUri(e.target.checked)}
                        className="accent-brand-500"
                      />
                      Include data URI prefix
                    </label>
                    <span className="text-xs text-dark-500">
                      {fileBase64.length.toLocaleString()} chars
                    </span>
                  </div>

                  {/* Output */}
                  <label className={labelClass}>Base64 Output</label>
                  <textarea
                    className={textareaClass}
                    value={getFileOutput()}
                    readOnly
                    rows={8}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => copyOutput(getFileOutput())} className={`${btnPrimary} text-xs`}>
                      {copied ? '✓ Copied' : 'Copy to Clipboard'}
                    </button>
                    <button onClick={() => { setFile(null); setFileBase64(''); setFileInfo(null); }} className={`${btnSecondary} text-xs`}>
                      Clear
                    </button>
                  </div>

                  {/* Preview for images */}
                  {fileInfo?.type?.startsWith('image/') && (
                    <div className="mt-4 p-3 bg-dark-900 border border-dark-700 rounded-lg">
                      <label className={labelClass}>Preview</label>
                      <img
                        src={`data:${fileInfo.type};base64,${fileBase64}`}
                        alt="Preview"
                        className="max-w-full max-h-48 rounded"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {fileMode === 'decode' && (
            <>
              <label className={labelClass}>Paste Base64 (raw or data URI)</label>
              <textarea
                className={textareaClass}
                value={decodeInput}
                onChange={e => { setDecodeInput(e.target.value); setDecodeError(''); }}
                rows={8}
                placeholder="Paste Base64 string or data:image/png;base64,... here"
              />
              {decodeError && <div className="text-red-400 text-xs mt-2">{decodeError}</div>}
              <div className="flex gap-2 mt-3">
                <button onClick={downloadDecoded} className={btnPrimary} disabled={!decodeInput.trim()}>
                  Download as File
                </button>
                <button onClick={() => { setDecodeInput(''); setDecodeError(''); }} className={btnSecondary}>
                  Clear
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About Base64 Encoding</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>Base64 is a binary-to-text encoding scheme that represents binary data as an ASCII string. It&apos;s widely used for embedding images in HTML/CSS (data URIs), sending binary data in JSON APIs, encoding email attachments (MIME), and storing binary content in text-based formats.</p>
          <p><strong className="text-dark-300">Text mode</strong> encodes and decodes UTF-8 strings to and from Base64. <strong className="text-dark-300">File mode</strong> lets you drag &amp; drop any file — images, PDFs, fonts, audio — to get its Base64 representation, ready to paste into your code. You can also decode a Base64 string back to a downloadable file.</p>
          <p>Everything runs locally in your browser using the FileReader API. No data is uploaded to any server.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
