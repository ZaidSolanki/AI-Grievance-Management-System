// Small micro-interactions for user pages
document.addEventListener('DOMContentLoaded', () => {
    // Dropzone simple preview
    const dz = document.getElementById('dropzone');
    const preview = document.getElementById('uploadPreview');
    if (dz) {
        dz.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                preview.innerHTML = '';
                preview.appendChild(img);
            };
            input.click();
        });
    }

    // Simple checkbox toggle visuals (graceful fallback)
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            cb.classList.toggle('on', cb.checked);
        });
    });

    // Timeline progress fill for Track Complaint page
    const timeline = document.getElementById('complaint-timeline');
    if (timeline) {
        const items = Array.from(timeline.querySelectorAll('.timeline-item'));
        const completed = items.filter(i => i.classList.contains('completed')).length;
        const total = items.length;
        const fill = timeline.querySelector('.timeline-fill');
        // compute percent of timeline to fill (top-to-bottom)
        const percent = total > 0 ? (completed / total) * 100 : 0;
        // set height as percent of the timeline container (subtract some padding)
        const containerHeight = Math.max(timeline.clientHeight - 32, 0);
        if (fill) {
            fill.style.height = (containerHeight * (percent / 100)) + 'px';
        }

        // add small pulsing animation class to active marker
        const active = timeline.querySelector('.timeline-item.active .timeline-marker');
        if (active) {
            active.classList.add('pulse');
        }
    }
});

// small pulse animation (kept outside DOMContentLoaded so CSS class exists)
(function addPulseStyle() {
    const style = document.createElement('style');
    style.textContent = `.timeline-marker.pulse{animation:markerPulse 2s infinite}@keyframes markerPulse{0%{box-shadow:0 6px 30px rgba(6,182,212,0.12)}50%{box-shadow:0 12px 60px rgba(6,182,212,0.16)}100%{box-shadow:0 6px 30px rgba(6,182,212,0.12)}}`;
    document.head.appendChild(style);
})();