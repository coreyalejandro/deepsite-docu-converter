let headingObserver;

export function buildTOC(markdownPreview) {
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
                if (link) link.classList.add('active');
            }
        });
    }, { root: document.getElementById('preview-content'), threshold: 0.1 });

    headings.forEach(h => headingObserver.observe(h));
}
