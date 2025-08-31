
        // Format selection
        const formatBtns = document.querySelectorAll('.format-btn');
        formatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons in the same container
                btn.parentElement.querySelectorAll('.format-btn').forEach(b => {
                    b.classList.remove('active', 'bg-indigo-600', 'text-white');
                    b.classList.add('bg-gray-200', 'text-gray-700');
                });
                
                // Add active class to clicked button
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
            
            // Get current active states
            const inputActive = inputMd.classList.contains('active') ? 'md' : 
                               inputPdf.classList.contains('active') ? 'pdf' : 'txt';
            const outputActive = outputMd.classList.contains('active') ? 'md' : 
                                outputPdf.classList.contains('active') ? 'pdf' : 'txt';
            
            // Reset all
            [inputMd, inputPdf, inputTxt, outputMd, outputPdf, outputTxt].forEach(btn => {
                btn.classList.remove('active', 'bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            // Set new active states (swapped)
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
        
        // Handle drag and drop
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
            convertBtn.disabled = false;
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
            convertBtn.disabled = true;
        });
        
        function updateConvertButtonState() {
            // In a real app, you might want to check for valid conversion combinations
            // For now, we'll just enable it if a file is selected
            convertBtn.disabled = fileInput.files.length === 0;
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
        
        // Convert button handler
        document.getElementById('convert-btn').addEventListener('click', () => {
            // In a real app, this would handle the actual conversion
            // For now, we'll just simulate it
            const inputFormat = document.querySelector('.format-btn.active').id.split('-')[1];
            const outputFormat = document.querySelectorAll('.format-btn.active')[1].id.split('-')[1];
            
            alert(`Converting from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}... This would be handled by a backend service in a real application.`);
            
            // Simulate conversion result
            if (outputFormat === 'pdf') {
                document.getElementById('pdf-viewer').classList.remove('hidden');
                document.querySelector('#pdf-preview p').classList.add('hidden');
                // In a real app, you would set the PDF viewer source here
            }
        });
        
        // Editor content change handler
        const editor = document.getElementById('editor');
        const markdownPreview = document.getElementById('markdown-preview');
        editor.addEventListener('input', (e) => {
            const raw = e.target.value;
            const html = marked.parse(raw || '');
            markdownPreview.innerHTML = html || '<p class="text-gray-500">Preview will appear here as you type...</p>';
            renderRichContent();
        });

function buildTOC() {
    const toc = document.getElementById('toc');
    toc.innerHTML = '';
    const headings = markdownPreview.querySelectorAll('h1, h2, h3');
    
    if (!headings.length) { 
        toc.classList.add('hidden'); 
        return; 
    }
    
    toc.classList.remove('hidden');
    headings.forEach((h, i) => {
        const id = 'heading-' + i;
        h.id = id;
        const link = document.createElement('a');
        link.href = '#' + id;
        link.textContent = h.textContent;
        link.style.paddingLeft = ((parseInt(h.tagName.substring(1)) - 1) * 12) + 'px';
        toc.appendChild(link);
    });
    
    if (headingObserver) headingObserver.disconnect();
    headingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = toc.querySelector(`a[href="#${entry.target.id}"]`);
            if (entry.isIntersecting) {
                toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { root: document.getElementById('preview-content'), threshold: 0.1 });
    
    headings.forEach(h => headingObserver.observe(h));
}

function initCallouts() {
    markdownPreview.querySelectorAll('.callout').forEach(co => {
        if (co.dataset.bound) return;
        co.dataset.bound = 'true';
        co.classList.add('collapsed');
        const toggle = co.querySelector('.callout-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => co.classList.toggle('collapsed'));
        }
    });
}

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

let headingObserver;

function initDiagramToggles() {
    markdownPreview.querySelectorAll('.diagram-toggle').forEach(btn => {
        const target = markdownPreview.querySelector(btn.dataset.target);
        if (!target) return;
        btn.addEventListener('click', () => target.classList.toggle('hidden'));
    });
}
