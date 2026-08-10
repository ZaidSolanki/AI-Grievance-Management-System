document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll(".auth-form");
  if (!forms.length) return;

  const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
  const isHindi = savedLanguage === "hi" || savedLanguage === "regional";

  function t(en, hi) {
    return isHindi ? hi : en;
  }

  function showFieldError(input, message) {
    const field = input.closest(".form-field");
    if (!field) return;
    const errorEl = field.querySelector(".field-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
    field.classList.toggle("is-invalid", !!message);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", errorEl ? errorEl.id : "");
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function clearFieldError(input) {
    showFieldError(input, "");
  }

  function showFormError(formId, message) {
    const form = document.getElementById(formId);
    if (!form) return;
    const errorEl = form.querySelector(".form-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = !message;
    }
  }

  function clearFormError(formId) {
    showFormError(formId, "");
  }

  function validateEmail(email) {
    if (!email || email.trim() === "")
      return t("Email is required.", "ईमेल आवश्यक है।");
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email))
      return t(
        "Please enter a valid email address.",
        "कृपया एक वैध ईमेल पता दर्ज करें।",
      );
    return "";
  }

  function validatePassword(password, minLength) {
    minLength = minLength || 6;
    if (!password || password === "")
      return t("Password is required.", "पासवर्ड आवश्यक है।");
    if (password.length < minLength)
      return t(
        "Password must be at least " + minLength + " characters.",
        "पासवर्ड कम से कम " + minLength + " अक्षर का होना चाहिए।",
      );
    return "";
  }

  function validateName(name) {
    if (!name || name.trim() === "")
      return t("Full name is required.", "पूरा नाम आवश्यक है।");
    if (name.trim().length < 2)
      return t(
        "Name must be at least 2 characters.",
        "नाम कम से कम 2 अक्षर का होना चाहिए।",
      );
    if (name.trim().length > 60)
      return t(
        "Name must be under 60 characters.",
        "नाम 60 अक्षरों से कम होना चाहिए।",
      );
    const re = /^[A-Za-z\u0900-\u097F\s.'-]+$/;
    if (!re.test(name))
      return t(
        "Name can only contain letters, spaces, dots, hyphens, and apostrophes.",
        "नाम में केवल अक्षर, स्पेस, डॉट, हाइफन और एपॉस्ट्रोफी हो सकते हैं।",
      );
    return "";
  }

  function validatePhone(phone) {
    if (!phone || phone.trim() === "")
      return t("Phone number is required.", "फ़ोन नंबर आवश्यक है।");
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10)
      return t(
        "Phone number must have at least 10 digits.",
        "फ़ोन नंबर में कम से कम 10 अंक होने चाहिए।",
      );
    if (digits.length > 15)
      return t(
        "Phone number must be under 15 digits.",
        "फ़ोन नंबर 15 अंकों से कम होना चाहिए।",
      );
    return "";
  }

  function validateAddress(address) {
    if (!address || address.trim() === "")
      return t("Address is required.", "पता आवश्यक है।");
    if (address.trim().length < 5)
      return t(
        "Address must be at least 5 characters.",
        "पता कम से कम 5 अक्षर का होना चाहिए।",
      );
    return "";
  }

  function validateConfirmPassword(password, confirm) {
    if (!confirm || confirm === "")
      return t(
        "Please confirm your password.",
        "कृपया अपना पासवर्ड पुष्टि करें।",
      );
    if (password !== confirm)
      return t("Passwords do not match.", "पासवर्ड मेल नहीं खाते।");
    return "";
  }

  forms.forEach(function (form) {
    const isLoginForm = form.id === "login-form";
    const formId =
      form.id || "auth-form-" + Math.random().toString(36).slice(2, 9);
    if (!form.id) form.id = formId;

    const emailInput = form.querySelector("#email");
    const passwordInput = form.querySelector("#password");
    const nameInput = form.querySelector("#full-name");
    const phoneInput = form.querySelector("#phone");
    const addressInput = form.querySelector("#address");
    const confirmPasswordInput = form.querySelector("#confirm-password");
    const submitButton = form.querySelector('button[type="submit"]');

    function validateForm() {
      let valid = true;
      clearFormError(formId);

      if (emailInput) {
        const err = validateEmail(emailInput.value);
        showFieldError(emailInput, err);
        if (err) valid = false;
      }

      if (passwordInput) {
        const err = validatePassword(passwordInput.value, 6);
        showFieldError(passwordInput, err);
        if (err) valid = false;
      }

      if (nameInput) {
        const err = validateName(nameInput.value);
        showFieldError(nameInput, err);
        if (err) valid = false;
      }

      if (phoneInput) {
        const err = validatePhone(phoneInput.value);
        showFieldError(phoneInput, err);
        if (err) valid = false;
      }

      if (addressInput) {
        const err = validateAddress(addressInput.value);
        showFieldError(addressInput, err);
        if (err) valid = false;
      }

      if (confirmPasswordInput) {
        const err = validateConfirmPassword(
          passwordInput ? passwordInput.value : "",
          confirmPasswordInput.value,
        );
        showFieldError(confirmPasswordInput, err);
        if (err) valid = false;
      }

      return valid;
    }

    [
      emailInput,
      passwordInput,
      nameInput,
      phoneInput,
      addressInput,
      confirmPasswordInput,
    ].forEach(function (input) {
      if (!input) return;
      input.addEventListener("blur", function () {
        if (input.value.trim() === "") {
          clearFieldError(input);
          return;
        }
        let err = "";
        if (input.id === "email" || input.name === "email")
          err = validateEmail(input.value);
        else if (input.id === "password" || input.name === "password")
          err = validatePassword(input.value, 6);
        else if (input.id === "full-name" || input.name === "full_name")
          err = validateName(input.value);
        else if (input.id === "phone" || input.name === "phone")
          err = validatePhone(input.value);
        else if (input.id === "address" || input.name === "address")
          err = validateAddress(input.value);
        else if (
          input.id === "confirm-password" ||
          input.name === "confirm_password"
        )
          err = validateConfirmPassword(
            passwordInput ? passwordInput.value : "",
            input.value,
          );
        showFieldError(input, err);
      });

      input.addEventListener("input", function () {
        const errorEl =
          input.closest(".form-field") &&
          input.closest(".form-field").querySelector(".field-error");
        if (errorEl && errorEl.textContent) {
          let err = "";
          if (input.id === "email" || input.name === "email")
            err = validateEmail(input.value);
          else if (input.id === "password" || input.name === "password")
            err = validatePassword(input.value, 6);
          else if (input.id === "full-name" || input.name === "full_name")
            err = validateName(input.value);
          else if (input.id === "phone" || input.name === "phone")
            err = validatePhone(input.value);
          else if (input.id === "address" || input.name === "address")
            err = validateAddress(input.value);
          else if (
            input.id === "confirm-password" ||
            input.name === "confirm_password"
          )
            err = validateConfirmPassword(
              passwordInput ? passwordInput.value : "",
              input.value,
            );
          showFieldError(input, err);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const valid = validateForm();
      if (!valid) {
        const firstInvalid = form.querySelector(".form-field.is-invalid input");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formData = new FormData(form);
      const url = form.getAttribute("action") || "/auth/login";
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isLoginForm
          ? t("Signing in...", "साइन इन हो रहा है...")
          : t("Creating account...", "खाता बना रहा है...");
      }

      fetch(url, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      })
        .then(function (res) {
          console.log("Login response status:", res.status);
          return res.json().then(function (data) {
            console.log("Login response data:", data);
            return { status: res.status, data: data };
          });
        })
        .then(function (result) {
          console.log("Login result:", result);
          if (result.status >= 200 && result.status < 300) {
            const redirectUrl = result.data.redirect_url || "/index.html";
            console.log("Redirecting to:", redirectUrl);
            window.location.href = redirectUrl;
          } else {
            showFormError(
              formId,
              result.data.message ||
                t(
                  "Something went wrong. Please try again.",
                  "कुछ गलत हो गया। कृपया फिर से प्रयास करें।",
                ),
            );
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = isLoginForm
                ? "Sign In"
                : "Create Account";
            }
          }
        })
        .catch(function (err) {
          console.error("Login fetch error:", err);
          showFormError(
            formId,
            t(
              "Network error. Please try again.",
              "नेटवर्क त्रुटि। कृपया फिर से प्रयास करें।",
            ),
          );
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = isLoginForm ? "Sign In" : "Create Account";
          }
        });
    });

    if (submitButton) {
      submitButton.addEventListener("click", function (ev) {
        if (!validateForm()) {
          ev.preventDefault();
        }
      });
    }
  });

  // Password visibility toggle
  const pwdFields = document.querySelectorAll('input[type="password"]');
  pwdFields.forEach(function (pwd) {
    const wrapper = pwd.closest(".form-field");
    if (!wrapper) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "password-toggle";
    btn.setAttribute("aria-label", "Toggle password visibility");
    btn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7-11 7S1 12 1 12z"></path><path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path></svg>';
    btn.addEventListener("click", function () {
      const isPwd = pwd.getAttribute("type") === "password";
      pwd.setAttribute("type", isPwd ? "text" : "password");
      btn.classList.toggle("is-visible", isPwd);
      pwd.focus();
    });
    wrapper.appendChild(btn);
  });

  // Role toggle logic (login page only)
  const toggleButtons = document.querySelectorAll(".role-toggle .toggle-item");
  const authForm = document.querySelector(".auth-form");
  const roleToggle = document.querySelector(".role-toggle");
  const roleInput = document.querySelector("#login-role");
  if (toggleButtons.length && authForm && roleToggle) {
    toggleButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        toggleButtons.forEach(function (btn) {
          btn.classList.remove("active");
        });
        button.classList.add("active");
        const role = button.dataset.role;
        roleToggle.setAttribute("data-role", role);
        if (roleInput) roleInput.value = role;
      });
    });
    const active = document.querySelector(".role-toggle .toggle-item.active");
    if (active) {
      roleToggle.setAttribute("data-role", active.dataset.role || "citizen");
      if (roleInput) roleInput.value = active.dataset.role || "citizen";
    }
  }
});
