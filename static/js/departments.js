document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('department-search');
    const workload = document.getElementById('department-workload');
    const sort = document.getElementById('department-sort');
    const grid = document.getElementById('departments-grid');

    if (!search || !workload || !sort || !grid) {
        return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-department]'));
    const updateDepartments = function () {
        const term = search.value.trim().toLowerCase();
        const selectedWorkload = workload.value;
        cards.forEach(function (card) {
            const matchesTerm = !term || (card.dataset.name + ' ' + card.dataset.officer).toLowerCase().includes(term);
            const matchesWorkload = selectedWorkload === 'All Workloads' || card.dataset.workload === selectedWorkload.replace(' Workload', '');
            card.hidden = !(matchesTerm && matchesWorkload);
        });
        cards.sort(function (a, b) {
            if (sort.value === 'name-asc') return a.dataset.name.localeCompare(b.dataset.name);
            const difference = Number(a.dataset.pending) - Number(b.dataset.pending);
            return sort.value === 'pending-asc' ? difference : -difference;
        }).forEach(function (card) {
            grid.appendChild(card);
        });
    };
    [search, workload, sort].forEach(function (control) {
        control.addEventListener('input', updateDepartments);
        control.addEventListener('change', updateDepartments);
    });
});
