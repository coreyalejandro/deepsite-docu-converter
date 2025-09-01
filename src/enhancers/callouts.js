export function initCallouts(markdownPreview) {
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
