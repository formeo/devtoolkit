'use client';
import { useState, useMemo, useCallback, useRef } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { textareaClass, btnPrimary, btnSecondary, labelClass, inputClass } from '../../components/styles';

const SAMPLE = `{
  "status": "success",
  "data": {
    "users": [
      { "id": 1, "name": "Alice", "email": "alice@example.com", "roles": ["admin", "editor"], "active": true },
      { "id": 2, "name": "Bob", "email": "bob@example.com", "roles": ["viewer"], "active": false }
    ],
    "pagination": { "page": 1, "perPage": 20, "total": 142 },
    "meta": { "requestId": "a1b2c3d4", "timestamp": 1707840000, "version": null }
  }
}`;

const TYPE_COLORS = {
  string: 'text-green-400',
  number: 'text-blue-400',
  boolean: 'text-yellow-400',
  null: 'text-red-400',
  object: 'text-purple-400',
  array: 'text-cyan-400',
};

const TYPE_LABELS = {
  string: 'str',
  number: 'num',
  boolean: 'bool',
  null: 'null',
  object: 'obj',
  array: 'arr',
};

function getType(val) {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

function countChildren(val) {
  if (val === null || typeof val !== 'object') return 0;
  return Array.isArray(val) ? val.length : Object.keys(val).length;
}

function TreeNode({ keyName, value, path, depth, search, expandedMap, toggleExpand, onCopyPath, defaultExpand }) {
  const type = getType(value);
  const isExpandable = type === 'object' || type === 'array';
  const childCount = countChildren(value);
  const nodeId = path;
  const isExpanded = expandedMap[nodeId] !== undefined ? expandedMap[nodeId] : depth < defaultExpand;

  const matchesSearch = search && keyName && keyName.toString().toLowerCase().includes(search.toLowerCase());

  const renderValue = () => {
    if (type === 'string') return <span className={TYPE_COLORS.string}>"{value.length > 120 ? value.slice(0, 120) + '…' : value}"</span>;
    if (type === 'number') return <span className={TYPE_COLORS.number}>{value}</span>;
    if (type === 'boolean') return <span className={TYPE_COLORS.boolean}>{value.toString()}</span>;
    if (type === 'null') return <span className={TYPE_COLORS.null}>null</span>;
    return null;
  };

  const renderBrackets = () => {
    if (type === 'array') return isExpanded ? '[' : `[${childCount}]`;
    if (type === 'object') return isExpanded ? '{' : `{${childCount}}`;
    return '';
  };

  const entries = isExpandable
    ? (type === 'array' ? value.map((v, i) => [i, v]) : Object.entries(value))
    : [];

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <div
        className={`flex items-center gap-1 py-[2px] group cursor-pointer rounded px-1 -mx-1 hover:bg-dark-800/50 ${matchesSearch ? 'bg-yellow-400/10 ring-1 ring-yellow-400/30' : ''}`}
        onClick={() => { if (isExpandable) toggleExpand(nodeId, !isExpanded); }}
      >
        {/* Expand arrow */}
        <span className="w-4 text-center text-[10px] text-dark-500 flex-shrink-0 select-none">
          {isExpandable ? (isExpanded ? '▼' : '▶') : ''}
        </span>

        {/* Key */}
        {keyName !== null && keyName !== undefined && (
          <span className="text-dark-200 font-medium">
            {typeof keyName === 'number' ? (
              <span className="text-dark-500">{keyName}</span>
            ) : (
              <>"{keyName}"</>
            )}
            <span className="text-dark-600">: </span>
          </span>
        )}

        {/* Value or brackets */}
        {isExpandable ? (
          <span className="text-dark-500 text-[11px]">
            <span className={TYPE_COLORS[type]}>{type === 'array' ? 'Array' : 'Object'}</span>
            <span className="text-dark-600"> {renderBrackets()}</span>
            {!isExpanded && <span className="text-dark-600 ml-1">{type === 'array' ? ']' : '}'}</span>}
          </span>
        ) : (
          <span className="font-mono text-[12px]">{renderValue()}</span>
        )}

        {/* Type badge */}
        <span className={`text-[9px] px-1 py-[0px] rounded ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${TYPE_COLORS[type]} bg-dark-900`}>
          {TYPE_LABELS[type]}
        </span>

        {/* Copy path button */}
        <button
          onClick={(e) => { e.stopPropagation(); onCopyPath(path); }}
          className="text-[9px] text-dark-600 hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto px-1 font-mono"
          title={`Copy path: ${path}`}
        >
          {path}
        </button>
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div>
          {entries.map(([k, v]) => {
            const childPath = typeof k === 'number' ? `${path}[${k}]` : (path ? `${path}.${k}` : k);
            return (
              <TreeNode
                key={childPath}
                keyName={k}
                value={v}
                path={childPath}
                depth={depth + 1}
                search={search}
                expandedMap={expandedMap}
                toggleExpand={toggleExpand}
                onCopyPath={onCopyPath}
                defaultExpand={defaultExpand}
              />
            );
          })}
          <div style={{ marginLeft: 16 }} className="text-dark-600 text-[11px] py-[1px]">
            {type === 'array' ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Client() {
  const [input, setInput] = useState(SAMPLE);
  const [search, setSearch] = useState('');
  const [expandedMap, setExpandedMap] = useState({});
  const [defaultExpand, setDefaultExpand] = useState(3);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const parsed = useMemo(() => {
    try {
      const val = JSON.parse(input);
      setError('');
      return val;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, [input]);

  const stats = useMemo(() => {
    if (!parsed) return null;
    let keys = 0, arrays = 0, objects = 0, strings = 0, numbers = 0, booleans = 0, nulls = 0, maxDepth = 0;
    const walk = (val, depth) => {
      if (depth > maxDepth) maxDepth = depth;
      const type = getType(val);
      if (type === 'null') { nulls++; return; }
      if (type === 'string') { strings++; return; }
      if (type === 'number') { numbers++; return; }
      if (type === 'boolean') { booleans++; return; }
      if (type === 'array') { arrays++; val.forEach(v => walk(v, depth + 1)); return; }
      if (type === 'object') { objects++; const entries = Object.entries(val); keys += entries.length; entries.forEach(([, v]) => walk(v, depth + 1)); }
    };
    walk(parsed, 0);
    return { keys, arrays, objects, strings, numbers, booleans, nulls, maxDepth, size: input.length };
  }, [parsed, input]);

  const toggleExpand = useCallback((nodeId, expanded) => {
    setExpandedMap(prev => ({ ...prev, [nodeId]: expanded }));
  }, []);

  const expandAll = () => {
    setExpandedMap({});
    setDefaultExpand(100);
  };

  const collapseAll = () => {
    setExpandedMap({});
    setDefaultExpand(0);
  };

  const resetExpand = () => {
    setExpandedMap({});
    setDefaultExpand(3);
  };

  const onCopyPath = (path) => {
    navigator.clipboard.writeText(path).then(() => {
      setCopied(path);
      setTimeout(() => setCopied(''), 1500);
    });
  };

  return (
    <ToolLayout title="JSON Tree Viewer" description="Visualize JSON as an interactive tree. Explore nested structures, copy node paths, search keys, and inspect data types.">
      {/* Input */}
      <div className="mb-4">
        <label className={labelClass}>Paste JSON</label>
        <textarea
          className={textareaClass}
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={6}
          placeholder='{"key": "value"}'
          spellCheck={false}
        />
        {error && <div className="text-red-400 text-xs mt-1">Parse error: {error}</div>}
      </div>

      {parsed !== null && (
        <>
          {/* Stats bar */}
          {stats && (
            <div className="flex flex-wrap gap-3 mb-4 text-[11px]">
              {[
                { label: 'Keys', value: stats.keys, color: 'text-purple-400' },
                { label: 'Objects', value: stats.objects, color: 'text-purple-400' },
                { label: 'Arrays', value: stats.arrays, color: 'text-cyan-400' },
                { label: 'Strings', value: stats.strings, color: 'text-green-400' },
                { label: 'Numbers', value: stats.numbers, color: 'text-blue-400' },
                { label: 'Booleans', value: stats.booleans, color: 'text-yellow-400' },
                { label: 'Nulls', value: stats.nulls, color: 'text-red-400' },
                { label: 'Depth', value: stats.maxDepth, color: 'text-dark-300' },
                { label: 'Size', value: (stats.size / 1024).toFixed(1) + ' KB', color: 'text-dark-300' },
              ].map(s => (
                <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <span className={`font-bold ${s.color}`}>{s.value}</span>
                  <span className="text-dark-500">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input
              className={inputClass + ' flex-1 min-w-[180px] max-w-[300px]'}
              placeholder="Search keys..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button onClick={expandAll} className={`${btnSecondary} text-xs`}>Expand All</button>
            <button onClick={collapseAll} className={`${btnSecondary} text-xs`}>Collapse All</button>
            <button onClick={resetExpand} className={`${btnSecondary} text-xs`}>Reset</button>
          </div>

          {/* Copied notification */}
          {copied && (
            <div className="text-xs text-brand-400 mb-2">
              ✓ Copied: <span className="font-mono">{copied}</span>
            </div>
          )}

          {/* Tree */}
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-4 font-mono text-[12px] text-dark-200 overflow-auto max-h-[600px] leading-relaxed">
            <TreeNode
              keyName={null}
              value={parsed}
              path=""
              depth={0}
              search={search}
              expandedMap={expandedMap}
              toggleExpand={toggleExpand}
              onCopyPath={onCopyPath}
              defaultExpand={defaultExpand}
            />
          </div>
        </>
      )}

      {/* SEO content */}
      <section className="mt-10 border-t border-dark-700 pt-6">
        <h2 className="text-base font-bold text-dark-200 mb-3">About JSON Tree Visualization</h2>
        <div className="text-xs text-dark-400 leading-relaxed space-y-2">
          <p>Working with deeply nested JSON from REST APIs, GraphQL responses, or NoSQL databases often means scrolling through thousands of lines of formatted text. A tree viewer transforms JSON into an interactive, collapsible structure where you can instantly see data types, array sizes, nesting depth, and navigate to any node.</p>
          <p>Click any node to copy its JavaScript-style path (like <code className="text-dark-300">data.users[0].email</code>) — ready to paste into your code. Use the search to find specific keys in large payloads. The stats bar shows a structural overview: total keys, arrays, objects, max depth, and data size. All processing happens locally in your browser — your JSON data is never sent to any server.</p>
        </div>
      </section>
    </ToolLayout>
  );
}
