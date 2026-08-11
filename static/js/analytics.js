document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('analytics-export');

    if (!exportButton) {
        return;
    }

    exportButton.addEventListener('click', function () {
        const report = [
            'AI Grievance Portal - Analytics Report',
            'Reporting period: This month',
            'Department: All departments',
            'Status: All statuses',
            '',
            'Total complaints: 176',
            'Resolved complaints: 128',
            'Pending complaints: 42',
            'Average resolution time: 3.8 days'
        ].join('\n');
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'analytics-report.txt';
        link.click();
        URL.revokeObjectURL(link.href);
    });
});
