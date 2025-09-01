import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import mermaid from 'mermaid';
import MathJax from 'mathjax/es5/tex-mml-chtml.js';
import { setupConversionHandlers } from './conversion.js';
import { buildTOC, initCallouts, initDiagramToggles } from './enhancers/index.js';

mermaid.initialize({ startOnLoad: false });

const editor = document.getElementById('editor');
const markdownPreview = document.getElementById('markdown-preview');
const htmlPreview = document.getElementById('html-preview');
const pdfPreview = document.getElementById('pdf-preview');

function initCodeRunners() {
    markdownPreview.querySelectorAll('pre code.language-js, pre code.language-javascript').forEach(code => {
        const pre = code.parentElement;
        if (pre.parentElement.classList.contains('code-runner')) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-runner relative group';
        pre.parentNode.replaceChild(wrapper, pre);
        wrapper.appendChild(pre);

        const btn = document.createElement('button');
        btn.textContent = 'Run';
        btn.className = 'absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition';

        btn.addEventListener('click', () => {
            try { eval(code.textContent); } catch (err) { console.error(err); }
        });

        wrapper.appendChild(btn);
    });
}

function renderRichContent(container) {
    container = container || markdownPreview;

    container.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
    });

    container.querySelectorAll('pre code.language-mermaid').forEach(code => {
        const pre = code.parentElement;
        const wrapper = document.createElement('div');
        wrapper.className = 'mermaid';
        wrapper.textContent = code.textContent;
        pre.replaceWith(wrapper);
    });
    if (mermaid) {
        mermaid.init(undefined, container.querySelectorAll('.mermaid'));
    }

    if (MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(err => console.error(err));
    }

    if (container === markdownPreview) {
        buildTOC(markdownPreview);
        initCallouts(markdownPreview);
        initCodeRunners();
        initDiagramToggles(markdownPreview);
    }
}

setupConversionHandlers({ editor, markdownPreview, htmlPreview, pdfPreview, renderRichContent });

async function loadHeroExample() {
    try {
        const res = await fetch('/samples/hero.md');
        const markdown = await res.text();
        const formData = new FormData();
        formData.append('markdown', markdown);
        const convRes = await fetch('/convert', { method: 'POST', body: formData });
        const data = await convRes.json();
        const hero = document.getElementById('hero-example');
        hero.innerHTML = data.html;
        renderRichContent(hero);
    } catch (err) {
        console.error('Failed to load hero example', err);
    }
}

loadHeroExample();

export { setupConversionHandlers, buildTOC, initCallouts, initDiagramToggles };
