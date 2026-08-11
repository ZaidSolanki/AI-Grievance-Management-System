document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('complaint-search');
    const priority = document.getElementById('complaint-priority');
    const department = document.getElementById('complaint-department');
    const status = document.getElementById('complaint-status');
    const date = document.getElementById('complaint-date');
    const clearButton = document.getElementById('clear-complaint-filters');
    const rows = Array.from(document.querySelectorAll('[data-complaint-row]'));

    if (!search || !priority || !department || !status || !date || !clearButton) {
        return;
    }

    const applyFilters = function () {
        const searchTerm = search.value.trim().toLowerCase();
        rows.forEach(function (row) {
            const matchesSearch = !searchTerm || row.dataset.search.includes(searchTerm);
            const matchesPriority = priority.value === 'All Priorities' || row.dataset.priority === priority.value;
            const matchesDepartment = department.value === 'All Departments' || row.dataset.department === department.value;
            const matchesStatus = status.value === 'All Statuses' || row.dataset.status === status.value;
            const matchesDate = date.value === 'All Dates' || row.dataset.date === date.value;
            row.hidden = !(matchesSearch && matchesPriority && matchesDepartment && matchesStatus && matchesDate);
        });
    };

    [search, priority, department, status, date].forEach(function (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
    });

    clearButton.addEventListener('click', function () {
        search.value = '';
        priority.selectedIndex = 0;
        department.selectedIndex = 0;
        status.selectedIndex = 0;
        date.selectedIndex = 0;
        applyFilters();
    });
});
