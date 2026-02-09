document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const activateBtn = document.getElementById("activate-btn");
    const licenseKeyInput = document.getElementById('license-key');
    const verificationAnim = document.getElementById('verification-animation');
    const licenseType = document.getElementById('license-type');
    const shopBtn = document.getElementById('shop-btn');

    // License validation mapping
    const licenseValidationMap = {
        'demo-license': '4PGQ3-C8XTP-7CFBY',
        '7days-license': '1.6578.3784.089.196',
        '1month-license': '87687.6.8954.38721',
        '3months-license': '277.387.456.789',
        '6months-license': '394.775.677.890',
        '1year-license': '45-678-567.174.901',
        'Premium-license': 'E4XDC5-RTFV6B-GY8HUBY-V7TCDXS',
    };

    // License page mapping
    const licensePageMap = {
        'demo-license': 'Demolicense.html',
        '7days-license': '7dayslicense.html',
        '1month-license': '1monthlicense.html',
        '3months-license': '3monthslicense.html',
        '6months-license': '6monthslicense.html',
        '1year-license': '1yearlicense.html',
        'Premium-license': 'Premiumlicense.html'
    };

    // License type dropdown event
    licenseType.addEventListener('change', (event) => {
        if (event.target.value !== "") {
            licenseKeyInput.disabled = false;
            licenseKeyInput.focus();
            licenseKeyInput.value = '';
            activateBtn.disabled = true;
            
            // Show hint for demo license
            if (event.target.value === 'demo-license') {
                showNotification('warning', 'Demo Version', 'Demo license has limited functionality');
            }
        } else {
            licenseKeyInput.disabled = true;
            activateBtn.disabled = true;
        }
    });

    // License key input event
    licenseKeyInput.addEventListener('input', () => {
        const hasValue = licenseKeyInput.value.trim() !== '';
        activateBtn.disabled = !hasValue;
        
        // Add real-time validation feedback
        if (hasValue) {
            licenseKeyInput.style.borderColor = 'var(--warning)';
            licenseKeyInput.style.boxShadow = '0 0 15px rgba(255, 211, 45, 0.3)';
        } else {
            licenseKeyInput.style.borderColor = 'var(--glass-border)';
            licenseKeyInput.style.boxShadow = 'none';
        }
    });

    // Buy License button event - UPDATED URL
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            showNotification('info', 'Redirecting', 'Opening license store...');
            setTimeout(() => {
                // Redirect to the new URL
                window.location.href = 'https://su-cam.github.io/Flashsenderpro/';
            }, 1000);
        });
    }

    // Activate button event
    activateBtn.addEventListener('click', () => {
        if (licenseType.value === "") {
            showNotification('error', 'Selection Required', 'Please select a license type first');
            licenseType.focus();
            return;
        }

        if (licenseKeyInput.value.trim() === "") {
            showNotification('error', 'Input Required', 'Please enter a license key');
            licenseKeyInput.focus();
            return;
        }

        // Show verification animation
        verificationAnim.classList.remove("hidden");
        
        // Simulate verification process
        const verificationTime = 2000 + Math.random() * 1000;
        
        setTimeout(() => {
            const enteredKey = licenseKeyInput.value.trim();
            const expectedKey = licenseValidationMap[licenseType.value];
            const isValidLicense = expectedKey && enteredKey === expectedKey;

            if (isValidLicense) {
                showNotification('success', 'License Valid', 'Product activation successful! Redirecting...');
                
                setTimeout(() => {
                    const redirectPage = licensePageMap[licenseType.value];
                    if (!redirectPage) {
                        showNotification('error', 'Configuration Error', 'Invalid license type configuration');
                        verificationAnim.classList.add("hidden");
                        return;
                    }
                    window.location.href = redirectPage;
                }, 2000);
            } else {
                verificationAnim.classList.add("hidden");
                showNotification('error', 'Invalid License', 
                    'The license key is invalid or does not match the selected license type. ' +
                    'Please check your key or purchase a valid license.');
                
                // Shake animation for invalid input
                licenseKeyInput.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    licenseKeyInput.style.animation = '';
                    licenseKeyInput.focus();
                    licenseKeyInput.select();
                }, 500);
            }
        }, verificationTime);
    });

    // Add shake animation for invalid inputs
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to activate
        if (e.ctrlKey && e.key === 'Enter') {
            if (!activateBtn.disabled) {
                activateBtn.click();
            }
        }
        
        // Escape to clear selection
        if (e.key === 'Escape') {
            licenseType.value = '';
            licenseKeyInput.disabled = true;
            activateBtn.disabled = true;
        }
    });

    // Function to show notifications
    function showNotification(type, title, message) {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon;
        switch(type) {
            case 'error':
                icon = '✖';
                break;
            case 'warning':
                icon = '⚠';
                break;
            case 'success':
                icon = '✓';
                break;
            default:
                icon = 'ℹ';
        }

        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        notificationContainer.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
});