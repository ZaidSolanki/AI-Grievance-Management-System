document.addEventListener('DOMContentLoaded', function () {
    const activeLink = document.querySelector('.nav-item[href="/user/dashboard.html"]');
    if (activeLink) {
        activeLink.classList.add('active');
    }

    const searchInput = document.querySelector('#dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll('.recent-table tbody tr');

            rows.forEach((row) => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
});
