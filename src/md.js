// Renderer markdown mini yang aman & lengkap: escape teks dulu, unescape safe tags, dan parse blok (code, heading, list, table, blockquote).
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(text) {
  let s = esc(text);
  // Kembalikan tag <br> yang ditulis oleh AI agar tidak muncul mentah &lt;br&gt;
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return s;
}

// Cek baris separator tabel Markdown: |:---|:---:|---:|
function isTableSep(line) {
  const trimmed = line.trim();
  if (!trimmed.includes('-')) return false;
  const parts = trimmed.split('|').map((p) => p.trim()).filter((p, idx, arr) => {
    // Abaikan elemen kosong pertama/terakhir jika diawali/diakhiri pipe
    if (idx === 0 && p === '' && trimmed.startsWith('|')) return false;
    if (idx === arr.length - 1 && p === '' && trimmed.endsWith('|')) return false;
    return true;
  });
  if (parts.length === 0) return false;
  return parts.every((p) => /^:?-+:?$/.test(p));
}

function parseTableAlignments(sepLine) {
  const trimmed = sepLine.trim();
  const parts = trimmed.split('|').map((p) => p.trim()).filter((p, idx, arr) => {
    if (idx === 0 && p === '' && trimmed.startsWith('|')) return false;
    if (idx === arr.length - 1 && p === '' && trimmed.endsWith('|')) return false;
    return true;
  });
  return parts.map((p) => {
    const left = p.startsWith(':');
    const right = p.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    return 'left';
  });
}

function splitTableRow(rowLine) {
  const trimmed = rowLine.trim();
  const parts = trimmed.split('|');
  if (trimmed.startsWith('|')) parts.shift();
  if (trimmed.endsWith('|')) parts.pop();
  return parts.map((p) => p.trim());
}

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  const isBlockStart = (idx) => {
    if (idx >= lines.length) return false;
    const l = lines[idx];
    if (/^```/.test(l)) return true;
    if (/^\s*([-*•]|\d+[.)])\s+/.test(l)) return true;
    if (/^#{1,4}\s+/.test(l)) return true;
    if (/^>\s+/.test(l)) return true;
    // Deteksi awal tabel: baris ada pipa dan baris berikutnya separator
    if (l.includes('|') && idx + 1 < lines.length && isTableSep(lines[idx + 1])) return true;
    return false;
  };

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Block
    if (/^```/.test(line)) {
      const langMatch = line.match(/^```(\w+)?/);
      const lang = langMatch && langMatch[1] ? ` class="language-${langMatch[1]}"` : '';
      const buf = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><button type="button" class="copy">Salin</button><code${lang}>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // 2. Heading
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const tag = h[1].length <= 2 ? 'h3' : 'h4';
      out.push(`<${tag}>${inline(h[2])}</${tag}>`);
      i += 1;
      continue;
    }

    // 3. Blockquote
    if (/^>\s+/.test(line)) {
      const quotes = [];
      while (i < lines.length && /^>\s+/.test(lines[i])) {
        quotes.push(inline(lines[i].replace(/^>\s+/, '')));
        i += 1;
      }
      out.push(`<blockquote>${quotes.join('<br>')}</blockquote>`);
      continue;
    }

    // 4. Markdown Table
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const headerRow = splitTableRow(line);
      const aligns = parseTableAlignments(lines[i + 1]);
      i += 2; // lewati header dan separator

      const rows = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        const cells = splitTableRow(lines[i]);
        rows.push(cells);
        i += 1;
      }

      const thead = `<thead><tr>${headerRow.map((h, colIdx) => `<th style="text-align:${aligns[colIdx] || 'left'}">${inline(h)}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${rows.map((row) => `<tr>${row.map((cell, colIdx) => `<td style="text-align:${aligns[colIdx] || 'left'}">${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;

      out.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`);
      continue;
    }

    // 5. Unordered List
    if (/^\s*[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*•]\s+/, ''))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // 6. Ordered List
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+[.)]\s+/, ''))}</li>`);
        i += 1;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // 7. Empty line
    if (!line.trim()) {
      i += 1;
      continue;
    }

    // 8. Normal Paragraph
    const buf = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(i)) {
      buf.push(inline(lines[i]));
      i += 1;
    }
    if (!buf.length) {
      buf.push(inline(line));
      i += 1;
    }
    out.push(`<p>${buf.join('<br>')}</p>`);
  }
  return out.join('');
}
