document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('user-search');
    const status = document.getElementById('user-status');
    const sort = document.getElementById('user-sort');
    const clearButton = document.getElementById('clear-user-filters');
    const count = document.getElementById('user-result-count');
    const tableBody = document.querySelector('.users-table-card tbody');
    const rows = Array.from(document.querySelectorAll('[data-user-row]'));

    if (!search || !status || !sort || !clearButton || !count || !tableBody) {
        return;
    }

    const applyFilters = function () {
        const searchTerm = search.value.trim().toLowerCase();
        const statusValue = status.value;
        const visibleRows = rows.filter(function (row) {
            const matchesSearch = !searchTerm || row.dataset.search.includes(searchTerm);
            const matchesStatus = statusValue === 'All statuses' || row.dataset.status === statusValue;
            row.hidden = !(matchesSearch && matchesStatus);
            return matchesSearch && matchesStatus;
        });

        visibleRows.sort(function (first, second) {
            if (sort.value === 'complaints') {
                return Number(second.dataset.complaints) - Number(first.dataset.complaints);
            }
            if (sort.value === 'status') {
                return first.dataset.status.localeCompare(second.dataset.status);
            }
            return first.dataset.search.localeCompare(second.dataset.search);
        }).forEach(function (row) {
            tableBody.appendChild(row);
        });

        count.textContent = 'Showing ' + visibleRows.length + ' citizen' + (visibleRows.length === 1 ? '' : 's');
    };

    [search, status, sort].forEach(function (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
    });

    clearButton.addEventListener('click', function () {
        search.value = '';
        status.selectedIndex = 0;
        sort.selectedIndex = 0;
        applyFilters();
    });
});
