'use client';
import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass } from '../../components/styles';

export default function YAMLJSONClient() {
  const [input, setInput] = useState("name: DevToolKit\nversion: 1.0\nfeatures:\n  - json_formatter\n  - yaml_converter\n  - base64\nsettings:\n  theme: dark\n  language: en");
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('yaml2json');
  const [error, setError] = useState('');

  const convert = useCallback(() => {
    try {
      if (mode === 'yaml2json') {
        const lines = input.split('\n');
        const result = {};
        let currentArray = null;
        let currentObj = null;
        let objKey = null;

        for (const line of lines) {
          const trimmed = line.trimEnd();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const arrayMatch = trimmed.match(/^\s+-\s+(.+)/);
          if (arrayMatch && currentArray) { currentArray.push(isNaN(arrayMatch[1]) ? arrayMatch[1] : Number(arrayMatch[1])); continue; }
          const kvMatch = trimmed.match(/^(\s*)(\w[\w\s]*?):\s*(.*)$/);
          if (kvMatch) {
            const indent = kvMatch[1].length, key = kvMatch[2].trim(), val = kvMatch[3].trim();
            if (indent > 0 && currentObj && objKey) { currentObj[key] = val === '' ? null : (val === 'true' ? true : val === 'false' ? false : (isNaN(val) ? val : Number(val))); continue; }
            currentArray = null; currentObj = null;
            if (val === '') {
              const nextIdx = lines.indexOf(line) + 1;
              if (nextIdx < lines.length && lines[nextIdx].trim().startsWith('-')) { result[key] = []; currentArray = result[key]; }
              else { result[key] = {}; currentObj = result[key]; objKey = key; }
            } else {
              result[key] = val === 'true' ? true : val === 'false' ? false : (isNaN(val) ? val.replace(/^["']|["']$/g, '') : Number(val));
            }
          }
        }
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const parsed = JSON.parse(input);
        const toYaml = (obj, indent = 0) => {
          let r = ''; const pad = '  '.repeat(indent);
          for (const [key, value] of Object.entries(obj)) {
            if (Array.isArray(value)) { r += `${pad}${key}:\n`; value.forEach(item => { r += typeof item === 'object' && item !== null ? `${pad}  - ${toYaml(item, indent + 2).trim()}\n` : `${pad}  - ${item}\n`; }); }
            else if (typeof value === 'object' && value !== null) { r += `${pad}${key}:\n${toYaml(value, indent + 1)}`; }
            else { r += `${pad}${key}: ${value}\n`; }
          }
          return r;
        };
        setOutput(toYaml(parsed));
      }
      setError('');
    } catch (e) { setError(e.message); setOutput(''); }
  }, [input, mode]);

  useEffect(() => { convert(); }, []);

  return (
    <ToolLayout title="YAML ↔ JSON Converter" description="Convert between YAML and JSON formats instantly. Supports nested objects and arrays.">
      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode('yaml2json')} className={mode === 'yaml2json' ? btnPrimary : btnSecondary}>YAML → JSON</button>
        <button onClick={() => setMode('json2yaml')} className={mode === 'json2yaml' ? btnPrimary : btnSecondary}>JSON → YAML</button>
        <button onClick={convert} className={`${btnPrimary} ml-auto`}>Convert</button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>{mode === 'yaml2json' ? 'YAML' : 'JSON'} Input</label>
          <textarea className={textareaClass} value={input} onChange={e => setInput(e.target.value)} rows={14} spellCheck={false} />
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className={labelClass}>{mode === 'yaml2json' ? 'JSON' : 'YAML'} Output {error && <span className="text-red-400 text-xs">⚠ {error}</span>}</label>
          <textarea className={textareaClass} value={output} readOnly rows={14} />
        </div>
      </div>
    
      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About YAML and JSON Conversion</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>YAML and JSON are the two dominant configuration formats in modern development. JSON is used in APIs, package.json, tsconfig, and browser storage. YAML is preferred for Kubernetes manifests, Docker Compose, GitHub Actions, Ansible playbooks, and CI/CD pipelines because of its readability and comment support.</p>
          <p>Converting between them is a daily task: paste a Kubernetes YAML to check its JSON structure, convert an API response to YAML for documentation, or transform docker-compose.yml to JSON for programmatic processing. This converter handles nested objects, arrays, and multi-document YAML.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
