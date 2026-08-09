document.addEventListener('DOMContentLoaded', function () {
    const categoryInput = document.querySelector('#category');
    const descriptionInput = document.querySelector('#description');
    const previewCategory = document.querySelector('#preview-category');
    const previewPriority = document.querySelector('#preview-priority');
    const previewDepartment = document.querySelector('#preview-department');
    const previewSummary = document.querySelector('#preview-summary');
    const voiceButton = document.querySelector('#voice-dictation');

    const categories = {
        Road: { priority: 'Medium', department: 'Roads' },
        Water: { priority: 'High', department: 'Water Supply' },
        Electricity: { priority: 'High', department: 'Power Grid' },
        Sanitation: { priority: 'Medium', department: 'Sanitation' },
        Other: { priority: 'Low', department: 'General Services' }
    };

    function updatePreview() {
        const categoryValue = categoryInput ? categoryInput.value : 'Other';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const result = categories[categoryValue] || categories.Other;

        if (previewCategory) previewCategory.textContent = categoryValue;
        if (previewPriority) previewPriority.textContent = result.priority;
        if (previewDepartment) previewDepartment.textContent = result.department;
        if (previewSummary) {
            previewSummary.textContent = description
                ? `AI suggests the complaint is related to ${categoryValue.toLowerCase()} issues and assigns it to the ${result.department} department.`
                : 'AI preview will update when you describe the issue in the box above.';
        }
    }

    if (categoryInput) categoryInput.addEventListener('change', updatePreview);
    if (descriptionInput) descriptionInput.addEventListener('input', updatePreview);

    if (voiceButton) {
        voiceButton.addEventListener('click', function () {
            voiceButton.classList.toggle('listening');
            voiceButton.textContent = voiceButton.classList.contains('listening') ? 'Listening...' : 'Start voice dictation';
        });
    }

    updatePreview();
});
