document.addEventListener('DOMContentLoaded', function () {
    const pieCanvas = document.getElementById('departmentWorkloadChart');
    const categoryCanvas = document.getElementById('categoryChart');
    const lineCanvas = document.getElementById('resolutionRateChart');

    if (typeof Chart === 'undefined') {
        return;
    }

    if (pieCanvas) {
        new Chart(pieCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Roads', 'Water', 'Electricity', 'Sanitation'],
                datasets: [{
                    data: [28, 24, 18, 30],
                    backgroundColor: ['#1e3a8a', '#0d9488', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 12,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    if (categoryCanvas) {
        new Chart(categoryCanvas, {
            type: 'pie',
            data: {
                labels: ['Potholes', 'Leakage', 'Power Outage', 'Waste Collection'],
                datasets: [{
                    data: [22, 18, 25, 35],
                    backgroundColor: ['#1e3a8a', '#0d9488', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 12,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    if (lineCanvas) {
        new Chart(lineCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Resolution Rate',
                    data: [62, 70, 75, 80, 78, 84, 88],
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    }
});
