document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.auth-form');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirm-password');

    if (!form) {
        return;
    }

    // Helper: keep .form-field updated with `has-value` when inputs have content
    function updateHasValue(input) {
        const ff = input.closest('.form-field');
        if (!ff) return;
        if (input.value && input.value.trim() !== '') {
            ff.classList.add('has-value');
        } else {
            ff.classList.remove('has-value');
        }
    }

    // Initialize has-value state and add listeners for all inputs inside .form-field
    const inputs = form.querySelectorAll('.form-field input');
    inputs.forEach((inp) => {
        // run once to pick up server-rendered values and autofill
        updateHasValue(inp);
        inp.addEventListener('input', () => updateHasValue(inp));
        // catch autofill in some browsers after short delay
        setTimeout(() => updateHasValue(inp), 200);
    });

    // Add password visibility toggle to all password fields within auth forms
    const pwdFields = form.querySelectorAll('input[type="password"]');
    pwdFields.forEach((pwd) => {
        const wrapper = pwd.closest('.form-field');
        if (!wrapper) return;
        // create toggle button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'password-toggle';
        btn.setAttribute('aria-label', 'Toggle password visibility');
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path><path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path></svg>';
        btn.addEventListener('click', function () {
            const isPwd = pwd.getAttribute('type') === 'password';
            pwd.setAttribute('type', isPwd ? 'text' : 'password');
            // toggle visual active state
            btn.classList.toggle('is-visible', isPwd);
            // keep focus on the field
            pwd.focus();
        });
        // insert button after the input so layout remains consistent
        wrapper.appendChild(btn);
        // ensure label state correct if browser auto-filled
        setTimeout(() => updateHasValue(pwd), 200);
    });

    form.addEventListener('submit', function (event) {
        const hasConfirm = !!confirmPassword;
        let valid = true;
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        const validationMessage = savedLanguage === 'hi' || savedLanguage === 'regional'
            ? 'पासवर्ड मेल नहीं खाते।'
            : 'Passwords do not match.';

        if (hasConfirm && password.value !== confirmPassword.value) {
            valid = false;
            confirmPassword.setCustomValidity(validationMessage);
            confirmPassword.reportValidity();
        } else if (hasConfirm) {
            confirmPassword.setCustomValidity('');
        }

        if (!valid) {
            event.preventDefault();
        }
    });

    // Fallback navigation: some environments (static file serving or edge cases) may prevent normal form
    // submission navigation. Hook submit button click to explicitly redirect to the form action when validation passes.
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function (ev) {
            // Let browser run built-in constraint validation UI
            if (!form.reportValidity()) {
                return; // invalid, do not navigate
            }
            // If form would submit normally, prefer JS navigation to ensure consistent behavior across hosts
            const target = form.getAttribute('action') || '../base.html';
            // small timeout to allow any form handlers to run
            setTimeout(() => {
                // Resolve relative paths reliably, then navigate
                try {
                    const resolved = new URL(target, window.location.href).href;
                    window.location.assign(resolved);
                } catch (err) {
                    // fallback if URL resolution fails
                    window.location.assign(target);
                }
            }, 10);
            // Prevent the normal form submit to avoid duplicates
            ev.preventDefault();
        });
    }

    const toggleButtons = document.querySelectorAll('.role-toggle .toggle-item');
    const authForm = document.querySelector('.auth-form');

    if (toggleButtons.length && authForm) {
        const roleToggle = document.querySelector('.role-toggle');
        toggleButtons.forEach((button) => {
            button.addEventListener('click', function () {
                toggleButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');

                const role = button.dataset.role;
                // update form action accordingly
                // Use relative paths so file:// and local HTTP servers resolve correctly
                // Always navigate into the main shell (base.html) after sign-in so the user lands in the app shell
                authForm.action = '../base.html';
                // update visual slider by setting data-role on the container
                if (roleToggle) {
                    roleToggle.setAttribute('data-role', role);
                }
            });
        });
        // initialize slider position based on initial active button
        const active = document.querySelector('.role-toggle .toggle-item.active');
        if (active && roleToggle) {
            roleToggle.setAttribute('data-role', active.dataset.role || 'citizen');
        }
    }
});
