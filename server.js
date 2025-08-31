const express = require('express');
const multer = require('multer');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const upload = multer();
const app = express();

// Serve static files
app.use(express.static('public'));

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

async function pdfToHtml(buffer) {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let html = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    html += `<p>${pageText}</p>`;
  }
  return html;
}

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    let html = '';
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        html = await pdfToHtml(req.file.buffer);
      } else {
        html = md.render(req.file.buffer.toString('utf8'));
      }
    } else if (req.body.markdown) {
      html = md.render(req.body.markdown);
    } else {
      return res.status(400).json({ error: 'No content provided' });
    }

    // Return raw HTML. Client will load assets like highlight.js and mermaid
    // and run post-processing after injection.
    res.json({ html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

