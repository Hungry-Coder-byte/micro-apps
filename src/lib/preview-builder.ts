/**
 * Builds a self-contained srcdoc HTML string for rendering AI-generated React components
 * inside an iframe. Uses React 18 UMD + Babel standalone + Tailwind CDN.
 */

function sanitizeCode(raw: string): string {
  let code = raw
    // Strip markdown code fences
    .replace(/^```[a-z]*\n?/gm, '')
    .replace(/^```$/gm, '')
    // Strip 'use client' / 'use server' directives
    .replace(/^['"]use (client|server)['"]\s*;?\n?/gm, '')
    // Strip import statements (single-line and multi-line)
    .replace(/^import\s[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n?/gm, '')
    .replace(/^import\s+['"][^'"]+['"]\s*;?\n?/gm, '')
    // Strip export default
    .replace(/^export\s+default\s+/gm, '')
    // Strip named exports
    .replace(/^export\s+/gm, '')
    .trim()

  // If AI forgot to add the render call, add it automatically
  if (code.includes('function App(') && !code.includes('ReactDOM.createRoot')) {
    code += "\nReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));"
  }

  return code
}

export function buildPreviewSrcdoc(rawCode: string, isDark = false): string {
  const code = sanitizeCode(rawCode)
  const bg = isDark ? '#0a0a0a' : '#ffffff'
  const fg = isDark ? '#f5f5f5' : '#0a0a0a'

  return `<!DOCTYPE html>
<html lang="en"${isDark ? ' class="dark"' : ''}>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<script>
  // Tailwind config must come before the CDN script
  window.tailwind = window.tailwind || {};
</script>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  if (window.tailwind && window.tailwind.config) {
    tailwind.config = { darkMode: 'class', theme: { extend: {} } };
  }
</script>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: ${bg}; color: ${fg}; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; }
  #root { width: 100%; padding: 1rem; }
  #err { display: none; background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; padding: 12px 16px; border-radius: 8px; font-size: 12px; white-space: pre-wrap; font-family: monospace; margin: 1rem; }
</style>
</head>
<body>
<div id="root"></div>
<div id="err"></div>
<script>
  window.addEventListener('error', function(e) {
    var el = document.getElementById('err');
    el.style.display = 'block';
    el.textContent = 'Error: ' + e.message + (e.lineno ? ' (line ' + e.lineno + ')' : '');
  });
  window.addEventListener('unhandledrejection', function(e) {
    var el = document.getElementById('err');
    el.style.display = 'block';
    el.textContent = 'Unhandled Promise: ' + (e.reason?.message || e.reason);
  });
</script>
<script type="text/babel" data-presets="react">
/* Destructure hooks so AI-generated code can use them without React. prefix */
const { useState, useEffect, useCallback, useMemo, useRef, useReducer, createContext, useContext } = React;

${code}
</script>
</body>
</html>`
}
