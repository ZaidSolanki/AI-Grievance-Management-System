document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('#complaint-search');
    const filterSelect = document.querySelector('#complaint-category-filter');
    const complaintRows = document.querySelectorAll('.complaint-table tbody tr');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = searchInput.value.toLowerCase();
            complaintRows.forEach((row) => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            const filterValue = filterSelect.value;
            complaintRows.forEach((row) => {
                const categoryCell = row.querySelector('.category-cell');
                const category = categoryCell ? categoryCell.textContent.trim() : '';
                row.style.display = filterValue === 'All' || category === filterValue ? '' : 'none';
            });
        });
    }
});
