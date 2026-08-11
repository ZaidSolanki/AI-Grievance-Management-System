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
        // create toggle button with open/closed eye icons
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'password-toggle';
        btn.setAttribute('aria-pressed', 'false');
        // accessible label will be updated on toggle
        btn.setAttribute('aria-label', 'Show password');

        const eyeOpen = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
        // fuller eye-off (eye with a clear diagonal slash) to avoid clipping or odd shapes
        const eyeClosed = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12s4.5-7 9.5-7 9.5 7 9.5 7-4.5 7-9.5 7S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M1.5 1.5l21 21"/></svg>';

        // start with 'hidden' state (password) -> show eye-closed icon
        btn.innerHTML = eyeClosed;

        btn.addEventListener('click', function (ev) {
            ev.preventDefault();
            const isPwd = pwd.getAttribute('type') === 'password';
            // toggle field type
            pwd.setAttribute('type', isPwd ? 'text' : 'password');
            // update icon and accessible attributes
            if (isPwd) {
                btn.innerHTML = eyeOpen;
                btn.classList.add('is-visible');
                btn.setAttribute('aria-pressed', 'true');
                btn.setAttribute('aria-label', 'Hide password');
            } else {
                btn.innerHTML = eyeClosed;
                btn.classList.remove('is-visible');
                btn.setAttribute('aria-pressed', 'false');
                btn.setAttribute('aria-label', 'Show password');
            }
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
            // small timeout to allow any form handlers to run and to support file:// previews
            setTimeout(() => {
                try {
                    if (window.location.protocol === 'file:') {
                        // use a relative path that works within local file previews
                        window.location.href = target.replace(/^\//, '').replace(/^(?:\.\/?)+/, '');
                    } else {
                        // prefer absolute site path when hosted
                        // if the action already starts with /, use it; otherwise resolve against origin
                        if (target.startsWith('/')) {
                            window.location.href = target;
                        } else {
                            const resolved = new URL(target, window.location.href).href;
                            window.location.href = resolved;
                        }
                    }
                } catch (err) {
                    // fallback to simple navigation
                    window.location.href = target;
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
