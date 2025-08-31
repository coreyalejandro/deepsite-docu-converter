document.getElementById('convert').addEventListener('click', async () => {
  const markdown = document.getElementById('markdown').value;
  const fileInput = document.getElementById('file');
  const formData = new FormData();
  if (fileInput.files[0]) {
    formData.append('file', fileInput.files[0]);
  }
  if (markdown) {
    formData.append('markdown', markdown);
  }
  const response = await fetch('/convert', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  const preview = document.getElementById('preview');
  preview.innerHTML = data.html;
  if (window.hljs) { hljs.highlightAll(); }
  if (window.mermaid) { mermaid.init(); }
});
