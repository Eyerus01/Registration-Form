document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const themeToggle = document.getElementById('theme-toggle');
    const passwordInput = document.getElementById('new-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const successMessage = document.getElementById('success-message');
    const formWrapper = document.querySelector('.form-wrapper');

    // Theme Toggle Logic
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        
        // Save preference
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }

    // Password Visibility Toggle
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    // Password Strength Meter
    passwordInput.addEventListener('input', () => {
        const value = passwordInput.value;
        let strength = 0;
        
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        strengthBar.className = 'strength-bar';
        if (value.length === 0) {
            strengthText.textContent = 'Password strength';
        } else if (strength < 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Medium strength';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
    });

    // Real-time Validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {

        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    function validateInput(input) {
        const group = input.closest('.form-group') || input.closest('.checkbox-group');
        let isValid = true;

        if (input.type === 'email') {
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        } else if (input.type === 'checkbox') {
            isValid = input.checked;
        } else if (input.id === 'new-password') {
            isValid = input.value.length >= 8;
        } else if (input.id === 'first-name' || input.id === 'last-name') {
            // Name validation: 2-30 characters, letters only (with spaces for middle names)
            // No numbers or special characters allowed
            let nameVal = input.value.trim();
            
            // Auto-capitalize: transform "john doe" to "John Doe"
            if (nameVal.length > 0) {
                nameVal = nameVal.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
                input.value = nameVal;
            }

            isValid = /^[a-zA-Z\s]{2,30}$/.test(nameVal) && !/\s\s+/.test(nameVal);
        } else if (input.id === 'bio') {
            // Bio validation: min 10 chars, not just repeated characters, has at least one space
            const bioVal = input.value.trim();
            const hasRepeated = /(.)\1{4,}/.test(bioVal); // e.g. "aaaaa"
            isValid = bioVal.length >= 10 && !hasRepeated && bioVal.includes(' ');
        } else {
            isValid = input.value.trim() !== '';
        }

        if (isValid) {
            group.classList.remove('error');
        } else {
            group.classList.add('error');
        }
        return isValid;
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) return;

        // Simulate API call
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Add a nice animation
        formWrapper.style.transform = 'scale(0.95)';
        setTimeout(() => {
            formWrapper.style.transform = 'scale(1)';
        }, 200);
    });
});
