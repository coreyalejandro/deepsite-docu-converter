const express = require('express');
const multer = require('multer');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const { createCanvas } = require('@napi-rs/canvas');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { createLearningJourney } = require('./learningPath');

// pdfjs-dist ships ES modules; load lazily to keep this file CommonJS
const pdfjsLibPromise = import('pdfjs-dist/legacy/build/pdf.mjs');

const upload = multer();
const app = express();
app.use(express.json());

// Initialize DOMPurify with a server-side DOM implementation
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Serve static files
app.use(express.static('dist'));

// Configure Markdown renderer with highlight.js
const md = new MarkdownIt();
md.set({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

function escapeHtml(str) {
  return str.replace(/[&<>"]|\u00A0/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\u00A0': '&nbsp;'
  })[c]);
}

async function pdfToHtml(buffer) {
  const pdfjsLib = await pdfjsLibPromise;
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const meta = await pdf.getMetadata().catch(() => ({ info: {} }));
  const outline = await pdf.getOutline().catch(() => []);

  let pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const background = canvas.toDataURL();

    const textContent = await page.getTextContent();
    const textLayer = textContent.items.map(item => {
      const tx = pdfjsLib.Util.transform(
        pdfjsLib.Util.transform(viewport.transform, item.transform),
        [1, 0, 0, -1, 0, 0]
      );
      const fontHeight = Math.hypot(tx[2], tx[3]);
      const x = tx[4];
      const y = tx[5] - fontHeight;
      return `<span style="position:absolute; left:${x}px; top:${y}px; font-size:${fontHeight}px;">${escapeHtml(item.str)}</span>`;
    }).join('');

    pages.push(
      `<div class="page" style="position:relative; width:${viewport.width}px; height:${viewport.height}px; background-image:url('${background}'); background-size:contain; background-repeat:no-repeat;">${textLayer}</div>`
    );
  }

  const styles = '<style>.page{margin:1em auto;}</style>';
  return {
    html: styles + pages.join(''),
    metadata: {
      title: meta.info.Title || '',
      headings: (outline || []).map(o => o.title)
    }
  };
}

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    let html = '';
    let metadata = {};
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const result = await pdfToHtml(req.file.buffer);
        html = result.html;
        metadata = result.metadata;
      } else {
        html = md.render(req.file.buffer.toString('utf8'));
      }
    } else if (req.body.markdown) {
      html = md.render(req.body.markdown);
    } else {
      return res.status(400).json({ error: 'No content provided' });
    }

    // Sanitize HTML to avoid XSS before sending to the client
    html = DOMPurify.sanitize(html);

    // Return sanitized HTML with metadata. Client will load assets like highlight.js
    // and mermaid and run post-processing after injection.
    res.json({ html, metadata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.post('/journey', (req, res) => {
  try {
    const { html, profile } = req.body;
    if (!html || !profile) {
      return res.status(400).json({ error: 'html and profile are required' });
    }
    const journey = createLearningJourney(html, profile);
    res.json(journey);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create learning journey' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

