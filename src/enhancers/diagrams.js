export function initDiagramToggles(markdownPreview) {
    markdownPreview.querySelectorAll('.diagram-toggle').forEach(btn => {
        const target = markdownPreview.querySelector(btn.dataset.target);
        if (!target) return;
        btn.addEventListener('click', () => target.classList.toggle('hidden'));
    });
}
