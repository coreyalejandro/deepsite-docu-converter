import { marked } from 'marked';

export function setupConversionHandlers({ editor, markdownPreview, htmlPreview, pdfPreview, renderRichContent }) {
    // Format selection
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.querySelectorAll('.format-btn').forEach(b => {
                b.classList.remove('active', 'bg-indigo-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });

            btn.classList.add('active', 'bg-indigo-600', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            updateConvertButtonState();
        });
    });

    // Swap conversion direction
    document.getElementById('swap-btn').addEventListener('click', () => {
        const inputMd = document.getElementById('input-md');
        const inputPdf = document.getElementById('input-pdf');
        const inputTxt = document.getElementById('input-txt');
        const outputMd = document.getElementById('output-md');
        const outputPdf = document.getElementById('output-pdf');
        const outputTxt = document.getElementById('output-txt');

        const inputActive = inputMd.classList.contains('active') ? 'md' :
                           inputPdf.classList.contains('active') ? 'pdf' : 'txt';
        const outputActive = outputMd.classList.contains('active') ? 'md' :
                            outputPdf.classList.contains('active') ? 'pdf' : 'txt';

        [inputMd, inputPdf, inputTxt, outputMd, outputPdf, outputTxt].forEach(btn => {
            btn.classList.remove('active', 'bg-indigo-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        if (outputActive === 'md') inputMd.classList.add('active', 'bg-indigo-600', 'text-white');
        if (outputActive === 'pdf') inputPdf.classList.add('active', 'bg-indigo-600', 'text-white');
        if (outputActive === 'txt') inputTxt.classList.add('active', 'bg-indigo-600', 'text-white');

        if (inputActive === 'md') outputMd.classList.add('active', 'bg-indigo-600', 'text-white');
        if (inputActive === 'pdf') outputPdf.classList.add('active', 'bg-indigo-600', 'text-white');
        if (inputActive === 'txt') outputTxt.classList.add('active', 'bg-indigo-600', 'text-white');

        updateConvertButtonState();
    });

    // File upload handling
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    const filename = document.getElementById('filename');
    const filesize = document.getElementById('filesize');
    const removeFile = document.getElementById('remove-file');
    const convertBtn = document.getElementById('convert-btn');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropzone.classList.add('active');
    }

    function unhighlight() {
        dropzone.classList.remove('active');
    }

    dropzone.addEventListener('drop', handleDrop, false);
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length) {
            const file = files[0];
            displayFileInfo(file);
        }
    }

    function displayFileInfo(file) {
        filename.textContent = file.name;
        filesize.textContent = formatFileSize(file.size);
        fileInfo.classList.remove('hidden');
        updateConvertButtonState();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile.addEventListener('click', () => {
        fileInfo.classList.add('hidden');
        fileInput.value = '';
        updateConvertButtonState();
    });

    function updateConvertButtonState() {
        convertBtn.disabled = fileInput.files.length === 0 && !editor.value.trim();
    }

    // Preview toggles
    document.getElementById('preview-md').addEventListener('click', () => {
        document.getElementById('markdown-preview').classList.remove('hidden');
        document.getElementById('html-preview').classList.add('hidden');
        document.getElementById('pdf-preview').classList.add('hidden');

        document.getElementById('preview-md').classList.add('bg-indigo-600', 'text-white');
        document.getElementById('preview-md').classList.remove('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-html').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-html').classList.add('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-pdf').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-pdf').classList.add('bg-gray-200', 'text-gray-700');
    });

    document.getElementById('preview-html').addEventListener('click', () => {
        document.getElementById('markdown-preview').classList.add('hidden');
        document.getElementById('html-preview').classList.remove('hidden');
        document.getElementById('pdf-preview').classList.add('hidden');

        document.getElementById('preview-md').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-md').classList.add('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-html').classList.add('bg-indigo-600', 'text-white');
        document.getElementById('preview-html').classList.remove('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-pdf').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-pdf').classList.add('bg-gray-200', 'text-gray-700');
    });

    document.getElementById('preview-pdf').addEventListener('click', () => {
        document.getElementById('markdown-preview').classList.add('hidden');
        document.getElementById('html-preview').classList.add('hidden');
        document.getElementById('pdf-preview').classList.remove('hidden');

        document.getElementById('preview-md').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-md').classList.add('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-html').classList.remove('bg-indigo-600', 'text-white');
        document.getElementById('preview-html').classList.add('bg-gray-200', 'text-gray-700');

        document.getElementById('preview-pdf').classList.add('bg-indigo-600', 'text-white');
        document.getElementById('preview-pdf').classList.remove('bg-gray-200', 'text-gray-700');
    });

    document.getElementById('convert-btn').addEventListener('click', async () => {
        const formData = new FormData();

        if (fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
        } else if (editor.value.trim()) {
            formData.append('markdown', editor.value);
        } else {
            const msg = '<p class="text-red-500">No content to convert</p>';
            markdownPreview.innerHTML = msg;
            htmlPreview.innerHTML = msg;
            pdfPreview.innerHTML = msg;
            return;
        }

        try {
            const res = await fetch('/convert', { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Conversion failed');

            markdownPreview.innerHTML = data.html;
            htmlPreview.innerHTML = data.html;
            pdfPreview.innerHTML = data.html;
            renderRichContent();
        } catch (err) {
            const msg = `<p class="text-red-500">${err.message}</p>`;
            markdownPreview.innerHTML = msg;
            htmlPreview.innerHTML = msg;
            pdfPreview.innerHTML = msg;
        }
    });

    editor.addEventListener('input', (e) => {
        const raw = e.target.value;
        const html = marked.parse(raw || '');
        markdownPreview.innerHTML = html || '<p class="text-gray-500">Preview will appear here as you type...</p>';
        renderRichContent();
        updateConvertButtonState();
    });

    updateConvertButtonState();
}
